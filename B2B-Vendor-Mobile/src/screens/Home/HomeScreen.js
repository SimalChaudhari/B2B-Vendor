import { Text, View, FlatList, Image, TouchableOpacity, ScrollView, Pressable, TextInput, Alert, Button } from 'react-native';
// import React from 'react';
import React, { useState, useEffect, useCallback } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import styles from '../../assets/cssFile';
import Swiper from 'react-native-swiper';
import productsData from '../../assets/Data/products.json';
import dealsData from '../../assets/Data/deals.json';
import ProductItem from '../../components/ProductItem';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import Feather from '@expo/vector-icons/Feather';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SliderBox } from 'react-native-image-slider-box';

const ITEMS_PER_PAGE = 4; // Number of items to display per page

const HomeScreen = () => {

  const user = useSelector((state) => state.auth.user);

  const deals = dealsData.products;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(deals.length / ITEMS_PER_PAGE);

  const currentItems = deals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <TouchableOpacity
          key={i}
          onPress={() => setCurrentPage(i)}
          style={[
            styles.pageNumber,
            currentPage === i && styles.activePage,
          ]}
        >
          <Text style={[styles.pageText, currentPage === i && styles.activePageText]}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return pageNumbers;
  };

  const list = [
    {
      id: "0",
      image: "https://m.media-amazon.com/images/I/41EcYoIZhIL._AC_SY400_.jpg",
      name: "Home",
    },
    {
      id: "1",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg",
      name: "Deals",
    },
    {
      id: "3",
      image:
        "https://images-eu.ssl-images-amazon.com/images/I/31dXEvtxidL._AC_SX368_.jpg",
      name: "Electronics",
    },
    {
      id: "4",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg",
      name: "Mobiles",
    },
    {
      id: "5",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/music.jpg",
      name: "Music",
    },
    {
      id: "6",
      image: "https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg",
      name: "Fashion",
    },
  ];

  const images = [
    "https://img.etimg.com/thumb/msid-93051525,width-1070,height-580,imgsize-2243475,overlay-economictimes/photo.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/PD23/Launches/Updated_ingress1242x550_3.gif",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Books/BB/JULY/1242x550_Header-BB-Jul23.jpg",
  ];


  const offers = [
    {
      id: "0",
      title:
        "Oppo Enco Air3 Pro True Wireless in Ear Earbuds with Industry First Composite Bamboo Fiber, 49dB ANC, 30H Playtime, 47ms Ultra Low Latency,Fast Charge,BT 5.3 (Green)",
      offer: "72% off",
      oldPrice: 7500,
      price: 4500,
      image:
        "https://m.media-amazon.com/images/I/61a2y1FCAJL._AC_UL640_FMwebp_QL65_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71LhLZGHrlL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61Rgefy4ndL._SX679_.jpg",
      ],
      color: "Green",
      size: "Normal",
    },
    {
      id: "1",
      title:
        "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
      offer: "40%",
      oldPrice: 7955,
      price: 3495,
      image: "https://m.media-amazon.com/images/I/41mQKmbkVWL._AC_SY400_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/71h2K2OQSIL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71BlkyWYupL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71c1tSIZxhL._SX679_.jpg",
      ],
      color: "black",
      size: "Normal",
    },
    {
      id: "2",
      title: "Aishwariya System On Ear Wireless On Ear Bluetooth Headphones",
      offer: "40%",
      oldPrice: 7955,
      price: 3495,
      image: "https://m.media-amazon.com/images/I/41t7Wa+kxPL._AC_SY400_.jpg",
      carouselImages: ["https://m.media-amazon.com/images/I/41t7Wa+kxPL.jpg"],
      color: "black",
      size: "Normal",
    },
    {
      id: "3",
      title:
        "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
      offer: "40%",
      oldPrice: 24999,
      price: 19999,
      image: "https://m.media-amazon.com/images/I/71k3gOik46L._AC_SY400_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg",
        "https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71wSGO0CwQL._SX679_.jpg",
      ],
      color: "Norway Blue",
      size: "8GB RAM, 128GB Storage",
    },
  ];


  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("jewelery");

  const [selectedAddress, setSelectedAdress] = useState("");
  console.log(selectedAddress)

  const [items, setItems] = useState([
    { label: "Men's clothing", value: "men's clothing" },
    { label: "jewelery", value: "jewelery" },
    { label: "electronics", value: "electronics" },
    { label: "women's clothing", value: "women's clothing" },
  ]);
  const onGenderOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);

  useEffect(() => {
    if (productsData && productsData.length) {
      setProducts(productsData); // Set products data
    }
  }, []);


  const cart = useSelector((state) => state.cart.cart);

  // Function to clear AsyncStorage
  // const clearAsyncStorage = async () => {
  //   try {
  //     await AsyncStorage.clear(); // Clear all keys and values
  //     Alert.alert("Success", "AsyncStorage cleared successfully."); // Success message
  //     console.log("AsyncStorage cleared successfully.");
  //   } catch (error) {
  //     console.error("Failed to clear AsyncStorage:", error);
  //   }
  // };

  return (
    <>
      <SafeAreaView style={styles.heroContainer}>
        <ScrollView >

          {/*
            <View style={styles.heroTopView}>
              <Pressable style={styles.heroPressable}>
                <Fontisto name="search" size={16} color="black" style={styles.heroSearchIcon} />
                <TextInput placeholder='Search...' />
              </Pressable>
              <MaterialIcons name="mic-none" size={24} color="black" />
            </View>
          */}
          <ScrollView >
            <Text style={styles.heroTopShop}>Shop</Text>
            <View style={styles.heroTopSearch}>
              <Pressable style={styles.heroPressable}>
                <Feather name="search" size={24} color="#ccc" />
                <TextInput
                  placeholder='Search...'
                  style={styles.searchInput}
                  placeholderTextColor="#aaa" // Adjust placeholder color
                />
              </Pressable>
            </View>

            <View style={styles.heroFilter}>
              <Pressable style={styles.filterButton}>
                <Text style={styles.filterText}>Filters</Text>
                <Ionicons name="filter-sharp" size={24} color="black" />
              </Pressable>
              <Pressable style={styles.sortButton}>
                <Text style={styles.sortByText}>Sort by:</Text>
                <Text style={styles.sortText}> Featured</Text>
                <Feather name="chevron-down" size={24} color="black" />
              </Pressable>
            </View>
          </ScrollView>

          <View>
          </View>

          {/*
            <Pressable
           onPress={clearAsyncStorage} // Clear AsyncStorage when pressed
           style={{ marginTop: 15 }}
         >
           <Text style={{ textAlign: "center", color: "red", fontSize: 16 }}>
             Clear AsyncStorage
           </Text>
         </Pressable>  
          */}
          {/* Category */}
          {/*
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.heroTopNavBar}>
              {list.map((item) => (
                <Pressable
                  key={item.id}
                  style={{ margin: 10, justifyContent: "center", alignItems: "center" }}
                >
                  <Image
                    style={{ width: 50, height: 50, resizeMode: "contain" }}
                    source={{ uri: item.image }}
                  />
                  <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "500", marginTop: 5 }}>
                    {item.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
             */}

          {/* Image Slider */}
          {/*
            <View>
              <Swiper
                style={{ height: 250 }}
                autoplay
                autoplayTimeout={3}
                showsButtons={true}
              >
                {images.map((image, index) => (
                  <View key={index}>
                    <Image source={{ uri: image }} style={{ width: '100%', height: 200 }} />
                  </View>
                ))}
              </Swiper>
            </View>
          */}

          {/* Trending Deals */}
          {/*
            <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
              Trending Deals of the Week
            </Text>
             */}

          <View>
            {/* Display current items here (the deals) */}
            <View style={styles.heroTreanding}>
              {currentItems.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    navigation.navigate("Info", {
                      id: item.id,
                      title: item.title,
                      price: item.price,
                      carouselImages: item.carouselImages,
                      color: item.colors,
                      oldPrice: item.oldPrice,
                      item: item,
                    })
                  }
                  style={{
                    marginVertical: 10,
                    width: '47%',
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <View style={styles.heroProductView}>
                    <Image
                      style={styles.heroTopImage}
                      source={{ uri: item.coverUrl }}
                    />
                    <Text style={styles.heroProductTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.heroProductBottom}>
                      {/* Render color circles */}
                      <View style={styles.heroProductBottom}>
                        {item.colors.slice(0, 3).map((color, index) => (
                          <View key={index} style={[styles.heroProductColor, { backgroundColor: color }]} />
                        ))}
                        {item.colors.length > 3 && (
                          <Text style={{ marginLeft: 5 }}>+{item.colors.length - 3}</Text>
                        )}
                      </View>
                      <Text style={{ marginLeft: 10 }}>₹{item.price}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Pagination Controls */}
            <View style={styles.paginationControls}>
              <TouchableOpacity onPress={goToPreviousPage} disabled={currentPage === 1}>
                <Text style={styles.paginationArrow}><AntDesign name="left" size={18} color="black" /></Text>
              </TouchableOpacity>

              {renderPageNumbers()}

              <TouchableOpacity onPress={goToNextPage} disabled={currentPage === totalPages}>
                <Text style={styles.paginationArrow}><AntDesign name="right" size={18} color="black" /></Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />

          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
            Today's Deals
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 10 }}>
            {offers.map((item, index) => (
              <Pressable
                key={`${item.id}-${index}`} // Ensure uniqueness by combining id with index
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    carouselImages: item.carouselImages,
                    color: item.color,
                    size: item.size,
                    oldPrice: item.oldPrice,
                    item: item,
                  })
                }
                style={{
                  margin: 10,
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: 150, height: 150, resizeMode: "contain" }}
                  source={{ uri: item.image }}
                />

                <View
                  style={{
                    backgroundColor: "#E31837",
                    paddingVertical: 5,
                    width: 130,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  >
                    Upto {item.offer}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />

          <View
            style={{
              marginHorizontal: 10,
              marginTop: 20,
              width: "45%",
              marginBottom: open ? 50 : 15,
            }}
          >
            <DropDownPicker
              style={{
                borderColor: "#B7B7B7",
                height: 30,
                marginBottom: open ? 120 : 15,
              }}
              open={open}
              value={category} //genderValue
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              placeholder="choose category"
              placeholderStyle={styles.placeholderStyles}
              onOpen={onGenderOpen}
              // onChangeValue={onChange}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          <View style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
          }}>
            {products?.filter((item) => item?.category === category)?.map((item, index) => {
              return (<ProductItem item={item} key={index} />);
            })}
          </View>

          */}



        </ScrollView>
      </SafeAreaView>

    </>
  );
};

export default HomeScreen;
