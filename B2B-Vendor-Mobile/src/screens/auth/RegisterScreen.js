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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password

  const handleRegister = () => {
    // Validation for required fields
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Input Error", "All fields are required.");
      return; // Exit the function if any field is empty
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert("Input Error", "Passwords and Confirm Password do not match.");
      return; // Exit the function if passwords do not match
    }

    const user = {
      name: name,
      email: email,
      password: password,
    };

    // Send a POST request to the backend API to register the user
    axios
      .post("http://192.168.1.112:8181/register", user)
      .then(async (response) => {
        console.log(response);
        const token = response.data.token; // Assuming the token is returned
        const userData = response.data.user; // Assuming the user data is returned

        // Store token and user data in AsyncStorage
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("userData", JSON.stringify(userData)); // Store user data

        Alert.alert("Registration successful", "You have been registered successfully");
        // Reset the form fields
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword(""); // Reset confirm password field
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

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <FontAwesome5 name="lock" size={24} color="black" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword} // Update the password state
        />
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <FontAwesome5 name="lock" size={24} color="black" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={confirmPassword} // Bind confirm password state
          onChangeText={setConfirmPassword} // Update confirm password state
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
