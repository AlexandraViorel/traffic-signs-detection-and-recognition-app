from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..repositories.PredictionRepository import PredictionRepository
from ..serializers import PredictionUpdateSerializer


class UpdatePredictionView(APIView):
    def patch(self, request, id):
        prediction = PredictionRepository.get_prediction_by_id(id)
        if not prediction:
            return Response({"error": "Prediction not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PredictionUpdateSerializer(prediction, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_205_RESET_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
