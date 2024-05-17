from rest_framework import serializers
from .models import TrafficSignDetection, Upload


class TrafficSignDetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrafficSignDetection
        fields = '__all__'


class UploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upload
        fields = ('id', 'file', 'uploaded_at')
