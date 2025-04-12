import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import CircularProgress from 'react-native-circular-progress-indicator';
import { Context as AuthContext } from "../context/AuthContext";

const FILTERS = ["All", "Breakfast", "Lunch", "Dinner", "Snack", "Pre-Workout", "Post-Workout"];

const MealsPageScreen1 = () => {
  const { state, getMeals } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getMeals();
  }, []);

  const openMeal = (meal) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  if (!state.meals) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading meals...</Text>
      </View>
    );
  }

  const filteredMeals =
    selectedCategory === "All"
      ? state.meals
      : state.meals.filter((meal) =>
          Array.isArray(meal.category) && meal.category.includes(selectedCategory)
        );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Recipes 🍽️</Text>

      <View style={styles.filterContainer}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, selectedCategory === filter && styles.activeFilter]}
            onPress={() => setSelectedCategory(filter)}
          >
            <Text
              style={{
                color: selectedCategory === filter ? "#fff" : "#333",
                fontWeight: "bold",
              }}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredMeals}
        numColumns={2}
        keyExtractor={(item) => item._id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openMeal(item)}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.calories}>{item.calories} Cal</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal */}
      {selectedMeal && (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Image source={{ uri: selectedMeal.image }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedMeal.title}</Text>
              <Text style={styles.category}>{selectedMeal.category?.join(" • ")}</Text>

              <View style={styles.calorieChartContainer}>
                <CircularProgress
                  value={selectedMeal.calories}
                  radius={60}
                  maxValue={2000}
                  title={'cal'}
                  titleColor={'#555'}
                  titleStyle={{ fontWeight: 'bold' }}
                  progressValueColor={'#6a1b9a'}
                  activeStrokeColor={'#6a1b9a'}
                  inActiveStrokeColor={'#f3e5f5'}
                  inActiveStrokeOpacity={0.3}
                  activeStrokeWidth={12}
                  inActiveStrokeWidth={12}
                  progressValueFontSize={15}
                />
              </View>

              <View style={styles.macrosRow}>
                <View style={styles.macroBox}>
                  <Text style={[styles.macroLabel, { color: "#2e7d32" }]}> 
                    {Math.round((selectedMeal.carbs / (selectedMeal.carbs + selectedMeal.fat + selectedMeal.protein)) * 100)}%
                  </Text>
                  <Text style={styles.macroText}>{selectedMeal.carbs} g Carbs</Text>
                </View>
                <View style={styles.macroBox}>
                  <Text style={[styles.macroLabel, { color: "#f57c00" }]}> 
                    {Math.round((selectedMeal.fat / (selectedMeal.carbs + selectedMeal.fat + selectedMeal.protein)) * 100)}%
                  </Text>
                  <Text style={styles.macroText}>{selectedMeal.fat} g Fat</Text>
                </View>
                <View style={styles.macroBox}>
                  <Text style={[styles.macroLabel, { color: "#0288d1" }]}> 
                    {Math.round((selectedMeal.protein / (selectedMeal.carbs + selectedMeal.fat + selectedMeal.protein)) * 100)}%
                  </Text>
                  <Text style={styles.macroText}>{selectedMeal.protein} g Protein</Text>
                </View>
              </View>

              <Text style={styles.ingredientsTitle}>Ingredients</Text>
              <Text style={styles.ingredientsText}>{selectedMeal.ingredients?.join(", ")}</Text>

              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
};

const { width } = Dimensions.get("window");
const cardWidth = (width - 45) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 15,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    justifyContent: "center",
  },
  filterButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 5,
  },
  activeFilter: {
    backgroundColor: "#4a90e2",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    width: cardWidth,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    color: "#333",
  },
  calories: {
    fontSize: 12,
    color: "#777",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
    textAlign: "center",
  },
  category: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
    marginBottom: 10,
    textAlign: "center",
  },
  calorieChartContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  macrosRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    width: "100%",
  },
  macroBox: {
    alignItems: "center",
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  macroText: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    alignSelf: "flex-start",
  },
  ingredientsText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  closeButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
});

export default MealsPageScreen1;
