import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button } from "react-native-paper";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

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
    
    const handleGoToOptionsScreen = () => {props.navigation.navigate("Options")}


    return (
      <ImageBackground source={require('../../assets/background.jpg')} style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to the Traffic Sign Detection App</Text>
          <Text style={styles.description}>
            This app allows you to upload images/videos or use your camera to detect and classify traffic signs.
          </Text>
          <Button
            mode="contained" 
            onPress={handleGoToOptionsScreen}
            style={styles.button}
            buttonColor="#4682B4"
          >
              Let's get started
          </Button>
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

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginHorizontal: 30,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
  },
});

export default MainScreen;