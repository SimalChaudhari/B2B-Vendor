
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ProductCardList } from './product-card-list';
import { _mock } from 'src/_mock';
import { useFetchProductData } from '../components/fetch-product';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Iconify } from 'src/components/iconify';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

export function ProductListView() {

  const { fetchData } = useFetchProductData(); // Destructure fetchData from the custom hook

  const productData = useSelector((state) => state.product?.product || []);
  //----------------------------------------------------------------------------------------------------
  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []);

  return (
    <DashboardContent maxWidth="2xl">
      <CustomBreadcrumbs
        heading="List Of Products"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Products', href: paths?.dashboard?.product?.root },
          { name: 'List' },
        ]}

        action={
          <Button
            size="large"
            color="success"
            variant="contained"
            startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
            sx={{
              px: 4,
              whiteSpace: 'nowrap',
              width: '100%' // Ensure full width on all screens
            }}
          >
            Cart List
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductCardList products={productData} />
    </DashboardContent>
  );
}
