import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";

const workouts = [
  {
    id: "1",
    title: "Chest Workout",
    description: "Build upper body strength.",
    thumbnail: "https://media.istockphoto.com/id/180200014/photo/a-man-lifting-weights-on-a-bench-press.jpg?s=1024x1024&w=is&k=20&c=iWQ26nOcn1Xc-fcrLxpsea0FgnewNXJlv-xfENMLWvQ=",
    route: "ChestWorkout", // Unique route for this workout
  },
  {
    id: "2",
    title: "Back Workout",
    description: "Enhance back muscles and posture.",
    thumbnail: "https://w0.peakpx.com/wallpaper/693/11/HD-wallpaper-gym-doing-pull-ups-pull-ups-workout-back-body-building.jpg",
    route: "BackWorkout", // Unique route for this workout
  },
  {
    id: "3",
    title: "Shoulder Workout",
    description: "Strengthen shoulder muscles.",
    thumbnail: "https://exercise.co.uk/wp-content/uploads/2023/02/6-Move-Shoulder-workout-Main.jpg",
    route: "LegWorkoutPage", // Unique route for this workout
    },
  {
    id: "4",
    title: "Leg Workout",
    description: "Strengthen leg muscles.",
    thumbnail: "https://cdn.shopify.com/s/files/1/1497/9682/files/Dumbbell_Lunges.jpg",
    route: "LegWorkoutPage", // Unique route for this workout
  },
  {
    id: "5",
    title: "Biceps Workout",
    description: "Improve strength and endurance.",
    thumbnail: "https://www.bodybuilding.com/images/2018/august/3-moves-to-complete-your-biceps-header-830x467.jpg",
    route:"",
},
{
    id: "6",
    title: "Triceps Workout",
    description: "Improve strength and endurance.",
    thumbnail: "https://row.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F8urtyqugdt2l%2F4nEcHjaC1BCwUSmxyTAj9U%2F07d5073be1a2041adde62059bb6ce258%2Fdesktop-tricep-exercises.jpg&w=2234&q=85",
    route:"",
},
{
    id: "7",
    title: "Abs Workout",
    description: "Tone and strengthen your core.",
    thumbnail: "https://hips.hearstapps.com/hmg-prod/images/young-muscular-build-athlete-exercising-strength-in-royalty-free-image-1706546541.jpg?crop=1.00xw:0.752xh;0,0.142xh&resize=1200:*",
    route:"",
  },
  {
    id: "8",
    title: "Fat Burning Cardio",
    description: "Burn calories and lose fat.",
    thumbnail: "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2022/12/cardio-or-weights-first-scaled.jpg?w=2560&ssl=1",
    route:"",
  },
];

const WorkoutPageScreen = ({ navigation }) => {
  const renderWorkoutCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.route)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workouts</Text>
      <FlatList
        data={workouts}
        renderItem={renderWorkoutCard}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});

export default WorkoutPageScreen;
