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
        }
        catch (error) {
            Alert.alert('Feedback Failed', 'An error occurred! Please try again!');
        }
    }

    const renderEntityCard = (index, prediction, image, predictionId) => {
        const handleCorrectPrediction = () => { handleUpdatePrediction(predictionId, true); };
        const handleIncorrectPrediction = () => { handleUpdatePrediction(predictionId, false); };
      
        return (
          <>
            <Card key={index}>
            <Card.Content>
              <Title>{`Predicted: ${prediction}`}</Title>
              <Image
                    source={{ uri: `data:image/jpeg;base64,${image}` }}
                    style={styles.croppedImage}
              />
            </Card.Content>
            <Card.Actions>
            <IconButton icon = "check-circle"  onPress={handleCorrectPrediction} />
            <IconButton icon = "cancel"  onPress={handleIncorrectPrediction} />
          </Card.Actions>
          </Card>
          </>
      );
    }

    return (
        
        <ScrollView>
            <Text style={styles.text}>Detected Traffic Signs:</Text>
            {croppedImages.map((base64Image, index) => renderEntityCard(index, predictions[index].class_name, base64Image, predictions[index].id))}    
        </ScrollView>
    );

}

const styles = StyleSheet.create({
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
        height: '80%'
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
        color: 'black',
    },
    media: {
        width: '100%',
        height: '100%',
    },
    separator: {
        height: 10,
    },
    croppedImage: {
        width: 100,
        height: 100,
    },
  });

export default DetectedSignsScreen;