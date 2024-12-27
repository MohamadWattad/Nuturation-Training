import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Context as nameContext } from "../context/AuthContext";
import logo from "../../assets/Page1.jpeg"; // Correct image file name

const HomePageScreen = ({ navigation }) => {
    const { state, getname } = useContext(nameContext);
    const [isLoading, setIsLoading] = useState(true);
    const { signout } = useContext(nameContext);

    useEffect(() => {
        const fetchName = async () => {
            setIsLoading(true);
            await getname();
            setIsLoading(false);
        };
        fetchName();
    }, []);

    return (
        <ImageBackground source={logo} style={styles.backgroundImage}>
            <View style={styles.container}>
                {isLoading ? (
                    <Text style={styles.loadingText}>Loading...</Text>
                ) : (
                    <Text style={styles.welcomeText}>Welcome, {state.userName}!</Text>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("ProfilePage")}
                >
                    <Text style={styles.buttonText}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={signout}>
                    <Text style={styles.buttonText}>Sign out</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Workout")}
                >
                    <Text style={styles.buttonText}>Workout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("ShopPage")}
                >
                    <Text style={styles.buttonText}>Fitness Store</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("ChatPage")}
                >
                    <Text style={styles.buttonText}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("AddProducts")}
                >
                    <Text style={styles.buttonText}>AddProduct</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("DeleteProduct")}
                >
                    <Text style={styles.buttonText}>Delete Product</Text>
                </TouchableOpacity>


            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 30,
        textAlign: "center",
    },
    loadingText: {
        fontSize: 18,
        color: "#fff",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#517e39", // Semi-transparent background
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 15,
        width: "80%", // Button width relative to the screen
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default HomePageScreen;
