import { useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ColorPicker } from 'src/components/color-utils';

import { IncrementerButton } from './components/incrementer-button';

import { useDispatch } from 'react-redux';
import { setProductDetails } from 'src/redux/orderProductAndAddressReducer';
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';


// ----------------------------------------------------------------------

export function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disableActions,
  ...other
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    id,
    itemName,
    sizes,
    sellingPrice,
    coverUrl,
    colors,
    newLabel,
    available,
    priceSale,
    saleLabel,
    totalRatings,
    totalReviews,
    inventoryType,
    description,
    productImages,
  } = product;

  const existProduct = !!items?.length && items.map((item) => item.id).includes(id);

  const isMaxQuantity =
    !!items?.length &&
    items.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const defaultValues = {
    id,
    itemName,
    coverUrl,
    productImages,
    // available: "5",
    sellingPrice,
    // colors: colors[0],
    // size: sizes[4],
    // quantity: available < 1 ? 0 : 1,
    quantity: 1,
  };

  const methods = useForm({ defaultValues });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = handleSubmit(async (data) => {
    if (data) {
      dispatch(setProductDetails({ productDetails: data, quantity: data.quantity }));
      onGotoStep?.(1); // Call to update the step in the context if necessary
      router.push({
        pathname: paths.product.checkout,
        query: { step: 1 } // Add step 1 to the query parameters
      });
    }
    // try {
    // if (!existProduct) {
    //     onAddCart?.({ ...data, colors: [values.colors], subtotal: data.sellingPrice * data.quantity });
    // }
    // onGotoStep?.(1);
    // router.push(paths.product.checkout);
    // } catch (error) {
    //   console.error(error);
    // }
  });

  const handleAddCart = useCallback(() => {
    try {
      // onAddCart?.({ ...values, colors: [values.colors], subtotal: values.sellingPrice * values.quantity });
      onAddCart?.({ ...values, subtotal: values.sellingPrice * values.quantity });
    } catch (error) {
      console.error(error);
    }
  }, [onAddCart, values]);

  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>

      {fCurrency(sellingPrice)}
    </Box>
  );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      <Link
        variant="subtitle2"
        sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
        className='text-black'
      >
        <Iconify icon="mingcute:add-line" width={16} sx={{ mr: 1 }} />
        Compare
      </Link>

      <Link
        variant="subtitle2"
        sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
        className='text-black'
      >
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Favorite
      </Link>

      <Link
        variant="subtitle2"
        sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
        className='text-black'
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Share
      </Link>
    </Stack>
  );

  // const renderColorOptions = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Color
  //     </Typography>

  //     <Controller
  //       name="colors"
  //       control={control}
  //       render={({ field }) => (
  //         <ColorPicker
  //           colors={colors}
  //           selected={field.value}
  //           onSelectColor={(color) => field.onChange(color)}
  //           limit={4}
  //         />
  //       )}
  //     />
  //   </Stack>
  // );

  // const renderSizeOptions = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Size
  //     </Typography>

  //     <Field.Select
  //       name="size"
  //       size="small"
  //       helperText={
  //         <Link underline="always" color="textPrimary">
  //           Size chart
  //         </Link>
  //       }
  //       sx={{
  //         maxWidth: 88,
  //         [`& .${formHelperTextClasses.root}`]: { mx: 0, mt: 1, textAlign: 'right' },
  //       }}
  //     >
  //       {sizes.map((size) => (
  //         <MenuItem key={size} value={size}>
  //           {size}
  //         </MenuItem>
  //       ))}
  //     </Field.Select>
  //   </Stack>
  // );

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Quantity
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={values.quantity}
          disabledDecrease={values.quantity <= 1}
          disabledIncrease={values.quantity >= available}
          onIncrease={() => setValue('quantity', values.quantity + 1)}
          onDecrease={() => setValue('quantity', values.quantity - 1)}
        />

        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          Available: {available}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row" spacing={2}>
      {/*
      <Button
        fullWidth
        // disabled={isMaxQuantity || disableActions}
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Add to cart
      </Button>
       */}

      <Button fullWidth size="large" type="submit" variant="contained"
      // disabled={disableActions}
      onClick={handleAddCart}
      >
        Buy now
      </Button>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" className='text-black font-lg'>
      {description}
    </Typography>
  );

  const renderClassification = (
    <Typography variant="body2" className='text-black font-lg' sx={{ width: '100%' }}>
      
            {/* Classifications Table */}
            <Box mt={5} >
              <Typography variant="subtitle1" gutterBottom>Classifications</Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small" aria-label="classification table">
                  <TableBody>
                    <TableRow>
                      <TableCell className='bold'>Group</TableCell>
                      <TableCell>{product?.group || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className='bold'>SubGroup1</TableCell>
                      <TableCell>{product?.subGroup1 || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className='bold'>SubGroup2</TableCell>
                      <TableCell>{product?.subGroup2 || '-'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
    </Typography>
  );

  const renderRating = (
    <Rating name="size-small" defaultValue={2} size="small" />
  );

  // const renderRating = (
  //   <Stack direction="row" alignItems="center" sx={{ color: 'text.disabled', typography: 'body2' }}>
  //     <Rating size="small" value={totalRatings} precision={0.1} readOnly sx={{ mr: 1 }} />
  //     {`(${fShortenNumber(totalReviews)} reviews)`}
  //   </Stack>
  // );

  // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
  //   <Stack direction="row" alignItems="center" spacing={1}>
  //     {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
  //     {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
  //   </Stack>
  // );

  // const renderInventoryType = (
  //   <Box
  //     component="span"
  //     sx={{
  //       typography: 'overline',
  //       color:
  //         (inventoryType === 'out of stock' && 'error.main') ||
  //         (inventoryType === 'low stock' && 'warning.main') ||
  //         'success.main',
  //     }}
  //   >
  //     {inventoryType}
  //   </Box>
  // );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
                <Button
                    size="small"
                    color="inherit"
                    onClick={() => window.history.back()}
                    startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                >
                    Back
                </Button>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
      
        <Stack spacing={2} alignItems="flex-start">
          {/*
          {renderLabels}


          {renderInventoryType}
          */}


          <Typography variant="h5">{itemName}</Typography>

          {/*
            {renderRating}
            */}

          {renderPrice}

          {renderSubDescription}

          {renderClassification}

          {/*
            {renderRating}
             */}
        </Stack>

        {/*
          <Divider sx={{ borderStyle: 'dashed' }} />
        {renderColorOptions}
        
        {renderSizeOptions}
        {renderQuantity}
        */}


        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}

        {/*
          {renderShare}
           */}
      </Stack>
    </Form>
  );
}
