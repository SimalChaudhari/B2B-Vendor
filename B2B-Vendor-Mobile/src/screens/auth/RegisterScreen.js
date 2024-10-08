import { Pressable, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../assets/cssFile';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = () => {
    // Validation for required fields
    if (!name || !email) {
      Alert.alert("Input Error", "All fields are required.");
      return; // Exit the function if any field is empty
    }

    const user = {
      name: name,
      email: email,
    };

    // Send a POST request to the backend API to register the user
    axios
      .post("http://192.168.1.112:8181/register", user)
      .then(async (response) => {
        console.log(response);
        // const token = response.data.token; // Uncomment if your API returns a token
        // const userData = response.data.user; // Uncomment if your API returns user data

        // Store token and user data in AsyncStorage if needed
        // await AsyncStorage.setItem("authToken", token);
        // await AsyncStorage.setItem("userData", JSON.stringify(userData)); // Uncomment if storing user data

        Alert.alert("Registration successful", "You have been registered successfully");

        // Navigate to OTPVerification, passing the email
        navigation.navigate('OTPVerification', { email: user.email }); // Pass email to OTPVerification

        // Reset the form fields
        setName("");
        setEmail(""); // Reset email field
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Registration Error", "An error occurred while registering");
        console.log("Registration failed", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Create an Account</Text>

      {/* Full Name Input */}
      <View style={styles.inputContainer}>
        <FontAwesome5 name="user-alt" size={24} color="black" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          autoCapitalize="words"
          value={name}
          onChangeText={setName} // Update the name state
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={24} color="black" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail} // Update the email state
        />
      </View>

      {/* Register Button */}
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>

      {/* Sign In Section */}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}> Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default RegisterScreen;
