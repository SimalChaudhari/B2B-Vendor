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
    heroContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    headerContainer: {
        backgroundColor: colors.background,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: colors.darkGray,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    headerText: {
        fontSize: 24,
        color: colors.white,
        fontWeight: 'bold',
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    termsText: {
        fontSize: 16,
        color: colors.textColor,
        lineHeight: 24,
        textAlign: 'justify',
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: colors.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingIndicator: {
        marginTop: 30,
    },
});

export default styles;
