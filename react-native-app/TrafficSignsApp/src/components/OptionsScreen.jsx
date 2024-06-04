import React, { useContext, useEffect, useState } from "react";
import { useAppContext } from "../appContext";
import { ActivityIndicator, Button, Card, IconButton, Title, Paragraph } from "react-native-paper";
import { Alert, ScrollView, View, Text, StyleSheet, ImageBackground } from "react-native";

const OptionsScreen = (props) => {
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
    const handleStatistics = () => {props.navigation.navigate("DetectionStatisticsScreen")}


    return (
        <ImageBackground source={require('../../assets/background.jpg')} style={styles.background}>
            <View style={styles.container}>
                <View style={styles.row}>
                    <Card style={styles.card}>
                    <Card.Content>
                        <Title>Open Camera</Title>
                        <Paragraph>Use your camera to take pictures/record videos.</Paragraph>
                        <Button 
                        mode="contained" 
                        icon="camera" 
                        onPress={handleOpenCamera}
                        style={styles.button}
                        buttonColor="#4682B4"
                        >
                            Open Camera
                        </Button>
                    </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                    <Card.Content>
                        <Title>Upload Image</Title>
                        <Paragraph>Upload an image from your device.</Paragraph>
                        <Button 
                        mode="contained" 
                        icon="image" 
                        onPress={handleUploadImage}
                        style={styles.button}
                        buttonColor="#4682B4"
                        >
                            Upload Image
                        </Button>
                    </Card.Content>
                    </Card>
                </View>
                <View style={styles.row}>
                    <Card style={styles.card}>
                    <Card.Content>
                        <Title>Upload Video</Title>
                        <Paragraph>Upload a video from your device.</Paragraph>
                        <Button 
                        mode="contained" 
                        icon="video" 
                        onPress={handleUploadVideo}
                        style={styles.button}
                        buttonColor="#4682B4"
                        >
                            Upload Video
                        </Button>
                    </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                    <Card.Content>
                        <Title>Show Statistics</Title>
                        <Paragraph>View traffic sign detection statistics.</Paragraph>
                        <Button 
                        mode="contained" 
                        icon="traffic-light"
                        onPress={handleStatistics}
                        style={styles.button}
                        buttonColor="#4682B4"
                        >
                            Show Statistics
                        </Button>
                    </Card.Content>
                    </Card>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: "70%",
      },
      container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    card: {
        flex: 1,
        margin: 5,
        height: 200,
        backgroundColor: '#cdebf9',
    },
    cardActions: {
        justifyContent: 'center',
    },
    button: {
        marginVertical: 40,
    },
});

export default OptionsScreen;