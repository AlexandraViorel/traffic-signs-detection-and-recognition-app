import { ResizeMode, Video } from "expo-av";
import { useState, useRef } from "react";
import { StyleSheet, View, Alert, Dimensions, ImageBackground } from "react-native";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../appContext';


const UploadVideoScreen = (props) => {
    const {uploadVideo} = useAppContext();
    const [videoUri, setVideoUri] = useState(null);
    const [videoDimensions, setVideoDimensions] = useState(null);
    const [croppedImages, setCroppedImages] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);

    const pickVideo = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("No permissions", "Camera roll permissions needed!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1
        });

        if (!result.canceled) {
            const { uri, width, height } = result.assets[0];
            setVideoUri(uri);
            setVideoDimensions({width, height});
        }
    }

    const handleGoToDetectedSignsScreen = (croppedImages, predictions) => {
        props.navigation.navigate("DetectedSignsScreen", { croppedImages, predictions });
    }

    const uploadVideoAndPredict = async () => {
        if (!videoUri) return;

        setLoading(true);

        let formData = new FormData();
        formData.append('file', {
          uri: videoUri,
          type: 'video/mp4',
          name: 'video.mp4',
        });

        try {
            const response = await uploadVideo(formData);
            console.log(response);

            const { cropped_images, predictions } = response;
            setCroppedImages(cropped_images);
            setPredictions(predictions);
            setVideoUri(null);
            handleGoToDetectedSignsScreen(cropped_images, predictions);
        }
        catch (error) {
            console.log(error);
            Alert.alert('Video Upload Failed', 'An error occurred! Please try again!');
        }
        finally {
            setLoading(false);
        }
    }
    
    const handleDiscard = () => {
        setVideoUri(null);
        setCroppedImages([]);
        setPredictions([]);
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" style={{ paddingTop: "70%" }} />
            </View>
        );
    }

    if (videoUri && videoDimensions) {
        const { width, height } = videoDimensions;
        const aspectRatio = width / height;

        const screenDimensions = Dimensions.get('window');
        const screenAspectRatio = screenDimensions.width / screenDimensions.height;
        const videoStyle = aspectRatio > screenAspectRatio
            ? { width: screenDimensions.width, height: screenDimensions.width / aspectRatio }
            : { width: screenDimensions.height * aspectRatio, height: screenDimensions.height };

        return (
            <View style={styles.container}>
                <View style={styles.mediaContainer}>
                    <Video
                        source={{ uri: videoUri }}
                        style={[videoStyle]}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button 
                        mode="outlined" 
                        onPress={handleDiscard}
                        textColor="#E37383"
                    >
                        Discard
                    </Button>
                    <Button 
                        mode="contained" 
                        onPress={uploadVideoAndPredict}
                        buttonColor="#E37383"
                    >
                        Predict    
                    </Button>
                </View>
            </View>
        )
    }

    return (
        <ImageBackground source={require('../../assets/background.jpg')} style={styles.background}>
            <View style={styles.container}>
                {croppedImages.length === 0 &&
                    <Button 
                        mode="contained"
                        buttonColor="#E37383"
                        onPress={pickVideo}
                    >
                        Select a Video from Camera Roll
                    </Button>}
            </View>
        </ImageBackground>
    );

}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        backgroundColor: 'white'
      },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediaContainer: {
        flex: 1,
        justifyContent: 'center' ,
        alignItems: 'center',
        marginBottom: 40,
        width: '100%',
        height: '80%',
        paddingTop: 150,
        paddingBottom: 100
    },
    buttonContainer: {
        bottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        margin: 20,
    },
    actionButton: {
        marginHorizontal: 10,
        width: 100,
      },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    separator: {
        height: 10,
    },
  });

export default UploadVideoScreen;