from keras.models import load_model
import csv
import cv2
import numpy as np


class ClassificationService:
    def __init__(self, cnn_model_path, labels_csv_path):
        self.cnn_model = load_model(cnn_model_path)
        self.class_labels = self._get_class_labels(labels_csv_path)

    @staticmethod
    def _get_class_labels(self, csv_file_path):
        classes = {}
        with open(csv_file_path, mode='r') as infile:
            reader = csv.reader(infile)
            next(reader)
            for rows in reader:
                class_id = int(rows[0])
                class_name = rows[1]
                classes[class_id] = class_name
        return classes

    def classify(self, image):
        image_resized = cv2.resize(image, (45, 45))
        image_preprocessed = image_resized / 255.0
        image_expanded = np.expand_dims(image_preprocessed, axis=0)
        pred = self.cnn_model.predict(image_expanded)
        predicted_class = np.argmax(pred, axis=1)[0]
        class_name = self.class_labels.get(predicted_class, "Unknown")
        return predicted_class, class_name
