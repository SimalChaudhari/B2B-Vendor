import { StyleSheet } from 'react-native';

// Color Constants
const colors = {
    background: '#fe0002',
    activeDoteColor: "#ec293362",
    textColor: "#1C252E",
    logoColor: '#007ACC',
    buttonColor: '#ff9900',
    linkColor: '#007185',
    white: '#FFFFFF',
    lightGray: '#EAEAEA',
    darkGray: '#333',
    bgBlue: '#00CED1',
    purple: '#7F00FF',
};

const styles = StyleSheet.create({

    loadingContainer: {
        flex: 1, // Fills the entire screen
        justifyContent: 'center', // Centers vertically
        alignItems: 'center', // Centers horizontally
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },

    loadingOverlay: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white, // White background for the loader
        borderRadius: 10, // Rounded corners
        padding: 20, // Padding around the loader
        shadowColor: colors.textColor, // Shadow for elevation effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // Elevation for Android
    },

    loadingText: {
        marginTop: 10, // Space between loader and text
        fontSize: 18, // Text size
        color: colors.background, // Loader text color
    },

    errorContainer: {
        backgroundColor: '#ffe6e6', // Light red background
        borderColor: '#fe0002', // Red border
        borderWidth: 1, // Border width
        borderRadius: 8, // Rounded corners
        padding: 15, // Padding around the text
        margin: 20, // Margin around the error message
        flexDirection: 'row', // Align items in a row
        alignItems: 'center', // Center items vertically
    },

    errorText: {
        flex: 1, // Take available space
        fontSize: 16, // Font size for error message
        color: '#fe0002', // Red color for the text
        marginLeft: 10, // Space between icon and text
    },

    dismissButton: {
        backgroundColor: '#fe0002', // Red background for the button
        borderRadius: 5, // Rounded corners
        padding: 5, // Padding inside the button
        marginLeft: 10, // Space between text and button
    },

    dismissButtonText: {
        color: '#fff', // White text color for the button
        fontSize: 14, // Font size for button text
        fontWeight: 'bold', // Bold text for emphasis
    },


    heroContainer: {
        flex: 1,
        // padding: 10,
        backgroundColor: colors.white,
        marginTop: 5,
    },
    Main_Logo_image: {
        width: 150,
        height: 50,
        // alignSelf: 'center',
    },
    LogoContainer: {
        backgroundColor: colors.background,
        padding: 10,
    },

    Verticalline: {
        height: 1,
        borderColor: colors.white,
        borderWidth: 2,
        // marginVertical: 5,
    },


    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
    },

    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        // marginTop: 180, // Adjust as needed for spacing
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 5,
        backgroundColor: colors.activeDoteColor, // Inactive dot color
        margin: 5,
        display: "none",
    },
    activeDot: {
        backgroundColor: colors.background, // Active dot color
    },

    categoryListBoxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow wrapping to create a grid effect
        justifyContent: 'space-between', // Adjust space between items
        marginBottom: 10, // Space below each row
        marginHorizontal: 12,
    },

    categoryContainer: {
        width: '31%', // Set width to approximately one-third of the container
        marginBottom: 10, // Space between rows
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.background,
        borderWidth: 1,
    },


    productListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow wrapping to create a grid effect
        justifyContent: 'space-between', // Adjust space between items
        marginBottom: 10, // Space below each row
    },

    productColumn: {
        width: '50%', // Each product will take up nearly half the width (2 per row)
        // marginBottom: 1, // Space between rows
    },

    productText: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textColor,
        marginHorizontal: 16,
        marginVertical: 10,

    },
    row: {
        justifyContent: 'space-between', // Ensure spacing between columns
        paddingHorizontal: 10, // Optional: Add horizontal padding
    },

    productContainer: {
        flex: 1 / 2, // Half width for two products in a row
        margin: 7,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        borderColor: '#ddd',
        borderWidth: 1,
    },

    categoryImage: {
        width: '100%', // Make image responsive
        height: 80,
        borderRadius: 10,
        marginBottom: 5,
    },

    productImage: {
        width: '100%', // Make image responsive
        height: 120,
        borderRadius: 10,
        marginBottom: 5,
    },

    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fe0002',
        marginTop: 5,
    },

    // Additional styles for a better layout
    productText: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textColor,
        marginHorizontal: 16,
        marginVertical: 10,
    },

    productListTextContainer: {
        flexDirection: "row", // Arrange items in a row
        alignItems: "center", // Center items vertically
        justifyContent: "space-between", // Space items evenly to left and right
        paddingHorizontal: 2,
    },

    productTextAndIcon: {
        flexDirection: "row", // Arrange items in a row
        alignItems: "center", // Center items vertically
        borderBottomWidth: 2,
        borderBottomColor: colors.background,
        borderRadius: 5,
    },
    viewAllText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.background,

    },

    categoryText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textColor,
    },
    productName: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textColor,
    },
    productDescription: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textColor,
    },

});

export default styles;
