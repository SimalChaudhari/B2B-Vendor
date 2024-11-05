import { StyleSheet, Text, View, ScrollView, ImageBackground, Alert } from 'react-native';
import React, { useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { addContactUs } from '../../BackendApis/contactUsApi'; // Import the addContactUs function

const ContactUsScreen = () => {
    const [focus, setFocus] = useState({
        name: false,
        email: false,
        message: false,
    });

    const [contactDetails, setContactDetails] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // New loading state

    const handleInputChange = (field, value) => {
        setContactDetails({ ...contactDetails, [field]: value });
        setErrors({ ...errors, [field]: '' }); // Clear error when input changes
    };

    const validateForm = () => {
        const newErrors = {};
        if (!contactDetails.name) {
            newErrors.name = 'Name is required';
        }
        if (!contactDetails.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(contactDetails.email)) {
            newErrors.email = 'Email address is invalid';
        }
        if (!contactDetails.message) {
            newErrors.message = 'Message is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true); // Start loading
            try {
                const response = await addContactUs(contactDetails); // Send details to API
                Alert.alert('Success', response.message); // Show success message
                setContactDetails({ name: '', email: '', message: '' }); // Clear form after submission
            } catch (error) {
                Alert.alert('Error', 'Failed to send your message. Please try again later.'); // Handle error
            } finally {
                setLoading(false); // Stop loading
            }
        }
    };

    const renderInputField = (label, value, field, multiline = false) => (
        <View>
            <TextInput
                label={label}
                value={value}
                onFocus={() => setFocus({ ...focus, [field]: true })}
                onBlur={() => setFocus({ ...focus, [field]: false })}
                onChangeText={(text) => handleInputChange(field, text)}
                mode="outlined"
                style={[styles.input, multiline ? styles.messageInput : {}]}
                multiline={multiline} // Set multiline based on the prop
                theme={{
                    colors: {
                        primary: focus[field] ? '#0C68E9' : '#666',
                        text: '#333',
                        placeholder: '#666',
                        background: 'white',
                    },
                }}
            />
            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
        </View>
    );

    return (
        <ScrollView style={styles.main}>
            <ImageBackground
                source={require('../../assets/images/contactUs.webp')}
                style={styles.headerBackground}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <Text style={styles.headerText}>Contact Us</Text>
                </View>
            </ImageBackground>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.formWrapper}>
                    <Text style={styles.getInTouchText}>Get in Touch</Text>
                    <Text style={styles.subHeaderText}>
                        We'd love to hear from you! Please fill out the form below and we will get back to you as soon as possible.
                    </Text>
                    {renderInputField("Name", contactDetails.name, "name")}
                    {renderInputField("Email", contactDetails.email, "email")}
                    {renderInputField("Your Message", contactDetails.message, "message", true)} 

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.submitButton}
                        labelStyle={styles.submitButtonText}
                        loading={loading} // Loading state
                        disabled={loading} // Disable button when loading
                    >
                        Send Message
                    </Button>
                </View>
            </ScrollView>
        </ScrollView>
    );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        marginTop: 30,
    },
    headerBackground: {
        height: 200,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    container: {
        flexGrow: 1,
        padding: 20,
    },
    formWrapper: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    getInTouchText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0C68E9',
        textAlign: 'center',
        marginBottom: 10,
    },
    subHeaderText: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
    },
    messageInput: {
        height: 100, // Adjust height for multiline input if needed
    },
    submitButton: {
        marginTop: 20,
        backgroundColor: '#0C68E9',
        paddingVertical: 8,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        marginTop: -10,
        fontSize: 12,
    },
});
