from ultralytics import YOLO
from ..constants import YOLO_MODEL_PATH


class TrafficSignDetectionService:
    def __init__(self):
        self.yolo_model = YOLO(YOLO_MODEL_PATH)

    def detect_objects(self, image):
        results = self.yolo_model(image)
        detections = []
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                confidence = float(box.conf[0])
                detections.append([x1, y1, x2, y2, confidence])
        return detections
