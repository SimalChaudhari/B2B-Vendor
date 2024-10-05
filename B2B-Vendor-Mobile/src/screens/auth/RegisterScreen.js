import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from '../../assets/cssFile';

const RegisterScreen = ({ navigation }) => {
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
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <FontAwesome5 name="lock" size={24} color="black" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
        />
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <FontAwesome5 name="lock" size={24} color="black" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
        />
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

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
