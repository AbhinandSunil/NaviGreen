import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const AccelerometerScreen = ({ navigation }) => {
    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    const [features, setFeatures] = useState({
        meanAcc: 0,
        stdDev: 0,
        xJerk: 0,
        yJerk: 0,
        zJerk: 0,
        medianAcc: 0,
        variance: 0,
        skewness: 0,
    });
    const sendDataToModel = async (averageData) => {
        try {
            const response = await fetch('http://192.168.1.67:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: averageData }),
            });
            const result = await response.json();
            console.log('Predicted mode of transport:', result.prediction);
        } catch (error) {
            console.error('Error sending data to model:', error);
        }
    };
    let dataBuffer = [];
    const bufferInterval = 5; 
    let bufferStartTime = Date.now();

    const calculateFeatures = (accData) => {
         const meanAcc = (accData.x + accData.y + accData.z) / 3;
        const stdDev = Math.sqrt(
            [(accData.x - meanAcc) ** 2, (accData.y - meanAcc) ** 2, (accData.z - meanAcc) ** 2].reduce((a, b) => a + b, 0) / 3
        );
        const xJerk = accData.x - meanAcc;
        const yJerk = accData.y - meanAcc;
        const zJerk = accData.z - meanAcc;
        const sortedAcc = [accData.x, accData.y, accData.z].sort((a, b) => a - b);
        const medianAcc = sortedAcc[1];
        const variance = stdDev ** 2;
        const skewness = ((accData.x - meanAcc) ** 3 + (accData.y - meanAcc) ** 3 + (accData.z - meanAcc) ** 3) / (3 * stdDev ** 3);

        setFeatures({
            meanAcc,
            stdDev,
            xJerk,
            yJerk,
            zJerk,
            medianAcc,
            variance,
            skewness,
        });

        dataBuffer.push({
            meanAcc: features.meanAcc,
            stdDev: features.stdDev,
            xJerk: features.xJerk,
            yJerk: features.yJerk,
            zJerk: features.zJerk,
            medianAcc: features.medianAcc,
            variance: features.variance,
            skewness: features.skewness,
            x: x,
            y: y,
            z: z
        });

        if (Date.now() - bufferStartTime > bufferInterval * 1000) {
            const averageData = calculateAverage(dataBuffer);
            sendDataToModel(averageData);
            dataBuffer = [];
            bufferStartTime = Date.now();
        }
    };

    const calculateAverage = (data) => {
        const sumData = data.reduce((acc, current) => {
            return {
                x: acc.x + current.x,
                y: acc.y + current.y,
                z: acc.z + current.z,
                meanAcc: acc.meanAcc + current.meanAcc,
                stdDev: acc.stdDev + current.stdDev,
                xJerk: acc.xJerk + current.xJerk,
                yJerk: acc.yJerk + current.yJerk,
                zJerk: acc.zJerk + current.zJerk,
                medianAcc: acc.medianAcc + current.medianAcc,
                variance: acc.variance + current.variance,
                skewness: acc.skewness + current.skewness,
               
            };
        }, {
            x: 0,
            y: 0,
            z: 0,
            meanAcc: 0,
            stdDev: 0,
            xJerk: 0,
            yJerk: 0,
            zJerk: 0,
            medianAcc: 0,
            variance: 0,
            skewness: 0,
        });
    
        const averageData = [
            sumData.x / data.length,
            sumData.y / data.length,
            sumData.z / data.length,
            sumData.meanAcc / data.length,
            sumData.stdDev / data.length,
            sumData.xJerk / data.length,
            sumData.yJerk / data.length,
            sumData.zJerk / data.length,
            sumData.medianAcc / data.length,
            sumData.variance / data.length,
            sumData.skewness / data.length
        ];
        return averageData;
    };

    const _subscribe = () => {
        Accelerometer.setUpdateInterval(1000); 
        setSubscription(
            Accelerometer.addListener((accData) => {
                setData(accData);
                calculateFeatures(accData);
            })
        );
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };
    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);


    const goBackToCardScreen = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.backButtonContainer}>
                <Button title="< Go Back" onPress={goBackToCardScreen} color="black" />
            </View>
            <Text style={styles.text}>Accelerometer: (in gs where 1g = 9.81 m/s^2)</Text>
            <Text style={styles.text}>x: {x.toFixed(3)}</Text>
            <Text style={styles.text}>y: {y.toFixed(3)}</Text>
            <Text style={styles.text}>z: {z.toFixed(3)}</Text>
             <Text style={styles.text}>Mean Acceleration: {features.meanAcc.toFixed(3)}</Text>
            <Text style={styles.text}>Standard Deviation: {features.stdDev.toFixed(3)}</Text>
            <Text style={styles.text}>X-axis Jerk: {features.xJerk.toFixed(3)}</Text>
            <Text style={styles.text}>Y-axis Jerk: {features.yJerk.toFixed(3)}</Text>
            <Text style={styles.text}>Z-axis Jerk: {features.zJerk.toFixed(3)}</Text>
            <Text style={styles.text}>Median: {features.medianAcc.toFixed(3)}</Text>
            <Text style={styles.text}>Variance: {features.variance.toFixed(3)}</Text>
            <Text style={styles.text}>Skewness: {features.skewness.toFixed(3)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    backButtonContainer: {
        position: 'absolute',
        top: 40,
        left: 5,
        zIndex: 999,
    },
    text: {
        textAlign: 'center',
        marginBottom: 5,
    },
});

export default AccelerometerScreen;
