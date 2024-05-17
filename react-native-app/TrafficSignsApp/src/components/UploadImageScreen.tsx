import { useState, useRef } from "react";
import { StyleSheet, View, Image, Alert, Dimensions, SafeAreaView } from "react-native";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';


const UploadImageScreen = (props: any) => {
    const [imageUri, setImageUri] = useState<any>(null);
    const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number } | null>(null);

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

    const handleKeep = () => {
        console.log('Media accepted:', imageUri);
    }
    
    const handleDiscard = () => {
        setImageUri(null);
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
                    <Image source={{uri: imageUri}} style={[styles.media, imageStyle]} resizeMode="contain" /> 
                </View>
                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={handleKeep}>Keep</Button>
                    <Button mode="contained" onPress={handleDiscard}>Discard</Button>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={pickImage}>Select an Image from Camera Roll</Button>
        </View>
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
        color: 'white',
    },
    media: {
        width: '100%',
        height: '100%',
    },
    separator: {
        height: 10,
    },
  });

export default UploadImageScreen;