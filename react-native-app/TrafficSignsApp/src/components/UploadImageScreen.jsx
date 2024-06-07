import { useState, useRef } from "react";
import { StyleSheet, View, Image, Alert, Dimensions, ImageBackground } from "react-native";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../appContext';


const UploadImageScreen = (props) => {
    const {uploadImage} = useAppContext();
    const [imageUri, setImageUri] = useState(null);
    const [imageDimensions, setImageDimensions] = useState(null);
    const [croppedImages, setCroppedImages] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("No permissions", "Camera roll permissions needed!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1
        });

        if (!result.canceled) {
            const { uri, width, height } = result.assets[0];
            setImageUri(uri);
            setImageDimensions({ width, height });
        }
    }

    const handleGoToDetectedSignsScreen = (croppedImages, predictions) => {
        props.navigation.navigate("DetectedSignsScreen", { croppedImages, predictions });
    }

    const uploadImageAndPredict = async () => {
        if (!imageUri) return;

        setLoading(true);

        let formData = new FormData();
        formData.append('file', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'image.jpg',
        });

        try {
            const response = await uploadImage(formData);
            console.log(response);

            const { cropped_images, predictions } = response;
            setCroppedImages(cropped_images);
            setPredictions(predictions);
            setImageUri(null);
            handleGoToDetectedSignsScreen(cropped_images, predictions);
        }
        catch (error) {
            console.log(error);
            Alert.alert('Image Upload Failed', 'An error occured! Please try again!');
        }
        finally {
            setLoading(false);
        }
    }
    
    const handleDiscard = () => {
        setImageUri(null);
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

    if (imageUri && imageDimensions) {
        const { width, height } = imageDimensions;
        const aspectRatio = width / height;

        const screenDimensions = Dimensions.get('window');
        const screenAspectRatio = screenDimensions.width / screenDimensions.height;
        const imageStyle = aspectRatio > screenAspectRatio
            ? { width: screenDimensions.width, height: screenDimensions.width / aspectRatio }
            : { width: screenDimensions.height * aspectRatio, height: screenDimensions.height };

        return (
            <View style={styles.container}>
                <View style={styles.mediaContainer}>
                    <Image source={{uri: imageUri}} style={[ imageStyle]} resizeMode="contain" /> 
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
                        onPress={uploadImageAndPredict}
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
                        onPress={pickImage}
                    >
                        Select an Image from Camera Roll
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
        backgroundColor: '#007AFF',
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
    croppedImage: {
        width: 100,
        height: 100,
    },
  });

export default UploadImageScreen;