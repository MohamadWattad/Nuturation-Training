import React, { useEffect, useContext } from "react";
import { StyleSheet, View, Text, FlatList, Image, ActivityIndicator  , TouchableOpacity, Alert} from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { Dimensions } from "react-native";

const BackWorkoutPageScreen = () => {
  const { state, getVideo,AddExercise } = useContext(AuthContext);

  useEffect(() => {
    getVideo("Back"); 
  }, []);

  if (!state.details) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  if (state.details.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>No videos found for Chest workout!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chest Workout Videos</Text>
      <FlatList
        data={state.details}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.gifUrl }} style={styles.thumbnail} />
            <Text style={styles.videoTitle}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.duration}>Duration: {item.duration}</Text>
            <TouchableOpacity onPress={() => {
              AddExercise(item._id);
              Alert.alert("Added!", "This exercise was added to your list.");
            }}>
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: width * 0.9, // Adjust width to 90% of the screen
    alignSelf: "center",
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
    color: "#222",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    textAlign: "justify",
  },
  duration: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: "#555",
    textAlign: "center",
  },
});

export default BackWorkoutPageScreen;
