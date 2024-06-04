from backend.backend_api.models import TrafficSignDetection


class TrafficSignDetectionRepository:
    @staticmethod
    def get_or_create_detection(date):
        detection, created = TrafficSignDetection.objects.get_or_create(
            detection_date=date,
            defaults={'number_of_signs': 0}
        )
        return detection, created

    @staticmethod
    def update_detection(detection, num_signs):
        detection.number_of_signs += num_signs
        detection.save()
        return detection
