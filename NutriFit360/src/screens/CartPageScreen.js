import React, { useEffect, useContext } from "react";
import { Text, View, FlatList, StyleSheet, Image, Dimensions , Button , TouchableOpacity} from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const CartPageScreen = ({ navigation }) => {
  const { state, getcart } = useContext(AuthContext);

  useEffect(() => {
    getcart(); 
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {state.cart.length === 0 ? (
        <Text style={styles.emptyMessage}>Your cart is empty!</Text>
      ) : (
        <FlatList   
          data={state.cart}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="contain" // Ensures the image scales proportionally
              />
              <View style={styles.details}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.productName}>Price:{item.price}</Text>
                <Text style={styles.productQuantity}>Total: ${item.totalProductPrice}</Text>
              </View>
            </View>
          )}
        />
        
      )}
      <Button title="Payment" onPress={() => navigation.navigate('Payment')}/>
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
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center", // Vertically align items
  },
  image: {
    width: screenWidth * 0.3, // 30% of the screen width for larger display
    height: screenWidth * 0.3, // Maintain square aspect ratio
    marginRight: 15,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productQuantity: {
    fontSize: 16,
    color: "#555",
  },
});

export default CartPageScreen;
