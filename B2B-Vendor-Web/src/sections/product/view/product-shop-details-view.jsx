import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTabs } from 'src/hooks/use-tabs';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CartIcon } from '../components/cart-icon';
import { useCheckoutContext } from '../../checkout/context';
import { ProductDetailsSkeleton } from '../product-skeleton';
import { ProductDetailsReview } from '../product-details-review';
import { ProductDetailsSummary } from '../product-details-summary';
import { ProductDetailsCarousel } from '../product-details-carousel';
import { ProductDetailsDescription } from '../product-details-description';
import { Divider, Stack } from '@mui/material';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: '100% original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: '10 days replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Year warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'solar:shield-check-bold',
  },
];


// ----------------------------------------------------------------------

export function ProductShopDetailsView({ product }) {

  const checkout = useCheckoutContext();

  const tabs = useTabs('description');

  // if (loading) {
  //   return (
  //     <Container sx={{ mt: 5, mb: 10 }}>
  //       <ProductDetailsSkeleton />
  //     </Container>
  //   );
  // }

  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <CartIcon totalItems={checkout.totalItems} />

      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          { name: 'Shop', href: paths?.product?.root },
          { name: product?.name },
        ]}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel images={product?.productImages} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          {product && (
            <ProductDetailsSummary
              product={product}
              items={checkout.items}
              onAddCart={checkout.onAddToCart}
              onGotoStep={checkout.onGotoStep}
              disableActions={!product?.available}
            />
          )}
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        // sx={{ my: 10 }}
      >
        {/*
      {SUMMARY.map((item) => (
        <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
          <Iconify icon={item.icon} width={32}  className='text-primary' />

          <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }} >
            {item.title}
          </Typography>

          <Typography variant="body2"  className='text-black'>
            {item.description}
          </Typography>
        </Box>
      ))}
       */}

      </Box>


      <Divider sx={{ my: 5 }} />

      <Grid container spacing={3}>

        {/* Box 1: Additional Information */}
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>Additional Information</Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Typography variant="body2"><span className='bold'> Alias: </span> {product?.alias}</Typography>
              <Typography variant="body2"><span className='bold'> Part Number: </span> {product?.partNo}</Typography>
              <Typography variant="body2"><span className='bold'> Selling Price Date: </span> {product?.sellingPriceDate}</Typography>
            </Stack>
          </Box>
        </Grid>

        {/* Box 2: Tax & Unit Details */}
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>Tax & Unit Details</Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Typography variant="body2"><span className='bold'>  GST Applicable: </span> {product?.gstApplicable}</Typography>
              <Typography variant="body2"><span className='bold'>  GST Applicable Date: </span> {product?.gstApplicableDate}</Typography>
              <Typography variant="body2"><span className='bold'>  GST Rate: </span> {product?.gstRate}%</Typography>
              <Typography variant="body2"><span className='bold'>  Base Unit: </span> {product?.baseUnit}</Typography>
              <Typography variant="body2"><span className='bold'>  Alternate Unit: </span> {product?.alternateUnit}</Typography>
            </Stack>
          </Box>
        </Grid>

        {/* Box 3: Conversion & Dimensions */}
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>Conversion & Dimensions</Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Typography variant="body2"><span className='bold'>  Taxability: </span> {product?.taxability}</Typography>
              <Typography variant="body2"><span className='bold'>  Conversion: </span> {product?.conversion}</Typography>
              <Typography variant="body2"><span className='bold'>  Denominator: </span> {product?.denominator}</Typography>

              <Box>
                <Typography variant="body2" className='bold'>Dimensional Files:</Typography>
                <Divider sx={{ my: 2 }} />
                {product?.dimensionalFiles?.length > 0 ? (
                  <Stack direction="column" spacing={0.5} sx={{ ml: 2, mt: 1 }}>
                    {product.dimensionalFiles.map((file, index) => {
                      const isPdf = file.endsWith('.pdf');
                      return (
                        <Stack direction="row" spacing={1} alignItems="center" key={index}>
                          {isPdf ? (
                            <img
                              src="/pdf-logo/pdf.png"
                              alt="pdf"
                              style={{ width: 60, height: 60, objectFit: 'cover' }}
                            />
                          ) : (
                            <img
                              src={file}
                              alt={`Dimensional File ${index + 1}`}
                              style={{ width: 60, height: 60, objectFit: 'cover' }}
                            />
                          )}
                          <a
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: '#1976d2' }}
                          >
                            Download
                          </a>
                        </Stack>
                      );
                    })}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }} className='bold'>
                    No dimensional files available
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>
        </Grid>

      </Grid>

      <Divider sx={{ my: 2 }} />

      {/*
        <Card>
          <Tabs
            value={tabs?.value}
            onChange={tabs?.onChange}
            sx={{
              px: 3,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme?.vars?.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {[
              { value: 'description', label: 'Description' },
              { value: 'reviews', label: `Reviews (${product?.reviews?.length})` },
            ].map((tab) => (
              <Tab key={tab?.value} value={tab?.value} label={tab?.label} />
            ))}
          </Tabs>
  
          {tabs?.value === 'description' && (
            <ProductDetailsDescription description={product?.description} />
          )}
  
        </Card>
         */}
    </Container>
  );
}
