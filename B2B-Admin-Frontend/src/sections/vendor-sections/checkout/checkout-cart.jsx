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
import { cartList, decreaseQuantity, deleteCartItem, increaseQuantity } from 'src/store/action/cartActions';
import useCart from './components/useCart';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export function CheckoutCart() {
  const dispatch = useDispatch();

  const mappedData = useCart();

  const totalItems = mappedData.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = mappedData.reduce((acc, item) => acc + item.totalAmount, 0);
  const discount = 0;
  //----------------------------------------------------------------------------------------------------

  const fetchData = async () => {
    await dispatch(cartList());
  };

  const checkout = useCheckoutContext();

  const empty = mappedData.length === 0;

  const handleDeleteCart = async (id) => {
    const res = await dispatch(deleteCartItem(id)); // Action to delete an item
    if (res) {
      fetchData();

    }
  };

  const handleIncreaseQuantity = async (id) => {
    await dispatch(increaseQuantity(id)); // Action to increase item quantity
    fetchData();

  };

  const handleDecreaseQuantity = async (id) => {
    await dispatch(decreaseQuantity(id)); // Action to decrease item quantity
    fetchData();

  };

  const handleDownload = async (id) => {
    const item = mappedData.find((data) => data.id === id);

    if (item && item.dimensionalFiles?.[0]) {
      window.open(item.dimensionalFiles?.[0], '_blank'); // Opens the PDF in a new tab
      
    } else {
      toast.warning('File Not found for this item', id);
    }
  };




  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Cart
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({totalItems} item{totalItems > 1 ? 's' : ''})
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
              onDelete={handleDeleteCart}
              onDownload={handleDownload}
              onIncreaseQuantity={handleIncreaseQuantity}
              onDecreaseQuantity={handleDecreaseQuantity}
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
          total={subtotal}
          discount={discount}
          subtotal={subtotal}
          onApplyDiscount={() => { }} // Optional: handle discount application
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
