import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from '../checkout/context';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';

import NOIMAGE from '../../DefaultImage/NOIMAGE.jpg';

export function ProductItem({ product }) {
  const navigate = useNavigate();
  const checkout = useCheckoutContext();

  const { id, itemName, productImages, sellingPrice, description, group } = product;
  const available = 5;
  const linkTo = paths.product.details(id);
  const limitedDescription =
    description.length > 17 ? `${description.slice(0, 17)}...` : description;

  const handleAddCart = (event) => {
    // Prevent click event propagation
    event.stopPropagation();

    const newProduct = {
      id,
      itemName,
      productImages,
      available,
      sellingPrice,
      quantity: 1,
    };

    try {
      checkout.onAddToCart(newProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const renderImage = (
    <Box sx={{ position: 'relative', p: 1 }}>
      <Fab
        color="warning"
        size="medium"
        className="add-cart-btn"
        onClick={handleAddCart}
        sx={{
          right: 16,
          bottom: 16,
          zIndex: 10,
          opacity: 0,
          position: 'absolute',
          transition: (theme) =>
            theme.transitions.create('all', {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.shorter,
            }),
        }}
      >
        <Iconify icon="solar:cart-plus-bold" width={24} />
      </Fab>
      <Image
        alt={itemName}
        src={productImages?.[0] || NOIMAGE}
        ratio="1/1"
        sx={{
          borderRadius: 1.5,
          ...(!available && { opacity: 0.8, filter: 'grayscale(1)' }),
        }}
      />
    </Box>
  );

  const renderContent = (
    <Stack spacing={0.5} sx={{ p: 2, pt: 0, alignItems: 'flex-start' }}>
      <Link component={RouterLink} href={linkTo} color="inherit" variant="subtitle2" noWrap>
        {itemName}
      </Link>
      <Box component="span">{group}</Box>
      <Box
        component="span"
        sx={{
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontWeight: 200,
          fontSize: '13px',
        }}
      >
        {limitedDescription}
      </Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box sx={{ typography: 'subtitle1' }}>{fCurrency(sellingPrice)}</Box>
      </Stack>
    </Stack>
  );

  return (
    <div className="card">
      <Button onClick={() => navigate(`/product/${id}`)}>
        <Card sx={{ '&:hover .add-cart-btn': { opacity: 1 } }}>
          {renderImage}
          {renderContent}
        </Card>
      </Button>
    </div>
  );
}
