from django.db import models


class TrafficSignDetection(models.Model):
    detection_date = models.DateField(primary_key=True, auto_now_add=True)
    number_of_signs = models.IntegerField()

    def __str__(self):
        return f"Date: {self.detection_date} : {self.number_of_signs} traffic signs detected"


class Upload(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateField(auto_now_add=True)
