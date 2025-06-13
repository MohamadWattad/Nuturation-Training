import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from "react-native";
import { Context as nameContext } from "../context/AuthContext";
import logo from "../../assets/Page1.jpeg";
import { Icon } from "react-native-elements";

const tips = [
  "Stay hydrated! Drink at least 8 glasses of water today 💧.",
  "Stretch for 5 minutes to improve flexibility 🧘‍♀️.",
  "Choose whole foods over processed snacks today 🥗.",
  "Get 7–9 hours of sleep for better recovery 🛌.",
  "Take a short walk after your meals to aid digestion🚶."
];

const HomePageScreen = ({ navigation }) => {
  const { state, getname, signout } = useContext(nameContext);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [randomTip, setRandomTip] = useState("");

  useEffect(() => {
    const fetchName = async () => {
      setIsLoading(true);
      await getname();
      setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
      setIsLoading(false);
    };
    fetchName();

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
          <>
            <Text style={styles.welcomeText}>Welcome, {state.userName} 👋</Text>

            <Animated.View style={[styles.tipCard, { opacity: fadeAnim }]}>
              <Text style={styles.tipTitle}>Tip of the Day ✨</Text>
              <Text style={styles.tipText}>{randomTip}</Text>
            </Animated.View>

            {/* Admin Panel */}
            {state.role === "admin" && (
              <View style={styles.adminPanel}>
                {[
                  { label: "Add Product", screen: "AddProducts" },
                  { label: "Delete Product", screen: "DeleteProduct" },
                  { label: "Add Video", screen: "AddVideo" },
                  { label: "Delete Video", screen: "DeleteVideo" },
                  { label: "Adding Amount", screen: "UpdateAmount" },
                  { label: "Decrease Amount", screen: "DecreaseAmount" },
                  { label: "Add Meal", screen: "addMeal" },
                  { label: "Delete Meal", screen: "deleteMeal" },
                ].map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.adminButton}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <Text style={styles.adminButtonText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          {[
            { name: "Chat", icon: "comments", type: "font-awesome-5", arrive: "ChatPage" },
            { name: "Workout", icon: "dumbbell", type: "font-awesome-5", arrive: "Workout" },
            { name: "Meals", icon: "apple-alt", type: "font-awesome-5", arrive: "MealsPage" },
            { name: "Scan", icon: "barcode", type: "font-awesome-5", arrive: "BarcodeScanner" },
            { name: "Store", icon: "store", type: "font-awesome-5", arrive: "ShopPage" },
            { name: "Profile", icon: "user", type: "font-awesome-5", arrive: "ProfilePage" },
            { name: "Log out", icon: "sign-out-alt", type: "font-awesome-5", arrive: "signout" },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              onPress={() =>
                item.arrive === "signout" ? signout() : navigation.navigate(item.arrive)
              }
            >
              <Icon name={item.icon} type={item.type} size={24} color="#4d8856" />
              <Text style={styles.navText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

HomePageScreen.navigationOptions = () => ({ headerShown: false });

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 30,
    textAlign: "center",
  },
  tipCard: {
    backgroundColor: "#f6fcf8",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  tipTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 12,
    textAlign: "center",
  },
  tipText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    lineHeight: 26,
  },
  adminPanel: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  adminButton: {
    backgroundColor: "#517e39",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 10,
    width: "90%",
    alignItems: "center",
  },
  adminButtonText: {
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
    borderRadius: 12,
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
