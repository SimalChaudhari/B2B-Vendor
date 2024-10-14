import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NoInternetScreen = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="wifi-off" size={64} color="#FF4D4D" />
      <Text style={styles.message}>No Internet Connection</Text>
      <Text style={styles.description}>Please connect to the internet and try again.</Text>
      <Button mode="contained" style={styles.button} onPress={() => { /* Add your reconnect logic here */ }}>
        Retry
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  message: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#FF4D4D",
  },
});

export default NoInternetScreen;
