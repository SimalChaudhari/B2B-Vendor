import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import { AvatarShape } from 'src/assets/illustrations'; // Assuming this is already defined
import { Image } from 'src/components/image'; // Assuming this is already defined
import { varAlpha } from 'src/theme/styles';
import { fCurrency } from 'src/utils/format-number';
// // ----------------------------------------------------------------------

// export function ProductCard({ product }) {
//   const navigate = useNavigate(); // Initialize useNavigate
//   const [quantity, setQuantity] = useState(1); // State to manage quantity

//   const handleCardClick = (id) => {
//     navigate(`/products/view/${id}`); // Adjust the path as per your routing structure
//   };

//   const handleAddToCart = () => {
//     alert(`Added `);
//   };

//   return (
//     <Card sx={{
//       textAlign: 'center', maxWidth: 400, m: 2
//     }}
//     >
//       <Box sx={{ cursor: 'pointer' }} onClick={() => handleCardClick(product.id)}>
//         <Box sx={{ position: 'relative', height: 160 }} > {/* Fixed height for the image container */}
//           <AvatarShape
//             sx={{
//               left: 0,
//               right: 0,
//               zIndex: 10,
//               mx: 'auto',
//               bottom: -26,
//               position: 'absolute',
//             }}
//           />

//           <Avatar
//             alt={product.itemName}
//             src={product.productImages?.[0] || '/path/to/placeholder/image.png'} // Placeholder for missing images
//             sx={{
//               width: 64,
//               height: 64,
//               zIndex: 11,
//               left: 0,
//               right: 0,
//               bottom: -32,
//               mx: 'auto',
//               position: 'absolute',
//             }}
//           />

//           <Image
//             alt={product.itemName}
//             src={product.productImages?.[0] || '/path/to/placeholder/image.png'} // Placeholder for missing images
//             slotProps={{
//               overlay: {
//                 background: (theme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.48),
//               },
//             }}
//             sx={{
//               display: 'block',
//               height: '100%', // Set image to cover the available height
//               width: '100%',  // Set image to cover the available width
//               objectFit: 'cover', // Ensure the image covers the area while maintaining aspect ratio
//             }}
//           />
//         </Box>

//         <ListItemText
//           sx={{ mt: 6, mb: 1, textAlign: 'center' }} // Center text
//           primary={product.itemName}
//           secondary={fCurrency(product?.sellingPrice)}
//           primaryTypographyProps={{ typography: 'subtitle1', textAlign: 'center' }} // Center primary text
//           secondaryTypographyProps={{ component: 'span', mt: 0.5, textAlign: 'center' }} // Center secondary text
//         />

//         <Stack direction="row" sx={{ mb: 2.5, justifyContent: 'center' }}> {/* Center text inside Stack */}
//           <Typography variant="caption" component="div" sx={{ mr: 1, color: 'text.secondary', textAlign: 'center' }}>
//             {product.group}
//           </Typography>
//         </Stack>
//       </Box>
//       <Divider sx={{ borderStyle: 'dashed' }} />
//       <Box display="flex" justifyContent="center" sx={{ py: 1 }} > {/* Center the button */}
//         <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}> {/* Change direction based on screen size */}
//           <Button
//             size="large"
//             color="warning"
//             variant="contained"
//             startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
//             sx={{
//               px: 4,
//               whiteSpace: 'nowrap',
//               width: '100%' // Ensure full width on all screens
//             }}
//           >
//             Add to cart
//           </Button>

//           <Button
//             size="large"
//             type="submit"
//             variant="contained"
//             sx={{
//               whiteSpace: 'nowrap',
//               width: '100%' // Ensure full width on all screens
//             }}
//           >
//             Buy now
//           </Button>
//         </Stack>
//       </Box>


//     </Card >
//   );
// }

import AutoHeight from 'embla-carousel-auto-height';

import Chip from '@mui/material/Chip';

import Rating from '@mui/material/Rating';

import { fDateTime } from 'src/utils/format-time';
import { Carousel, useCarousel, CarouselArrowBasicButtons } from 'src/components/carousel';
import { CardHeader } from '@mui/material';
import { useNavigate } from 'react-router';


// ----------------------------------------------------------------------

export function ProductCard({ product }) {
  const carousel = useCarousel({ align: 'start' }, [AutoHeight()]);
  const navigate = useNavigate(); // Initialize useNavigate
  const [quantity, setQuantity] = useState(1); // State to manage quantity

  const handleCardClick = (id) => {
    navigate(`/products/view/${id}`); // Adjust the path as per your routing structure
  };

  const handleAddToCart = () => {
    alert(`Added `);
  };


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



