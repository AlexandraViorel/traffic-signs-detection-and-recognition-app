from backend.backend_api.models import Prediction


class PredictionRepository:
    @staticmethod
    def create_prediction(predicted_class_id, predicted_class_name, box, cropped_image_base64):
        return Prediction.objects.create(
            predicted_class_id=predicted_class_id,
            predicted_class_name=predicted_class_name,
            box=box,
            cropped_image=cropped_image_base64
        )
