import React,{useEffect,useState,useContext} from "react";
import {Text ,StyleSheet ,View , TextInput , Button , ScrollView} from 'react-native';
import { Context as updateContext } from "../context/AuthContext";
import { Dropdown } from "react-native-element-dropdown";
const UpdateProfileScreen = ({ navigation }) => {
    const {state , updatedetails} = useContext(updateContext);
    const [age , setAge] = useState('');
    const [gender , setGender] = useState('');
    const [height , setHeight] = useState('');
    const [weight , setWeight] = useState('');
    const [goal , setGoal] = useState('');
    const [activityLevel , setActivityLevel] = useState();
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
    const handleSave = async () => {
        if (!age || !gender || !height || !weight || !goal || !activityLevel) {
            throw new Error('Validation Error', 'All fields must be filled out');
             // Stop execution if validation fails
        }
        const updatedData = {
            age: parseInt(age, 10),
            gender,
            height: parseFloat(height),
            weight: parseFloat(weight),
            goal,
            activityLevel,
        }
        await updatedetails(updatedData); // call the updated with parameter updatedData
        
        navigation.goBack();
        };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Update Your Profile</Text>
            <TextInput
                style={styles.input}
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric" // just numbers
            />
             <Dropdown
                style={styles.dropdown}
                data={genderOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Gender"
                value={gender}
                onChange={(item) => setGender(item.value)}
            />

             <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
            />
            <Dropdown
                style={styles.dropdown}
                data={goalOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Goal"
                value={goal}
                onChange={(item) => setGoal(item.value)}
            />
            <Dropdown
                style={styles.dropdown}
                data={activityLevelOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Activity Level"
                value={activityLevel}
                onChange={(item) => setActivityLevel(item.value)}
            />
            <Button title="Save Changes" onPress={handleSave} />
        </ScrollView>


    );
};



const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    dropdown: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
});



export default UpdateProfileScreen;