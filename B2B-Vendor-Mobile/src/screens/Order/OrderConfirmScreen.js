import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { resetProductAndAddress } from '../../../redux/productAndAddressReducer';
import { useNavigation } from '@react-navigation/native';

const OrderConfirmScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const productDetails = useSelector((state) => state.productAndAddress.productDetails);
    const address = useSelector((state) => state.productAndAddress.address);

    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirmOrder = () => {
        setLoading(true);
        // Simulating an API call for order confirmation
        setTimeout(() => {
            setLoading(false);
            setModalVisible(false);
            dispatch(resetProductAndAddress()); // Reset Redux state
            navigation.navigate('Order'); // Navigate to the Confirmation screen
            console.log('Order confirmed!');
        }, 2000);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Order Confirmation</Text>

            <View style={styles.card}>
                <Text style={styles.header}>Product Details:</Text>
                {productDetails ? (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detail}>
                            <MaterialIcons name="label" size={16} color="#555" /> Name: {productDetails.itemName}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialIcons name="info" size={16} color="#555" /> Description: {productDetails.description}
                        </Text>
                        <Text style={styles.price}>
                            <MaterialIcons name="attach-money" size={16} color="#555" /> Price: ₹{productDetails.sellingPrice}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialIcons name="monetization-on" size={16} color="#555" /> GST Rate: {productDetails.gstRate}%
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.errorText}>No product details available.</Text>
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.header}>Shipping Address:</Text>
                {address ? (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detail}>
                            <MaterialIcons name="person" size={16} color="#555" /> Name: {address.name}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialIcons name="house" size={16} color="#555" /> House No: {address.houseNo}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialIcons name="place" size={16} color="#555" /> Street: {address.street}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialIcons name="location-on" size={16} color="#555" /> Landmark: {address.landmark}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialIcons name="location-city" size={16} color="#555" /> City: {address.city}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialIcons name="public" size={16} color="#555" /> Country: {address.country}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialIcons name="email" size={16} color="#555" /> Postal Code: {address.postalCode}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialIcons name="phone" size={16} color="#555" /> Mobile No: {address.mobileNo}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.errorText}>No address available.</Text>
                )}
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Confirm Order</Text>
            </TouchableOpacity>

            {/* Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Are you sure you want to confirm the order?</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleConfirmOrder}>
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Loading Indicator */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Processing your order...</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#444',
    },
    detailsContainer: {
        marginVertical: 10,
    },
    detail: {
        fontSize: 16,
        marginVertical: 5,
        color: '#555',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
        color: '#D32F2F', // Red color for price
    },
    errorText: {
        color: 'red',
        fontStyle: 'italic',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    modalButton: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        padding: 10,
        width: '40%',
        alignItems: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
    },
});

export default OrderConfirmScreen;
