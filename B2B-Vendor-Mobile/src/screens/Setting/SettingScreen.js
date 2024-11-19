import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import styles from './SettingCss'; // Ensure this is correctly imported
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.heroContainer}>
           
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.enhancedButton}
                    onPress={() => navigation.navigate('ContactUs')} // Navigate to ContactUs screen
                >
                    <Text style={styles.enhancedButtonText}> Contact Us</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.enhancedButton}
                    onPress={() => navigation.navigate('TermsAndConditions')} // Navigate to TermsAndConditions screen
                >
                    <Text style={styles.enhancedButtonText}> Terms and Conditions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.enhancedButton}
                    onPress={() => navigation.navigate('Login')} // Navigate to TermsAndConditions screen
                >
                    <Text style={styles.enhancedButtonText}> Vendor Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SettingScreen;
