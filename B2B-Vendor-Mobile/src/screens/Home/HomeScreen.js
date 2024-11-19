import { Image, View, TouchableOpacity, Text, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useCallback } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import styles from './HomeScreenCss'; // Ensure this is correctly imported
import { useFocusEffect } from '@react-navigation/native';
import { fetchItems } from '../../BackendApis/itemsApi'; // Make sure this API function is defined
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { resetSelectedGroup, setSelectedGroupR } from '../../../redux/groupReducer';
import LoadingComponent from '../../components/Loading/LoadingComponent';
import ErrorComponent from '../../components/Error/ErrorComponent';
import LogoComponent from '../../components/Logo/LogoComponent';
import { fetchBanner } from '../../BackendApis/bannerApi';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const selectedGroup = useSelector(state => state.group.selectedGroup); // Get selected group from Redux state

  // State hooks
  const [items, setItems] = useState([]); // For storing fetched items
  const [group, setGroup] = useState([]); // For storing unique groups
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error messages
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh functionality
  const [currentIndex, setCurrentIndex] = useState(0); // For carousel index
  const [bannerData, setBannerData] = useState([]);

  const images = [
    require('../../assets/images/Banner_1.png'),
    require('../../assets/images/Banner_2.png'),
    require('../../assets/images/Banner_3.png'),
    require('../../assets/images/Banner_4.jpg'),
  ];

  // Function to fetch items
  const getItems = async () => {
    dispatch(resetSelectedGroup(''));
    setLoading(true);
    try {
      const data = await fetchItems();
      const bannerData = await fetchBanner();
      setBannerData(bannerData);
      setItems(data);

      // Extract unique groups with images
      const groupsWithImages = data.data.map(item => ({
        group: item.group,
        id: item.id,
        firstImage: item.productImages && item.productImages.length > 0 ? item.productImages[0] : null,
      }));

      // Filter for unique groups
      const uniqueGroups = groupsWithImages.reduce((accumulator, current) => {
        const x = accumulator.find(item => item.group === current.group);
        if (!x) {
          accumulator.push(current);
        }
        return accumulator;
      }, []);

      setGroup(uniqueGroups);
      setError(null); // Reset error
    } catch (err) {
      setError('Failed to fetch items'); // Set error message
    } finally {
      setLoading(false); // Always set loading to false
    }
  };

  // useFocusEffect to fetch items when screen is focused
  useFocusEffect(
    useCallback(() => {
      getItems(); // Fetch items when the screen is focused
    }, [])
  );

  // Function for pull-to-refresh functionality
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getItems(); // Fetch items again
    setRefreshing(false);
  }, []);

  const displayProducts = items?.data?.slice(0, 6) || []; // Fallback for products

  // Function to handle category press
  const handleCategoryPress = async (item) => {
    await dispatch(setSelectedGroupR(item.group)); // Set the selected group
    if (selectedGroup !== item.group) {
      navigation.navigate('Shop'); // Redirect to Shop screen
    }
  };

  return (
    <SafeAreaView style={styles.heroContainer}>
      {loading ? (
        <LoadingComponent /> // Show loading component
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={styles.LogoContainer}>
            <LogoComponent />
          </View>

          <Text style={styles.Verticalline} />

          <View>
            {bannerData.length > 0 ? (
              <Carousel
                loop
                width={400}
                height={200}
                autoPlay={true}
                data={bannerData}
                onSnapToItem={(index) => setCurrentIndex(index)}
                renderItem={({ item }) => (
                  <View style={styles.slide}>
                    <Image
                      source={{ uri: item.BannerImages[0] }} // Use dynamic URL from bannerData
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                )}
                scrollAnimationDuration={3000}
              />
            ) : (
              <ActivityIndicator size="large" color="#fe0002" />
            )}

            <View style={styles.dotsContainer}>
              {bannerData.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dot, currentIndex === index ? styles.activeDot : null]}
                />
              ))}
            </View>
          </View>


          <Text style={styles.Verticalline} />
          <Text style={styles.productText}>Product Categories</Text>

          {group.length > 0 ? (
            <View style={styles.categoryListBoxContainer}>
              {group.slice(0, 6).map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.categoryContainer}
                  onPress={() => handleCategoryPress(item)}
                >
                  {item.firstImage && (
                    <Image
                      source={{ uri: item.firstImage }}
                      style={styles.categoryImage}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={styles.categoryText}>{item.group}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <ErrorComponent errorMessage={error} onRetry={getItems} />
          )}

          <Text style={styles.Verticalline} />

          <View style={styles.productListTextContainer}>
            <View>
              <Text style={styles.productText}>Latest Products</Text>
            </View>

            <View style={styles.productTextAndIcon}>
              <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
              <MaterialIcons name="keyboard-double-arrow-right" size={25} color="#fe0002" />
            </View>
          </View>

          {displayProducts.length > 0 ? (
            <View style={styles.productListContainer}>
              {displayProducts.map((item) => (
                <View key={item.id.toString()} style={styles.productColumn}>
                  <TouchableOpacity
                    style={styles.productContainer}
                    onPress={() => navigation.navigate("Info", { id: item.id })}
                  >
                    {item.productImages && item.productImages.length > 0 && (
                      <Image source={{ uri: item.productImages[0] }} style={styles.productImage} resizeMode="contain" />
                    )}
                    <Text style={styles.productName}>{item.itemName}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <ErrorComponent errorMessage={error} onRetry={getItems} />
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
