from ..models import Prediction


class PredictionRepository:
    @staticmethod
    def get_all_predictions():
        return Prediction.objects.all()

    @staticmethod
    def create_prediction(predicted_class_id, predicted_class_name, box, cropped_image_base64):
        return Prediction.objects.create(
            predicted_class_id=predicted_class_id,
            predicted_class_name=predicted_class_name,
            box=box,
            cropped_image=cropped_image_base64
        )

    @staticmethod
    def get_prediction_by_id(prediction_id):
        return Prediction.objects.filter(id=prediction_id).first()

    @staticmethod
    def update_prediction(prediction, data):
        for key, value in data.items():
            setattr(prediction, key, value)
        prediction.save()
        return prediction