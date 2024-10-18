import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import { AvatarShape } from 'src/assets/illustrations'; // Assuming this is already defined
import { Image } from 'src/components/image'; // Assuming this is already defined
import { varAlpha } from 'src/theme/styles';
import Rating from '@mui/material/Rating';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { addToCart } from 'src/store/action/cartActions';

// ----------------------------------------------------------------------

export function ItemCard({ product }) {
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch()

  const handleCardClick = (id) => {
    navigate(`/items/view/${id}`); // Adjust the path as per your routing structure
  };

  const handleToAddCard = async (id, quantity = 1) => { // Adjust to accept id and quantity
     const data = { productId: id, quantity };
    try {
      await dispatch(addToCart(data));
    } catch (error) {
      console.error('Submission failed', error);
    }
  }

  return (
    <Card sx={{ m: 1 }}>

      <Box sx={{ cursor: 'pointer' }} onClick={() => handleCardClick(product.id)}>
        <Box sx={{ position: 'relative', height: 160 }} > {/* Fixed height for the image container */}
          <AvatarShape
            sx={{
              left: 0,
              right: 0,
              zIndex: 10,
              mx: 'auto',
              bottom: -26,
              position: 'absolute',
            }}
          />

          <Avatar
            alt={product.itemName}
            src={product.productImages?.[0] || '/path/to/placeholder/image.png'} // Placeholder for missing images
            sx={{
              width: 64,
              height: 64,
              zIndex: 11,
              left: 0,
              right: 0,
              bottom: -32,
              mx: 'auto',
              position: 'absolute',
            }}
          />

          <Image
            alt={product.itemName}
            src={product.productImages?.[0] || '/path/to/placeholder/image.png'} // Placeholder for missing images
            slotProps={{
              overlay: {
                background: (theme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.48),
              },
            }}
            sx={{
              display: 'block',
              height: '100%', // Set image to cover the available height
              width: '100%',  // Set image to cover the available width
              objectFit: 'cover', // Ensure the image covers the area while maintaining aspect ratio
            }}
          />
        </Box>
      </Box>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Box
        sx={{
          p: 3,
          gap: 2,
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',

        }}

      >
        <Box
          sx={{
            gap: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >

          <ListItemText
            primary={product?.itemName}
            secondary='Posted Posted 16 Oct 2024 12:03 pm'
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />
        </Box>

        <Rating value={product?.rating} size="small" readOnly precision={0.5} />

        <Typography variant="body2">{product.description}</Typography>

      </Box>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Box sx={{ p: 3, gap: 2, display: 'flex' }}>
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering card click
            handleToAddCard(product.id, 1); // Pass id and quantity 0
          }}
          fullWidth
          color="error"
          variant="soft"
        >
          Add To Cart
        </Button>
        <Button onClick={() => handleCardClick(product.id)}
          fullWidth
          color="inherit"
          variant="contained"
        >
          Buy
        </Button>
      </Box>
    </Card>
  );
}



