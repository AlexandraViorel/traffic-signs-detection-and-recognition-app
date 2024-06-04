import base64
import cv2
import numpy as np
from PIL import Image
from keras.models import load_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ultralytics import YOLO
from datetime import date
from rest_framework import generics
import csv

from .serializers import UploadSerializer, PredictionSerializer, PredictionUpdateSerializer, TrafficSignDetectionSerializer
from .models import Upload, TrafficSignDetection, Prediction


# def frames_extraction(video_path):
#     frames = []
#     video = cv2.VideoCapture(video_path)
#     video_frames_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
#     skip_frames_window = max(int(video_frames_count/20), 1)
#
#     for frame_counter in range(20):
#         video.set(cv2.CAP_PROP_POS_FRAMES, frame_counter * skip_frames_window)
#         success, frame = video.read()
#
#         if not success:
#             break
#
#         resized_frame = cv2.resize(frame, (45, 45))
#         normalized_frame = resized_frame / 255
#         frames.append(normalized_frame)
#
#     video.release()
#
#     return frames

def frames_extraction(video_path, num_frames=10):
    frames = []
    video = cv2.VideoCapture(video_path)
    video_frames_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    skip_frames_window = max(int(video_frames_count / num_frames), 1)

    for frame_counter in range(num_frames):
        video.set(cv2.CAP_PROP_POS_FRAMES, frame_counter * skip_frames_window)
        success, frame = video.read()

        if not success:
            break

        frames.append(frame)

    video.release()

    return frames


def get_class_labels():
    classes = {}

    csv_file_path = r'D:\Faculty materials\BACHELORS-THESIS-APP\backend\backend\backend_api\SignsNames.csv'

    with open(csv_file_path, mode='r') as infile:
        reader = csv.reader(infile)
        next(reader)
        for rows in reader:
            class_id = int(rows[0])  # assuming the first column is class_id
            class_name = rows[1]  # assuming the second column is class_name
            classes[class_id] = class_name

    return classes


yolo_model = YOLO(r'D:\Faculty materials\BACHELORS-THESIS-APP\backend\backend\backend_api\best.pt')
cnn_model = load_model(r'D:\Faculty materials\BACHELORS-THESIS-APP\backend\backend\backend_api\model-tsrnet1.h5')
class_labels = get_class_labels()


def detect_objects_yolo(image):
    results = yolo_model(image)
    detections = []
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            confidence = float(box.conf[0])
            detections.append([x1, y1, x2, y2, confidence])
    return detections


