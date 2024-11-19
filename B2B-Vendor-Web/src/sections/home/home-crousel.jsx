import { useLayoutEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import { fetchBanner } from 'src/services/bannerApi';

// Styled buttons for better UI
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#f0f0f0",
  color: '#000',
  borderRadius: '4px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  height: "100px",
  transition: 'background-color 0.3s, transform 0.3s',
  '&:hover': {
    backgroundColor: "#ccc",
    transform: 'scale(1.05)',
  },
}));

export function HomeCarousel({ sx, ...other }) {
  const sliderRef = useRef(null); // Ref for Slider if you need to control it

  const [carouselImages, setCarouselImages] = useState([]); // State for dynamic images
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  // Fetch banner images
  useLayoutEffect(() => {
    const getBannerData = async () => {
      try {
        const data = await fetchBanner();
        const bannerImages = data.map((item) => item.BannerImages[0]); // Assuming BannerImages is an array
        setCarouselImages(bannerImages);
      } catch (err) { // Renamed `error` to `err` to avoid shadowing
        console.error('Failed to fetch banner data:', err);
        setError('Failed to load banners');
      } finally {
        setLoading(false);
      }
    };

    getBannerData();
  }, []);

  // Handle previous and next actions
  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  // Render carousel
  const renderCarousel = (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <Slider ref={sliderRef} {...settings}>
        {carouselImages.map((src, index) => (
          <Box key={index}>
            <img
              src={src}
              alt={`Carousel slide ${index + 1}`}
              style={{ width: '100%', height: 500, objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Slider>

      {/* Custom Next and Previous Buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <StyledIconButton onClick={handlePrev}>
          <FaAngleLeft />
        </StyledIconButton>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <StyledIconButton onClick={handleNext}>
          <FaAngleRight />
        </StyledIconButton>
      </Box>
    </Box>
  );

  return (
    <Container
      component={m.div}
      sx={{
        overflow: 'hidden',
        width: "100%",
        ...sx,
      }}
      {...other}
    >
      {loading ? (
        <p>Loading banners...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        renderCarousel
      )}
    </Container>
  );
}
