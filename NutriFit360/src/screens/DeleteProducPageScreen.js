import React, { useContext, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Button } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";

const DeleteProductPageScreen = () => {
    const { state, deleteproducts } = useContext(AuthContext);
    const [productName, setProductName] = useState(""); // State for product name input

    const handleDeleteByName = () => {
        if (!productName.trim()) {
            Alert.alert("Error", "Please enter a product name to delete.");
            return;
        }

        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to delete "${productName}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => deleteproducts(productName), // Call delete function by name
                },
            ]
        );
    };

    const handleDeleteFromList = (name) => {
        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to delete "${name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteproducts(name);
                            Alert.alert("Success", `"${name}" has been deleted successfully.`);
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete the product. Please try again.");
                        }
                    },
                },
            ]
        );
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Delete Products</Text>

            {/* TextInput for deleting by name */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter product name to delete"
                    value={productName}
                    onChangeText={setProductName}
                />
                <Button title="Delete" color="#ff4d4d" onPress={handleDeleteByName} />
            </View>

            {/* List of products */}
            {state.products && state.products.length > 0 ? (
                <FlatList
                    data={state.products}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productPrice}>${item.price}</Text>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteFromList(item.name)}
                            >
                                <AntDesign name="delete" size={20} color="#fff" />
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noProductsText}>No products available to delete.</Text>
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
    productCard: {
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
    productName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    productPrice: {
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
    noProductsText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginTop: 50,
    },
});

export default DeleteProductPageScreen;
