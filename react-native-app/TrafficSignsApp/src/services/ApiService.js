import { ip } from "../constants";

// !! HERE CHANGE THE PATHS

export default class ApiService {
    apiBase = `http://${ip}/api/`;
    constructor() {}

    uploadImage(formData) {
        return fetch(this.apiBase + "uploadimage/", {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => data);
    }

    uploadVideo(formData) {
        return fetch(this.apiBase + "uploadvideo/", {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => data);
    }

    updatePrediction(predictionId, isCorrect) {
        return fetch(`${this.apiBase}predictions/${predictionId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_prediction_correct: isCorrect }),
        })
        .then((response) => response.json())
        .then((data) => data);
    }

    getDetectionStatistics() {
        return fetch(this.apiBase + "detections/")
        .then((response) => response.json())
        .then((data) => data);
    }
}