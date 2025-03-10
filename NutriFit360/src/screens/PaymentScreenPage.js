import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const PaymentScreenPage = ( {navigation }) => {
  const {clearCart} = useContext(AuthContext);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardHolderName) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }
    try{
        await clearCart();
        console.log("Cart cleared successfully");
        Alert.alert("Success", "Payment processed successfully!");
        navigation.navigate("HomePage")
    }catch (error) {
      console.error("Error clearing cart:", error.message);
      Alert.alert("Error", "Failed to clear cart. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Card Number"
        keyboardType="numeric"
        value={cardNumber}
        onChangeText={setCardNumber}
        maxLength={16}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="MM/YY"
          keyboardType="numeric"
          value={expiryDate}
          onChangeText={setExpiryDate}
          maxLength={5}
        />
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="CVV"
          keyboardType="numeric"
          secureTextEntry
          value={cvv}
          onChangeText={setCvv}
          maxLength={3}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Cardholder Name"
        value={cardHolderName}
        onChangeText={setCardHolderName}
      />

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallInput: {
    width: screenWidth * 0.4,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PaymentScreenPage;
