import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchProductsFailure, fetchProductsStart, fetchProductsSuccess } from 'src/redux/ProductReducer';
import { fetchItems } from 'src/services/productApi'; 
import {
    Container,
    Grid,
    CardMedia,
    Typography,
    CircularProgress,
    Box,
    Divider,
} from '@mui/material';
import { AiOutlineWarning } from 'react-icons/ai';

export function HomeProductGroup() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate
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
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        borderRadius: '8px',
                        padding: '30px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.02)',
                        },
                    }}
                >
                    <AiOutlineWarning style={{ fontSize: '48px', color: '#f44336' }} />
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

    const handleProductClick = (category) => {
        // Redirect to /product with query string for category
        navigate(`/product?category=${encodeURIComponent(category)}`);
    };

    return (
        <Container className='containerCss'>
            <Typography className='text-black mt-2 mb-2' variant="h4" component="h1" gutterBottom>
                Product Categories
            </Typography>
            <Grid container spacing={2}>
            {displayedProducts.map((product) => (
                <Grid item xs={6} sm={4} md={2} key={product.id}>
                    <button
                        type="button" // Add this line to specify the button type
                        className="card2"
                        onClick={() => handleProductClick(product.group)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleProductClick(product.group);
                            }
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '0',
                            cursor: 'pointer',
                            width: '100%',
                            textAlign: 'left', // Ensure text is aligned left
                        }} // Optional inline styles
                        aria-label={`View products in category ${product.group}`} // Accessible label
                    >
                        <div>
                            <span className='productCard'>
                                <Typography variant="h6" className='productTitle'>
                                    {product.group}
                                </Typography>
                                {product.productImages && product.productImages.length > 0 && (
                                    <CardMedia
                                        component="img"
                                        image={product.productImages[0]}
                                        alt={product.itemName}
                                        className='productImage'
                                    />
                                )}
                            </span>
                        </div>
                    </button>
                </Grid>
            ))}
            
            </Grid>

            <Divider sx={{ borderStyle: 'dashed' }} className='mt-4' />
        </Container>
    );
}

const LoadingScreen = () => (
    <div className='loadingScreen' style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
        <p>Loading products...</p>
    </div>
);
