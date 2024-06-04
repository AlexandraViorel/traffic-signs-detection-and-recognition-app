import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Image, Alert, Dimensions, SafeAreaView, Text, ScrollView } from "react-native";
import { ActivityIndicator, Card, Title, Button, IconButton } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../appContext';


const DetectedSignsScreen = (props) => {
    const { updatePrediction } = useAppContext();
    const [croppedImages, setCroppedImages] = useState([]);
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        setCroppedImages(props.route.params.croppedImages);
        setPredictions(props.route.params.predictions);
    }, []);

    const handleUpdatePrediction = async (predictionId, isCorrect) => {
        try {
            const response = await updatePrediction(predictionId, isCorrect);
            Alert.alert('Feedback Successful', `Your feedback on the prediction was provided successfully!`);

            setCroppedImages(croppedImages.filter((_, index) => predictions[index].id !== predictionId));
            setPredictions(predictions.filter(prediction => prediction.id !== predictionId));

            if (updatedPredictions.length === 0) {
                handleGoToOptionsScreen();
            }
        }
        catch (error) {
            Alert.alert('Feedback Failed', 'An error occurred! Please try again!');
        }
    }

    const renderEntityCard = (index, prediction, image, predictionId) => {
        const handleCorrectPrediction = () => { handleUpdatePrediction(predictionId, true); };
        const handleIncorrectPrediction = () => { handleUpdatePrediction(predictionId, false); };
      
        return (
            <Card key={index} style={styles.card}>
                <Card.Content>
                    <Title>{`Predicted: ${prediction}`}</Title>
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${image}` }}
                        style={styles.croppedImage}
                    />
                </Card.Content>
                <Card.Actions>
                    <IconButton 
                        icon="check"  
                        iconColor="#ffffff"
                        containerColor="#34b233"
                        style={styles.iconButton}
                        onPress={handleCorrectPrediction} />
                    <IconButton 
                        icon = "cancel"  
                        iconColor="#ffffff"
                        containerColor="#cc0000"
                        style={styles.iconButton}
                        onPress={handleIncorrectPrediction} />
                </Card.Actions>
          </Card>
      );
    }

    const handleGoToOptionsScreen = () => {props.navigation.navigate("Options")}

    if (croppedImages.length === 0 && predictions.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noSignsText}>There were no traffic signs detected!</Text>
                <Button 
                    mode="contained"
                    onPress={handleGoToOptionsScreen}
                    buttonColor="#4682B4"
                >
                    Go Back to the Options Screen
                </Button>
            </View>

        ) }


    return (
        <ScrollView contentContainerStyle={styles.detectedSignsList}>
            <Text style={styles.text}>Detected Traffic Signs</Text>
            <Text style={styles.description}>Help us improve our traffic sign detection and recognition models by providing feedback on the detected traffic signs! 😊</Text>
            {croppedImages.length !== 0 && croppedImages.map((base64Image, index) => renderEntityCard(index, predictions[index].class_name, base64Image, predictions[index].id))}    
            <Button mode="contained" onPress={handleGoToOptionsScreen} style={styles.skipButton}>Skip Feedback</Button>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detectedSignsList: {
        marginTop: 60,
        paddingBottom: 100,
        padding: 20,
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        marginBottom: 20,
        width: '100%',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
        alignContent: 'center',
        justifyContent: 'center',
    },
    noSignsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 30,
    },
    skipButton: {
        marginTop: 20,
        backgroundColor: '#f44336',
    },
    iconButton: {
        margin: 0,
        borderWidth: 0,
        elevation: 0,
    },
    croppedImage: {
        width: 100,
        height: 100,
    },
  });

export default DetectedSignsScreen;