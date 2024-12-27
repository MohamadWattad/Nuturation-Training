
import React, { useState ,useContext , useEffect} from "react";
import { View, StyleSheet, ImageBackground,TouchableOpacity} from "react-native";
import { Text, Input, Button } from "react-native-elements";
import Spacer from "../components/Spacer";
import logo from "../../assets/NutriFit.png";
import { Context as AuthContext } from "../context/AuthContext";
import { NavigationEvents } from "react-navigation";

const SignupScreen = ({ navigation }) => {
  const { state, signup , clearErrorMessage  } = useContext(AuthContext);
  const [name, setname] = useState("");
  const [lastName, setLastName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [phone,setPhone] = useState(null);
  const [password, setPassword] = useState("");
  return (
    <ImageBackground source={logo} style={styles.background}>
      <View style={styles.overlay}>
        <NavigationEvents onWillBlur={clearErrorMessage}/>
        <Spacer>
          <Text h3 style={styles.headerText}>Sign up</Text>
        </Spacer>
        <Input
          label="First Name"
          value={name}
          onChangeText={setname}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={styles.input}
          labelStyle={styles.label} 

        />
        <Input
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={styles.input}
          labelStyle={styles.label} 

        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={styles.input}
          labelStyle={styles.label} 

        />
        <Input
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={styles.input}
          labelStyle={styles.label} 

        />
        <Input
          label="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={styles.input}
          labelStyle={styles.label} 
        />
        {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text>: null}
        <Spacer>
          <Button title="Sign up" buttonStyle={styles.button} onPress={() => signup({name , lastName , email, phone,password})} />
        </Spacer>
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
        <Text style={styles.footerText}>Already have an account? Sign in instead</Text>

        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

SignupScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Ensures the image covers the full screen
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.7)", // White overlay with slight transparency
    padding: 20,
    borderRadius: 10,
    margin: 20,
    elevation: 5, // Shadow for better visibility
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
    color: "#000", // Black color for the labels
    fontWeight: "600", // Optional: Makes the labels bold
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    height: 50,
  },
  footerText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
    color: "gray",
  },
  errorMessage:{
    fontSize:16,
    color:'red',
    marginLeft:15,
    marginTop:15
},
});

export default SignupScreen;
