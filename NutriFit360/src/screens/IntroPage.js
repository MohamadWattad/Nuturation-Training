import React, { useRef } from 'react';
import { View,Text, StyleSheet, TouchableWithoutFeedback, StatusBar, ScrollView, Image, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

const Intro = ({ navigation }) => {
    const animationRef = useRef(null);

    const handleNavigate = () => {
        navigation.navigate('Signup'); // Navigate to the next screen
    };

    return (
        <>
            <StatusBar hidden={true} />
            <TouchableWithoutFeedback>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        {/* Lottie Animation - Loops Continuously */}
                        <LottieView
                            ref={animationRef}
                            source={require('../../assets/Animation.json')} // Path to your animation file
                            autoPlay
                            loop={true} // Set to true to enable infinite looping
                            style={styles.animation}
                            colorFilters={[
                                {
                                    keypath: "katman 2 Outlines", // Layer name from your JSON
                                    color: "#FFFFFF", // White color
                                },
                            ]}
                        />
                        {/* Explanation Section */}
                        <View style={styles.explanationContainer}>
                            <Text style={styles.explanationTitle}>
                                What is NutriFit?
                            </Text>
                            <Text style={styles.explanationText}>
                                NutriFit is your all-in-one solution for achieving your health and fitness goals. It combines personalized meal plans, workout routines, and real-time progress tracking to help you stay on track and lead a healthier lifestyle.
                            </Text>
                        </View>
                        {/* GIF Button */}
                        <TouchableOpacity onPress={handleNavigate} style={styles.gifButtonContainer}>
                            <Image
                                source={require('../../assets/Lets.gif')} // Path to your GIF file
                                style={styles.gifButton}
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </>
    );
};

Intro.navigationOptions = () => {
    return {
        headerShown: false,
    };
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#358733',
    },
    container: {
        alignItems: 'center',
        paddingBottom: 30, // Add some padding at the bottom
    },
    animation: {
        width: 300, // Adjust size as needed
        height: 300,
        marginTop: -100, // Position below the top
    },
    explanationContainer: {
        marginTop: 30, // Space between the "Tap to Continue" text and explanation
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    explanationTitle: {
        fontSize: 22,
        color: '#ffffff',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    explanationText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 24,
    },
    gifButtonContainer: {
        marginTop: 30,
    },
    gifButton: {
        width: 200,
        height: 80, // Adjust dimensions to fit your GIF
    },
});

export default Intro;
