import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../src/screens/auth/LoginScreen';
import RegisterScreen from '../src/screens/auth/RegisterScreen';
import HomeScreen from '../src/screens/Home/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import ProductInfoScreen from '../src/screens/products/ProductInfoScreen';
import CartScreen from '../src/screens/products/CartScreen';
import AddressScreen from '../src/screens/auth/AddAddressScreen';

const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    function BottomTabs() {
        return (
            <Tab.Navigator>
                {/* Home */}
                <Tab.Screen
                    name="Home" // Corrected from "nam" to "name"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: "Home", // Corrected from "tabBarLable" to "tabBarLabel"
                        tabBarLabelStyle: { color: "#008E97" },
                        headerShown: false,
                        tabBarIcon: ({ focused }) => focused ? (
                            <Ionicons name="home" size={24} color="black" />
                        ) : (
                            <Ionicons name="home-outline" size={24} color="black" />
                        )
                    }}
                />

                {/* Profile */}
                <Tab.Screen
                    name="Profile" // Corrected from "nam" to "name"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: "Profile", // Corrected from "tabBarLable" to "tabBarLabel"
                        tabBarLabelStyle: { color: "#008E97" },
                        headerShown: false,
                        tabBarIcon: ({ focused }) => focused ? (
                            <Ionicons name="person" size={24} color="black" /> // Use a different icon for Profile
                        ) : (
                            <Ionicons name="person-outline" size={24} color="black" />
                        )
                    }}
                />

                {/* Cart */}
                <Tab.Screen
                    name="Cart" // Corrected from "nam" to "name"
                    component={CartScreen}
                    options={{
                        tabBarLabel: "Cart", // Corrected from "tabBarLable" to "tabBarLabel"
                        tabBarLabelStyle: { color: "#008E97" },
                        headerShown: false,
                        tabBarIcon: ({ focused }) => focused ? (
                            <Ionicons name="cart" size={24} color="black" /> // Use a different icon for Cart
                        ) : (
                            <Ionicons name="cart-outline" size={24} color="black" />
                        )
                    }}
                />
            </Tab.Navigator>
        )
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
            <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Info" component={ProductInfoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddAdress" component={AddressScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNavigator;

const styles = StyleSheet.create({});
