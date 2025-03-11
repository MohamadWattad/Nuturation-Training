import React, { useContext, useState } from "react";
import { 
    Text, View, StyleSheet, Alert, TextInput, Button 
} from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const DecreaseAmountPageScreen = () => {
    const { state, decreaseStock } = useContext(AuthContext);
    const [productName, setProductName] = useState(""); 
    const [stockToRemove, setStockToRemove] = useState(""); 

    const handleUpdateStockByName = async () => {
        if (!productName.trim() || !stockToRemove.trim()) {
            Alert.alert("Error", "Please enter a product name and stock amount.");
            return;
        }

        // ✅ Ask for confirmation BEFORE calling the API
        Alert.alert(
            "Confirm Update",
            `Are you sure you want to remove ${stockToRemove} units from "${productName}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Update",
                    onPress: async () => {
                        try {
                            const response = await decreaseStock(productName, parseInt(stockToRemove));

                            if (response.error) {
                                Alert.alert("Error", response.error);
                                return;
                            }

                            Alert.alert("Success", `Stock updated successfully for "${productName}"`);
                        } catch (error) {
                            Alert.alert("Error", "Failed to remove stock. Please try again.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Remove Product Stock</Text>

            {/* Input Fields for Manual Update */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter product name"
                    value={productName}
                    onChangeText={setProductName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter stock amount"
                    value={stockToRemove}
                    onChangeText={setStockToRemove}
                    keyboardType="numeric"
                />
                <Button title="Update" color="#4CAF50" onPress={handleUpdateStockByName} />
            </View>
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
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

export default DecreaseAmountPageScreen;
