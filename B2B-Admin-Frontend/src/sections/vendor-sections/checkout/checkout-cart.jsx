import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { CheckoutCartProductList } from './checkout-cart-product-list';
import { useDispatch, useSelector } from 'react-redux';
import { cartList } from 'src/store/action/cartActions';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export function CheckoutCart() {
  const dispatch = useDispatch();

  const checkout = useCheckoutContext();

  const addToCartData = useSelector((state) => state.cart?.cart || []);

  // Dynamically map through cart data
  const mappedData = addToCartData.map((item, index) => ({
    id: item.id,
    quantity: item.quantity,
    userId: item.userId,
    price: item.product.sellingPrice,
    totalAmount: "1000",
    name: item.product.itemName,
    // Add more product fields dynamically here if needed
    // colors: [colors[0]],
    // size: sizes[0],
  }));

  //----------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(cartList());
    };
    fetchData(); // Call fetchData when the component mounts
  }, []);






  const empty = !checkout.items.length;

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Cart
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;(
                  {checkout.totalItems} item)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {empty ? (
            <EmptyContent
              title="Cart is empty!"
              description="Look like you have no items in your shopping cart."
              imgUrl={`${CONFIG.site.basePath}/assets/icons/empty/ic-cart.svg`}
              sx={{ pt: 5, pb: 10 }}
            />
          ) : (
            <CheckoutCartProductList
              products={mappedData}
              onDelete={checkout.onDeleteCart}
              onIncreaseQuantity={checkout.onIncreaseQuantity}
              onDecreaseQuantity={checkout.onDecreaseQuantity}
            />
          )}
        </Card>

        <Button
          component={RouterLink}
          href={paths.items.root}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Continue shopping
        </Button>
      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutSummary
          total={checkout.total}
          discount={checkout.discount}
          subtotal={checkout.subtotal}
          onApplyDiscount={checkout.onApplyDiscount}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={empty}
          onClick={checkout.onNextStep}
        >
          Check out
        </Button>
      </Grid>
    </Grid>
  );
}
