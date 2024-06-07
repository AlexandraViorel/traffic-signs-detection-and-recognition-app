import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import MainScreen from "./components/MainScreen";
import CameraScreen from "./components/CameraScreen";
import UploadImageScreen from "./components/UploadImageScreen";
import UploadVideoScreen from "./components/UploadVideoScreen"; 
import DetectedSignsScreen from "./components/DetectedSignsScreen";
import OptionsScreen from "./components/OptionsScreen";
import DetectionStatisticsScreen from "./components/DetectionStatisticsScreen";
import PredictionsStatisticsScreen from "./components/PredictionsStatisticsScreen";
import StatisticsOptionsScreen from "./components/StatisticsOptionsScreen";

const { Navigator, Screen } = createNativeStackNavigator();

const AppNavigator = () => (
    <NavigationContainer>
        <Navigator initialRouteName="Main">
            <Screen name="Main" options={{ headerShown: false}} component={MainScreen} />
            <Screen name="Options" options={{ headerShown: false}} component={OptionsScreen} />
            <Screen name="CameraScreen" options={{ headerShown: false}} component={CameraScreen} />
            <Screen name="UploadImageScreen" options={{ headerShown: false}} component={UploadImageScreen} />
            <Screen name="UploadVideoScreen" options={{ headerShown: false}} component={UploadVideoScreen} />
            <Screen name="DetectedSignsScreen" options={{ headerShown: false, gestureEnabled: false}} component={DetectedSignsScreen} />
            <Screen name="StatisticsOptionsScreen" options={{ headerShown: false}} component={StatisticsOptionsScreen} />
            <Screen name="DetectionStatisticsScreen" options={{ headerShown: false}} component={DetectionStatisticsScreen} />
            <Screen name="PredictionStatisticsScreen" options={{ headerShown: false}} component={PredictionsStatisticsScreen} />
        </Navigator>
    </NavigationContainer>
)

export default AppNavigator;