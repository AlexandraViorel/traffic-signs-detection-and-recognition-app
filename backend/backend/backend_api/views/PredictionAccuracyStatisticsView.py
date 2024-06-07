from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..repositories.PredictionRepository import PredictionRepository
from ..statisticsStrategies.PredictionAccuracyStrategy import PredictionAccuracyStrategy
from ..statisticsStrategies.StatisticsContext import StatisticsContext


class PredictionAccuracyStatisticsView(APIView):
    def get(self, request):
        predictions = PredictionRepository.get_all_predictions()

        strategy = PredictionAccuracyStrategy()
        context = StatisticsContext(strategy)
        statistics = context.calculate_statistics(predictions)

        return Response(statistics, status=status.HTTP_200_OK)
