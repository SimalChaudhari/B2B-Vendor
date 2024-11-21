import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction, setUser } from '../../../redux/authReducer'; // Adjust the import path as necessary
import { getAllOrder } from "../../BackendApis/orderApi";
import { authLogout, fetchUserData } from "../../BackendApis/userApi";
import useAuthToken from "../../components/AuthToken/useAuthToken";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import { useAuth } from "../../components/AuthToken/AuthContext";


const ProfileScreen = () => {

  const { userData } = useAuthToken();
  const { token } = useAuth();

  const parsedUserData = JSON.parse(userData);
  const [userId, setUserId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const authData = useSelector((state) => state.auth);

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

  // Use useFocusEffect to call getCartData whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        getOrderData();
      }
      // setLoading(false);
    }, [token]) // This dependency array ensures that the effect runs again when the token changes
  );

  const getOrderData = async () => {
    setLoading(true);
    try {
      setOrders([]);

      // Delay for 1 seconds (1000 milliseconds)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const data = await getAllOrder();
      setOrders(data);


    } catch (err) {
      // console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authLogout(); // API call
      navigation.navigate("Home")
    } catch (err) {
      setError('Failed to Logout...');
      setLoading(false);
    }
  };


  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}><LoadingComponent /></View>;
  }
  return (
    <ScrollView style={{ marginTop: 55 }}>
      <ScrollView style={{ padding: 10, flex: 1, backgroundColor: "white" }}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : token ? (
          token ? (
            <>
              <Text style={styles.welcomeText}>Welcome, {parsedUserData?.name}</Text>

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
                <Pressable style={styles.button} onPress={() => handleLogout()}>
                  <Text style={styles.buttonText}>Logout</Text>
                </Pressable>

                {/*
                  <Pressable onPress={logout} style={styles.button}>
                    <Text style={styles.buttonText}>Logout</Text>
                  </Pressable>
                   */}
              </View>
              <ScrollView >
                {orders.length > 0 ? (
                  orders?.map((order) => (
                    <Pressable style={styles.orderCard} key={order.id}>
                      {/*
                        */}
                      <View style={styles.orderDetails}>
                        <Text style={styles.productDetail}>
                          Date: {new Date(order.createdAt).toLocaleDateString()}
                        </Text>
                        <Text style={styles.productDetail}>Total Price: ₹{order.totalPrice}</Text>
                        <Text style={styles.productDetail}>Delivery: {order.delivery}</Text>
                        <Text style={styles.separator} />
                      </View>

                      {/* Iterate over orderItems to access product details */}
                      {order.orderItems?.map((item) => (
                        <View style={styles.productContainer} key={item.id}>
                          {/* Check if 'item.product' exists and use safe access */}
                          {item.product ? (
                            <View style={styles.orderProductContainer}>
                              <View >
                                <Image
                                  source={{ uri: item.product.productImages[0] || 'https://via.placeholder.com/100' }} // Fallback image
                                  style={styles.productImage}
                                />
                              </View>
                              <View style={styles.productInfo}>
                                <Text> <Text style={styles.productDetail}></Text> <Text>{item.product.itemName}</Text> </Text>
                                <Text> <Text style={styles.productDetail}>Price: ₹</Text> <Text>{item.product.sellingPrice}</Text> </Text>
                                <Text> <Text style={styles.productDetail}>Quantity: </Text> <Text>{item.quantity}</Text> </Text>
                                <Text> <Text style={styles.productDetail}>Status: </Text> <Text>{item.status}</Text> </Text>

                              </View>

                              <Text style={styles.separator} />
                            </View>
                          ) : (
                            <Text style={styles.noProductText}>No product details available</Text>
                          )}
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
              <Text style={styles.noOrdersText}>Your account is not verified.</Text>
              <View style={styles.buttonContainer}>
                <Pressable onPress={() => navigation.navigate("Login")} style={styles.button}>
                  <Text style={styles.buttonText}>Login</Text>
                </Pressable>

                <Pressable onPress={() => navigation.navigate("Register")} style={styles.button}>
                  <Text style={styles.buttonText}>Register</Text>
                </Pressable>
              </View>
            </View>
          )
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
    width: 120,
    height: 120,
    resizeMode: "contain",

    borderWidth: 1,
    borderColor: '#919eab33',
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

  separator: {
    borderBottomWidth: 1, // Sets the bottom border width
    borderBottomColor: '#919eab33', // Sets the bottom border color
    borderStyle: 'dashed', // Sets the bottom border style to dashed
  },
  orderProductContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginVertical: 10,
  },
  productDetail: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C252E"
  }
});

export default ProfileScreen;
