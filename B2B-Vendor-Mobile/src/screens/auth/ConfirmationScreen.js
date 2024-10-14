import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { cleanCart } from "../../../redux/CartReducer";

const ConfirmationScreen = () => {
    // Access user data from authReducer
    const user = useSelector((state) => state.auth.user);

    const steps = [
        { title: "Address", content: "Address Form" },
        { title: "Place Order", content: "Order Summary" },
    ];
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(0);

    const [addresses, setAddresses] = useState([
        {
            _id: "1",
            name: "John Doe",
            houseNo: "123",
            landmark: "Near Park",
            street: "Main St.",
            mobileNo: "1234567890",
            postalCode: "560001"
        },
        {
            _id: "2",
            name: "Jane Doe",
            houseNo: "456",
            landmark: "Near Mall",
            street: "Second St.",
            mobileNo: "0987654321",
            postalCode: "560002"
        }
    ]);
    const cart = useSelector((state) => state.cart.cart);
    const total = cart
        ?.map((item) => item.sellingPrice * item.quantity)
        .reduce((curr, prev) => curr + prev, 0);

    const dispatch = useDispatch();
    const [selectedAddress, setSelectedAddress] = useState("");

    const handleProceedToCheckout = () => {
        if (!selectedAddress) {
            Alert.alert("Please select an address before proceeding.");
            return;
        }
        setCurrentStep(1); // Proceed to the order summary step
    };

    return (
        <ScrollView style={{ marginTop: 55 }}>
            <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, justifyContent: "space-between" }}>
                    {steps?.map((step, index) => (
                        <View key={index} style={{ justifyContent: "center", alignItems: "center" }}>
                            {index > 0 && (
                                <View style={[{ flex: 1, height: 2, backgroundColor: index <= currentStep ? "green" : "#D0D0D0" }]} />
                            )}
                            <View style={[{ width: 30, height: 30, borderRadius: 15, backgroundColor: index <= currentStep ? "green" : "#ccc", justifyContent: "center", alignItems: "center" }]}>
                                {index < currentStep ? (
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>&#10003;</Text>
                                ) : (
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>{index + 1}</Text>
                                )}
                            </View>
                            <Text style={{ textAlign: "center", marginTop: 8 }}>{step.title}</Text>
                        </View>
                    ))}
                </View>
            </View>

           
            {currentStep === 0 && (
                <View style={{ marginHorizontal: 20, paddingVertical: 15 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Select Delivery Address</Text>
            
                    <View style={styles.container}>
                        <Pressable onPress={() => navigation.navigate("AddAddressScreen")} style={styles.addAddressButton}>
                            <Text style={{ fontSize: 16, color: "#008397" }}>Add a new Address</Text>
                            <AntDesign name="pluscircleo" size={24} color="#008397" />
                        </Pressable>
                    </View>
            
                    {addresses.map((item) => (
                        <Pressable
                            key={item._id}
                            style={{
                                backgroundColor: "#f9f9f9", // Light background for better visibility
                                borderWidth: 1,
                                borderColor: "#D0D0D0",
                                padding: 15,
                                flexDirection: "row",
                                alignItems: "center",
                                marginVertical: 7,
                                borderRadius: 8,
                                shadowColor: "#000", // For iOS shadow effect
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                elevation: 2, // For Android shadow effect
                            }}
                            onPress={() => setSelectedAddress(item)}
                        >
                            {selectedAddress && selectedAddress._id === item._id ? (
                                <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                            ) : (
                                <Entypo name="circle" size={20} color="gray" />
                            )}
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#181818" }}>{item.name}</Text>
                                <Text style={{ fontSize: 14, color: "#555" }}>{item.houseNo}, {item.landmark}</Text>
                                <Text style={{ fontSize: 14, color: "#555" }}>{item.street}</Text>
                                <Text style={{ fontSize: 14, color: "#555" }}>India, Bangalore</Text>
                                <Text style={{ fontSize: 14, color: "#555" }}>Phone No: {item.mobileNo}</Text>
                                <Text style={{ fontSize: 14, color: "#555" }}>Pin code: {item.postalCode}</Text>
                            </View>
                        </Pressable>
                    ))}
            
                    <Pressable
                        onPress={handleProceedToCheckout}
                        style={{
                            backgroundColor: "#008397",
                            padding: 12,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 15,
                            elevation: 5, // For Android shadow effect
                            shadowColor: "#000", // For iOS shadow effect
                            shadowOpacity: 0.3,
                            shadowOffset: { width: 0, height: 3 },
                            shadowRadius: 4,
                        }}
                    >
                        <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>Proceed to Checkout</Text>
                    </Pressable>
                </View>
            )}
            

            {currentStep === 1 && (
                <View style={{ marginHorizontal: 20, padding: 15 }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Order Summary</Text>

                    <Text style={{ fontSize: 18, marginVertical: 10 }}>Selected Address:</Text>
                    <Text style={{ fontSize: 16 }}>{selectedAddress?.name}</Text>
                    <Text style={{ fontSize: 16 }}>{selectedAddress?.houseNo}, {selectedAddress?.landmark}</Text>
                    <Text style={{ fontSize: 16 }}>{selectedAddress?.street}, India, Bangalore</Text>
                    <Text style={{ fontSize: 16 }}>Phone: {selectedAddress?.mobileNo}</Text>
                    <Text style={{ fontSize: 16 }}>Pin Code: {selectedAddress?.postalCode}</Text>

                    <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>Order Total: <Text style={{ color: "#E91E63" }}>₹{total}</Text></Text>

                    {/* Place Order Button */}
                    <Pressable
                        onPress={() => {
                            dispatch(cleanCart());
                            navigation.navigate("Order"); // Navigate to Order screen
                            setCurrentStep(0); // Reset to step 0
                            setAddresses([]);
                        }}
                        style={{
                            backgroundColor: "#FFC72C",
                            padding: 12,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20,
                            elevation: 5, // For Android shadow effect
                            shadowColor: '#000', // For iOS shadow effect
                            shadowOpacity: 0.2,
                            shadowOffset: { width: 0, height: 2 },
                            shadowRadius: 4,
                        }}
                    >
                        <Text style={{ color: "black", fontWeight: "bold" }}>Place your order</Text>
                    </Pressable>
                </View>
            )}

        </ScrollView>
    );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    addAddressButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
        borderColor: "#D0D0D0",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        paddingVertical: 7,
    },
});
