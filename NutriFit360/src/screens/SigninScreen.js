import React, { useState, useContext } from "react";
import { View, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import Spacer from "../components/Spacer";
import logo from "../../assets/NutriFit.png";
import { Context as AuthContext } from "../context/AuthContext";
import { NavigationEvents } from "react-navigation";

const SigninScreen = ({ navigation }) => {
  const { state, signin,clearErrorMessager } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  
  return (
    <ImageBackground source={logo} style={styles.background}>
      <View style={styles.overlay}>
        <NavigationEvents onWillBlur={clearErrorMessager}/>
        <Spacer>
          <Text h3 style={styles.headerText}>Sign In</Text>
        </Spacer>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={styles.input}
          labelStyle={styles.label}
        />
        <Spacer />
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
        {state.errorMessage ? (
          <Text style={styles.errorMessage}>{state.errorMessage}</Text>
        ) : null}
        <Spacer>
          <Button
            title="Sign In"
            buttonStyle={styles.button}
            onPress={() => signin({ email, password })}
          />
        </Spacer>
        <TouchableOpacity>
            <Text style = {styles.footerText}>Forgot Password? </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.footerText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

SigninScreen.navigationOptions = () => {
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

export default SigninScreen;
