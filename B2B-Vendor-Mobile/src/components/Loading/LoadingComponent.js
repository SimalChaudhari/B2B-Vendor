import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';

export default function LoadingComponent() {
    return (
        <View style={styles.loadingContainer}>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fe0002" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1, // Fills the entire screen
        justifyContent: 'center', // Centers vertically
        alignItems: 'center', // Centers horizontally
        // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },

    loadingOverlay: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff", // White background for the loader
        borderRadius: 10, // Rounded corners
        padding: 20, // Padding around the loader
        shadowColor: "#1C252E", // Shadow for elevation effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // Elevation for Android
    },

    loadingText: {
        marginTop: 10, // Space between loader and text
        fontSize: 18, // Text size
        color: '#fe0002', // Loader text color
    },
});
