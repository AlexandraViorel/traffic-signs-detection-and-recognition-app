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
}