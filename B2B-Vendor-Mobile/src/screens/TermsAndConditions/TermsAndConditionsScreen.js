import React, { useCallback, useState } from 'react';
import { Text, View, ScrollView, RefreshControl, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RenderHTML from 'react-native-render-html'; // Import RenderHTML
import { useFocusEffect } from '@react-navigation/native';
import styles from './TermsAndConditionsScreenCss';
import { fetchTermsAndConditions } from '../../BackendApis/termsAndConditionsApi';
import LoadingComponent from '../../components/Loading/LoadingComponent';

const TermsAndConditionsScreen = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [termsAndConditionData, setTermsAndConditionData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const { width } = useWindowDimensions(); // Get screen width for HTML rendering

    // Function to fetch terms and conditions
    const getTermsAndConditions = async () => {
        setLoading(true);
        try {
            const data = await fetchTermsAndConditions(); // Ensure this API returns data in the expected format
            setTermsAndConditionData(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch Terms and Conditions');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when the screen is focused
    useFocusEffect(
        useCallback(() => {
            getTermsAndConditions();
        }, [])
    );

    // Pull-to-refresh functionality
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await getTermsAndConditions();
        setRefreshing(false);
    }, []);

    return (
        <SafeAreaView style={styles.heroContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Terms and Conditions</Text>
            </View>

            {loading ? (
                <LoadingComponent/>
                // <ActivityIndicator size="large" color="#fe0002" style={styles.loadingIndicator} />
            ) : (
                <ScrollView
                    contentContainerStyle={styles.container}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : termsAndConditionData ? (
                        <RenderHTML
                            contentWidth={width}
                            source={{ html: termsAndConditionData.content || '<p>No Content Available</p>' }}
                        />
                    ) : (
                        <Text style={styles.termsText}>No Content Available</Text>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default TermsAndConditionsScreen;
