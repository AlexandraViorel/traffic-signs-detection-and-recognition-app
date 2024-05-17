import { ResizeMode, Video } from "expo-av";
import { Camera, CameraType, VideoQuality } from "expo-camera";
import { useState, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";


const CameraScreen = (props: any) => {
    const [cameraType, setCameraType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [isRecording, setIsRecording] = useState(false);
    const [photo, setPhoto] = useState<any>(null);
    const [video, setVideo] = useState<any>(null);
    const [mediaUri, setMediaUri] = useState<any>(null);
    const [isVideo, setIsVideo] = useState(false);
    const cameraRefference = useRef<Camera | null>(null); 

    const toggleCameraType = () => {
        setCameraType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const takePicture = async () => {
        if (cameraRefference.current) {
            const photo = await cameraRefference.current.takePictureAsync();
            setPhoto(photo);
            console.log(photo.uri);
            setMediaUri(photo.uri);
            setIsVideo(false);
        }
    }

    const recordVideo = async () => {
        if (cameraRefference.current) {
            if (isRecording) {
                cameraRefference.current.stopRecording();
                setIsRecording(false);
            }
            else {
                setIsRecording(true);
                const video = await cameraRefference.current.recordAsync({
                    quality: VideoQuality["480p"],
                });
                setVideo(video);
                setMediaUri(video.uri);
                setIsVideo(true);
                console.log(video.uri);
                setIsRecording(false);
            }
        }
    }

    const handleKeep = () => {
        console.log('Media accepted:', mediaUri);
    }
    
    const handleDiscard = () => {
        setMediaUri(null);
    }

    if (!permission) {
        return (
            <View>
                <ActivityIndicator animating={true} size="large" style={{paddingTop: "70%"}}/>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View>
                <Text style={{ textAlign: 'center'}}>Cannot open camera without permissions!</Text>
                <Button mode="contained-tonal" onPress={requestPermission}>Allow</Button>
            </View>
        )
    }

    if (mediaUri) {
        return (
            <View style={styles.container}>
                {isVideo &&
                    <View style={styles.mediaContainer}>
                        <Video
                            source={{uri: mediaUri}}
                            useNativeControls
                            isLooping
                            style={styles.media}
                            resizeMode={ResizeMode.CONTAIN} />
                    </View>}


                {!isVideo &&
                    <View style={styles.mediaContainer}>
                        <Image
                            source={{uri: mediaUri}}
                            style={styles.media}
                            resizeMode="contain" />
                    </View>}
                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={handleKeep}>Keep</Button>
                    <Button mode="contained" onPress={handleDiscard}>Discard</Button>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Camera ref={cameraRefference} style={styles.camera} type={cameraType}>
                <View style={styles.cameraButtonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                        <IconButton mode="contained" icon="camera-switch" iconColor="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <IconButton mode="contained" icon="camera" iconColor="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={ recordVideo}>
                        <IconButton mode="contained" icon={isRecording ? "square" : "play" } iconColor="white" />
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    mediaContainer: {
        flex: 1,
        justifyContent: 'center' ,
        alignItems: 'center',
        marginBottom: 40,
        width: '100%',
        height: '80%'
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
        bottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    cameraButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
      },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
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
  });

export default CameraScreen;