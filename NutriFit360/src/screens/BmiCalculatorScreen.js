import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";

const BmiCalculatorScreen = () => {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmiData, setBmiData] = useState([]); // Stores BMI history
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState("");

    const calculateBMI = () => {
        if (!height || !weight) {
            Alert.alert("Error", "Please enter both height and weight!");
            return;
        }

        const heightInMeters = parseFloat(height) / 100;
        const weightInKg = parseFloat(weight);

        if (heightInMeters <= 0 || weightInKg <= 0) {
            Alert.alert("Error", "Height and weight must be positive numbers!");
            return;
        }

        // Calculate BMI
        const bmiValue = weightInKg / (heightInMeters * heightInMeters);
        const roundedBmi = parseFloat(bmiValue.toFixed(2));

        // Determine BMI category
        let bmiCategory = "";
        if (bmiValue < 18.5) bmiCategory = "Underweight";
        else if (bmiValue >= 18.5 && bmiValue < 24.9) bmiCategory = "Normal weight";
        else if (bmiValue >= 25 && bmiValue < 29.9) bmiCategory = "Overweight";
        else bmiCategory = "Obesity";

        setBmi(roundedBmi);
        setCategory(bmiCategory);

        // Add BMI and current date to history
        const date = new Date().toISOString().split("T")[0];
        setBmiData([...bmiData, { date, bmi: roundedBmi }]);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>BMI Calculator</Text>
            <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
            />
            <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
            />
            <Button title="Calculate BMI" onPress={calculateBMI} />
            {bmi && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Your BMI: {bmi}</Text>
                    <Text style={styles.resultText}>Category: {category}</Text>
                </View>
            )}
            {bmiData.length > 0 && (
                <View style={styles.graphContainer}>
                    <Text style={styles.graphTitle}>BMI Graph</Text>
                    <LineChart
                        data={{
                            labels: bmiData.map((item) => item.date), // X-axis labels
                            datasets: [
                                {
                                    data: bmiData.map((item) => item.bmi), // Y-axis values
                                },
                            ],
                        }}
                        width={300}
                        height={220}
                        yAxisSuffix=" kg/m²"
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        bezier
                        style={styles.chart}
                    />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    resultContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    resultText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    graphContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    graphTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    chart: {
        borderRadius: 16,
    },
});

export default BmiCalculatorScreen;
