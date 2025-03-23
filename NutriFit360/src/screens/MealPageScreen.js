import React, { useContext, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Context as AuthContext } from "../context/AuthContext";

const MealPageScreen = () => {
  const { state, getMealPlan } = useContext(AuthContext);

  useEffect(() => {
    getMealPlan();
  }, []);

  const latestPlan = state.mealPlan?.mealPlans?.[0]?.plan;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Latest Meal Plan 🍽️ :</Text>

      {latestPlan ? (
        <Text style={styles.planText}>{latestPlan}</Text>
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  planText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  loading: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
  },
});

export default MealPageScreen;
