import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: '',
    houseNo: '',
    landmark: '',
    street: '',
    mobileNo: '',
    city: '',
    country: '',
    postalCode: '',
  });
  const userId = "67036f6ac07b2748247e6331"; // Static userId

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/addresses/${userId}`
      );
      const { addresses } = response.data;

      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };

  // Refresh the addresses when the component comes to focus
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const handleAddAddress = async () => {
  // Check if any field is empty
  const isEmptyField = Object.values(newAddress).some(field => field.trim() === '');

  if (isEmptyField) {
    alert('Please fill in all fields'); // Alert for empty fields
    return; // Prevent submission if any field is empty
  }

  try {
    const response = await axios.post("http://192.168.1.112:8181/addresses", {
      userId,
      address: newAddress,
    });
    console.log(response.data.message);
    fetchAddresses(); // Refresh the addresses after adding a new one
    setNewAddress({
      name: '',
      houseNo: '',
      landmark: '',
      street: '',
      mobileNo: '',
      city: '',
      country: '',
      postalCode: '',
    }); // Clear the form
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 200
      console.log("Error adding address:", error.response.data);
    } else if (error.request) {
      // Request was made but no response was received
      console.log("No response received:", error.request);
    } else {
      // Something else happened
      console.log("Error setting up request:", error.message);
    }
  }
};

  

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 50 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Add Your Addresses</Text>

        {/* Add Address Form */}
        <View style={{ marginVertical: 20 }}>
          <TextInput
            placeholder="Name"
            value={newAddress.name}
            onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="House No"
            value={newAddress.houseNo}
            onChangeText={(text) => setNewAddress({ ...newAddress, houseNo: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Landmark"
            value={newAddress.landmark}
            onChangeText={(text) => setNewAddress({ ...newAddress, landmark: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Street"
            value={newAddress.street}
            onChangeText={(text) => setNewAddress({ ...newAddress, street: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Mobile No"
            value={newAddress.mobileNo}
            onChangeText={(text) => setNewAddress({ ...newAddress, mobileNo: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="City"
            value={newAddress.city}
            onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Country"
            value={newAddress.country}
            onChangeText={(text) => setNewAddress({ ...newAddress, country: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Postal Code"
            value={newAddress.postalCode}
            onChangeText={(text) => setNewAddress({ ...newAddress, postalCode: text })}
            style={styles.input}
          />
          <Pressable onPress={handleAddAddress} style={styles.addButton}>
            <Text style={{ color: 'white' }}>Add Address</Text>
          </Pressable>
        </View>

        <Pressable>
          {addresses?.map((item, index) => (
            <Pressable
              key={index}
              style={{
                borderWidth: 1,
                borderColor: "#D0D0D0",
                padding: 10,
                flexDirection: "column",
                gap: 5,
                marginVertical: 10,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item?.name}
                </Text>
                <Entypo name="location-pin" size={24} color="red" />
              </View>

              <Text style={{ fontSize: 15, color: "#181818" }}>
                {item?.houseNo}, {item?.landmark}
              </Text>

              <Text style={{ fontSize: 15, color: "#181818" }}>
                {item?.street}
              </Text>

              <Text style={{ fontSize: 15, color: "#181818" }}>
                {item?.city}, {item?.country}
              </Text>

              <Text style={{ fontSize: 15, color: "#181818" }}>
                Phone No: {item?.mobileNo}
              </Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                Pin Code: {item?.postalCode}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 7,
                }}
              >
                <Pressable style={styles.editButton}>
                  <Text>Edit</Text>
                </Pressable>

                <Pressable style={styles.removeButton}>
                  <Text>Remove</Text>
                </Pressable>

                <Pressable style={styles.defaultButton}>
                  <Text>Set as Default</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 0.9,
    borderColor: "#D0D0D0",
  },
  removeButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 0.9,
    borderColor: "#D0D0D0",
  },
  defaultButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 0.9,
    borderColor: "#D0D0D0",
  },
});
