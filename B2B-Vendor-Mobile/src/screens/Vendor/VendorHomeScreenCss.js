import { StyleSheet } from 'react-native';

// Color Constants
const colors = {
    // background: '#eb282d',
    background: '#fe0002',
    // background: '#f3f3f3',
    logoColor: '#007ACC',
    buttonColor: '#ff9900',
    linkColor: '#007185',
    white: '#FFFFFF',
    lightGray: '#EAEAEA',
    darkGray: '#1C252E',
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.background,
        backgroundColor: colors.white,
        marginTop: 30,
    },
    VendorContainer: {
        marginTop: 20,
        // padding: 20,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: "100%",
        height: '100%',
        backgroundColor: colors.background,
        padding: 20,
        elevation: 4,
        zIndex: 10,
    },
    sidebarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 20,
    },
    sidebarItem: {
        fontSize: 16,
        color: colors.white,
        marginVertical: 10,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 5,
        // backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slightly shaded background
        fontWeight: 'bold',
        borderBottomColor: colors.white,
        borderBottomWidth: 2,
    },
    closeButton: {
        // alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        // padding: 10,
        marginBottom: 30,
    },
    closeButtonLogoText: {
        fontSize: 28,
        color: colors.white,
        fontWeight:"700",
    },
    closeButtonText: {
        fontSize: 20,
        color: colors.white,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    sidebarToggle: {
        marginRight: 10,
        padding: 10,
        // backgroundColor: colors.logoColor,
        borderRadius: 5,
    },
    toggleText: {
        fontSize: 24,
        color: colors.white,
        color: "#000",
    },
    searchBar: {
        borderWidth: 1,
        borderColor: colors.darkGray,
        borderRadius: 5,
        padding: 10,
        width: '80%',
        backgroundColor: colors.white,
        elevation: 1,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.darkGray,
        // marginBottom: 10,
        marginLeft:10,
    },

    // Start Filter

    heroFilter: {
        marginTop: 20,
        marginBottom: 20,
        // marginRight: 10,
        flexDirection: 'row',
        // justifyContent: 'flex-end', // Align items to the right
        justifyContent: 'space-between', // Align items to the right
        alignItems: 'center', // Center vertically
        // paddingHorizontal: 3,
        marginLeft: 3,
        gap: 10,
    },


    filterButton: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    sortButton: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    filterText: {
        fontSize: 18,
        color: '#000', // Adjust color for filters
        fontWeight: 'bold',
    },
    sortText: {
        fontSize: 18,
        color: '#000', // Adjust color for sort options
        fontWeight: 'bold',
    },
    sortByText: {

        fontSize: 18,
        color: '#000', // Adjust color for sort options
        fontWeight: 'medium',
    },

    // End Filter

    // Start Dropdown

    dropdownContainer: {
        width: 100,
        marginLeft: 173,
    },
    DropdownStyle: {
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        borderColor: '#EAECEE',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 12,
        width: 200,
    },
    selectedText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black', // You can change the color
    },

    // End Dropdown


    heroTreanding: {
        flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 10, backgroundColor: colors.background,
    },

    heroProductView: {
        backgroundColor: '#fff',
        // height:280,
    },
    // Add Addresses Screen StyleSheet
    heroProductBottom: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 6,
        marginBottom: 10,
         marginTop: 5,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    heroProductTitle: {
        marginLeft: 14,
        marginTop: 5,
        color:"#1C252E",
        fontSize: 13,
        fontWeight: "bold",
    },

    heroProductColor: {
        height: 12,
        width: 12,
        borderRadius: 7, // This will create a circle
    },
    paginationContent:{
        width:"100%"
    },
    paginationControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    pageNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        // backgroundColor: '#f0f0f0', // Light background for page numbers
    },
    activePage: {
        backgroundColor: '#1C252E', // Dark background for active page
    },
    activePageText: {
        color: "#fff", // Set text color for active page number
        fontSize: 15,
        fontWeight: "bold",
    },
    pageText: {
        fontSize: 16,
        fontWeight: "bold",
        color: '#1C252E', // Text color for page numbers
    },
    paginationArrow: {
        fontSize: 20,
        marginHorizontal: 10,
        color: '#1C252E', // Color for arrows
    },

    heroTopImage: {
        width: '90%',
        height: 175,
        // resizeMode: "contain",
        marginLeft: 8,
        marginTop: 8,

        borderWidth: 5,
        // borderColor: "#fff",
        borderRadius: 12,
        padding: 10,

    },


});

export default styles;
