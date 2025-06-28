import React, { useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const BicepsWorkoutPageScreen = () => {
  const { state, getVideo, AddExercise } = useContext(AuthContext);

  useEffect(() => {
    getVideo("Biceps");
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
        <Text style={styles.loadingText}>
          No videos found for Chest workout!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biceps Workout Videos</Text>
      <FlatList
        data={state.details}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.gifUrl }} style={styles.thumbnail} />
            <Text style={styles.videoTitle}>{item.title}</Text>
            {item.description ? (
              <Text style={styles.description}>{item.description}</Text>
            ) : null}
            <Text style={styles.duration}>Duration: {item.duration}</Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={async() => {
                await AddExercise(item._id);
                Alert.alert("✅ Added!", "This exercise was added to your list.");
                await getVideo("Biceps")
              }}
            >
              <Text style={styles.addButtonText}>Add to your list</Text>
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
    width: width * 0.9,
    alignSelf: "center",
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
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
  addButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: "#555",
    textAlign: "center",
  },
});

export default BicepsWorkoutPageScreen;
