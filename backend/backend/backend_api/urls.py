from django.urls import path
from .views import ImageUploadView, VideoUploadView

urlpatterns = [
    path('upload_image/', ImageUploadView.as_view(), name='upload_image'),
    path('upload_video/', VideoUploadView.as_view(), name='upload_video'),
]
