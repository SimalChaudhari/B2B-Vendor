import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { AddressItem, AddressNewForm } from 'src/sections/vendor-sections/address';
import { useDispatch, useSelector } from 'react-redux';
import useCart from './components/useCart';
import useAddress from './components/userAddress';
import { addressGetByList, addressList } from 'src/store/action/addressActions';
import { useEffect } from 'react';
import { CheckoutPayment } from './checkout-payment';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export function CheckoutBillingAddress() {
  const checkout = useCheckoutContext();

  const dispatch = useDispatch();
  const mappedData = useCart();

  const subtotal = mappedData.reduce((acc, item) => acc + item.totalAmount, 0);
  const discount = 0;

  const addressForm = useBoolean();

  // Get address data from Redux store
  const userAddress = useSelector((state) => state.address?.address || []);

  useEffect(() => {
    // Dispatch the action to fetch addresses when the component mounts
    dispatch(addressList());
  }, [dispatch]);

  const handleAddressByID = async (id) => {
    const res = await dispatch(addressGetByList(id))
    if (res) {
      checkout.onNextStep()
    }
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack direction="row" justifyContent="space-between">


            <Button
              size="small"
              color="primary"
              onClick={addressForm.onTrue}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New address
            </Button>
          </Stack>

          {/* Display the single user address */}
          {Object.keys(userAddress).length > 0 ? (
            <AddressItem
              address={userAddress}
             
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                boxShadow: (theme) => theme.customShadows.card,
              }}
            />
          ) : (
            <p>No address available</p> // Show a message if there's no address
          )}



          <CheckoutPayment />
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={subtotal}
            subtotal={subtotal}
            discount={discount}
          />



          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          // disabled={empty}
          // loading={isSubmitting}
          >
            Complete order
          </LoadingButton>
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
