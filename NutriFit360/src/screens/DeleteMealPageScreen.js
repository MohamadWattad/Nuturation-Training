import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const DeleteMealPageScreen = () => {
  const { deleteMeal } = useContext(AuthContext);
  const [mealTitle, setMealTitle] = useState("");

  const handleDelete = () => {
    if (!mealTitle.trim()) {
      Alert.alert("Error", "Please enter the meal title");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      `Delete meal "${mealTitle}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteMeal(mealTitle);
            Alert.alert("Deleted", `"${mealTitle}" has been removed.`);
            setMealTitle("");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Meal</Text>
      <TextInput
        placeholder="Enter meal title"
        value={mealTitle}
        onChangeText={setMealTitle}
        style={styles.input}
      />
      <Button title="Delete Meal" color="#dc3545" onPress={handleDelete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default DeleteMealPageScreen;
