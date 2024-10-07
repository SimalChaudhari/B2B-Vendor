import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from 'react-redux'; // Import useSelector if using Redux

const ProfileScreen = () => {
  const [userId, setUserId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(); // Initialize user state
  const navigation = useNavigation();

  // Replace with your reducer selector
  const authData = useSelector((state) => state.auth); // Get auth data from your Redux store
  // console.log("Reducer Auth Data:", authData); // Log the reducer data

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#00CED1",
      },
      headerLeft: () => (
        <Image
          style={{ width: 140, height: 120, resizeMode: "contain" }}
          source={{
            uri: "https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c518.png",
          }}
        />
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", marginRight: 12 }}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <AntDesign name="search1" size={24} color="black" />
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const checkUserLogin = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const userData = await AsyncStorage.getItem("userData");
      const storedUserId = await AsyncStorage.getItem("userId");

      // Log the values retrieved from AsyncStorage
      // console.log("Auth Token:", token);
      // console.log("userData:", userData);
      // console.log("Stored User ID:", storedUserId); // Log stored user ID

      if (token && storedUserId) { // Check both token and storedUserId
        setUserId(storedUserId);
        // console.log("User is logged in with User ID:", storedUserId); // Log message when user is logged in
        await fetchUserProfile(storedUserId);
        await fetchOrders(storedUserId);
      } else {
        setLoading(false); // Set loading to false if not logged in
        // console.log("User is not logged in");
      }
    };

    checkUserLogin();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`http://192.168.1.112:8181/profile/${userId}`);
      const { user } = response.data;
      console.log("Fetched User Profile:", user); // Log fetched user profile
      setUser(user);
    } catch (error) {
      console.log("Error fetching user profile:", error);
    }
  };

  const fetchOrders = async (userId) => {
    try {
      const response = await axios.get(`http://192.168.1.112:8181/orders/${userId}`);
      const orders = response.data.orders;
      console.log("Fetched Orders:", orders); // Log fetched orders
      setOrders(orders);
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching orders
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userId"); // Clear userId as well
    console.log("Auth token cleared and user logged out");
    setUserId(null);
    setUser(null);
    setOrders([]);
  };

  return (
    <ScrollView style={{ marginTop: 55 }}>
      <ScrollView style={{ padding: 10, flex: 1, backgroundColor: "white" }}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : user ? (
          <>
            <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>

            <View style={styles.buttonContainer}>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Your Orders</Text>
              </Pressable>

              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Your Account</Text>
              </Pressable>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Buy Again</Text>
              </Pressable>

              <Pressable onPress={logout} style={styles.button}>
                <Text style={styles.buttonText}>Logout</Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <Pressable
                    style={styles.orderCard}
                    key={order._id}
                  >
                    {order.products.slice(0, 1)?.map((product) => (
                      <View style={{ marginVertical: 10 }} key={product._id}>
                        <Image
                          source={{ uri: product.image }}
                          style={styles.productImage}
                        />
                      </View>
                    ))}
                  </Pressable>
                ))
              ) : (
                <Text style={styles.noOrdersText}>No orders found</Text>
              )}
            </ScrollView>
          </>
        ) : (
          <View style={styles.loginContainer}>
            <Text style={styles.noOrdersText}>You are not logged in</Text>
            <View style={styles.buttonContainer}>
              <Pressable onPress={() => navigation.navigate("Login")} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("Register")} style={styles.button}>
                <Text style={styles.buttonText}>Register</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  button: {
    padding: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 25,
    flex: 1,
  },
  buttonText: {
    textAlign: "center",
  },
  orderCard: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
  },
  noOrdersText: {
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
  loginContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
