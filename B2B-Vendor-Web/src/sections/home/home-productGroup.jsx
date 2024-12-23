import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchProductsFailure, fetchProductsStart, fetchProductsSuccess } from 'src/redux/ProductReducer';
import { fetchItems } from 'src/services/productApi';
import {
    Container,
    CardMedia,
    Typography,
    CircularProgress,
    Box,
    Divider,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { AiOutlineWarning } from 'react-icons/ai';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { DUMMY_IMAGE } from 'src/constfile/dummyImage';


// Styled buttons for better UI
const StyledIconButton = styled(IconButton)(({ theme }) => ({
    // backgroundColor: "#f0f0f0",
    color: '#000',
    borderRadius: "50%",
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    // height: "100px",
    transition: 'background-color 0.3s, transform 0.3s',
    '&:hover': {
        // backgroundColor: "#ccc",
        transform: 'scale(1.05)',
    },
}));

export function HomeProductGroup() {
    const sliderRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate
    const { items: products = [], loading: productsLoading } = useSelector((state) => state.product);
    // Conditional rendering of next and previous buttons
    const [showArrows, setShowArrows] = useState(false);
    const theme = useTheme();
    const matchesMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const matchesTablet = useMediaQuery(theme.breakpoints.down('md'));
    const matchesDesktop = useMediaQuery(theme.breakpoints.down('lg'));

    // Calculate the number of slides to show based on screen size
    const getSlidesToShow = () => {
        if (matchesMobile) return 1;
        if (matchesTablet) return 2;
        if (matchesDesktop) return 4;
        return 7; // Default for larger screens
    };


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

    const settings = {
        dots: false,
        // infinite: true,
        speed: 500,
        // slidesToShow: 7,
        slidesToShow: getSlidesToShow(),
        slidesToScroll: showArrows ? 1 : 0,
        // autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        responsive: [
            {
                breakpoint: 1200, // For large screens
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 992, // For medium screens (like tablets)
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768, // For small screens (e.g., large phones)
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 576, // For very small screens (e.g., small phones)
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 400, // For extra small screens
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    useEffect(() => {
        setShowArrows(products.length > settings.slidesToShow);
    }, [products.length, settings.slidesToShow]);

    // Handle previous and next actions
    const handlePrev = () => {
        sliderRef.current.slickPrev();
    };

    const handleNext = () => {
        sliderRef.current.slickNext();
    };

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
    const uniqueGroups = Array.from(new Set(products.map(product => product.subGroup1))).map(group =>
        products.find(product => product.subGroup1 === group)
    );



    const displayedProducts = uniqueGroups.slice(0, 6);

    const handleProductClick = (category) => {
        // Redirect to /product with query string for category
        navigate(`/product?category=${encodeURIComponent(category)}`);
    };

    return (
        <Container className='containerCss'>
            <Box className="Latest_PRG" sx={{ mb: 2 }}>
                <Box>
                    <Typography className='text-black mt-1' variant="h4" component="h1" gutterBottom>
                        Product Categories
                    </Typography>
                </Box>
                {/* Custom Next and Previous Buttons */}
                {showArrows && (
                    <Box sx={{ display: "flex", gap: "20px" }}>
                        <Box
                            sx={{
                                zIndex: 10,
                            }}
                        >
                            <StyledIconButton onClick={handlePrev}>
                                <FaAngleLeft size={20} />
                            </StyledIconButton>
                        </Box>
                        <Box
                            sx={{
                                zIndex: 10,
                            }}
                        >
                            <StyledIconButton onClick={handleNext}>
                                <FaAngleRight size={20} />
                            </StyledIconButton>
                        </Box>
                    </Box>
                )}
            </Box>
            <Slider ref={sliderRef} {...settings} >
                {uniqueGroups.map((product, index) => (
                    <Box
                        key={index}
                        sx={{
                            // padding: '10px',
                            textAlign: 'center',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleProductClick(product.subGroup1)}
                        className="card2"
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '0',
                            cursor: 'pointer',
                            // width: '100%',
                            // textAlign: 'left',
                        }}
                    >
                        <span className='productCard'>
                            <Typography
                                variant="h6"
                                className="productTitle"
                                sx={{
                                    fontSize: {
                                        xs: '0.75rem', // Small screens
                                        sm: '0.90rem',     // Medium screens
                                        md: '1.00rem',  // Large screens
                                        xl: '1.00rem',  // Large screens
                                    },
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: {
                                        xs: '100px', // Restrict width for small screens
                                        sm: '120px', // Medium screens
                                        md: '120px', // Larger screens
                                        xl: '200px', // Larger screens

                                    },
                                }}
                            >
                                {product.subGroup1.length > 19
                                    ? `${product.subGroup1.slice(0, 10)}...`
                                    : product.subGroup1}
                            </Typography>

                            <CardMedia
                                component="img"
                                image={
                                    product.productImages && product.productImages.length > 0
                                        ? product.productImages[0] // Show the first image if available
                                        : DUMMY_IMAGE // Fallback image if null or empty
                                }
                                alt={product.itemName}
                                className='productImage'
                            />
                        </span>
                    </Box>
                ))}
            </Slider>



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
