import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Network from 'expo-network';
// import { useSelector } from 'react-redux';
import HomeScreen from '../src/screens/Home/HomeScreen';
// import CartScreen from '../src/screens/products/CartScreen';
import AddressScreen from '../src/screens/auth/AddressScreen';
import AddAddressScreen from '../src/screens/auth/AddAddressScreen';
import ConfirmationScreen from '../src/screens/auth/ConfirmationScreen';
import OrderScreen from '../src/screens/products/OrderScreen';
import ProfileScreen from '../src/screens/auth/ProfileScreen';
import LoginScreen from '../src/screens/auth/LoginScreen';
import RegisterScreen from '../src/screens/auth/RegisterScreen';
import ProductInfoScreen from '../src/screens/products/ProductInfoScreen';
import OTPVerification from '../src/screens/auth/OTPVerification';
import NoInternetScreen from '../src/screens/NoInternet/NoInternetScreen';
import VendorHomeScreen from '../src/screens/Vendor/VendorHomeScreen';
import { fetchCart } from '../src/BackendApis/cartApi';
import ShopScreen from '../src/screens/products/ShopScreen';
import ContactUsScree from '../src/screens/ContactUs/ContactUsScree';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import OrderConfirmScreen from '../src/screens/Order/OrderConfirmScreen';
// import useAuthToken from '../src/components/AuthToken/useAuthToken';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const StackNavigator = () => {

    const [isConnected, setIsConnected] = useState(true); // Track network status   
    

    // Check network status
    useEffect(() => {
        const checkNetwork = async () => {
            const networkState = await Network.getNetworkStateAsync();
            setIsConnected(networkState.isConnected);
        };
        checkNetwork();
    }, []);


    if (!isConnected) {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="NoInternet"
                        component={NoInternetScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    function BottomTabs() {
        return (
            <Tab.Navigator>
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: "Home",
                        tabBarLabelStyle: { color: "#000", fontWeight:700, marginBottom:7  },
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            focused ? (
                                <Ionicons name="home" size={26} color="#fe0002" />
                            ) : (
                                <Ionicons name="home-outline" size={26} color="#fe0002" />
                            )
                        ),
                    }}
                />

                <Tab.Screen
                    name="Shop"
                    component={ShopScreen}
                    options={{
                        tabBarLabel: "Products",
                        tabBarLabelStyle: { color: "#000", fontWeight:700, marginBottom:7  },
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            focused ? (
                                <Ionicons name="storefront-sharp" size={26} color="#fe0002" />
                            ) : (
                                <Ionicons name="storefront-outline" size={26} color="#fe0002" />
                            )
                        ),
                    }}
                />



                <Tab.Screen
                    name="ContactUs"
                    component={ContactUsScree}
                    options={{
                        tabBarLabel: "Contact Us",
                        tabBarLabelStyle: { color: "#000", fontWeight:700, marginBottom:7  },
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            focused ? (
                                <MaterialCommunityIcons name="message-question" size={26} color="#fe0002" />
                            ) : (
                                <MaterialCommunityIcons name="message-question-outline" size={26} color="#fe0002" />
                            )
                        ),
                    }}
                />
                

            </Tab.Navigator>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Main"
                    component={BottomTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="VendorHome"
                    component={VendorHomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AddAddress"
                    component={AddressScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AddAddressScreen"
                    component={AddAddressScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Info"
                    component={ProductInfoScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="OTPVerification"
                    component={OTPVerification}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Confirm"
                    component={ConfirmationScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Order"
                    component={OrderScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="OrderConfirm"
                    component={OrderConfirmScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigator;

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        right: -8,
        top: -8,
        backgroundColor: 'red',
        borderRadius: 10,
        minWidth: 20,
        minHeight: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
