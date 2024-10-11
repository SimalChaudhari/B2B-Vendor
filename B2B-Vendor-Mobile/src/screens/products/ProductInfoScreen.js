import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign, Feather } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Toast from 'react-native-toast-message';
import { addToCart } from "../../../redux/CartReducer";
import dealsData from '../../assets/Data/deals.json';

const ProductInfoScreen = () => {
  const route = useRoute();
  console.log(route.params.id);


  const deals = dealsData.products;
  const product = deals.find((item) => item.id === route.params.id);
  console.log('====================================');
  console.log(product.colors);
  console.log('====================================');

  // Calculate average rating
  const totalStars = product.ratings.reduce(
    (acc, rating) => acc + parseInt(rating.name[0]) * rating.starCount,
    0
  );
  const totalReviews = product.ratings.reduce(
    (acc, rating) => acc + rating.starCount,
    0
  );
  const averageRating = (totalStars / totalReviews).toFixed(1); // Rounded to 1 decimal

  // Helper function to format the review count
  const formatReviewCount = (count) => {
    if (count >= 1000) {
      return `(${(count / 1000).toFixed(2)}k reviews)`; // Convert to 'x.xxk reviews' format
    }
    return `(${count} reviews)`; // For counts below 1k
  };

  const [selectedSize, setSelectedSize] = useState(null); // State to hold the selected size

  // Sizes array
  // Prepare items for the dropdown
  const sizeItems = product.sizes.map((size) => ({
    label: size,
    value: size,
  }));

  // State to track the selected color
  const [selectedColor, setSelectedColor] = useState('');
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const [addedToCart, setAddedToCart] = useState(false);
  const height = (width * 100) / 100;
  const dispatch = useDispatch();

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));


    // Show a toast notification
    Toast.show({
      text1: `Product added to cart!`,
      position: 'bottom',
      type: 'success', // Can be 'success', 'error', 'info', or 'normal'
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });

    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };

  const cart = useSelector((state) => state.cart.cart);

  return (
    <ScrollView
      style={{ marginTop: 23, flex: 1, backgroundColor: "white" }}
      showsVerticalScrollIndicator={false}
    >


      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {(product.images || []).map((item, index) => (
          <ImageBackground
            style={{ width, height, marginTop: 25, resizeMode: "contain" }}
            source={{ uri: item }}
            key={index}
          >

          </ImageBackground>
        ))}
      </ScrollView>

      <View style={styles.productInfo}>
        {product.available === 0 ? "" : <Text style={styles.productSaleInfo}>{product.saleLabel.content}</Text>}
        <Text
          style={[
            styles.productAvailableInfo,
            {
              color: product.available === 0 ? '#FFAB00' : '#22C55E' // Conditional text color
            },
          ]}
        >
          {product.available === 0 ? 'OUT OF STOCK' : 'IN STOCK'}
        </Text>
        <Text style={styles.productTitle}>{product.name}</Text>

        <View>

          {/* Star visualization for the average rating */}
          <View style={styles.starRowView}>
            <View style={styles.starRow}>
              {[...Array(Math.round(averageRating))].map((_, index) => (
                <AntDesign key={index} name="star" size={22} color="#FFA500" />
              ))}
              {[...Array(5 - Math.round(averageRating))].map((_, index) => (
                <AntDesign key={index} name="star" size={22} color="#d0d0d0" />
              ))}
            </View>
            {/*
              <View>
                <Text style={styles.totalReviewsText}>({totalReviews} total ratings)</Text>
              </View>
            */}
          </View>

        </View>

        <Text style={styles.productPrice}>₹{product.price}</Text>
        <Text style={styles.productsubDescription}>{product.subDescription}</Text>
      </View>

      <Text style={styles.separator} />

      <View style={styles.colorSizeContainer}>
        <Text style={styles.colorText}>Color: </Text>


        <View style={styles.colorDisplay}>
          {product.colors.map((color, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedColor(color)} // Set the selected color
              style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
            >
              {selectedColor === color ? (
                <AntDesign name="checkcircle" size={28} color={color} /> // Selected color
              ) : (
                <FontAwesome name="circle" size={28} color={color} /> // Unselected color
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.colorSizeContainer}>
        <Text style={styles.sizeText}>Size:</Text>

        <Dropdown
          style={styles.DropdownStyle}
          data={sizeItems}
          labelField="label"  // Field to be displayed in dropdown
          valueField="value"   // Field to hold the selected value
          placeholder="Size"
          value={selectedSize}
          onChange={item => {
            setSelectedSize(item.value); // Set the selected size
          }}
          selectedTextStyle={styles.selectedText}
        />
      </View>


      <Text style={styles.separator} />


      <View style={styles.BottomButton}>

        <Pressable
          onPress={() => addItemToCart(route.params.item)}
          style={[
            styles.addToCartButton,
            { backgroundColor: addedToCart ? "#00dd00" : "#FFAB00" } // Dynamic background color
          ]}

        // style={styles.addToCartButton}
        >
          {addedToCart ? (
            <View style={styles.addToCartBox}>
              <FontAwesome6 name="cart-plus" size={24} color="black" />
              <Text style={styles.addToCartText}> Added to Cart</Text>
            </View>
          ) : (

            <View style={styles.addToCartBox}>
              <FontAwesome6 name="cart-plus" size={24} color="black" />
              <Text style={styles.addToCartText}> Add to Cart</Text>
            </View>
          )}
        </Pressable>

        <Pressable style={styles.buyNowButton} onPress={() => navigation.navigate("Cart")}>
          <Text style={styles.byeNowText}>Buy Now</Text>
        </Pressable>
      </View>
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
  productSaleInfo: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    width: "15%",
    color: "#B71D18",
    backgroundColor: "#ff563029",
    fontWeight: "700",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  productAvailableInfo: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "700",
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10,
  },

  starRowView: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
  },
  starRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  totalReviewsText: {
    fontSize: 14,
    color: "#808080",
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10,
    color: "#1C252E",
  },
  productsubDescription: {
    marginTop: 10,
    // marginBottom: 10,
    fontSize: 16,
    color: "#637381",

  },
  separator: {
    borderBottomWidth: 1, // Sets the bottom border width
    borderBottomColor: '#919eab33', // Sets the bottom border color
    borderStyle: 'dashed', // Sets the bottom border style to dashed
  },
  colorSizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  DropdownStyle: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    width: 100,
  },

  selectedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // You can change the color
  },
  selectedText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  colorDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  colorText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
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
    backgroundColor: "#FFAB00",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    width: "45%",
    height: 55,
    gap: 10,
  },
  buyNowButton: {
    backgroundColor: "#1C252E",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    width: "45%",
    height: 55,
  },
  addToCartBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  addToCartText: {
    marginBottom: 2,
    fontSize: 17,
    fontWeight: "700",
  },
  byeNowText: {
    color:"#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  BottomButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
