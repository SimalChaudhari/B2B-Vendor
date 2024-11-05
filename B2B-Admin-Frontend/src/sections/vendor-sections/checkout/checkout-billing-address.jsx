import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { AddressItem, AddressNewForm } from 'src/sections/vendor-sections/address';
import { useDispatch, useSelector } from 'react-redux';
import useCart from './components/useCart';
import { addressList } from 'src/store/action/addressActions';
import { CheckoutPayment } from './checkout-payment';
import { LoadingButton } from '@mui/lab';
import { Typography, Card, CardContent } from '@mui/material';
import { createOrder, createOrderItem } from 'src/store/action/orderActions';

export function CheckoutBillingAddress() {
  const checkout = useCheckoutContext();
  const dispatch = useDispatch();
  const mappedData = useCart();

  const subtotal = mappedData.reduce((acc, item) => acc + item.totalAmount, 0);
  const quantity = mappedData.reduce((acc, item) => acc + item.quantity, 0);
  const discount = 0;

  const addressForm = useBoolean();

  const userAddress = useSelector((state) => state.address?.address || []);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(addressList());
  }, [dispatch]);

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
  };

  const toggleShowAllAddresses = () => {
    setShowAllAddresses((prev) => !prev);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // Start loading
    try {
      const orderData = {
        totalPrice: subtotal,
        totalQuantity: quantity,
        addressId: selectedAddressId, // Use selectedAddressId here
      };

      const orderResponse = await dispatch(createOrder(orderData));

      if (orderResponse) {
        const itemData = {
          orderId: orderResponse.data?.id,
          products: mappedData.map((item) => ({
            productId: item.productID,
            quantity: item.quantity,
          })),
        };
        const itemResponse = await dispatch(createOrderItem(itemData));

        if (itemResponse) {
          checkout.onNextStep();
          checkout.onReset();
        } else {
          console.error('Failed to create items for the order:', itemResponse);
        }
      } else {
        console.error('Failed to create order:', orderResponse);
      }
    } catch (error) {
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>

          <Card sx={{ mb: 1 }}>
            <CheckoutPayment />
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Button
                  size="small"
                  color="primary"
                  onClick={addressForm.onTrue}
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  New Address
                </Button>
              </Stack>

              <Box sx={{ mt: 1 }}>
                {userAddress.length > 0 ? (
                  <div>
                    {(showAllAddresses ? userAddress : userAddress.slice(0, 2)).map((address) => (
                      <AddressItem
                        key={address.id}
                        address={address}
                        onClick={() => handleSelectAddress(address.id)}
                        sx={{
                          p: 3,
                          mb: 3,
                          borderRadius: 1,
                          boxShadow: (theme) => theme.customShadows.card,
                          cursor: 'pointer',
                          border: selectedAddressId === address.id ? '2px solid black' : '1px solid grey',
                          backgroundColor: selectedAddressId === address.id ? 'inherit' : 'inherit',
                        }}
                      />
                    ))}
                    {userAddress.length > 2 && (
                      <Button onClick={toggleShowAllAddresses} fullWidth>
                        {showAllAddresses ? 'Show Less' : 'Show More'}
                      </Button>
                    )}
                  </div>
                ) : (
                  <Typography>No address available</Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          <Button sx={{ m: 1 }}
            size="small"
            color="inherit"
            onClick={checkout.onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back
          </Button>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={subtotal + checkout.shipping}
            subtotal={subtotal}
            shipping={checkout.shipping}
            discount={discount} />

          {subtotal > 0 && (
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={!selectedAddressId || isSubmitting}
              loading={isSubmitting}
              onClick={handleSubmit} // Attach the handleSubmit here
            >
              Complete order
            </LoadingButton>
          )}
        </Grid>
      </Grid>

      <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={checkout.onCreateBilling}
      />
    </>
  );
}
