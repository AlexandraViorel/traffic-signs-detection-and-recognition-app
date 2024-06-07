import React, { useContext, useEffect, useState } from "react";
import { useAppContext } from "../appContext";
import { ActivityIndicator, Button, Card, IconButton, Title, Paragraph } from "react-native-paper";
import { Alert, ScrollView, View, Text, StyleSheet, ImageBackground } from "react-native";

const StatisticsOptionsScreen = (props) => {
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
    
    const handleDetectionStatistics = () => {props.navigation.navigate("DetectionStatisticsScreen")}
    const handlePredictionStatistics = () => {props.navigation.navigate("PredictionStatisticsScreen")}


    return (
        <ImageBackground source={require('../../assets/background.jpg')} style={styles.background}>
            <View style={styles.container}>
                <View style={styles.row}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Show Detection Statistics</Title>
                        <Paragraph>View statistics related to the detected traffic signs.</Paragraph>
                        <Button 
                        mode="contained" 
                        icon="traffic-light"
                        onPress={handleDetectionStatistics}
                        style={styles.button}
                        buttonColor="#E37383"
                        >
                            Show
                        </Button>
                    </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                    <Card.Content>
                        <Title>Show Predictions Statistics</Title>
                        <Paragraph>View statistics related to the predicted traffic signs.</Paragraph>
                        <Button 
                        mode="contained" 
                        icon="traffic-light"
                        onPress={handlePredictionStatistics}
                        style={styles.button}
                        buttonColor="#E37383"
                        >
                            Show
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
        height: 250,
        backgroundColor: '#E5E4E2',
    },
    cardActions: {
        justifyContent: 'center',
    },
    button: {
        marginVertical: 40,
    },
});

export default StatisticsOptionsScreen;