import React, { useState, useContext } from "react";
import { 
    View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator 
} from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const ForgotPasswordScreenPage = () => {
    const { forgotpassword, state } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email.");
            return;
        }

        setLoading(true);
        try {
            await forgotpassword(email);
            Alert.alert("Success", "A reset link has been sent to your email.");
        } catch (error) {
            Alert.alert("Error", "Failed to reset password. Please try again.");
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
                Enter your email to receive a password reset link.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleResetPassword}
                >
                    <Text style={styles.buttonText}>Send Reset Link</Text>
                </TouchableOpacity>
            )}

            {state.errorMessage ? (
                <Text style={styles.errorText}>{state.errorMessage}</Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
        marginBottom: 20,
        textAlign: "center",
        paddingHorizontal: 20,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        marginTop: 10,
    },
});

export default ForgotPasswordScreenPage;
