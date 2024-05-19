import { ResizeMode, Video } from "expo-av";
import { useState, useRef } from "react";
import { StyleSheet, View, Alert, SafeAreaView } from "react-native";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';


const UploadVideoScreen = (props) => {
    const [videoUri, setVideoUri] = useState(null);

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
            setVideoUri(result.assets[0].uri);
        }
    }

    const handleKeep = () => {
        console.log('Media accepted:', videoUri);
    }
    
    const handleDiscard = () => {
        setVideoUri(null);
    }

    if (videoUri) {
        return (
            <View style={styles.container}>
                <View style={styles.mediaContainer}>
                    <Video
                        source={{ uri: videoUri }}
                        style={styles.media}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                    />
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
            <Button mode="contained" onPress={pickVideo}>Select a Video from Camera Roll</Button>
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

export default UploadVideoScreen;