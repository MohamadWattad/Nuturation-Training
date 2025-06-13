import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const FILTERS = ["All", "Chest", "Back", "Shoulder", "Leg", "Biceps", "Triceps", "Abs"];

const WorkoutPlanScreen = () => {
  const { state, getWorkoutPlan, deleteExercise } = useContext(AuthContext);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkoutPlan();
  }, []);

  const loadWorkoutPlan = async () => {
    setLoading(true);
    await getWorkoutPlan();
    setLoading(false);
  };

  const handleDelete = async (exerciseId) => {
    await deleteExercise(exerciseId);
    Alert.alert("Deleted", "The exercise was removed from your plan.");
    await loadWorkoutPlan(); // Refresh the plan
  };

  if (loading || !Array.isArray(state.details)) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading workout plan...</Text>
      </View>
    );
  }

  const allExercises = state.details.flatMap((plan) => plan.exercises);

  const filteredExercises =
    selectedFilter === "All"
      ? allExercises
      : allExercises.filter((exercise) => exercise.muscleGroup === selectedFilter);

  const renderFilter = (filter) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilter,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={{
          color: selectedFilter === filter ? "#fff" : "#333",
          fontWeight: "bold",
        }}
      >
        {filter}
      </Text>
    </TouchableOpacity>
  );

  const renderExercise = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.gifUrl }} style={styles.thumbnail} />
      <Text style={styles.videoTitle}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.duration}>Duration: {item.duration}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item._id)}
      >
        <Text style={styles.deleteButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Workout Plan</Text>
      <View style={styles.filterContainer}>
        {FILTERS.map(renderFilter)}
      </View>
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item._id}
        renderItem={renderExercise}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
  },
  duration: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default WorkoutPlanScreen;
