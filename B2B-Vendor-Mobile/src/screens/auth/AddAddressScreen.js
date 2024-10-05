import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    Pressable,
    Alert,
  } from "react-native";
  import React, { useState } from "react";
//   import RNFS from "react-native-fs"; // Import File System module
  
  const AddressScreen = () => {
    const [name, setName] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [street, setStreet] = useState("");
    const [landmark, setLandmark] = useState("");
    const [postalCode, setPostalCode] = useState("");
  
    const handleAddAddress = async () => {
      const address = {
        name,
        mobileNo,
        houseNo,
        street,
        landmark,
        postalCode,
      };
  
    //   const filePath = `${RNFS.DocumentDirectoryPath}/src/assets/Data/addreddes.json`;
  
      try {
        // Check if the file exists
        // const fileExists = await RNFS.exists(filePath);
  
        let addressData = [];
  
        if (fileExists) {
          // If the file exists, read the current data
        //   const fileContent = await RNFS.readFile(filePath);
          addressData = JSON.parse(fileContent);
        }
  
        // Add the new address to the data
        addressData.push(address);
  
        // Convert the updated data back to JSON
        const jsonData = JSON.stringify(addressData, null, 2);
  
        // Write the updated JSON data back to the file
        // await RNFS.writeFile(filePath, jsonData, "utf8");
  
        Alert.alert("Success", "Address added successfully");
  
        // Reset input fields
        setName("");
        setMobileNo("");
        setHouseNo("");
        setStreet("");
        setLandmark("");
        setPostalCode("");
  
      } catch (error) {
        Alert.alert("Error", "Failed to save address");
        console.error("Error saving address:", error);
      }
    };
  
    return (
      <ScrollView style={{ marginTop: 50 }}>
        <View style={{ height: 50, backgroundColor: "#00CED1" }} />
  
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>Add a new Address</Text>
          {/* Input fields for address */}
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            style={styles.input}
          />
          <TextInput
            value={mobileNo}
            onChangeText={setMobileNo}
            placeholder="Mobile No"
            style={styles.input}
          />
          <TextInput
            value={houseNo}
            onChangeText={setHouseNo}
            placeholder="Flat, House No, Building, Company"
            style={styles.input}
          />
          <TextInput
            value={street}
            onChangeText={setStreet}
            placeholder="Area, Street, Sector, Village"
            style={styles.input}
          />
          <TextInput
            value={landmark}
            onChangeText={setLandmark}
            placeholder="Landmark (e.g., near Apollo hospital)"
            style={styles.input}
          />
          <TextInput
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="Enter Pincode"
            style={styles.input}
          />
  
          <Pressable onPress={handleAddAddress} style={styles.button}>
            <Text style={styles.buttonText}>Add Address</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    input: {
      padding: 10,
      borderColor: "#D0D0D0",
      borderWidth: 1,
      marginTop: 10,
      borderRadius: 5,
    },
    button: {
      backgroundColor: "#FFC72C",
      padding: 19,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
    },
    buttonText: {
      fontWeight: "bold",
    },
  });
  
  export default AddressScreen;
  