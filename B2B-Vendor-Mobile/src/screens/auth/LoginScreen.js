import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import styles from './AuthCss';
import { authVerify } from '../../BackendApis/authApi';
import { setUser } from '../../../redux/authReducer';
import ShortLogoComponent from '../../components/Logo/ShortLogoComponent';


const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) navigation.replace('Main');
      } catch (err) {
        console.log('Error checking login status:', err);
      }
    };
    checkLoginStatus();
  }, [navigation]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    setIsEmailInvalid(false);

    if (!email) {
      Toast.show({ type: 'error', text1: 'Input Error', text2: 'Email is required.' });
      return;
    }

    if (!validateEmail(email)) {
      setIsEmailInvalid(true);
      Toast.show({ type: 'error', text1: 'Input Error', text2: 'Invalid email format.' });
      return;
    }

    setLoading(true);
    try {
      const response = await authVerify(email);

      const user = response;
      if (user) {
        navigation.navigate('OTPVerification', { email });
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      Toast.show({ type: 'error', text1: 'Login Error', text2: 'Invalid Email or Phone Number.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
      </Text>
      <ShortLogoComponent style={styles.logo} />

      <View style={[styles.inputContainer, isEmailInvalid && { borderColor: 'red', borderWidth: 1 }]}>
        <FontAwesome5 name="user-alt" size={24} color="black" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email or Phone Number"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (validateEmail(text)) setIsEmailInvalid(false);
          }}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

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
