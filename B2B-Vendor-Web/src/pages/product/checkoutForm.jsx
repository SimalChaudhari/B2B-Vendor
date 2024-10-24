import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { FormView } from 'src/sections/checkout/form/view/form-view';


// ----------------------------------------------------------------------

const metadata = { title: `CheckoutForm - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <div>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FormView />
    </div>
  );
}
