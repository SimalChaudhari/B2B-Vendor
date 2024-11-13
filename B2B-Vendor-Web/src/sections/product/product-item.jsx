import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { ColorPreview } from 'src/components/color-utils';

import { useCheckoutContext } from '../checkout/context';
import { Rating } from '@mui/material';

// ----------------------------------------------------------------------

const dummyImage = 'https://png.pngtree.com/png-vector/20210303/ourmid/pngtree-mobile-phone-png-smartphone-camera-mockup-png-image_3009179.jpg'

export function ProductItem({ product }) {
  const checkout = useCheckoutContext();



  // const { id, name, coverUrl, price, colors, available, sizes, priceSale, newLabel, saleLabel } =
  //   product;
  const { id, itemName, productImages, sellingPrice, description, group } =
    product;
  const available = 5;
  const linkTo = paths.product.details(id);
  const limitedDescription = description.length > 17 ? `${description.slice(0, 17)}...` : description;


  const handleAddCart = async () => {
    const newProduct = {
      id,
      itemName,
      productImages,
      available,
      sellingPrice,
      // colors: [colors[0]],
      // size: sizes[0],
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
      <Image
        alt={itemName}
        src={productImages?.[0] || dummyImage}
        ratio="1/1"
        sx={{ borderRadius: 1.5, ...(!available && { opacity: 0.8, filter: 'grayscale(1)' }) }}
      />
      {/* 
          </Tooltip>
        */}
    </Box>
  );

  const renderContent = (
    <Stack spacing={0.5} sx={{ p: 2, pt: 0, alignItems: 'flex-start' }}>
      <Link component={RouterLink} href={linkTo} color="inherit" variant="subtitle2" noWrap>
        {itemName}
      </Link>

      <Box component="span">
        {group}
      </Box>
      <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight:'200', fontSize:'13px' }}>
        {limitedDescription}
      </Box>
      {/* 5-Star Rating */}
      <Rating name="size-small" defaultValue={2} size="small" />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>


          {sellingPrice && (
            <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
              {fCurrency(sellingPrice - 500)}
            </Box>
          )}
          <Box component="span">&nbsp; {fCurrency(sellingPrice)}</Box>
        </Stack>
      </Stack>
    </Stack >
  );

  return (
    <div className="card">
      <Card sx={{ '&:hover .add-cart-btn': { opacity: 1 } }}>
        {/* {renderLabels} */}


        {renderImg}

        {renderContent}
      </Card>
    </div>
  );
}
