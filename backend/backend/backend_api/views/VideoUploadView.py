from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..serializers import UploadSerializer
from ..services.VideoProcessingService import VideoProcessingService
from ..services.TrafficSignDetectionService import TrafficSignDetectionService
from ..services.TrafficSignClassificationService import TrafficSignClassificationService
from ..services.TrafficSignProcessingService import TrafficSignProcessingService

object_detection_service = TrafficSignDetectionService()
classification_service = TrafficSignClassificationService()
traffic_sign_processing_service = TrafficSignProcessingService(object_detection_service, classification_service)


class VideoUploadView(APIView):
    def post(self, request):
        serializer = UploadSerializer(data=request.data)
        if serializer.is_valid():
            upload = serializer.save()
            frames = VideoProcessingService.extract_frames(upload.file.path, num_frames=10)
            best_frame = None
            best_score = 0
            best_detections = []

            for frame in frames:
                detections = object_detection_service.detect_objects(frame)
                num_detections = len(detections)
                confidence_sum = sum(detection[4] for detection in detections)
                score = num_detections * confidence_sum
                if score > best_score:
                    best_score = score
                    best_frame = frame
                    best_detections = detections

            if best_frame is None:
                return Response({"error": "No frame selected"}, status=status.HTTP_400_BAD_REQUEST)

            detections, cropped_images, predictions = traffic_sign_processing_service.process_image(best_frame, convert_image=False)
            detection = traffic_sign_processing_service.update_detection_statistics(len(best_detections))

            response_data = {
                'detection_date': detection.detection_date,
                'number_of_signs': detection.number_of_signs,
                'predictions': predictions,
                'cropped_images': cropped_images,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)