import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../assets/cssFile';
import { setUser } from '../../../redux/authReducer';
import { useDispatch } from 'react-redux';

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');

    // Check login status when component mounts
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (token) {
                    navigation.replace("Main");
                }
            } catch (err) {
                console.log("Error checking login status:", err);
            }
        };
        checkLoginStatus();
    }, [navigation]);

    // Handle login
    const handleLogin = async () => {
        if (!email) {
            Alert.alert("Input Error", "Email is required.");
            return; // Exit if the email is empty
        }
        const userData = { email };

        console.log('Attempting to login with:', userData); // Log the user object

        try {
            const response = await axios.post("http://192.168.1.112:8181/login", userData);
            console.log('Response data:', response.data); // Log the response data

            const { token, user } = response.data; // Correctly destructure response

            // Check if token and user data are valid
            if (token && user) {
                // Instead of storing data directly in AsyncStorage,
                // navigate to the OTP verification page
                navigation.navigate("OTPVerification", {
                    userId: user._id, // Pass user ID for OTP verification
                    email: email, // Pass email for reference
                });
            } else {
                throw new Error('Invalid response data'); // Handle invalid response
            }
        } catch (error) {
            console.error("Login error:", error?.response ? error?.response?.data : error?.message);
            Alert.alert("Login Error", "Invalid Email or Phone Number.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Your Logo</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
                <FontAwesome5 name="user-alt" size={24} color="black" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email or Phone Number"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail} // Update email state
                />
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Forgot Password Link */}
            <TouchableOpacity>
                <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign Up Section */}
            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>New here?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>Create an account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginScreen;
