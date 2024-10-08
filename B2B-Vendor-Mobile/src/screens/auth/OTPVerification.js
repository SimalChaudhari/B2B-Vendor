import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/authReducer';
import styles from '../../assets/cssFile';

const OTPVerification = ({ route, navigation }) => {
    const { email } = route.params; // Retrieve the email passed from RegistrationScreen
    const [otp, setOtp] = useState(''); // State for OTP input
    const dispatch = useDispatch(); // Redux dispatch for user state management

    // Function to handle OTP verification
    const handleVerifyOTP = async () => {
        if (!otp) {
            Alert.alert("Input Error", "OTP is required.");
            return; // Exit the function if the OTP field is empty
        }
    
        // Send a POST request to verify the OTP
        try {
            const response = await axios.post("http://192.168.1.112:8181/verify-otp", { email, otp });
            console.log(response);
            
            // Assuming your API returns a token and user data
            const { token, user, user_id } = response.data; // Destructure token and user from response
            // console.log("Token", token);
            // console.log("User", user);
            
            // Store user data and token in AsyncStorage
            await AsyncStorage.setItem("authToken", token);
            await AsyncStorage.setItem("userId", user_id);
            await AsyncStorage.setItem("userData", JSON.stringify(user)); // Store the user data
            dispatch(setUser(user)); // Dispatch user data to Redux
            
            // Display a success message
            Alert.alert("Verification Successful", "Your OTP has been verified successfully.");
            
            // Navigate to Home screen or another appropriate screen
            navigation.navigate('Home'); // Adjust as necessary
        } catch (error) {
            console.error(error);
            Alert.alert("Verification Error", "An error occurred while verifying the OTP.");
        }
    };
    
    // Function to resend OTP
    const handleResendOTP = async () => {
        try {
            const response = await axios.post("http://192.168.1.112:8181/resend-otp", { email });
            console.log(response);
            Alert.alert("OTP Resent", "A new OTP has been sent to your email.");
        } catch (error) {
            console.error(error);
            Alert.alert("Resend Error", "An error occurred while resending the OTP.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>OTP Verification</Text>

            {/* OTP Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp} // Update the OTP state
                />
            </View>

            {/* Verify Button */}
            <Pressable style={styles.button} onPress={handleVerifyOTP}>
                <Text style={styles.buttonText}>Verify OTP</Text>
            </Pressable>

            {/* Resend OTP Button styled like a link */}
            <Pressable style={{ marginTop: 10 }} onPress={handleResendOTP}>
                <Text style={styles.linkText}>Resend OTP</Text>
            </Pressable>
        </View>
    );
};

export default OTPVerification;
