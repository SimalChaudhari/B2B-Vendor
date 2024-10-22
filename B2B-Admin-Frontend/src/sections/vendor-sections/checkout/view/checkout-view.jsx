import { useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';

import { CheckoutCart } from '../checkout-cart';
import { useCheckoutContext } from '../context';
import { CheckoutSteps } from '../checkout-steps';
import { CheckoutPayment } from '../checkout-payment';
import { CheckoutOrderComplete } from '../checkout-order-complete';
import { CheckoutBillingAddress } from '../checkout-billing-address';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

export function CheckoutView() {
  const checkout = useCheckoutContext();

  const addressByData = useSelector((state) => state.address?.addressByID);

  useEffect(() => {
    checkout.initialStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckoutStep = () => {
    if (checkout.activeStep === 1 && !addressByData) {
      return <CheckoutBillingAddress />;
    }

    if (checkout.activeStep === 2 && !addressByData) {
      checkout.onBackStep(); // Reset to previous step
      return <CheckoutBillingAddress />;
    }
    return null; // Default return if no conditions are met
  };

  return (
    <Box>
      <Grid container justifyContent={checkout.completed ? 'center' : 'flex-start'}>
        <Grid xs={12} md={8}>
          <CheckoutSteps activeStep={checkout.activeStep} steps={PRODUCT_CHECKOUT_STEPS} />
        </Grid>
      </Grid>

      <>
        {checkout.activeStep === 0 && <CheckoutCart />}

        {handleCheckoutStep()} {/* Call the new function to handle step rendering */}

        {addressByData && checkout.activeStep === 2 && <CheckoutPayment />}

        {checkout.completed && (
          <CheckoutOrderComplete open onReset={checkout.onReset} onDownloadPDF={() => { }} />
        )}
      </>
    </Box>
  );
}
