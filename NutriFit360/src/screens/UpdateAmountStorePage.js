import React, { useContext, useState } from "react";
import { 
    Text, View, StyleSheet,Alert, TextInput, Button 
} from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const UpdateStockPageScreen = () => {
    const { state, updateStock } = useContext(AuthContext);
    const [productName, setProductName] = useState(""); 
    const [stockToAdd,setStockToAdd ] = useState(""); 

    const handleUpdateStockByName = async () => {
        if (!productName.trim() || !stockToAdd.trim()) {
            Alert.alert("Error", "Please enter a product name and stock amount.");
            return;
        }    
        Alert.alert(
            "Confirm Update",
            `Are you sure you want to add ${stockToAdd} units to "${productName}"?`,
            [
                { text: "Cancel", style: "cancel" },    
                {
                    text: "Update",
                    onPress: async () => {
                        try {
                            const response = await updateStock(productName, parseInt(stockToAdd));
    
                            if (response.error) {
                                Alert.alert("Error", response.error);
                                return;
                            }
    
                            Alert.alert("Success", `Stock updated successfully for "${productName}"`);
                        } catch (error) {
                            Alert.alert("Error", "Failed to update stock. Please try again.");
                        }
                    }
                }
            ]
        );
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Update Product Stock</Text>

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
                    value={stockToAdd}
                    onChangeText={setStockToAdd}
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
    productStock: {
        fontSize: 16,
        color: "#555",
    },
    updateButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    updateButtonText: {
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

export default UpdateStockPageScreen;
