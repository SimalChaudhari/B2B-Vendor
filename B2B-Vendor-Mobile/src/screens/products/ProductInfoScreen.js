import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    ImageBackground,
    Dimensions,
  } from "react-native";
  import React, { useState } from "react";
  import { AntDesign, Feather } from "@expo/vector-icons";
  import { Ionicons } from "@expo/vector-icons";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import { MaterialCommunityIcons } from "@expo/vector-icons";
  import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/CartReducer";
  
  const ProductInfoScreen = () => {
    const route = useRoute();
    const { width } = Dimensions.get("window");
    const navigation = useNavigation();
    const [addedToCart, setAddedToCart] = useState(false);
    const height = (width * 100) / 100;
    const dispatch = useDispatch();
  
    const addItemToCart = (item) => {
      setAddedToCart(true);
      dispatch(addToCart(item));
      // setTimeout(() => {
      //   setAddedToCart(false);
      // }, 60000);
    };
  
    const cart = useSelector((state) => state.cart.cart);
  
    return (
      <ScrollView
        style={{ marginTop: 23, flex: 1, backgroundColor: "white" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <Pressable style={styles.searchInput}>
            <AntDesign style={styles.searchIcon} name="search1" size={22} color="black" />
            <TextInput placeholder="Search Amazon.in" />
          </Pressable>
          <Feather name="mic" size={24} color="black" />
        </View>
  
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(route.params.carouselImages || []).map((item, index) => (
            <ImageBackground
              style={{ width, height, marginTop: 25, resizeMode: "contain" }}
              source={{ uri: item }}
              key={index}
            >
              <View style={styles.imageOverlay}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>20% off</Text>
                </View>
                <View style={styles.shareIcon}>
                  <MaterialCommunityIcons name="share-variant" size={24} color="black" />
                </View>
              </View>
              <View style={styles.wishIcon}>
                <AntDesign name="hearto" size={24} color="black" />
              </View>
            </ImageBackground>
          ))}
        </ScrollView>
  
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{route?.params?.title}</Text>
          <Text style={styles.productPrice}>₹{route?.params?.price}</Text>
        </View>
  
        <Text style={styles.separator} />
  
        <View style={styles.colorSizeContainer}>
          <Text>Color: </Text>
          <Text style={styles.boldText}>{route?.params?.color}</Text>
        </View>
  
        <View style={styles.colorSizeContainer}>
          <Text>Size: </Text>
          <Text style={styles.boldText}>{route?.params?.size}</Text>
        </View>
  
        <Text style={styles.separator} />
  
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total : ₹{route.params.price}</Text>
          <Text style={styles.freeDeliveryText}>FREE delivery Tomorrow by 3 PM. Order within 10hrs 30 mins</Text>
          <View style={styles.deliveryLocation}>
            <Ionicons name="location" size={24} color="black" />
            <Text style={styles.deliveryText}>Deliver To Sujan - Bangalore 560019</Text>
          </View>
        </View>
  
        <Text style={styles.inStockText}>IN Stock</Text>
  
        <Pressable
          onPress={() => addItemToCart(route?.params?.item)}
          style={styles.addToCartButton}
        >
          {addedToCart ? (
            <Text>Added to Cart</Text>
          ) : (
            <Text>Add to Cart</Text>
          )}
        </Pressable>
  
        <Pressable style={styles.buyNowButton}>
          <Text>Buy Now</Text>
        </Pressable>
      </ScrollView>
    );
  };
  
  export default ProductInfoScreen;
  
  const styles = StyleSheet.create({
    searchContainer: {
      backgroundColor: "#00CED1",
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    searchInput: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 7,
      gap: 10,
      backgroundColor: "white",
      borderRadius: 3,
      height: 38,
      flex: 1,
    },
    searchIcon: {
      paddingLeft: 10,
    },
    imageOverlay: {
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    discountBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#C60C30",
      justifyContent: "center",
      alignItems: "center",
    },
    discountText: {
      color: "white",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 12,
    },
    shareIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#E0E0E0",
      justifyContent: "center",
      alignItems: "center",
    },
    wishIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#E0E0E0",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "auto",
      marginLeft: 20,
      marginBottom: 20,
    },
    productInfo: {
      padding: 10,
    },
    productTitle: {
      fontSize: 15,
      fontWeight: "500",
    },
    productPrice: {
      fontSize: 18,
      fontWeight: "600",
      marginTop: 6,
    },
    separator: {
      height: 1,
      borderColor: "#D0D0D0",
      borderWidth: 1,
    },
    colorSizeContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
    },
    boldText: {
      fontSize: 15,
      fontWeight: "bold",
    },
    totalContainer: {
      padding: 10,
    },
    totalText: {
      fontSize: 15,
      fontWeight: "bold",
      marginVertical: 5,
    },
    freeDeliveryText: {
      color: "#00CED1",
    },
    deliveryLocation: {
      flexDirection: "row",
      marginVertical: 5,
      alignItems: "center",
      gap: 5,
    },
    deliveryText: {
      fontSize: 15,
      fontWeight: "500",
    },
    inStockText: {
      color: "green",
      marginHorizontal: 10,
      fontWeight: "500",
    },
    addToCartButton: {
      backgroundColor: "#FFC72C",
      padding: 10,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 10,
      marginVertical: 10,
    },
    buyNowButton: {
      backgroundColor: "#FFAC1C",
      padding: 10,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 10,
      marginVertical: 10,
    },
  });
  