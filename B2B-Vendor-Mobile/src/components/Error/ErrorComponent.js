// C:\DEV2\Work\Project\B2B-Vendor\B2B-Vendor-Mobile\src\components\Error\ErrorComponent.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const ErrorComponent = ({ errorMessage, onRetry }) => {
    return (
        <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color="#fe0002" />
            <Text style={styles.errorText}>{errorMessage || 'Something went wrong!'}</Text>
            <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );
};

const colors = {
    background: '#fe0002',
    textColor: "#1C252E",
    logoColor: '#007ACC',
    buttonColor: '#ff9900',
    linkColor: '#007185',
    white: '#FFFFFF',
};

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Light background
        padding: 20,
        borderRadius: 10,
        shadowColor: colors.textColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    errorText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginVertical: 10,
    },
    retryButton: {
        backgroundColor: colors.background,
        padding: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: colors.width,
        fontSize: 16,
    },
});

export default ErrorComponent;
