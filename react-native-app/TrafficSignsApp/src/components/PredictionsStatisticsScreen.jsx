import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { ActivityIndicator } from 'react-native-paper';
import { useAppContext } from '../appContext';

const PredictionsStatisticsScreen = () => {
    const { getPredictionStatistics } = useAppContext();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        try {
            const response = await getPredictionStatistics();
            setData(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const processDataForChart = () => {
        return {
            labels: ['Correct Predictions', 'Incorrect Predictions'],
            datasets: [
                {
                    data: [data.correct_predictions || 0, data.incorrect_predictions || 0],
                },
            ],
        };
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        );
    }

    return (
        <ImageBackground source={require('../../assets/background.jpg')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Prediction Accuracy Statistics</Text>
                <BarChart
                    data={processDataForChart()}
                    width={Dimensions.get('window').width - 32}
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix=""
                    fromZero
                    chartConfig={{
                        backgroundColor: '#FFB6C1',
                        backgroundGradientFrom: '#FFB6C1',
                        backgroundGradientTo: '#FFB6C1',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#E37383',
                        },
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}

                />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-start',
        backgroundColor: 'white'
      },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 100,
        marginTop: 60,
        height: 500,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        paddingBottom: 50,
        fontWeight: 'bold',
    },
});

export default PredictionsStatisticsScreen;
