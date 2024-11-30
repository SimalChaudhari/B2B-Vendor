import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsFailure, fetchProductsStart, fetchProductsSuccess } from 'src/redux/ProductReducer';
import { fetchItems } from 'src/services/productApi'; // Ensure this file is correct
import {
  Container,
  Grid,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
} from '@mui/material';
import { AiOutlineWarning } from 'react-icons/ai';
import { useNavigate } from 'react-router';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { fCurrency } from 'src/utils/format-number';
import NOIMAGE from '../../DefaultImage/NOIMAGE.jpg';

export function HomeLetestProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  // Limit to the first 4 products directly
  const displayedProducts = products.slice(0, 8);

  return (
    <Container className='containerCss mb-5'>
      <Box mb={3} className="Latest_PRG">
        <Typography variant="h4" component="h1" className='text-black mb-1 mt-1'>
          Latest Products
        </Typography>
        <Button
          variant="text"
          onClick={() => navigate('/product')}
          className='text-primary font-lg ViewAll'
        // sx={{ color: 'primary.main', textTransform: 'none' }}
        >
          View All <MdOutlineKeyboardDoubleArrowRight className='font-lg ml-1' />
        </Button>
      </Box>

      <Grid container spacing={2}>
        {displayedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Button className="unique-card" onClick={() => navigate(`/product/${product.id}`)}   >
              <div className="background-overlay" />
              <div className="card-content">

                <span className=''>
                  {product.productImages && product.productImages.length > 0 && (
                    <div className=''>
                      <CardMedia
                        component="img"
                        image={product.productImages[0] || NOIMAGE}
                        alt={product.itemName}
                        className='letestProductImage' // Added class for styling
                      />
                    </div>
                  )}
                  <CardContent>
                    <Typography variant="h6" className='productTitle' sx={{ textAlign: 'left', marginBottom: "5px" }}>
                      {product.itemName}
                    </Typography>
                    <Typography sx={{ fontSize: '15px', textAlign: 'left', marginBottom: "2px" }}>
                      {fCurrency(product.sellingPrice)}
                    </Typography>
                    <Typography sx={{ fontSize: '13px', textAlign: 'left', marginBottom: "2px" }}>
                      {product.description.length > 50
                        ? `${product.description.slice(0, 50)}...`
                        : product.description}
                    </Typography>

                  </CardContent>
                </span>
              </div>
            </Button>
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
