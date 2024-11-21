import React, { useCallback, useState } from 'react';
import { Text, View, FlatList, Button, Alert } from 'react-native';
import styles from './VendorShopScreenCss';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchItems } from '../../BackendApis/itemsApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MultiSelect from 'react-native-multiple-select';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { addCart } from '../../BackendApis/cartApi';
import { Feather } from '@expo/vector-icons';
import LogoComponent from '../../components/Logo/LogoComponent';

const VendorShopScreen = () => {

    const navigation = useNavigation();
    const [products, setProducts] = useState([]); // All products
    const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products to display

    const [groups, setGroups] = useState([]);
    const [subGroups1, setSubGroups1] = useState([]);
    const [subGroups2, setSubGroups2] = useState([]);

    const [filteredSubGroups1, setFilteredSubGroups1] = useState([]);
    const [filteredSubGroups2, setFilteredSubGroups2] = useState([]);

    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedSubGroup1, setSelectedSubGroup1] = useState([]);
    const [selectedSubGroup2, setSelectedSubGroup2] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);

    const fetchItemsData = async () => {
        try {
            const data = await fetchItems(); // API call

            // Set products
            setProducts(data.data);
            setFilteredProducts(data.data); // Initially, show all products

            // Extract unique values for dropdowns
            const allGroups = [...new Set(data.data.map(item => item.group))];
            const allSubGroups1 = data.data.map(item => ({
                group: item.group,
                subGroup1: item.subGroup1,
            }));
            const allSubGroups2 = data.data.map(item => ({
                subGroup1: item.subGroup1,
                subGroup2: item.subGroup2,
            }));

            // Set dropdown data
            setGroups(allGroups.map(group => ({ id: group, name: group })));
            setSubGroups1(allSubGroups1);
            setSubGroups2(allSubGroups2);
        } catch (err) {
            console.error('Error fetching items:', err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchItemsData();
        }, [])
    );

    // Filter subGroup1 when group is selected
    const handleGroupChange = selectedGroupIds => {
        setSelectedGroups(selectedGroupIds);

        const filtered = subGroups1
            .filter(sg1 => selectedGroupIds.includes(sg1.group))
            .map(sg1 => ({ id: sg1.subGroup1, name: sg1.subGroup1 }));
        setFilteredSubGroups1(filtered);

        // Reset lower levels
        setSelectedSubGroup1([]);
        setFilteredSubGroups2([]);
        setSelectedSubGroup2([]);
        setSelectedProduct([]);

        // Update product display
        filterProducts(selectedGroupIds, [], []);
    };

    // Filter subGroup2 when subGroup1 is selected
    const handleSubGroup1Change = selectedSubGroup1Ids => {
        setSelectedSubGroup1(selectedSubGroup1Ids);

        const filtered = subGroups2
            .filter(sg2 => selectedSubGroup1Ids.includes(sg2.subGroup1))
            .map(sg2 => ({ id: sg2.subGroup2, name: sg2.subGroup2 }));
        setFilteredSubGroups2(filtered);

        // Reset lower level
        setSelectedSubGroup2([]);
        setSelectedProduct([]);

        // Update product display
        filterProducts(selectedGroups, selectedSubGroup1Ids, []);
    };

    // Handle subGroup2 selection and update product display
    const handleSubGroup2Change = selectedSubGroup2Ids => {
        setSelectedSubGroup2(selectedSubGroup2Ids);
        filterProducts(selectedGroups, selectedSubGroup1, selectedSubGroup2Ids);
    };

    // Filter products based on selections
    const filterProducts = (groups, subGroup1, subGroup2) => {
        let filtered = products;

        if (groups.length > 0) {
            filtered = filtered.filter(product => groups.includes(product.group));
        }
        if (subGroup1.length > 0) {
            filtered = filtered.filter(product => subGroup1.includes(product.subGroup1));
        }
        if (subGroup2.length > 0) {
            filtered = filtered.filter(product => subGroup2.includes(product.subGroup2));
        }

        setFilteredProducts(filtered);
    };

    const productItems = filteredProducts.map(product => ({
        id: product.id, // Use unique ID
        name: product.itemName, // Display product name in the dropdown
    }));

    // Add to Cart Function
    const addToCart = async () => {
        try {
            // Prepare payload
            const payload = {
                items: selectedProduct.map(productId => ({
                    productId,
                    quantity: 100, // Default quantity (can be customized per product)
                })),
            };

            console.log('Payload for Cart:', payload);

            // Call addCart API
            const response = await addCart(payload);
            Alert.alert('Success', 'Products added to cart successfully!');

            navigation.navigate("VendorCart");
            // Clear selected states
            setSelectedGroups([]);
            setSelectedSubGroup1([]);
            setSelectedSubGroup2([]);
            setSelectedProduct([]);

        } catch (error) {
            console.error('Error adding to cart:', error);
            Alert.alert('Error', 'Failed to add products to cart.');
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <LogoComponent />
                <Feather
                    name="shopping-cart"
                    size={24}
                    color="#fff"
                    onPress={() => navigation.navigate('VendorCart')}
                    style={styles.cartIcon}
                />
            </View>

            <FlatList
                style={styles.mainCard}
                ListHeaderComponent={
                    <View>
                        {/* Multi-select dropdown for Groups */}
                        <Text style={styles.label}>Select Groups:</Text>
                        <View style={styles.dropdownContainer}>
                            <MultiSelect
                                items={groups}
                                uniqueKey="id"
                                onSelectedItemsChange={handleGroupChange}
                                selectedItems={selectedGroups}
                                selectText="Pick Groups"
                                searchInputPlaceholderText="Search Groups..."
                                tagRemoveIconColor="#ff0000"
                                tagBorderColor="#ccc"
                                tagTextColor="#333"
                                selectedItemTextColor="#007ACC"
                                selectedItemIconColor="#007ACC"
                                itemTextColor="#000"
                                displayKey="name"
                                searchInputStyle={{ color: '#000' }}
                                submitButtonColor="#007ACC"
                                submitButtonText="Done"
                                styleDropdownMenuSubsection={styles.dropdown}
                            />
                        </View>

                        {/* Multi-select dropdown for SubGroup1 */}
                        <Text style={styles.label}>Select SubGroup1:</Text>
                        <View style={styles.dropdownContainer}>
                            <MultiSelect
                                items={filteredSubGroups1}
                                uniqueKey="id"
                                onSelectedItemsChange={handleSubGroup1Change}
                                selectedItems={selectedSubGroup1}
                                selectText="Pick SubGroup1"
                                searchInputPlaceholderText="Search SubGroup1..."
                                tagRemoveIconColor="#ff0000"
                                tagBorderColor="#ccc"
                                tagTextColor="#333"
                                selectedItemTextColor="#007ACC"
                                selectedItemIconColor="#007ACC"
                                itemTextColor="#000"
                                displayKey="name"
                                searchInputStyle={{ color: '#000' }}
                                submitButtonColor="#007ACC"
                                submitButtonText="Done"
                                styleDropdownMenuSubsection={styles.dropdown}
                            />
                        </View>

                        {/* Multi-select dropdown for SubGroup2 */}
                        <Text style={styles.label}>Select SubGroup2:</Text>
                        <View style={styles.dropdownContainer}>
                            <MultiSelect
                                items={filteredSubGroups2}
                                uniqueKey="id"
                                onSelectedItemsChange={handleSubGroup2Change}
                                selectedItems={selectedSubGroup2}
                                selectText="Pick SubGroup2"
                                searchInputPlaceholderText="Search SubGroup2..."
                                tagRemoveIconColor="#ff0000"
                                tagBorderColor="#ccc"
                                tagTextColor="#333"
                                selectedItemTextColor="#007ACC"
                                selectedItemIconColor="#007ACC"
                                itemTextColor="#000"
                                displayKey="name"
                                searchInputStyle={{ color: '#000' }}
                                submitButtonColor="#007ACC"
                                submitButtonText="Done"
                                styleDropdownMenuSubsection={styles.dropdown}
                            />
                        </View>

                        {/* Multi-select dropdown for Products */}
                        <Text style={styles.label}>Select Products:</Text>
                        <View style={styles.dropdownContainer}>
                            <MultiSelect
                                items={productItems}
                                uniqueKey="id"
                                onSelectedItemsChange={selectedItems => {
                                    setSelectedProduct(selectedItems); // Update the selected products
                                    console.log('Selected Products:', selectedItems); // Log selected product IDs
                                }}
                                selectedItems={selectedProduct} // Bind selectedProduct state
                                selectText="Pick Products"
                                searchInputPlaceholderText="Search Products..."
                                tagRemoveIconColor="#ff0000"
                                tagBorderColor="#ccc"
                                tagTextColor="#333"
                                selectedItemTextColor="#007ACC"
                                selectedItemIconColor="#007ACC"
                                itemTextColor="#000"
                                displayKey="name"
                                searchInputStyle={{ color: '#000' }}
                                submitButtonColor="#007ACC"
                                submitButtonText="Done"
                                styleDropdownMenuSubsection={styles.dropdown}
                            />
                        </View>
                    </View>
                }
            />
            <View style={styles.mainCard}>
                <Button
                    title="Add to Cart"
                    onPress={() => {
                        if (selectedProduct.length > 0) {
                            addToCart(); // Call the `addToCart` function if products are selected
                        } else {
                            Alert.alert(
                                "No Products Selected",
                                "Please select at least one product to add to the cart."
                            );
                        }
                    }}
                />
            </View>

        </SafeAreaView>
    );
};

export default VendorShopScreen;
