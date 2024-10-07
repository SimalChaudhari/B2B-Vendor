import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { addToCart } from "../../redux/CartReducer";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

const ProductItem = ({ item }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation(); // Initialize navigation

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }); // Reset the state after 60 seconds
  };

  return (
    <View>
      {/* Navigate to Info screen when pressed */}
      <Pressable
        style={{ marginHorizontal: 20, marginVertical: 25 }}
        onPress={() =>
          navigation.navigate("Info", {
            id: item.id,
            title: item.title,
            price: item.price,
            carouselImages: item.carouselImages,
            color: item.color,
            size: item.size,
            oldPrice: item.oldPrice,
            item: item, // Pass the full item object if needed
          })
        }
      >
        <Image
          style={{ width: 150, height: 150, resizeMode: "contain" }}
          source={{ uri: item?.image }}
        />

        <Text numberOfLines={1} style={{ width: 150, marginTop: 10 }}>
          {item?.title}
        </Text>

        <View
          style={{
            marginTop: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>₹{item?.price}</Text>
          <Text style={{ color: "#FFC72C", fontWeight: "bold" }}>
            {item?.rating?.rate} ratings
          </Text>
        </View>

        <Pressable
          onPress={() => addItemToCart(item)}
          style={{
            backgroundColor: "#FFC72C",
            padding: 10,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          {addedToCart ? (
            <View>
              <Text>Added to Cart</Text>
            </View>
          ) : (
            <Text>Add to Cart</Text>
          )}
        </Pressable>
      </Pressable>
    </View>
  );
};

export default ProductItem;
