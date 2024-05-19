# Generated by Django 5.0.6 on 2024-05-19 18:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_api', '0002_alter_upload_uploaded_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='Prediction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('predicted_class_id', models.IntegerField()),
                ('box', models.JSONField()),
                ('cropped_image', models.TextField()),
                ('is_prediction_correct', models.BooleanField()),
            ],
        ),
    ]
