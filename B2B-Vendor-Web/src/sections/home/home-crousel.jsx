import { useRef } from 'react';
import { m } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

// Correct image imports
import carouselImage1 from '../../assets/banner/Banner_1.png';
import carouselImage2 from '../../assets/banner/Banner_2.png';
import carouselImage3 from '../../assets/banner/Banner_3.png';
import carouselImage4 from '../../assets/banner/Banner_4.jpg';

// Carousel images
const carouselImages = [
  carouselImage1,
  carouselImage2,
  carouselImage3,
  carouselImage4,
];

// Styled buttons for better UI
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#f0f0f0",
  color: '#000',
  borderRadius: '4px',
  // padding: '10px 15px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  height:"100px",
  transition: 'background-color 0.3s, transform 0.3s',
  '&:hover': {
    backgroundColor: "#ccc",
    transform: 'scale(1.05)', // Slightly less scaling for a subtle effect
  },
}));

export function HomeCarousel({ sx, ...other }) {
  const sliderRef = useRef(null); // Ref for Slider if you need to control it

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
              alt={`Carousel slide ${index + 1}`} // Updated alt text for better accessibility
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
          // left: '10px',
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
          right: '.1px',
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
        // height: '100vh', 
        width: "100%",
        ...sx,
      }}
      {...other}
    >
      {renderCarousel}
    </Container>
  );
}
