from django.urls import path
from .views import ImageUploadView, VideoUploadView, PredictionListView, UpdatePredictionView, \
    DetectedTrafficSignsStatisticsView, PredictionAccuracyStatisticsView


urlpatterns = [
    path('uploadimage/', ImageUploadView.as_view(), name='uploadimage'),
    path('uploadvideo/', VideoUploadView.as_view(), name='uploadvideo'),
    path('predictions/', PredictionListView.as_view(), name='predictions-list'),
    path('predictions/<int:id>/', UpdatePredictionView.as_view(), name='predictions-update'),
    path('statistics/detections/', DetectedTrafficSignsStatisticsView.as_view(), name='traffic-sign-detection-list'),
    path('statistics/predictions/', PredictionAccuracyStatisticsView.as_view(), name='predictions-statistics'),
]