class ImageUploadView(APIView):
    def post(self, request):
        serializer = UploadSerializer(data=request.data)
        if serializer.is_valid():
            upload = serializer.save()
            # Load the image
            img = Image.open(upload.file)
            # Convert to numpy array
            img_np = np.array(img)
            detections = detect_objects_yolo(img_np)

            cropped_images = []
            predictions = []

            for (x1, y1, x2, y2, confidence) in detections:
                cropped_img = img_np[y1:y2, x1:x2]
                # Convert BGR to RGB
                cropped_img_rgb = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2RGB)
                cropped_img_resized = cv2.resize(cropped_img_rgb, (45, 45))
                cropped_img_preprocessed = cropped_img_resized / 255.0
                cropped_img_expanded = np.expand_dims(cropped_img_preprocessed, axis=0)
                pred = cnn_model.predict(cropped_img_expanded)
                predicted_class = np.argmax(pred, axis=1)[0]

                # Get the class name from the dictionary
                class_name = class_labels.get(predicted_class, "Unknown")

                # Convert the cropped image to base64
                _, buffer = cv2.imencode('.jpg', cropped_img_rgb)
                cropped_img_base64 = base64.b64encode(buffer).decode('utf-8')

                # Save prediction to database
                prediction = Prediction.objects.create(
                    predicted_class_id=predicted_class,
                    predicted_class_name=class_name,
                    box=[x1, y1, x2, y2],
                    cropped_image=cropped_img_base64
                )

                cropped_images.append(cropped_img_base64)
                predictions.append({
                    'class_id': int(predicted_class),
                    'class_name': class_name,
                    'box': [x1, y1, x2, y2],
                    'id': prediction.id
                })

            # Check if a record with today's date already exists
            today = date.today()
            detection, created = TrafficSignDetection.objects.get_or_create(
                detection_date=today,
                defaults={'number_of_signs': len(detections)}
            )

            if not created:
                # If the record exists, update the number_of_signs
                detection.number_of_signs += len(detections)
                detection.save()

            response_data = {
                'detection_date': detection.detection_date,
                'number_of_signs': detection.number_of_signs,
                'predictions': predictions,
                'cropped_images': cropped_images,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VideoUploadView(APIView):
    def post(self, request):
        serializer = UploadSerializer(data=request.data)
        if serializer.is_valid():
            upload = serializer.save()
            # Extract frames from the video
            frames = frames_extraction(upload.file.path, num_frames=10)

            best_frame = None
            best_score = 0
            best_detections = []

            # Apply YOLO to each frame and calculate the score
            for frame in frames:
                detections = detect_objects_yolo(frame)
                num_detections = len(detections)
                confidence_sum = sum(detection[4] for detection in detections)
                score = num_detections * confidence_sum  # weighted sum based on the number of detections

                if score > best_score:
                    best_score = score
                    best_frame = frame
                    best_detections = detections

            if best_frame is None:
                return Response({"error": "No frame selected"}, status=status.HTTP_400_BAD_REQUEST)

            # Process the best frame with the CNN model
            cropped_images = []
            predictions = []

            for (x1, y1, x2, y2, _) in best_detections:
                cropped_img = best_frame[y1:y2, x1:x2]
                # Convert BGR to RGB
                # cropped_img_rgb = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2RGB)
                cropped_img_resized = cv2.resize(cropped_img, (45, 45))
                cropped_img_preprocessed = cropped_img_resized / 255.0
                cropped_img_expanded = np.expand_dims(cropped_img_preprocessed, axis=0)
                pred = cnn_model.predict(cropped_img_expanded)
                predicted_class = np.argmax(pred, axis=1)[0]

                # Get the class name from the dictionary
                class_name = class_labels.get(predicted_class, "Unknown")

                # Convert the cropped image to base64
                _, buffer = cv2.imencode('.jpg', cropped_img)
                cropped_img_base64 = base64.b64encode(buffer).decode('utf-8')

                # Save prediction to database
                prediction = Prediction.objects.create(
                    predicted_class_id=predicted_class,
                    predicted_class_name=class_name,
                    box=[x1, y1, x2, y2],
                    cropped_image=cropped_img_base64
                )

                cropped_images.append(cropped_img_base64)
                predictions.append({
                    'class_id': int(predicted_class),
                    'class_name': class_name,
                    'box': [x1, y1, x2, y2],
                    'id': prediction.id
                })

            # Check if a record with today's date already exists
            today = date.today()
            detection, created = TrafficSignDetection.objects.get_or_create(
                detection_date=today,
                defaults={'number_of_signs': len(best_detections)}
            )

            if not created:
                # If the record exists, update the number_of_signs
                detection.number_of_signs += len(best_detections)
                detection.save()

            response_data = {
                'detection_date': detection.detection_date,
                'number_of_signs': detection.number_of_signs,
                'predictions': predictions,
                'cropped_images': cropped_images,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PredictionListView(generics.ListAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer


class UpdatePredictionView(APIView):
    def patch(self, request, id):
        try:
            prediction = Prediction.objects.get(id=id)
        except Prediction.DoesNotExist:
            return Response({"error": "Prediction not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PredictionUpdateSerializer(prediction, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_205_RESET_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TrafficSignDetectionListView(APIView):
    def get(self, request):
        detections = TrafficSignDetection.objects.all().order_by('detection_date')
        serializer = TrafficSignDetectionSerializer(detections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)