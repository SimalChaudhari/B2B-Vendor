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
import { formatNumber } from "../../utils";

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



  const navigation = useNavigation();
  return (
    <ScrollView style={{ marginTop: 30, flex: 1, backgroundColor: "white" }}>

      <Text style={styles.CheckOutText}> Checkout </Text>

      {cart.length === 0 ? ( // Conditionally render EmptyCart SVG
        <View style={styles.emptyCartContainer}>
          <View style={styles.card}>
            <Image
              source={require('../../assets/images/ic-cart.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.emptyCartText}>Cart is empty!</Text>
            <Text style={styles.emptyCartText2}>Look like you have no items in your shopping cart.</Text>
          </View>


          <Pressable style={styles.emptyLastBox}
            onPress={() => navigation.navigate("Home")}
          >
            <Feather name="chevron-left" size={26} color="#1C252E" />
            <Text style={styles.emptyLastText}>Continue shopping</Text>
          </Pressable>
        </View>
      ) : (


        <View>
          <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "900", color: "#637381" }}>Subtotal : </Text>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1C252E" }}>₹ {formatNumber(total)}</Text>
          </View>


          <Pressable
            // onPress={handleProceedToBuy} // Updated onPress handler
            onPress={() => navigation.navigate("Confirm")}
            style={{
              backgroundColor: cart.length > 0 ? "#1C252E" : "#D3D3D3", // Change color if disabled
              padding: 15,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 10,
              marginTop: 10,
            }}
            disabled={cart.length === 0} // Disable the button if the cart is empty
          >
            <Text style={{ color: cart.length > 0 ? "white" : "gray", fontWeight: 'bold', fontSize: 17, }}> {/* Change text color if disabled */}
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
                  <Text numberOfLines={3} style={{ width: 150, marginTop: 10, fontSize: 15, fontWeight: "600", color: "#1C252E", }}>
                    {item.itemName}
                  </Text>
                  <Text numberOfLines={3} style={{ width: 120, marginTop: 5, fontSize: 12, fontWeight: "600", color: "#637381", }}>
                    {item.description}
                  </Text>
                    <Text
                      style={{ fontSize: 20, fontWeight: "bold", marginTop: 6, color: "#1C252E" }}
                    >
                      ₹ {formatNumber(item.sellingPrice)}
                    </Text>
                    <Text style={{ color: "green", marginTop: 6 }}>In Stock</Text>
                    
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
                        <AntDesign name="minus" size={24} color="#1C252E" />
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
                        <AntDesign name="delete" size={24} color="#1C252E" />
                      </Pressable>
                    )}

                    <Pressable
                      style={{
                        backgroundColor: "white",
                        paddingHorizontal: 18,
                        paddingVertical: 6,
                      }}
                    >
                      <Text style={{ color:"#1C252E", fontSize: 18, fontWeight: "bold", }}>{item.quantity}</Text>
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
                      <Feather name="plus" size={24} color="#1C252E" />
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

              </View>
            ))}
          </View>
        </View>
      )}

    </ScrollView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  CheckOutText: {
    fontSize: 25,
    fontWeight: "600",
    margin: 10,
    color: "#1C252E",
    marginTop: 65,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f0f0f0',
    marginTop: 30,
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    alignItems: 'center',
    width: '90%',
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 15,
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#919EAB',
    marginTop: 10,
  },
  emptyCartText2: {
    alignItems: 'center',
    fontSize: 13,
    // fontWeight: 'bold',
    color: '#919EAB',
    marginTop: 5,
  },
  emptyLastBox: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    gap: 10,

    // backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    // borderRadius: 5,
    borderColor: "#C0C0C0",
    // borderWidth: 0.6,
  },
  emptyLastText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C252E',
  },
});