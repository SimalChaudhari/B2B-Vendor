import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { CheckoutDelivery } from './checkout-delivery';
import { CheckoutBillingInfo } from './checkout-billing-info';
import { CheckoutPaymentMethods } from './checkout-payment-methods';
import useCart from './components/useCart';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, createOrderItem } from 'src/store/action/orderActions';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  { value: 0, label: 'Free', description: '5-7 days delivery' },
  { value: 10, label: 'Standard', description: '3-5 days delivery' },
  // { value: 20, label: 'Express', description: '2-3 days delivery' },
];

const PAYMENT_OPTIONS = [
  {
    value: 'debit_card',
    label: 'Credit / Debit card',
    description: 'We support Mastercard, Visa, Discover and Stripe.',
  },
  { value: 'cash_on_delivery', label: 'Cash', description: 'Pay with cash when your order is delivered.' },
];

const CARDS_OPTIONS = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];


// ----------------------------------------------------------------------

export const PaymentSchema = zod.object({
  payment: zod.string().min(1, { message: 'Payment is required!' }),
  // Not required
  delivery: zod.number(),
});

// ----------------------------------------------------------------------

export function CheckoutPayment() {
  const checkout = useCheckoutContext();
  const dispatch = useDispatch();
  const mappedData = useCart();
  console.log("🚀 ~ CheckoutPayment ~ mappedData:", mappedData)

  const [payment, setPayment] = useState()

  const addressByData = useSelector((state) => state.address?.addressByID);


  const subtotal = mappedData.reduce((acc, item) => acc + item.totalAmount, 0);
  const quantity = mappedData.reduce((acc, item) => acc + item.quantity, 0);

  const discount = 0;


  const empty = mappedData.length === 0;

  const defaultValues = { delivery: checkout.shipping, payment: '' };

  const methods = useForm({
    resolver: zodResolver(PaymentSchema),
    defaultValues,

  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch, // Add this to watch form fields
  } = methods;

  // Watch the payment field
  const selectedPayment = watch('payment');
  // Log the selected payment method
  useEffect(() => {
    if (selectedPayment === 'cash_on_delivery') {
      setPayment(selectedPayment)
    } else if (selectedPayment === 'debit_card') {
      setPayment(selectedPayment)
    }
  }, [selectedPayment]); // Run effect when selectedPayment changes

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Prepare the order data with total price, address ID, and payment method
      const orderData = {
        totalPrice: subtotal, // Add subtotal
        totalQuantity: quantity, // Add subtotal
        addressId: addressByData?.id, // Include address data
        paymentMethod: payment, // Include the selected payment method
      };

      // Create the order and handle the response
      const orderResponse = await dispatch(createOrder(orderData));

      if (orderResponse) {
        // Prepare item data based on the response and mappedData
        const itemData = {
          orderId: orderResponse.data?.id, // Extracting order ID from the response
          products: mappedData.map(item => ({
            productId: item.productID, // Adjust according to your data structure
            quantity: item.quantity, // Assuming quantity is part of item
          })),
        };
        // Dispatch the createOrder action for products
        const itemResponse = await dispatch(createOrderItem(itemData));
        // Check if item creation was successful
        if (itemResponse) {
          // Proceed to the next step if both orders were successful
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
    }
  });


  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <CheckoutDelivery onApplyShipping={checkout.onApplyShipping} options={DELIVERY_OPTIONS} />

          <CheckoutPaymentMethods
            options={{
              payments: PAYMENT_OPTIONS,
              cards: CARDS_OPTIONS,
            }}
            sx={{ my: 3 }}
          />

          <Button
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
            total={subtotal}
            subtotal={subtotal}
            discount={discount}
            shipping={checkout.shipping}
            onEdit={() => checkout.onGotoStep(0)}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            disabled={empty}
            loading={isSubmitting}
          >
            Complete order
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}
