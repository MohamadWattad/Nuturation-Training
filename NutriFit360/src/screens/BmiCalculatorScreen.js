import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const BmiCalculatorScreen = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiData, setBmiData] = useState([]);
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

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    const roundedBmi = parseFloat(bmiValue.toFixed(2));

    let bmiCategory = "";
    if (bmiValue < 18.5) bmiCategory = "Underweight";
    else if (bmiValue >= 18.5 && bmiValue < 24.9) bmiCategory = "Normal weight";
    else if (bmiValue >= 25 && bmiValue < 29.9) bmiCategory = "Overweight";
    else bmiCategory = "Obesity";

    setBmi(roundedBmi);
    setCategory(bmiCategory);

    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
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
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Calculate BMI</Text>
      </TouchableOpacity>

      {bmi && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Your BMI: {bmi}</Text>
          <Text style={styles.resultCategory}>{category}</Text>
        </View>
      )}

      {bmiData.length > 0 && (
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>BMI History</Text>
          <LineChart
            data={{
              labels: bmiData.map((item, index) =>
                index % 2 === 0
                  ? new Date(item.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                    })
                  : ""
              ),
              datasets: [
                {
                  data: bmiData.map((item) => item.bmi),
                },
              ],
            }}
            width={340}
            height={220}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} 
            formatYLabel={(value) => parseFloat(value).toFixed(0)}
            withInnerLines={false}
            verticalLabelRotation={20}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#f0f4f7",
              backgroundGradientTo: "#f0f4f7",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#3498db",
              },
            }}
            bezier
            style={{
              borderRadius: 10,
              marginLeft: 10,
              paddingRight: 25,
            }}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f4f6f8",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  button: {
    width: "100%",
    backgroundColor: "#3f87f5",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#3f87f5",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  resultContainer: {
    backgroundColor: "#e8f4fd",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  resultCategory: {
    fontSize: 18,
    color: "#2e86de",
  },
  graphContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
});

export default BmiCalculatorScreen;
