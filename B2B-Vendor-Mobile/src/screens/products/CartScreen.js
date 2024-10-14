import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incementQuantity,
  removeFromCart,
} from "../../../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {

  // Access user data from authReducer

  
  const cart = useSelector((state) => state.cart.cart);
  // console.log(cart);
  
  // const total = cart
  //   ?.map((item) => item.price * item.quantity)
  //   .reduce((curr, prev) => curr + prev, 0);
  // const dispatch = useDispatch();
  // const increaseQuantity = (item) => {
  //   dispatch(incementQuantity(item));
  // };
  // const decreaseQuantity = (item) => {
  //   dispatch(decrementQuantity(item));
  // };
  // const deleteItem = (item) => {
  //   dispatch(removeFromCart(item));
  // };

  
  const total = cart
    ?.map((item) => item.sellingPrice * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);
  const dispatch = useDispatch();
  const increaseQuantity = (item) => {
    dispatch(incementQuantity(item));
  };
  const decreaseQuantity = (item) => {
    dispatch(decrementQuantity(item));
  };
  const deleteItem = (item) => {
    dispatch(removeFromCart(item));
  };

   // Function to format number with commas
   const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  const navigation = useNavigation();
  return (
    <ScrollView style={{ marginTop: 55, flex: 1, backgroundColor: "white" }}>
    
      <Text style={styles.CheckOutText}> Checkout </Text>

      <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "400" }}>Subtotal : </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>₹ {formatNumber(total)}</Text>
      </View>
      <Text style={{ marginHorizontal: 10 }}>EMI details Available</Text>


      <Pressable
      // onPress={handleProceedToBuy} // Updated onPress handler
        onPress={() => navigation.navigate("Confirm")}
        style={{
          backgroundColor: cart.length > 0 ? "#FFC72C" : "#D3D3D3", // Change color if disabled
          padding: 10,
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginTop: 10,
        }}
        disabled={cart.length === 0} // Disable the button if the cart is empty
      >
        <Text style={{ color: cart.length > 0 ? "black" : "gray" }}> {/* Change text color if disabled */}
          Proceed to Buy ({cart.length}) items
        </Text>
      </Pressable>



      <Text
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 1,
          marginTop: 16,
        }}
      />

      <View style={{ marginHorizontal: 10 }}>
        {cart.map((item, index) => (
          <View
            style={{
              backgroundColor: "white",
              marginVertical: 10,
              borderBottomColor: "#F0F0F0",
              borderWidth: 2,
              borderLeftWidth: 0,
              borderTopWidth: 0,
              borderRightWidth: 0,
            }}
            key={index}
          >
            <Pressable
              style={{
                marginVertical: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Image
                  style={{ width: 140, height: 140, resizeMode: "contain" }}
                  source={{ uri: item.productImages[0] }}
                />
              </View>

              <View>
                <Text numberOfLines={3} style={{ width: 150, marginTop: 10 }}>
                  {item.itemName}
                </Text>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}
                >
                ₹ {formatNumber(item.sellingPrice)}
                </Text>
                <Text style={{ color: "green", marginTop: 6 }}>In Stock</Text>
                {/* <Text style={{ fontWeight: "500", marginTop: 6 }}>
                    {item.rating.rate} ratings
                  </Text> */}
              </View>
            </Pressable>

            <Pressable
              style={{
                marginTop: 15,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 7,
                }}
              >
                {item.quantity > 1 ? (
                  <Pressable
                    onPress={() => decreaseQuantity(item)}
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                  >
                    <AntDesign name="minus" size={24} color="black" />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => deleteItem(item)}
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                  >
                    <AntDesign name="delete" size={24} color="black" />
                  </Pressable>
                )}

                <Pressable
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 18,
                    paddingVertical: 6,
                  }}
                >
                  <Text>{item.quantity}</Text>
                </Pressable>

                <Pressable
                  onPress={() => increaseQuantity(item)}
                  style={{
                    backgroundColor: "#D8D8D8",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Feather name="plus" size={24} color="black" />
                </Pressable>
              </View>
              <Pressable
                onPress={() => deleteItem(item)}
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>Delete</Text>
              </Pressable>
            </Pressable>

            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 15,
              }}
            >

              <Pressable
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>Save For Later</Text>
              </Pressable>

              <Pressable
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>See More Like this</Text>
              </Pressable>
              
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
CheckOutText:{
fontSize: 25,
fontWeight: "600",
margin:10,
},
});