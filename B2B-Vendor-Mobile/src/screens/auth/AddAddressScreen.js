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
import { useDispatch, useSelector } from "react-redux";
import { updateUserAddresses } from "../../../redux/authReducer"; // Adjust the import path as necessary
import Entypo from "react-native-vector-icons/Entypo";
import Toast from "react-native-toast-message";
import styles from "../../assets/cssFile";

const AddAddressScreen = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const userId = user?._id;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    houseNo: "",
    landmark: "",
    street: "",
    mobileNo: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const [clickCount, setClickCount] = useState(0); // Counter for button clicks

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`http://192.168.1.112:8181/addresses/${userId}`);
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const handleAddAddress = async () => {
    // setClickCount((prevCount) => prevCount + 1); // Increment the click count
    // console.log(`Button clicked: ${clickCount + 1} times`); // Log the count

    // Check if any field is empty
    const isEmptyField = Object.values(newAddress).some(field => field.trim() === '');

    if (isEmptyField) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields', // Toast for empty fields
      });
      return; // Prevent submission if any field is empty
    }

    setLoading(true); // Set loading to true when starting the add address process

    try {
      const response = await axios.post("http://192.168.1.112:8181/addresses", {
        userId,
        address: newAddress,
      });
      console.log(response.data.message);

      const addressesResponse = await axios.get(`http://192.168.1.112:8181/addresses/${userId}`);
      const updatedAddresses = addressesResponse.data.addresses;

      // Dispatch the updated addresses to the authReducer
      dispatch(updateUserAddresses(updatedAddresses)); // Use the new action

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

      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Address added successfully!',
      });

      // Navigate back after a delay to allow the toast to show
      setTimeout(() => {
        navigation.navigate('Confirm');
      }, 1000); // Delay for 1 second (optional)

    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleError = (error) => {
    if (error.response) {
      console.log("Error adding address:", error.response.data);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to add address: ${error.response.data.message || 'Please try again.'}`,
      });
    } else if (error.request) {
      console.log("No response received:", error.request);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No response from the server. Please check your network connection and try again.',
      });
    } else {
      console.log("Error setting up request:", error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Unexpected error: ${error.message}`,
      });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 50 }}>
      <View style={{ padding: 10 }}>
        <Text style={styles.heading}>Add Your Address</Text>

        {/* Add Address Form */}
        <View style={styles.form}>
          <TextInput
            placeholder="Name"
            value={newAddress.name}
            onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
            style={styles.AddAddressinput}
          />
          <TextInput
            placeholder="House No"
            value={newAddress.houseNo}
            onChangeText={(text) => setNewAddress({ ...newAddress, houseNo: text })}
            style={styles.AddAddressinput}
          />
          <TextInput
            placeholder="Landmark"
            value={newAddress.landmark}
            onChangeText={(text) => setNewAddress({ ...newAddress, landmark: text })}
            style={styles.AddAddressinput}
          />
          <TextInput
            placeholder="Street"
            value={newAddress.street}
            onChangeText={(text) => setNewAddress({ ...newAddress, street: text })}
            style={styles.AddAddressinput}
          />
          <TextInput
            placeholder="Mobile No"
            value={newAddress.mobileNo}
            onChangeText={(text) => setNewAddress({ ...newAddress, mobileNo: text })}
            style={styles.AddAddressinput}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="City"
            value={newAddress.city}
            onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
            style={styles.AddAddressinput}
          />
          <TextInput
            placeholder="Country"
            value={newAddress.country}
            onChangeText={(text) => setNewAddress({ ...newAddress, country: text })}
            style={styles.AddAddressinput}
          />
          <TextInput
            placeholder="Postal Code"
            value={newAddress.postalCode}
            onChangeText={(text) => setNewAddress({ ...newAddress, postalCode: text })}
            style={styles.AddAddressinput}
            keyboardType="numeric"
          />
          <Pressable onPress={handleAddAddress} style={styles.addButton} disabled={loading}>
            <Text style={styles.addButtonText}>{loading ? 'Adding...' : 'Add Address'}</Text>
          </Pressable>
        </View>

        {/* Displaying Existing Addresses */}
        {/* ... Add existing addresses display logic here ... */}

        {/* Add Login Button */}
        {!isAuthenticated && (
          <Pressable onPress={() => navigation.navigate('Login')} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login to Add Address</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};

export default AddAddressScreen;
