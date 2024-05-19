import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Image, Alert, Dimensions, SafeAreaView, Text, ScrollView } from "react-native";
import { ActivityIndicator, Card, Title, Button, IconButton } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../appContext';

export const renderEntityCard = (index, prediction, image) => {
    // const handleOnEditButton = () => { onIconPress(entity);}
    // const handleOnEditButton = () => {props.navigation.navigate("Update", {paramKey: entity})} // for update all fields
    // const handleOnDeleteButton = () => {props.navigation.navigate("Delete", {paramKey: entity})}
    const handleDetails = () => {{props.navigation.navigate("Details", {paramKey: entity})}}
  
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
        {/* <IconButton icon = "pencil"  onPress={handleOnEditButton} /> */}
        {/* <IconButton icon = "delete"  onPress={handleOnDeleteButton} /> */}
        {/* <IconButton icon = "arrow-right"  onPress={handleDetails} /> */}
      </Card.Actions>
      </Card>
      </>
  );
}

const DetectedSignsScreen = ({route, navigation}) => {
    const { croppedImages, predictions } = route.params;

    return (
        
        <ScrollView>
            <Text style={styles.text}>Detected Traffic Signs:</Text>
            {croppedImages.map((base64Image, index) => renderEntityCard(index, predictions[index].class_id, base64Image))}    
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