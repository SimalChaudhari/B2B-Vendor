import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

// import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
// import { Iconify } from 'src/components/iconify';
// import { ColorPreview } from 'src/components/color-utils';

import { useCheckoutContext } from '../checkout/context';

// ----------------------------------------------------------------------

export function ProductItem({ product }) {
  // console.log(product, " dddd");
  const checkout = useCheckoutContext();
  // Set the available status based on your logic
  

  // const { id, name, coverUrl, price, colors, available, sizes, priceSale, newLabel, saleLabel } =
  //   product;
    const { id, name, description, price, imageUrl, status } =
      product;
      
      const available = status === 2; // Set as true if status is 'active', false otherwise

  const linkTo = paths.product.details(id);

  const handleAddCart = async () => {
    const newProduct = {
      id,
      name,
      price,
      description,
      imageUrl,
      status,
      quantity: 1,
    };
    try {
      checkout.onAddToCart(newProduct);
    } catch (error) {
      console.error(error);
    }
  };

  
  

    const renderImg = (
      <Box sx={{ position: 'relative', p: 1 }}>
      {!!available && (
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: 'absolute',
            
          }}
        />

      )}

      <Tooltip title={!!available && 'Out of stock'} placement="bottom-end">
        <Image
          alt={name}
          src={imageUrl}
          ratio="1/1"
          sx={{ borderRadius: 1.5, ...(!available && { opacity: 0.48, filter: 'grayscale(1)' }) }}
        />
      </Tooltip>
    </Box>
    );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Link component={RouterLink} href={linkTo} color="inherit" variant="subtitle2" noWrap>
        {name}
      </Link>

      <Stack direction="row" alignItems="center" justifyContent="space-between">

        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          

          <Box component="span">{fCurrency(price)}</Box>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Card sx={{ '&:hover .add-cart-btn': { opacity: 1 } }}>


      {renderImg}

      {renderContent}
    </Card>
  );
}
