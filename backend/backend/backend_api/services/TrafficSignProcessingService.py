import base64
import cv2
from datetime import date
from ..repositories.TrafficSignDetectionRepository import TrafficSignDetectionRepository
from ..repositories.PredictionRepository import PredictionRepository


class TrafficSignProcessingService:
    def __init__(self, detection_service, classification_service):
        self.detection_service = detection_service
        self.classification_service = classification_service

    def process_image(self, img_np, convert_image=True):
        detections = self.detection_service.detect_objects(img_np)
        cropped_images = []
        predictions = []

        for (x1, y1, x2, y2, confidence) in detections:
            cropped_img = img_np[y1:y2, x1:x2]

            if convert_image:
                cropped_img_rgb = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2RGB)
            else:
                cropped_img_rgb = cropped_img

            if not convert_image:
                predicted_class, class_name = self.classification_service.classify(cv2.cvtColor(cropped_img, cv2.COLOR_BGR2RGB))
            else:
                predicted_class, class_name = self.classification_service.classify(cropped_img)
            _, buffer = cv2.imencode('.jpg', cropped_img_rgb)
            cropped_img_base64 = base64.b64encode(buffer).decode('utf-8')
            prediction = PredictionRepository.create_prediction(predicted_class, class_name, [x1, y1, x2, y2], cropped_img_base64)
            cropped_images.append(cropped_img_base64)
            predictions.append({
                'class_id': int(predicted_class),
                'class_name': class_name,
                'box': [x1, y1, x2, y2],
                'id': prediction.id
            })
        return detections, cropped_images, predictions

    def update_detection_statistics(self, detections_count):
        today = date.today()
        detection, created = TrafficSignDetectionRepository.get_or_create_detection(today)
        if not created:
            detection = TrafficSignDetectionRepository.update_detection(detection, detections_count)
        return detection
