
import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Unstable_Grid2';
import { Form } from 'src/components/hook-form';
import { useCheckoutContext } from './context';
import { CheckoutDelivery } from './checkout-delivery';
import useCart from './components/useCart';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  { value: 0, label: 'Transportation', description: '3-5 days delivery' },

];

export function CheckoutPayment() {
  const checkout = useCheckoutContext();
  const defaultValues = { delivery: checkout.shipping, payment: '' };
  const methods = useForm({
    defaultValues,
  });


  return (
    <Form methods={methods} >
        <CheckoutDelivery onApplyShipping={checkout.onApplyShipping} options={DELIVERY_OPTIONS} />
    </Form>
  );
}
