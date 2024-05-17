import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import MainScreen from "./components/MainScreen";
import CameraScreen from "./components/CameraScreen";
import UploadImageScreen from "./components/UploadImageScreen";
import UploadVideoScreen from "./components/UploadVideoScreen"; 

const { Navigator, Screen } = createNativeStackNavigator();

const AppNavigator = () => (
    <NavigationContainer>
        <Navigator initialRouteName="Main">
            <Screen name="Main" component={MainScreen} />
            <Screen name="CameraScreen" component={CameraScreen} />
            <Screen name="UploadImageScreen" component={UploadImageScreen} />
            <Screen name="UploadVideoScreen" component={UploadVideoScreen} />
        </Navigator>
    </NavigationContainer>
)

export default AppNavigator;