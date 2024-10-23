import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './VendorHomeScreenCss';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { fetchItems } from '../../BackendApis/itemsApi';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { formatNumber } from '../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedGroupR } from '../../../redux/groupReducer';
import LoadingComponent from '../../components/Loading/LoadingComponent';

const VendorHomeScreen = () => {
    const dispatch = useDispatch();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const [refreshing, setRefreshing] = useState(false);
    const [items, setItems] = useState([]); // Store the fetched items
    const [filteredItems, setFilteredItems] = useState([]); // Items to display based on group filter
    const [group, setGroup] = useState([]);
    const [loading, setLoading] = useState(true); // Show a loading indicator
    const [error, setError] = useState(null); // Handle errors
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4); // Default number of items per page
    const [dropdownValue, setDropdownValue] = useState(4); // Initial dropdown value
    const [selectedGroup, setSelectedGroup] = useState(''); // Store selected group
    const selectedGroupr = useSelector((state) => state.group.selectedGroup);

    const options = [
        // { label: '1 items per page', value: 1 }, // Testing For Short Data
        { label: '4 items per page', value: 4 },
        { label: '10 items per page', value: 10 },
        { label: '20 items per page', value: 20 },
        { label: '30 items per page', value: 30 },
    ];

    // Get items and filter based on the selected group
    const getItems = async () => {
        setLoading(true);
        try {
            const data = await fetchItems(); // API call
            setItems(data); // Set the fetched items

            setFilteredItems(data.data);
            // Filter and set groups based on the group property
            const groups = data.data.map(item => item.group); // Get all groups
            const uniqueGroups = [...new Set(groups)]; // Get unique groups
            setGroup(uniqueGroups); // Set the filtered items to group

            setLoading(false); // Stop loading indicator
            setError(null);
        } catch (err) {
            setError('Failed to fetch items'); // Set error message
            setLoading(false);
        }
    };


    // useEffect to call getItems when the component mounts
    useEffect(() => {
        getItems(); // Call the async function
    }, []); // Only run once when the component mounts

    // Refresh function
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setLoading(true);
        setSelectedGroup(selectedGroupr);
        // Introduce a minimum delay of 5 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        await getItems(); // Call getItems to refresh data
        setRefreshing(false);
        setLoading(false);
    }, []);


    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}><LoadingComponent/></View>;
    }

    if (error) {
        return <View style={{ color: 'red', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}><Text style={{ color: 'red', fontSize: 22 }}>{error}</Text></View>; // Ensure the error is visible
    }

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        const maxVisiblePages = 1; // Show up to 5 pages
        const firstPage = 1;
        const lastPage = totalPages;

        // Determine the range of pages to show
        let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), firstPage);
        let endPage = Math.min(startPage + maxVisiblePages - 1, lastPage);

        // Adjust startPage if endPage is less than maxVisiblePages
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(endPage - maxVisiblePages + 1, firstPage);
        }

        // Render first page if not in the range
        if (startPage > firstPage) {
            pageNumbers.push(
                <TouchableOpacity key={firstPage} onPress={() => setCurrentPage(firstPage)} style={styles.pageNumber}>
                    <Text style={styles.pageText}>{firstPage}</Text>
                </TouchableOpacity>
            );
        }

        // Add ellipsis before the range if needed
        if (startPage > firstPage + 1) {
            pageNumbers.push(<Text key="ellipsis-start"> ... </Text>);
        }

        // Render visible page numbers within the range
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => setCurrentPage(i)}
                    style={[styles.pageNumber, currentPage === i && styles.activePage]}
                >
                    <Text style={[styles.pageText, currentPage === i && styles.activePageText]}>{i}</Text>
                </TouchableOpacity>
            );
        }

        // Add ellipsis after the range if needed
        if (endPage < lastPage - 1) {
            pageNumbers.push(<Text key="ellipsis-end"> ... </Text>);
        }

        // Render last page if not in the range
        if (endPage < lastPage) {
            pageNumbers.push(
                <TouchableOpacity key={lastPage} onPress={() => setCurrentPage(lastPage)} style={styles.pageNumber}>
                    <Text style={styles.pageText}>{lastPage}</Text>
                </TouchableOpacity>
            );
        }

        return pageNumbers;
    };


    const navigation = useNavigation();


    // Handle group filtering
    const filterByGroup = (group) => {
        dispatch(setSelectedGroupR(group));
        setSelectedGroup(selectedGroup);
        const filtered = items.data.filter(item => item.group === group);
        setFilteredItems(filtered);
        setCurrentPage(1); // Reset to the first page
    };

    // Reset filter to show all items
    const resetFilter = () => {
        setSelectedGroup(''); // Reset the selected group to an empty string
        setFilteredItems(items.data); // Reset filtered items to all items
        setCurrentPage(1); // Reset to the first page
    };

    // Function to handle resetting filter and toggling sidebar
    const handleResetAndToggle = (selectedGroup) => {
        if (selectedGroup) {
            filterByGroup(selectedGroup); // Call filterByGroup with the selected group
        } else {
            resetFilter(); // Call resetFilter
        }
        toggleSidebar(); // Call toggleSidebar after handling filtering
    };


    return (
        <ScrollView style={styles.container} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            <View style={styles.VendorContainer}>
                {sidebarVisible && (
                    <View style={styles.sidebar}>
                        <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
                            <Text style={styles.closeButtonLogoText}>Logo</Text>
                            <Text style={styles.closeButtonText}>✖</Text>
                        </TouchableOpacity>
                        <Text style={styles.sidebarText}>Sidebar Menu</Text>
                        
                        <View style={styles.filterContainer}>
                            {group.map((groupName, index) => (
                                <TouchableOpacity key={index} onPress={() => handleResetAndToggle(groupName)}>
                                    <Text style={styles.sidebarItem}>Filter {groupName}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity onPress={() => handleResetAndToggle(null)}>
                                <Text style={styles.sidebarItem}>Reset Filter</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}

                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.sidebarToggle} onPress={toggleSidebar}>
                        <Text style={styles.toggleText}>☰</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search..."
                        placeholderTextColor="#999"
                    />
                </View>

                <Text style={styles.headerText}>Welcome to Vendor Home</Text>

                <View style={styles.heroFilter}>
                    <Pressable style={styles.filterButton} onPress={toggleSidebar}>
                        <Text style={styles.filterText}>Filters</Text>
                        <Ionicons name="filter-sharp" size={24} color="black" />
                    </Pressable>
                    <Pressable style={styles.sortButton}>
                        <Text style={styles.sortByText}>Sort by:</Text>
                        <Text style={styles.sortText}> Featured</Text>
                        <Feather name="chevron-down" size={24} color="black" />
                    </Pressable>
                </View>


                {/* Dropdown to select items per page */}
                <View style={styles.dropdownContainer}>
                    <Dropdown
                        style={styles.DropdownStyle}
                        data={options}
                        labelField="label"
                        valueField="value"
                        placeholder="Select items per page"
                        value={dropdownValue}
                        onChange={item => {
                            setDropdownValue(item.value);
                            setItemsPerPage(item.value); // Update the number of items per page
                            setCurrentPage(1); // Reset to the first page
                        }}
                        selectedTextStyle={styles.selectedText}
                    />
                </View>

                {/* Display current items here (the deals) */}
                <View style={styles.heroTreanding}>
                    {currentItems.map((item) => (
                        <Pressable
                            key={item.id}
                            onPress={() =>
                                navigation.navigate("Info", {
                                    id: item.id
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
                                    source={{ uri: item.productImages[0] }}
                                />
                                <Text style={styles.heroProductTitle} numberOfLines={1}>
                                    {item.itemName}
                                </Text>
                                <View style={styles.heroProductBottom}>
                                    <Text style={{
                                        marginLeft: 10,
                                        color: "#1C252E",
                                        fontSize: 13,
                                        fontWeight: "bold",
                                    }}>₹ {formatNumber(item.sellingPrice)}</Text>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>

                {/* Pagination Controls */}
                <View style={styles.paginationContent}>
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
            </View>
        </ScrollView>
    );
};

export default VendorHomeScreen;
