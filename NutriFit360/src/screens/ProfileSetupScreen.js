import React, { useContext, useState } from "react";
import {View,StyleSheet,ImageBackground,ScrollView,ActivityIndicator }from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { Dropdown } from "react-native-element-dropdown";
import Spacer from "../components/Spacer";
import logo from "../../assets/NutriFit.png";
import { Context as ProfileContext } from "../context/ProfileContext";
const ProfileSetupScreen = ({ navigation }) => {
  const {state , details} = useContext(ProfileContext);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [allergies, setAllergies] = useState("");
  // Options for the dropdown
  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];
  const goalOptions = [
    { label: 'Weight Loss', value: 'weight_loss' },
    { label: 'Muscle Gain', value: 'muscle_gain' },
    { label: 'Maintain Weight', value: 'maintain_weight' },
  ];
  const activityLevelOptions = [
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Light Activity', value: 'light_activity' },
    { label: 'Moderate Activity', value: 'moderate_activity' },
    { label: 'Very Active', value: 'very_active' },
  ];
  const allergyOptions = [
    { label: 'None', value: 'none' },
    { label: 'Peanuts', value: 'peanuts' },
    { label: 'Dairy', value: 'dairy' },
    { label: 'Gluten', value: 'gluten' },
    { label: 'Seafood', value: 'seafood' },
  ];
  
  return(
  <ImageBackground source={logo} style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>

            <View style={styles.overlay}>
                <Spacer>
                    <Text h3 style={styles.headerText}>Start Your Journey</Text>
                </Spacer>
                <Input
                    label="Age"
                    value={age}
                    onChangeText={setAge}
                    autoCapitalize="none"
                    autoCorrect={false}
                    inputStyle={styles.input}
                    labelStyle={styles.label}
                />
                <Spacer />
                <Dropdown
                    style={styles.dropdown}
                    data={genderOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Gender"
                    value={gender}
                    onChange={(item) => setGender(item.value)} // Save the selected value
                />
                <Spacer />
                <Input
                    label="Height"
                    value={height}
                    onChangeText={setHeight}
                    autoCapitalize="none"
                    autoCorrect={false}
                    inputStyle={styles.input}
                    labelStyle={styles.label}
                />
                <Spacer />
                 <Input
                    label="Weight"
                    value={weight}
                    onChangeText={setWeight}
                    autoCapitalize="none"
                    autoCorrect={false}
                    inputStyle={styles.input}
                    labelStyle={styles.label}
                />
                <Spacer />
                <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    data={goalOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Goal"
                    placeholderStyle={styles.placeholder}
                    selectedTextStyle={styles.selectedText}
                    value={goal}
                    onChange={(item) => setGoal(item.value)}
                />
                 <Spacer />
                 <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    data={activityLevelOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Activity Level"
                    placeholderStyle={styles.placeholder}
                    selectedTextStyle={styles.selectedText}
                    value={activityLevel}
                    onChange={(item) => setActivityLevel(item.value)}
                />
                <Spacer />
                {state.errorMessage ? (
                    <Text style={styles.errorMessage}>{state.errorMessage}</Text>
                ) : null}
                <Spacer>
                    <Button
                        title="Save & Continue "
                        buttonStyle={styles.button}
                        onPress={() =>{
                            console.log({ age, gender, height, weight, goal, activityLevel });
                            details ({ age , gender , height ,weight , goal ,activityLevel})}}
                    />
                </Spacer>
            </View>
        </ScrollView>

    </ImageBackground>
)};

ProfileSetupScreen.navigationOptions = () => {
return {
headerShown: false,
};
};

const styles = StyleSheet.create({
background: {
flex: 1,
resizeMode: "cover",
justifyContent: "center",
},
overlay: {
backgroundColor: "rgba(255, 255, 255, 0.7)",
padding: 20,
borderRadius: 10,
margin: 20,
elevation: 5,
},
headerText: {
textAlign: "center",
fontSize: 28,
fontWeight: "bold",
color: "#4CAF50",
marginBottom: 20,
},
input: {
fontSize: 16,
color: "#333",
},
label: {
color: "#000",
fontWeight: "600",
},
button: {
backgroundColor: "#4CAF50",
borderRadius: 10,
height: 50,
},
dropdown: {
    height: 50,
    borderColor: 'gray', // Gray border color
    borderWidth: 1, // Border width
    borderRadius: 8, // Rounded corners
    paddingHorizontal: 8,
    backgroundColor: 'white', // White background
  },
footerText: {
textAlign: "center",
marginTop: 10,
fontSize: 15,
color: "gray",
},
errorMessage: {
fontSize: 16,
color: "red",
marginLeft: 15,
marginTop: 15,
},
});

export default ProfileSetupScreen;
