import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const AddMealPageScreen = () => {
  const { addMeals } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState("");
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [protein, setProtein] = useState("");
  const [ingredients, setIngredients] = useState("");

  const handleSubmit = () => {
    if (!title || !image || !calories || !carbs || !fat || !protein || !ingredients) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    const categoriesArray = categories.split(",").map((item) => item.trim());
    const ingredientsArray = ingredients.split(",").map((item) => item.trim());

    addMeals(
      title,
      image,
      categoriesArray,
      Number(calories),
      Number(carbs),
      Number(fat),
      Number(protein),
      ingredientsArray
    );

    Alert.alert("Success", "Meal added successfully");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Meal</Text>
      <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Image URL" style={styles.input} value={image} onChangeText={setImage} />
      <TextInput placeholder="Categories (comma separated)" style={styles.input} value={categories} onChangeText={setCategories} />
      <TextInput placeholder="Calories" keyboardType="numeric" style={styles.input} value={calories} onChangeText={setCalories} />
      <TextInput placeholder="Carbs (g)" keyboardType="numeric" style={styles.input} value={carbs} onChangeText={setCarbs} />
      <TextInput placeholder="Fat (g)" keyboardType="numeric" style={styles.input} value={fat} onChangeText={setFat} />
      <TextInput placeholder="Protein (g)" keyboardType="numeric" style={styles.input} value={protein} onChangeText={setProtein} />
      <TextInput placeholder="Ingredients (comma separated)" style={styles.input} value={ingredients} onChangeText={setIngredients}  multiline={true} />
      <Button title="Add Meal" color="#28a745" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default AddMealPageScreen;
