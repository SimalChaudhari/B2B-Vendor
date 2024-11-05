import { useEffect } from 'react';
import { useCheckoutContext } from '../context';
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
    && <CheckoutBillingAddress />



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
      <Box>
        {handleCheckoutStep()} {/* Render dynamic step components */}
        {checkout.activeStep === 2 &&
          <CheckoutOrderComplete
            open
            onReset={checkout.onReset}
          />
        }
      </Box>
    </Box>

  );
}
