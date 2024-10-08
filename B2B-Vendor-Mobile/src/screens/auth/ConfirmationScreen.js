import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
// import { UserType } from "../UserContext";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { cleanCart } from "../../../redux/CartReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode"
import { UserType } from "../../../UserContext";
// import RazorpayCheckout from "react-native-razorpay";

const ConfirmationScreen = () => {

    // Access user data from authReducer

    const user = useSelector((state) => state.auth.user);
    // const {userId,setUserId} = useContext(UserType)
    // const {userId,setUserId} = useContext(UserType)
    const userId = user._id
    const steps = [
        { title: "Address", content: "Address Form" },
        { title: "Delivery", content: "Delivery Options" },
        { title: "Payment", content: "Payment Details" },
        { title: "Place Order", content: "Order Summary" },
    ];
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const cart = useSelector((state) => state.cart.cart);
    const total = cart
        ?.map((item) => item.price * item.quantity)
        .reduce((curr, prev) => curr + prev, 0);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
          const response = await axios.get(`http://192.168.1.112:8181/addresses/${userId}`);
          setAddresses(response.data.addresses);
        } catch (error) {
          console.error("Error fetching addresses: 555555555555555555555555555555555555555", error);
        }
      };
      
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );
    
    const dispatch = useDispatch();
    const [selectedAddress, setSelectedAdress] = useState("");
    const [option, setOption] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");

    const handlePlaceOrder = async () => {
        try {
            const orderData = {
                userId: userId,
                cartItems: cart,
                totalPrice: total,
                shippingAddress: selectedAddress,
                paymentMethod: selectedOption,
            };

            const response = await axios.post(
                "http://192.168.1.112:8181/orders",
                orderData
            );
            if (response.status === 200) {
                navigation.navigate("Order");
                dispatch(cleanCart());
                console.log("order created successfully", response.data);
            } else {
                console.log("error creating order", response.data);
            }
        } catch (error) {
            console.log("errror", error);
        }
    };

    const pay = async () => {
        try {
            const options = {
                description: "Adding To Wallet",
                currency: "INR",
                name: "Amazon",
                key: "rzp_test_E3GWYimxN7YMk8",
                amount: total * 100,
                prefill: {
                    email: "void@razorpay.com",
                    contact: "9191919191",
                    name: "RazorPay Software",
                },
                theme: { color: "#F37254" },
            };

            const data = await RazorpayCheckout.open(options);

            console.log(data)

            const orderData = {
                userId: userId,
                cartItems: cart,
                totalPrice: total,
                shippingAddress: selectedAddress,
                paymentMethod: "card",
            };

            const response = await axios.post(
                "http://192.168.1.112:8181/orders",
                orderData
            );
            if (response.status === 200) {
                navigation.navigate("Order");
                dispatch(cleanCart());
                console.log("order created successfully", response.data);
            } else {
                console.log("error creating order", response.data);
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleRemoveAddress = async (addressId) => {
        try {
            const response = await axios.delete(`http://192.168.1.112:8181/addresses/${user._id}/${addressId}`);
            if (response.status === 200) {
                const updatedAddresses = addresses.filter((addr) => addr._id !== addressId);
                setAddresses(updatedAddresses);
                Alert.alert("Success", "Address deleted successfully.");
            }
        } catch (error) {
            // Log full error details for debugging
            console.error("Error deleting address:", error.response ? error.response.data : error.message);

            // Provide more user-friendly feedback based on the error
            if (error.response && error.response.status === 404) {
                Alert.alert("Error", "Address not found. It may have already been removed.");
            } else if (error.response && error.response.status === 500) {
                Alert.alert("Error", "Server error. Please try again later.");
            } else {
                Alert.alert("Error", "Failed to delete address. Please try again.");
            }
        }
    };


    const confirmRemoveAddress = (addressId) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to remove this address?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () => handleRemoveAddress(addressId),
                },
            ],
            { cancelable: false }
        );
    };


    return (
        <ScrollView style={{ marginTop: 55 }}>
            <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 20,
                        justifyContent: "space-between",
                    }}
                >
                    {steps?.map((step, index) => (
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            {index > 0 && (
                                <View
                                    style={[
                                        { flex: 1, height: 2, backgroundColor: "green" },
                                        index <= currentStep && { backgroundColor: "green" },
                                    ]}
                                />
                            )}
                            <View
                                style={[
                                    {
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        backgroundColor: "#ccc",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    },
                                    index < currentStep && { backgroundColor: "green" },
                                ]}
                            >
                                {index < currentStep ? (
                                    <Text
                                        style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                                    >
                                        &#10003;
                                    </Text>
                                ) : (
                                    <Text
                                        style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                                    >
                                        {index + 1}
                                    </Text>
                                )}
                            </View>
                            <Text style={{ textAlign: "center", marginTop: 8 }}>
                                {step.title}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {currentStep == 0 && (
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        Select Delivery Address
                    </Text>
                    <View style={styles.container}>
                        <Pressable
                            onPress={() => navigation.navigate("AddAddressScreen")} // Update the route name here
                            style={styles.addAddressButton}
                        >
                            <Text>Add a new Address</Text>
                            <AntDesign name="pluscircleo" size={24} color="black" />
                        </Pressable>
                    </View>
                    <Pressable>
                        {addresses?.map((item, index) => (
                            <Pressable
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#D0D0D0",
                                    padding: 10,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 5,
                                    paddingBottom: 17,
                                    marginVertical: 7,
                                    borderRadius: 6,
                                }}
                            >
                                {selectedAddress && selectedAddress._id === item?._id ? (
                                    <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                                ) : (
                                    <Entypo
                                        onPress={() => setSelectedAdress(item)}
                                        name="circle"
                                        size={20}
                                        color="gray"
                                    />
                                )}

                                <View style={{ marginLeft: 6 }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 3,
                                        }}
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
                                        India, Bangalore
                                    </Text>

                                    <Text style={{ fontSize: 15, color: "#181818" }}>
                                        phone No : {item?.mobileNo}
                                    </Text>
                                    <Text style={{ fontSize: 15, color: "#181818" }}>
                                        pin code : {item?.postalCode}
                                    </Text>

                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 10,
                                            marginTop: 7,
                                        }}
                                    >
                                        {/*
                                            <Pressable
                                                style={{
                                                    backgroundColor: "#F5F5F5",
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 6,
                                                    borderRadius: 5,
                                                    borderWidth: 0.9,
                                                    borderColor: "#D0D0D0",
                                                }}
                                            >
                                                <Text>Edit</Text>
                                            </Pressable>
                                            <Pressable
                                                style={{
                                                    backgroundColor: "#F5F5F5",
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 6,
                                                    borderRadius: 5,
                                                    borderWidth: 0.9,
                                                    borderColor: "#D0D0D0",
                                                }}
                                            >
                                                <Text>Remove</Text>
                                            </Pressable>
                                        */}

                                        <Pressable
                                            style={styles.actionButton}
                                            onPress={() => confirmRemoveAddress(item._id)}
                                        >
                                            <Text>Remove</Text>
                                        </Pressable>

                                        <Pressable
                                            style={{
                                                backgroundColor: "#F5F5F5",
                                                paddingHorizontal: 10,
                                                paddingVertical: 6,
                                                borderRadius: 5,
                                                borderWidth: 0.9,
                                                borderColor: "#D0D0D0",
                                            }}
                                        >
                                            <Text>Set as Default</Text>
                                        </Pressable>
                                    </View>

                                    <View>
                                        {selectedAddress && selectedAddress._id === item?._id && (
                                            <Pressable
                                                onPress={() => setCurrentStep(1)}
                                                style={{
                                                    backgroundColor: "#008397",
                                                    padding: 10,
                                                    borderRadius: 20,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: 10,
                                                }}
                                            >
                                                <Text style={{ textAlign: "center", color: "white" }}>
                                                    Deliver to this Address
                                                </Text>
                                            </Pressable>
                                        )}
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </Pressable>
                </View>
            )}

            {currentStep == 1 && (
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                        Choose your delivery options
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "white",
                            padding: 8,
                            gap: 7,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                        }}
                    >
                        {option ? (
                            <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                        ) : (
                            <Entypo
                                onPress={() => setOption(!option)}
                                name="circle"
                                size={20}
                                color="gray"
                            />
                        )}

                        <Text style={{ flex: 1 }}>
                            <Text style={{ color: "green", fontWeight: "500" }}>
                                Tomorrow by 10pm
                            </Text>{" "}
                            - FREE delivery with your Prime membership
                        </Text>
                    </View>

                    <Pressable
                        onPress={() => setCurrentStep(2)}
                        style={{
                            backgroundColor: "#FFC72C",
                            padding: 10,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 15,
                        }}
                    >
                        <Text>Continue</Text>
                    </Pressable>
                </View>
            )}

            {currentStep == 2 && (
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                        Select your payment Method
                    </Text>

                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 8,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 7,
                            marginTop: 12,
                        }}
                    >
                        {selectedOption === "cash" ? (
                            <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                        ) : (
                            <Entypo
                                onPress={() => setSelectedOption("cash")}
                                name="circle"
                                size={20}
                                color="gray"
                            />
                        )}

                        <Text>Cash on Delivery</Text>
                    </View>

                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 8,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 7,
                            marginTop: 12,
                        }}
                    >
                        {selectedOption === "card" ? (
                            <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                        ) : (
                            <Entypo
                                onPress={() => {
                                    setSelectedOption("card");
                                    Alert.alert("UPI/Debit card", "Pay Online", [
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel is pressed"),
                                        },
                                        {
                                            text: "OK",
                                            onPress: () => pay(),
                                        },
                                    ]);
                                }}
                                name="circle"
                                size={20}
                                color="gray"
                            />
                        )}

                        <Text>UPI / Credit or debit card</Text>
                    </View>
                    <Pressable
                        onPress={() => setCurrentStep(3)}
                        style={{
                            backgroundColor: "#FFC72C",
                            padding: 10,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 15,
                        }}
                    >
                        <Text>Continue</Text>
                    </Pressable>
                </View>
            )}

            {currentStep === 3 && selectedOption === "cash" && (
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Order Now</Text>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                            backgroundColor: "white",
                            padding: 8,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                        }}
                    >
                        <View>
                            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                                Save 5% and never run out
                            </Text>
                            <Text style={{ fontSize: 15, color: "gray", marginTop: 5 }}>
                                Turn on auto deliveries
                            </Text>
                        </View>

                        <MaterialIcons
                            name="keyboard-arrow-right"
                            size={24}
                            color="black"
                        />
                    </View>

                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 8,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                        }}
                    >
                        <Text>Shipping to {selectedAddress?.name}</Text>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 8,
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                                Items
                            </Text>

                            <Text style={{ color: "gray", fontSize: 16 }}>₹{total}</Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 8,
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                                Delivery
                            </Text>

                            <Text style={{ color: "gray", fontSize: 16 }}>₹0</Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 8,
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                                Order Total
                            </Text>

                            <Text
                                style={{ color: "#C60C30", fontSize: 17, fontWeight: "bold" }}
                            >
                                ₹{total}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 8,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 16, color: "gray" }}>Pay With</Text>

                        <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 7 }}>
                            Pay on delivery (Cash)
                        </Text>
                    </View>

                    <Pressable
                        onPress={handlePlaceOrder}
                        style={{
                            backgroundColor: "#FFC72C",
                            padding: 10,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20,
                        }}
                    >
                        <Text>Place your order</Text>
                    </Pressable>
                </View>
            )}
        </ScrollView>
    );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({

    // container: {
    //     padding: 10,
    // },
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
        // paddingHorizontal: 5,
    },
});