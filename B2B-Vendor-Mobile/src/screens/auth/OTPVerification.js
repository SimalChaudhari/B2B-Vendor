import { Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../assets/cssFile';
import { setUser } from '../../../redux/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { authLogin } from '../../BackendApis/authApi'; // Import the authVerify function

const OTPVerification = ({ route, navigation }) => {
    const { email } = route.params;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const [resendDisabled, setResendDisabled] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        if (timer > 0) {
            const timerId = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else {
            setResendDisabled(false);
        }
    }, [timer]);

    const handleVerifyOTP = async () => {
        if (!otp) {
            Toast.show({
                type: 'error',
                text1: 'Input Error',
                text2: 'OTP is required.',
            });
            return;
        }
    
        setLoading(true);
        const contact = email;
        try {
            const response = await authLogin(contact, otp); // Call the authVerify function
    
            const { token, user } = response; // Get token and user from response
    
            // Store the token and user data in AsyncStorage
            await AsyncStorage.setItem("authToken", token);
            await AsyncStorage.setItem("userId", user.id); // Use user.id instead of user_id
            await AsyncStorage.setItem("userData", JSON.stringify(user));
            dispatch(setUser(user)); // Dispatch user data to Redux
    
            Toast.show({
                type: 'success',
                text1: 'Verification Successful',
                text2: 'Your OTP has been verified successfully.',
            });
    
            navigation.navigate('Home');
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Verification Error',
                text2: 'Enter Correct OTP.',
            });
        } finally {
            setLoading(false);
        }
    };
    

    // const handleResendOTP = async () => {
    //     setResendLoading(true); 
    //     setResendDisabled(true); 

    //     try {
    //         const response = await axios.post("http://192.168.1.112:8181/resend-otp", { email });
    //         console.log(response);
    //         Toast.show({
    //             type: 'success',
    //             text1: 'OTP Resent',
    //             text2: 'A new OTP has been sent to your email.',
    //         });
    //         setTimer(30); 
    //     } catch (error) {
    //         console.error(error);
    //         Toast.show({
    //             type: 'error',
    //             text1: 'Resend Error',
    //             text2: 'An error occurred while resending the OTP.',
    //         });
    //     } finally {
    //         setResendLoading(false); 
    //         setResendDisabled(false); 
    //     }
    // };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>OTP Verification</Text>

            <View style={styles.inputContainer}>
                <FontAwesome5 name="lock" size={24} color="black" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                />
            </View>

            {resendLoading ? (
                <Text>Sending you new OTP on Email.</Text>
            ) : (
                <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleVerifyOTP} disabled={loading || resendLoading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>Verify OTP</Text>
                    )}
                </TouchableOpacity>
            )}

            <Text style={{ marginVertical: 10 }}>
                {timer > 0 ? `Resend OTP in ${timer} seconds` : ""}
            </Text>
            {/*
    {timer === 0 && (
        <Text
            style={[ { marginTop: 10 }]}
            onPress={handleResendOTP}
            disabled={loading || resendLoading}
        >
            {resendLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
                <Text style={styles.ResendButtonText}>Resend OTP</Text>
            )}
        </Text>
    )}
     */}
        </View>
    );
};

export default OTPVerification;
