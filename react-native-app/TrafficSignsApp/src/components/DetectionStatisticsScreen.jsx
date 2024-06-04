import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ActivityIndicator } from 'react-native-paper';
import { useAppContext } from '../appContext';


const DetectionStatisticsScreen = () => {
    const {getDetectionStatistics} = useAppContext();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        try {
            const response = await getDetectionStatistics();

            setData(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    }

    const processDataForChart = () => {
        const labels = data.map(item => item.detection_date);
        const values = data.map(item => item.number_of_signs);

        return {
            labels: labels,
            datasets: [
                {
                    data: values,
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
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Detected Traffic Signs per Day</Text>
                <Text style={styles.title}>Statistics</Text>
                <LineChart
                    data={processDataForChart()}
                    width={Dimensions.get('window').width - 16}
                    height={600}
                    yAxisLabel=""
                    yAxisSuffix=""
                    verticalLabelRotation={90}
                    chartConfig={{
                        backgroundColor: '#4682B4',
                        backgroundGradientFrom: '#4682B4',
                        backgroundGradientTo: '#4682B4',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#ffa726',
                        },
                    }}
                    style={{
                        marginTop: 20,
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 100,
        marginTop: 60,

    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default DetectionStatisticsScreen;
