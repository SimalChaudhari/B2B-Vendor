import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsFailure, fetchProductsStart, fetchProductsSuccess } from 'src/redux/ProductReducer';
import { fetchItems } from 'src/services/productApi'; // Ensure this file is correct
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CircularProgress,
    Box,
} from '@mui/material';
import { AiOutlineWarning } from 'react-icons/ai';

export function HomeProductGroup() {
    const dispatch = useDispatch();
    const { items: products = [], loading: productsLoading } = useSelector((state) => state.product);

    useEffect(() => {
        const getProducts = async () => {
            dispatch(fetchProductsStart());

            try {
                const data = await fetchItems();
                dispatch(fetchProductsSuccess(data.data));
            } catch (error) {
                dispatch(fetchProductsFailure(error.message));
            }
        };

        getProducts();
    }, [dispatch]);

    if (productsLoading) {
        return <LoadingScreen />;
    }

    if (!Array.isArray(products) || products.length === 0) {
        return (
            <Container className='containerCss' style={{ textAlign: 'center', marginTop: '50px' }}>
                <Box
                    sx={{
                        backgroundColor: 'rgba(255, 0, 0, 0.1)', // Light red background
                        borderRadius: '8px',
                        padding: '30px', // Increased padding for a spacious feel
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Enhanced shadow for depth
                        transition: 'transform 0.3s ease', // Smooth transition effect
                        '&:hover': {
                            transform: 'scale(1.02)', // Scale effect on hover
                        },
                    }}
                >
                    <AiOutlineWarning style={{ fontSize: '48px', color: '#f44336' }} /> {/* Icon with color */}
                    <Typography variant="h5" color="textPrimary" style={{ fontWeight: 'bold', marginTop: '15px' }}>
                        No products found.
                    </Typography>
                    <Typography variant="body1" color="textSecondary" style={{ marginTop: '10px' }}>
                        Please try again later.
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Filter to get unique groups
    const uniqueGroups = Array.from(new Set(products.map(product => product.group))).map(group =>
        products.find(product => product.group === group)
    );

    const displayedProducts = uniqueGroups.slice(0, 6);

    return (
        <Container className='containerCss'>
            <Typography className='text-black mb-2 mt-2' variant="h4" component="h1" gutterBottom>
                Home Product Category
            </Typography>
            <Grid container spacing={2}>
                {displayedProducts.map((product) => (
                    <Grid item xs={6} sm={4} md={2} key={product.id}>

                        <Card className='productCard'>
                            <Typography variant="h6" className='productTitle'>
                                {product.group}
                            </Typography>
                            {product.productImages && product.productImages.length > 0 && (
                                <CardMedia
                                    component="img"
                                    image={product.productImages[0]}
                                    alt={product.itemName}
                                    className='productImage' // Added class for styling
                                />
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

const LoadingScreen = () => (
    <div className='loadingScreen' style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
        <p>Loading products...</p>
    </div>
);
