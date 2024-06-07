from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..repositories.TrafficSignDetectionRepository import TrafficSignDetectionRepository
from ..statisticsStrategies.TrafficSignDetectionStrategy import TrafficSignDetectionStrategy
from ..statisticsStrategies.StatisticsContext import StatisticsContext
from ..serializers import TrafficSignDetectionSerializer


class DetectedTrafficSignsStatisticsView(APIView):
    def get(self, request):
        detections = TrafficSignDetectionRepository.get_all_detections()

        strategy = TrafficSignDetectionStrategy()
        context = StatisticsContext(strategy)
        statistics = context.calculate_statistics(detections)
        serializer = TrafficSignDetectionSerializer(statistics, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
