from .StatisticsStrategy import StatisticsStrategy


class PredictionAccuracyStrategy(StatisticsStrategy):
    def calculate(self, predictions):
        total_predictions = predictions.count()
        correct_predictions = predictions.filter(is_prediction_correct=True).count()
        incorrect_predictions = total_predictions - correct_predictions
        return {
            "correct_predictions": correct_predictions,
            "incorrect_predictions": incorrect_predictions
        }
