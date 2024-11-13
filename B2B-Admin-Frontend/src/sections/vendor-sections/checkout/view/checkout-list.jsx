
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { _mock } from 'src/_mock';
import { CheckoutView } from './checkout-view';

// ----------------------------------------------------------------------

export function CheckoutListView() {
  return (
    <DashboardContent maxWidth="2xl">
      <CustomBreadcrumbs
        heading="Product Listing"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Products', href: paths?.dashboard?.items?.root },
          { name: 'List' },
        ]}

        sx={{ mb: { xs: 3, md: 4 } }}
      />

      <CheckoutView />
    </DashboardContent>
  );
}
