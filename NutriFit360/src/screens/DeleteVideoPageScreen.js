import React, { useContext, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Button } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";

const DeleteVideoPageScreen = () => {
    const { state, deleteVideo } = useContext(AuthContext);
    const [videoName, setVideoName] = useState(""); // State for video name input

    const handleDeleteByName = () => {
        if (!videoName.trim()) {
            Alert.alert("Error", "Please enter a video name to delete.");
            return;
        }

        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to delete \"${videoName}\"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => deleteVideo(videoName), // Call delete function by name
                },
            ]
        );
    };

    const handleDeleteFromList = (title) => {
        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to delete \"${title}\"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteVideo(title);
                            Alert.alert("Success", `\"${title}\" has been deleted successfully.`);
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete the video. Please try again.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Delete Videos</Text>

            {/* TextInput for deleting by name */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter video name to delete"
                    value={videoName}
                    onChangeText={setVideoName}
                />
                <Button title="Delete" color="#ff4d4d" onPress={handleDeleteByName} />
            </View>

            {/* List of videos */}
            {state.videos && state.videos.length > 0 ? (
                <FlatList
                    data={state.videos}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.videoCard}>
                            <Text style={styles.videoTitle}>{item.title}</Text>
                            <Text style={styles.videoDuration}>{item.duration} mins</Text>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteFromList(item.title)}
                            >
                                <AntDesign name="delete" size={20} color="#fff" />
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noVideosText}>No videos available to delete.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    videoCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    videoTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    videoDuration: {
        fontSize: 16,
        color: "#555",
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ff4d4d",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: "#fff",
        marginLeft: 5,
        fontWeight: "bold",
    },
    noVideosText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginTop: 50,
    },
});

export default DeleteVideoPageScreen;   