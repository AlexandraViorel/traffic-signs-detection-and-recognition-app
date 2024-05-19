import React, { useContext, useEffect, useState } from "react";
import { useAppContext } from "../appContext";
import { ActivityIndicator, Button, Card, IconButton, Title } from "react-native-paper";
import { Alert, ScrollView, View, Text, StyleSheet } from "react-native";

const MainScreen = (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return (
          <View>
            <ActivityIndicator animating={true} size="large" style={{paddingTop: "70%"}}/>
          </View>
        )
      }
    
    const handleOpenCamera = () => {props.navigation.navigate("CameraScreen")}
    const handleUploadImage = () => {props.navigation.navigate("UploadImageScreen")}
    const handleUploadVideo = () => {props.navigation.navigate("UploadVideoScreen")}


    return (
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained"
          icon="camera" 
          onPress={handleOpenCamera}
          style={styles.button}
        >
          Open Camera
        </Button>
        <Button 
          mode="contained" 
          icon="image"
          onPress={handleUploadImage}
          style={styles.button}
        >
          Upload Image
        </Button>
        <Button 
          mode="contained" 
          icon="video"
          onPress={handleUploadVideo}
          style={styles.button}
        >
          Upload Video
        </Button>
        <Button 
          mode="contained" 
          icon="traffic-light"
          style={styles.button}
        >
          Show Statistics
        </Button>
      </View>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
  },
});

export default MainScreen;