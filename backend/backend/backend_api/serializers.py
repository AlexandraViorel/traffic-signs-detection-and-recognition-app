from rest_framework import serializers
from .models import TrafficSignDetection, Upload, Prediction


class TrafficSignDetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrafficSignDetection
        fields = '__all__'


class UploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upload
        fields = ('id', 'file', 'uploaded_at')


class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = ('id', 'predicted_class_id', 'predicted_class_name', 'box', 'cropped_image', 'is_prediction_correct')


class PredictionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = ['is_prediction_correct']
