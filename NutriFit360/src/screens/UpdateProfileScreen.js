import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Context as updateContext } from "../context/AuthContext";
import { Dropdown } from "react-native-element-dropdown";

const UpdateProfileScreen = ({ navigation }) => {
  const { state, updatedetails } = useContext(updateContext);

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [activityLevel, setActivityLevel] = useState();

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];
  const goalOptions = [
    { label: 'Weight Loss', value: 'weight_loss' },
    { label: 'Muscle Gain', value: 'muscle_gain' },
    { label: 'Maintain Weight', value: 'maintain_weight' },
  ];
  const activityLevelOptions = [
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Light Activity', value: 'light_activity' },
    { label: 'Moderate Activity', value: 'moderate_activity' },
    { label: 'Very Active', value: 'very_active' },
  ];

  const handleSave = async () => {
    if (!age || !gender || !height || !weight || !goal || !activityLevel) {
      Alert.alert("Validation Error", "All fields must be filled out");
      return;
    }

    const updatedData = {
      age: parseInt(age, 10),
      gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      goal,
      activityLevel,
    };

    await updatedetails(updatedData);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Your Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholderTextColor="#888"
      />

      <Dropdown
        style={styles.dropdown}
        data={genderOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Gender"
        value={gender}
        onChange={(item) => setGender(item.value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        placeholderTextColor="#888"
      />

      <Dropdown
        style={styles.dropdown}
        data={goalOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Goal"
        value={goal}
        onChange={(item) => setGoal(item.value)}
      />

      <Dropdown
        style={styles.dropdown}
        data={activityLevelOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Activity Level"
        value={activityLevel}
        onChange={(item) => setActivityLevel(item.value)}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f4f6f8",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    color: "#1a1a1a",
    textAlign: "center",
  },
  input: {
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dropdown: {
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  saveButton: {
    backgroundColor: "#3f87f5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#3f87f5",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UpdateProfileScreen;
