import { createContext, useContext, useReducer, useState } from "react";
import ApiService from "./services/ApiService";
import { Alert } from "react-native";

const services = {
    ApiService: new ApiService(),
}

const AppContext = createContext(undefined);

const AppProvider = ({ children }) => {
    const uploadImage = async(formData) => {
        try {
            const response = await services.ApiService.uploadImage(formData);
            return response;
        }
        catch (error) {
            console.log(error);
        }
    }

    const uploadVideo = async(formData) => {
        try {
            const response = await services.ApiService.uploadVideo(formData);
            return response;
        }
        catch (error) {
            console.log(error);
        }
    }

    const updatePrediction = async(predictionId, isCorrect) => {
        try {
            const response = await services.ApiService.updatePrediction(predictionId, isCorrect);
            return response;
        }
        catch (error) {
            console.log(error);
        }
    }

    const getDetectionStatistics = async () => {
        try {
            const response = await services.ApiService.getDetectionStatistics();
            return response;
        }
        catch (error) {
            console.log(error);
        }
    }

    const getPredictionStatistics = async () => {
        try {
            const response = await services.ApiService.getPredictionStatistics();
            return response;
        }
        catch (error) {
            console.log(error);
        }
    }

    const values = {
        uploadImage,
        uploadVideo,
        updatePrediction,
        getDetectionStatistics,
        getPredictionStatistics,
    }

    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
  };

export {useAppContext, AppProvider};