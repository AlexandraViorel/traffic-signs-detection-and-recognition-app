from django.urls import path
from .views import ImageUploadView, VideoUploadView

urlpatterns = [
    path('uploadimage/', ImageUploadView.as_view(), name='uploadimage'),
    path('uploadvideo/', VideoUploadView.as_view(), name='uploadvideo'),
]
