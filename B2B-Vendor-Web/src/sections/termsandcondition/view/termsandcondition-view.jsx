import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { fetchTermsAndCondition } from 'src/services/termsandconditionApi';
import parse from 'html-react-parser'; // Import HTML parser
import { Box, Card, CardContent } from '@mui/material';

export function TermsAndConditionView() {
    const [termsData, setTermsData] = useState(null); // State to store fetched data
    const [loading, setLoading] = useState(true); // State to handle loading state
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTermsAndCondition();
                setTermsData(data); // Store data in state
            } catch (err) {
                console.error('Error fetching terms and condition data:', err);
                setError('Failed to fetch terms and condition data'); // Set error message
            } finally {
                setLoading(false); // Ensure loading stops
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs once on mount

    if (loading) {
        return (
            <Container sx={{ py: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress /> {/* Loading indicator */}
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 10 }}>
            <Typography variant="h5" gutterBottom>
                Terms and Conditions
            </Typography>

            <Card sx={{ boxShadow: 5, my: 3,  borderRadius: 2, overflow: 'hidden' }}>

                <CardContent>
                    <Box sx={{ p: 3, textAlign: 'justify', lineHeight: 1.8 }}>

                        <div>{parse(termsData.content || '<p>No Content Available</p>')}</div>
                    </Box>
                </CardContent >
            </Card>
        </Container>
    );
}
