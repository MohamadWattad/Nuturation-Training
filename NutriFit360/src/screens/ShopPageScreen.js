import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Dimensions } from 'react-native';
import { Context as AuthContext } from "../context/AuthContext";

const ShopPageScreen = ({ navigation }) => {
    const { state, getproducts, addToCart } = useContext(AuthContext); // Access addToCart function
    const [searchText, setSearchText] = useState(""); // State for search text
    const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products for search

    useEffect(() => {
        // Fetch products when the component mounts
        getproducts();
    }, []);

    useEffect(() => {
        // Filter products based on search text
        if (searchText.trim() === "") {
            setFilteredProducts(state.products); // Show all products if search text is empty
        } else {
            const filtered = state.products.filter((item) =>
                item.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchText, state.products]);

    const handleAddToCart = async (productName) => {
        try {
            const response = await addToCart(productName); // Call addToCart and wait for response

            // // ✅ Check if the response contains an error (e.g., out of stock)
            // if (response?.error) {
            //     Alert.alert("Error", response.error); // Show error message from backend
            //     return;
            // }
            // await addToCart(productName); // Call the context function to add the product to the cart
            Alert.alert("Success", `${productName} has been added to your cart!`);
        } catch (err) {
            Alert.alert("Error", "Failed to add the product to the cart. Please try again.");
            console.error(err.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Fitness Store</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
                    <AntDesign name="shoppingcart" size={24} color="black" style={styles.cartIcon} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for products..."
                    placeholderTextColor="#aaa"
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* Products List */}
            <FlatList
                data={filteredProducts}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.price}>${item.price}</Text>
                        <Text>Amount:{item.stock}</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleAddToCart(item.name)} // Pass product name to handleAddToCart
                        >
                            <Text style={styles.buttonText}>Add to Cart</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item, index) => {
                    if (item._id) {
                        return item._id.toString(); // Use _id if available
                    }
                    return index.toString(); // Fallback to index
                }}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const screenWidth = Dimensions.get('window').width;

// ShopPageScreen.navigationOptions = () => {
//     return {
//       headerShown: false,
//     };
//   };


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    cartIcon: {
        position: "absolute",
        right: 10,
        top: 0,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#fff",
        paddingHorizontal: 10,
    },
    searchBar: {
        flex: 1,
        height: 40,
        marginLeft: 10,
    },
    searchIcon: {
        color: "#888",
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: "100%",
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },
    price: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ShopPageScreen;
