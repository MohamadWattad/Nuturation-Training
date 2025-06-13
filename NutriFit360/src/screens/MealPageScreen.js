// Enhanced MealPageScreen with fallback when no meal plan exists
import React, { useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import { Context as AuthContext } from "../context/AuthContext";

const MealPageScreen = ({ navigation }) => {
  const { state, getMealPlan } = useContext(AuthContext);

  useEffect(() => {
    getMealPlan();
  }, []);

  const latestPlanText = state.mealPlan?.mealPlans?.[0]?.plan;

  const meals = latestPlanText
    ? latestPlanText.split(/\*\*Meal \d+: /).filter(Boolean).map((meal, idx) => `Meal ${idx + 1}: ${meal.trim()}`)
    : [];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🍽️ Your Latest Meal Plan</Text>

      {meals.length > 0 ? (
        meals.map((meal, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              {/* <Image source={require('../../assets/meal-icon.png')} style={styles.icon} /> */}
              <Text style={styles.mealTitle}>{meal.split("**")[0]}</Text>
            </View>
            <Text style={styles.mealContent}>{meal.replace(meal.split("**")[0], "").trim()}</Text>
          </View>
        ))
      ) : latestPlanText === "" || latestPlanText === undefined ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyMessage}>🍽️ You don’t have a meal plan yet.</Text>
          <Text style={styles.emptySubtext}>Go to the chat page to generate one!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ChatPage")}
          >
            <Text style={styles.buttonText}>Open Chat</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.loading}>Loading your meal plan...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#388e3c",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 6,
    borderLeftColor: "#4CAF50",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  mealContent: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  loading: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    marginTop: 50,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyMessage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: "#999",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MealPageScreen;


// import React, { useContext, useEffect } from "react";
// import { Text, View, StyleSheet, ScrollView } from 'react-native';
// import { Context as AuthContext } from "../context/AuthContext";

// const MealPageScreen = () => {
//   const { state, getMealPlan } = useContext(AuthContext);

//   useEffect(() => {
//     getMealPlan();
//   }, []);

//   const latestPlan = state.mealPlan?.mealPlans?.[0]?.plan;

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Your Latest Meal Plan 🍽️ :</Text>

//       {latestPlan ? (
//         <Text style={styles.planText}>{latestPlan}</Text>
//       ) : (
//         <Text style={styles.loading}>Loading your meal plan...</Text>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: "#fff",
//     flex: 1,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 15,
//   },
//   planText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: "#333",
//   },
//   loading: {
//     fontSize: 16,
//     fontStyle: "italic",
//     color: "#888",
//   },
// });

// export default MealPageScreen;