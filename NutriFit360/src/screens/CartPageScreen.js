import React, { useEffect, useContext, useMemo } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const CartPageScreen = ({ navigation }) => {
  const { state, getcart } = useContext(AuthContext);

  useEffect(() => {
    getcart();
  }, []);

  const finalTotal = useMemo(() => {
    return state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [state.cart]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {state.cart.length === 0 ? (
        <Text style={styles.emptyMessage}>Your cart is empty!</Text>
      ) : (
        <>
          <FlatList
            data={state.cart}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const totalProductPrice = item.price * item.quantity;
              return (
                <View style={styles.cartItem}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <View style={styles.details}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
                    <Text style={styles.productPrice}>Price: {item.price}$</Text>
                    <Text style={styles.productTotal}>Total: {totalProductPrice}$</Text>
                  </View>
                </View>
              );
            }}
          />

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total: </Text>
            <Text style={styles.totalAmount}>{finalTotal}$</Text>
          </View>

          <TouchableOpacity
            style={styles.paymentButton}
            onPress={() => navigation.navigate("Payment")}
          >
            <Text style={styles.paymentText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginTop: 50,
  },
  cartItem: {
    flexDirection: "row",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    marginRight: 15,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 16,
    color: "#555",
  },
  productPrice: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  productTotal: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  totalBox: {
    marginTop: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
  },
  paymentButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  paymentText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});

export default CartPageScreen;
