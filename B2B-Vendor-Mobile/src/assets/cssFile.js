// styles.js
import { StyleSheet } from 'react-native';

// Color Constants
const colors = {
    background: '#f3f3f3',
    logoColor: '#007ACC',
    buttonColor: '#ff9900',
    linkColor: '#007185',
    white: '#FFFFFF',
    lightGray: '#EAEAEA',
    darkGray: '#333',
    bgBlue: '#00CED1',
};

const styles = StyleSheet.create({
    // General styles
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        background: colors.white,
    },
    logo: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        width: '100%',
    },
    input: {
        height: 50,
        paddingHorizontal: 10,
        flex: 1,
    },
    button: {
        backgroundColor: colors.buttonColor,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    link: {
        color: colors.linkColor,
        textAlign: 'center',
        marginBottom: 10,
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signInText: {
        marginRight: 5,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signUpText: {
        marginRight: 5,
    },
    inputIcon: {
        marginLeft: 10,
    },

    // Home styles

    heroContainer: {
        flex: 1,
        backgroundColor: colors.background,
        // paddingTop: 20,
        backgroundColor: colors.white,
    },
    heroLogo: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: colors.white, // White background
        elevation: 3, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderRadius: 10,
    },
    headerLogo: {
        fontSize: 28, // Slightly larger logo
        fontWeight: 'bold',
        color: colors.logoColor, // Amazon-like blue color
    },
    heroTopView: { backgroundColor: colors.bgBlue, padding: 10, flexDirection: 'row', alignItems: "center" },
    heroPressable: {
        flexDirection: "row", alignItems: "center", marginHorizontal: 7, gap: 10, backgroundColor: colors.white, borderRadius: 3, height: 30, flex: 1,
    },
    heroSearchIcon: { paddingLeft: 10 },
    heroTopNavBar: { backgroundColor: colors.white },
    icon: {
        padding: 10,
    },
    categoryList: {
        paddingVertical: 10,
    },
    category: {
        alignItems: 'center',
        marginHorizontal: 5, // Decreased margin for better alignment
        backgroundColor: colors.white, // White background for categories
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        padding: 10, // Added padding for better touch area
        height: 120, // Set fixed height for the category box
        width: 100, // Set a fixed width for category items
    },
    categoryImage: {
        width: 80, // Adjust image size
        height: 80, // Adjust image size
        borderRadius: 10,
        marginBottom: 5,
    },
    categoryTitle: {
        marginTop: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        color: colors.darkGray,
        fontSize: 10, // Slightly smaller font size for better fit
    },
    featuredSection: {
        marginTop: 20,
        padding: 10,
        backgroundColor: colors.white, // White background for featured section
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    featuredTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.logoColor, // Consistent color with the logo
    },

    heroTreanding: {
        flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 10, backgroundColor: colors.white,
    }
});

export default styles;
