import React, { useContext, useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Animated } from "react-native";
import { Context as nameContext } from "../context/AuthContext";
import logo from "../../assets/Page1.jpeg"; // Correct image file name
import { Icon } from "react-native-elements";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons"; // Import the specific icon


const HomePageScreen = ({ navigation }) => {
    const { state, getname } = useContext(nameContext);
    const [isLoading, setIsLoading] = useState(true);
    const { signout } = useContext(nameContext);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fetch user name on component mount
        const fetchName = async () => {
            setIsLoading(true);
            await getname();
            setIsLoading(false);
        };
        fetchName();

        // Start fade-in animation for bottom navigation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
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

                {state.role === "admin" && (
                    <View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("AddProducts")}
                        >
                            <Text style={styles.buttonText}>Add Product</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("DeleteProduct")}
                        >
                            <Text style={styles.buttonText}>Delete Product</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("AddVideo")}
                        >
                            <Text style={styles.buttonText}>Add Video</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("DeleteVideo")}
                        >
                            <Text style={styles.buttonText}>Delete Video</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("UpdateAmount")}
                        >
                            <Text style={styles.buttonText}>Update Amount </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Bottom Navigation Bar */}
                <Animated.View style={[styles.bottomNav, { opacity: fadeAnim }]}>
                    {[
                        { name: "Chat", icon: "comments" ,type: "font-awesome-5",arrive:"ChatPage" },
                        { name: "Store", icon: "store" , type:"font-awesome-5" , arrive:"ShopPage" },
                        { name: "Workout", icon: "dumbbell", type: "font-awesome-5" , arrive:"Workout" },
                        { name: "Profile", icon: "user" , type:"font-awesome-5"  , arrive:"ProfilePage"},
                        { name: "Log out", icon: "sign-out-alt" , type:"font-awesome-5"  , arrive:"ProfilePage"},

                    ].map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.navItem}
                            onPress={() => navigation.navigate(item.arrive)}
                        >
                            <Icon name={item.icon} type={item.type} size={24} color="#4d8856" />
                            <Text style={styles.navText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            </View>
        </ImageBackground>
    );
};

HomePageScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
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
        backgroundColor: "#517e39",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 15,
        width: "80%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    bottomNav: {
        position: "absolute",
        bottom: 20,
        left: 10,
        right: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    navItem: {
        alignItems: "center",
    },
    navText: {
        fontSize: 12,
        color: "#666",
        marginTop: 5,
    },
});

export default HomePageScreen;
