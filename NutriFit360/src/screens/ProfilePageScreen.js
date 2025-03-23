import React, { useContext, useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    ImageBackground,
} from "react-native";
import { Button } from "react-native-elements";
import { Context as nameContext } from "../context/AuthContext";
import Spacer from "../components/Spacer";
import background from "../../assets/Page1.jpeg"; // Background image

const ProfilePageScreen = ({ navigation }) => {
    const { state, getname, getdetails } = useContext(nameContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchName = async () => {
            setIsLoading(true);
            await getname();
            await getdetails();
            setIsLoading(false);
        };
        fetchName();
        console.log("State Details:", state.details);
    }, []);

    return (
        <ImageBackground source={background} style={styles.backgroundImage}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#ffffff" />
                    ) : (
                        <ScrollView contentContainerStyle={styles.contentContainer}>
                            {/* Welcome Text */}
                            <Text style={styles.welcomeText}>
                                Welcome to your Profile, {state.userName}!
                            </Text>

                            {/* Profile Details */}
                            <View style={styles.detailsContainer}>
                                <Text style={styles.detailItem}>
                                    <Text style={styles.label}>Age: </Text>
                                    {state.details.age}
                                </Text>
                                <Text style={styles.detailItem}>
                                    <Text style={styles.label}>Gender: </Text>
                                    {state.details.gender}
                                </Text>
                                <Text style={styles.detailItem}>
                                    <Text style={styles.label}>Height: </Text>
                                    {state.details.height} cm
                                </Text>
                                <Text style={styles.detailItem}>
                                    <Text style={styles.label}>Weight: </Text>
                                    {state.details.weight} kg
                                </Text>
                                <Text style={styles.detailItem}>
                                    <Text style={styles.label}>Goal: </Text>
                                    {state.details.goal}
                                </Text>
                                <Text style={styles.detailItem}>
                                    <Text style={styles.label}>Activity Level: </Text>
                                    {state.details.activityLevel}
                                </Text>
                            </View>

                            {/* Buttons */}
                            <View style={styles.buttonContainer}>
                                <Button
                                    title="Home Page"
                                    buttonStyle={styles.button}
                                    titleStyle={styles.buttonText}
                                    onPress={() => navigation.navigate("HomePage")}
                                />
                                <Spacer />
                                <Button
                                    title="Update Profile"
                                    buttonStyle={styles.button}
                                    titleStyle={styles.buttonText}
                                    onPress={() => navigation.navigate("UpdateProfile")}
                                />
                                <Spacer />
                                <Button
                                    title="BMI Calculator"
                                    buttonStyle={styles.button}
                                    titleStyle={styles.buttonText}
                                    onPress={() => navigation.navigate("BMI")}
                                />
                                <Button
                                    title="Meal Plan"
                                    buttonStyle={styles.button}
                                    titleStyle={styles.buttonText}
                                    onPress={() => navigation.navigate("MealPlan")}
                                />
                            </View>
                        </ScrollView>
                    )}
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Slight dark overlay
    },
    container: {
        flex: 1,
        padding: 20,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#fff",
        marginBottom: 20,
    },
    detailsContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        marginBottom: 20,
    },
    detailItem: {
        fontSize: 18,
        marginBottom: 10,
        color: "#333",
    },
    label: {
        fontWeight: "bold",
        color: "#000",
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: "80%",
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default ProfilePageScreen;
