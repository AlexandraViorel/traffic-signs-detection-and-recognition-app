from rest_framework import generics
from ..models import Prediction
from ..serializers import PredictionSerializer


class PredictionListView(generics.ListAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer
