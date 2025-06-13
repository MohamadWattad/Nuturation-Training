// Enhanced ProfilePageScreen with gender/goal/activity as stat boxes
import React, { useContext, useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Image,
} from "react-native";
import { Button } from "react-native-elements";
import { Context as nameContext } from "../context/AuthContext";
import Spacer from "../components/Spacer";
// import avatarImage from "../../assets/avatar.png";

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
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.headerContainer}>
                {/* <Image source={avatarImage} style={styles.avatar} /> */}
                <Text style={styles.nameText}>{state.userName}</Text>
                <Text style={styles.statusText}>Living a healthy lifestyle</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}><Text style={styles.statNumber}>{state.details.weight}kg</Text><Text style={styles.statLabel}>Weight</Text></View>
                <View style={styles.statBox}><Text style={styles.statNumber}>{state.details.height}cm</Text><Text style={styles.statLabel}>Height</Text></View>
                <View style={styles.statBox}><Text style={styles.statNumber}>{state.details.age}</Text><Text style={styles.statLabel}>Age</Text></View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}><Text style={styles.statNumber}>{state.details.gender}</Text><Text style={styles.statLabel}>Gender</Text></View>
                <View style={styles.statBox}><Text style={styles.statNumber}>{state.details.goal}</Text><Text style={styles.statLabel}>Goal</Text></View>
                <View style={styles.statBox}><Text style={styles.statNumber}>{state.details.activityLevel}</Text><Text style={styles.statLabel}>Activity</Text></View>
            </View>

            <Spacer />

            <View style={styles.buttonGroup}>
                <Button title="Update Profile" buttonStyle={styles.button} onPress={() => navigation.navigate("UpdateProfile")} />
                <Button title="BMI Calculator" buttonStyle={styles.button} onPress={() => navigation.navigate("BMI")} />
                <Button title="Meal Plan" buttonStyle={styles.button} onPress={() => navigation.navigate("MealPlan")} />
                <Button title="Workout Plan" buttonStyle={styles.button} onPress={() => navigation.navigate("WorkoutPlan")} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: "#fff",
        paddingVertical: 20,
        alignItems: "center",
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    nameText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    statusText: {
        fontSize: 14,
        color: "#777",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginVertical: 10,
    },
    statBox: {
        alignItems: "center",
        flex: 1,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4CAF50",
        textAlign: "center",
    },
    statLabel: {
        fontSize: 12,
        color: "#777",
        textAlign: "center",
    },
    buttonGroup: {
        width: "90%",
        marginTop: 20,
    },
    button: {
        backgroundColor: "#4CAF50",
        marginVertical: 8,
        borderRadius: 25,
        paddingVertical: 12,
    },
});

export default ProfilePageScreen;