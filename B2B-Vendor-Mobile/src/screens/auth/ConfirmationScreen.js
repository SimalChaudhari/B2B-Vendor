import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { cleanCart } from "../../../redux/CartReducer";
import { formatNumber } from "../../utils";

const ConfirmationScreen = () => {
    const user = useSelector((state) => state.auth.user);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const steps = [
        { title: "Address", content: "Address Form" },
        { title: "Place Order", content: "Order Summary" },
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses] = useState([
        {
            _id: "1",
            name: "John Doe",
            houseNo: "123",
            landmark: "Near Park",
            street: "Main St.",
            mobileNo: "1234567890",
            postalCode: "560001",
        },
        {
            _id: "2",
            name: "Jane Doe",
            houseNo: "456",
            landmark: "Near Mall",
            street: "Second St.",
            mobileNo: "0987654321",
            postalCode: "560002",
        },
    ]);

    const cart = useSelector((state) => state.cart.cart);
    const total = cart
        ?.map((item) => item.sellingPrice * item.quantity)
        .reduce((curr, prev) => curr + prev, 0);

    const handleProceedToCheckout = () => {
        if (!selectedAddress) {
            Alert.alert("Please select an address before proceeding.");
            return;
        }
        setCurrentStep(1);
    };

    return (
        <ScrollView style={{ marginTop: 55 }}>
            <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, justifyContent: "space-between" }}>
                    {steps.map((step, index) => (
                        <View key={index} style={{ justifyContent: "center", alignItems: "center" }}>
                            {index > 0 && (
                                <View style={{ flex: 1, height: 2, backgroundColor: index <= currentStep ? "#0C68E9" : "#D0D0D0" }} />
                            )}
                            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: index <= currentStep ? "#0C68E9" : "#ccc", justifyContent: "center", alignItems: "center" }}>
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

            {/* Step 0: Select Delivery Address */}
            {currentStep === 0 && (
                <View style={{ marginHorizontal: 20, paddingVertical: 15 }}>
                    <Text style={styles.headerText}>Select Delivery Address</Text>

                    <Pressable onPress={() => navigation.navigate("AddAddressScreen")} style={styles.addAddressButton}>
                        <Text style={{ fontSize: 16, color: "#0C68E9", fontWeight: "bold", }}>Add a new Address</Text>
                        <AntDesign name="pluscircleo" size={24} color="#0C68E9" />
                    </Pressable>

                    {addresses.map((item) => (
                        <Pressable
                            key={item._id}
                            style={{
                                backgroundColor: selectedAddress?._id === item._id ? "#e0f7fa" : "#f9f9f9",
                                borderWidth: 1,
                                borderColor: "#D0D0D0",
                                padding: 15,
                                flexDirection: "row",
                                alignItems: "center",
                                marginVertical: 7,
                                borderRadius: 8,
                                shadowColor: "#1C252E",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                elevation: 2,
                            }}
                            onPress={() => setSelectedAddress(item)}
                        >
                            {selectedAddress?._id === item._id ? (
                                <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                            ) : (
                                <Entypo name="circle" size={20} color="gray" />
                            )}
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.addressText}>{item.name}</Text>
                                <Text style={styles.addressDetailsText}>{item.houseNo}, {item.landmark}</Text>
                                <Text style={styles.addressDetailsText}>{item.street}</Text>
                                <Text style={styles.addressDetailsText}>India, Bangalore</Text>
                                <Text style={styles.addressDetailsText}>Phone No: {item.mobileNo}</Text>
                                <Text style={styles.addressDetailsText}>Pin code: {item.postalCode}</Text>
                            </View>
                        </Pressable>
                    ))}

                    <Pressable style={styles.emptyLastBox}
                        onPress={() => navigation.navigate("Cart")}
                    >
                        <Feather name="chevron-left" size={20} color="#1C252E" />
                        <Text style={styles.emptyLastText}>Back</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleProceedToCheckout}
                        style={styles.proceedButton}
                    >
                        <Text style={{ textAlign: "center", color: "white", fontSize: 16, fontWeight: "bold", }}>Proceed to Checkout</Text>
                    </Pressable>
                </View>
            )}

            {/* Step 1: Order Summary */}
            {currentStep === 1 && (
                <View style={{ marginHorizontal: 20, padding: 15 }}>
                    <Text style={styles.orderSummaryTitle}>Order Summary</Text>

                    <Text style={styles.selectedAddressTitle}>Selected Address:</Text>
                    <Text style={styles.selectedAddressText}>{selectedAddress?.name}</Text>
                    <Text style={styles.selectedAddressText}>{selectedAddress?.houseNo}, {selectedAddress?.landmark}</Text>
                    <Text style={styles.selectedAddressText}>{selectedAddress?.street}, India, Bangalore</Text>
                    <Text style={styles.selectedAddressText}>Phone: {selectedAddress?.mobileNo}</Text>
                    <Text style={styles.selectedAddressText}>Pin Code: {selectedAddress?.postalCode}</Text>

                    <Text style={styles.orderSummaryTitle}>Products:</Text>
                    {cart.length > 0 ? (
                        cart.map((item, index) => (
                            <View key={index} style={styles.productContainer}>
                                <Text style={styles.productText}>{item.itemName} (x{item.quantity})</Text>
                                <Text style={styles.productPrice}>₹ {formatNumber(item.sellingPrice * item.quantity)}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyCartText}>No products in the cart.</Text>
                    )}
                    <View style={styles.productContainer}>
                    <Text style={styles.orderTotalText}>Order Total: </Text> 
                    <Text style={styles.totalAmount}> ₹ {formatNumber(total)}</Text>
                    </View>

                    <Pressable
                        onPress={() => {
                            console.log("Order placed by:", user); // Log user data
                            console.log("Selected address:", selectedAddress); // Log selected address
                            console.log("Ordered products:", cart); // Log cart items
                            console.log("Total amount:", total); // Log total amount
                            // dispatch(cleanCart());
                            // navigation.navigate("Order");
                            // setCurrentStep(0);
                        }}
                        style={styles.placeOrderButton}
                    >
                        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Place your order</Text>
                    </Pressable>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
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
    addressText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#181818",
    },
    addressDetailsText: {
        fontSize: 14,
        color: "#555",
    },
    proceedButton: {
        backgroundColor: "#0C68E9",
        padding: 12,
        borderRadius: 3,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        elevation: 5,
        shadowColor: "#1C252E",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
    },
    orderSummaryTitle: {
        color: "#1C252E",
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 10,
    },
    selectedAddressTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
    },
    selectedAddressText: {
        fontSize: 16,
    },
    orderTotalText: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 8,
    },
    totalAmount: {
        fontSize: 22,
        color: "#1C252E",
        fontWeight: "bold",
    },
    productContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
    },
    productText: {
        fontSize: 16,
        color: "#1C252E",
        fontWeight: "bold",

    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ff5722",
    },
    emptyCartText: {
        fontSize: 16,
        color: "#555",
        marginVertical: 10,
    },
    placeOrderButton: {
        backgroundColor: "#0C68E9",
        padding: 12,
        borderRadius: 3,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        elevation: 5,
        shadowColor: "#1C252E",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
    },
    emptyLastBox: {
        // marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-start",
        gap: 3,

        // backgroundColor: "#fff",
        // paddingHorizontal: 15,
        paddingVertical: 5,
        // borderRadius: 5,
        borderColor: "#C0C0C0",
        // borderWidth: 0.6,
    },
    emptyLastText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1C252E',
    },
});

export default ConfirmationScreen;
