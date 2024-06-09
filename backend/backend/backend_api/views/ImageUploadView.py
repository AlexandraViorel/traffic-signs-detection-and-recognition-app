import numpy as np
from PIL import Image
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..serializers import UploadSerializer
from ..services.TrafficSignDetectionService import TrafficSignDetectionService
from ..services.TrafficSignClassificationService import TrafficSignClassificationService
from ..services.TrafficSignProcessingService import TrafficSignProcessingService


object_detection_service = TrafficSignDetectionService()
classification_service = TrafficSignClassificationService()
traffic_sign_processing_service = TrafficSignProcessingService(object_detection_service, classification_service)


class ImageUploadView(APIView):
    def post(self, request):
        serializer = UploadSerializer(data=request.data)
        if serializer.is_valid():
            upload = serializer.save()
            img = Image.open(upload.file)
            img_np = np.array(img)

            detections, cropped_images, predictions = traffic_sign_processing_service.process_image(img_np)
            detection = traffic_sign_processing_service.update_detection_statistics(len(detections))

            response_data = {
                'detection_date': detection.detection_date,
                'number_of_signs': detection.number_of_signs,
                'predictions': predictions,
                'cropped_images': cropped_images,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)