import { useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';

import { useCheckoutContext } from '../context';
import { CheckoutSteps } from '../checkout-steps';
import { CheckoutPayment } from '../checkout-payment';
import { CheckoutOrderComplete } from '../checkout-order-complete';
import { CheckoutBillingAddress } from '../checkout-billing-address';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { ProductFilterView } from '../components/product-filter';
import { CheckoutCart } from '../checkout-cart';

// ----------------------------------------------------------------------

export function CheckoutView() {
  const checkout = useCheckoutContext();

  const addressByData = useSelector((state) => state.address?.addressByID);

  useEffect(() => {
    checkout.initialStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckoutStep = () =>
    checkout.activeStep === 1 && !addressByData
      ? <CheckoutBillingAddress />
      : checkout.activeStep === 2 && !addressByData
        ? (checkout.onBackStep(), <CheckoutBillingAddress />)
        : null;



  return (
    <Box>
      {checkout.activeStep === 0 && (
        <Box>
          <ProductFilterView />
          <Box mt={3}>
            <CheckoutCart />
          </Box>
        </Box>
      )}
      <Box mt={3}>
        {handleCheckoutStep()} {/* Render dynamic step components */}

        {checkout.activeStep === 2 && addressByData &&
          <div>
            <CheckoutBillingAddress />
            <CheckoutPayment />
          </div>
        }


        {checkout.completed && (
          <CheckoutOrderComplete
            open
            onReset={checkout.onReset}
            onDownloadPDF={() => { }}
          />
        )}
      </Box>
    </Box>

  );
}
