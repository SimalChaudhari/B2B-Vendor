import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTabs } from 'src/hooks/use-tabs';

import { varAlpha } from 'src/theme/styles';
import { PRODUCT_PUBLISH_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { ProductDetailsSkeleton } from '../components/product-skeleton';
import { ProductDetailsReview } from '../components/product-details-review';
import { ProductDetailsSummary } from '../components/product-details-summary';
import { ProductDetailsToolbar } from '../components/product-details-toolbar';
import { ProductDetailsCarousel } from '../components/product-details-carousel';
import { ProductDetailsDescription } from '../components/product-details-description';

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

const product = {
  id: 1,
  publish: 'published',
  images: [
    'https://5.imimg.com/data5/SELLER/Default/2022/11/KE/VX/MV/116453489/white-casual-shoes-for-men-500x500.jpg',
    'https://tiimg.tistatic.com/fp/1/008/421/men-laces-up-colorful-canvas-shoes-for-casual-wear-439.jpg',
    'https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/665715991691e4002b9c5c9e/white-shoes-4.jpg'
  ],
  description: 'This is a dummy description for a placeholder product. It includes various details about the item, its features, and benefits.',
  reviews: [
    { id: 1, name: 'John Doe', rating: 5, comment: 'Amazing product!', avatarUrl: "https://img.freepik.com/free-photo/bearded-man-with-striped-shirt_273609-7180.jpg" },
    { id: 2, name: 'Jane Smith', rating: 4, comment: 'Very good value for money.', avatarUrl: "https://img.freepik.com/free-photo/bearded-man-with-striped-shirt_273609-7180.jpg" },
    { id: 3, name: 'Alice Johnson', rating: 3, comment: 'It’s okay, could be better.', avatarUrl: "https://img.freepik.com/free-photo/bearded-man-with-striped-shirt_273609-7180.jpg" },
  ],
  totalRatings: 4.0,
  totalReviews: 3,
  ratings: [
    { name: '5 Star', starCount: 30, reviewCount: 30 },
    { name: '4 Star', starCount: 25, reviewCount: 25 },
    { name: '3 Star', starCount: 20, reviewCount: 20 },
    { name: '2 Star', starCount: 15, reviewCount: 15 },
    { name: '1 Star', starCount: 10, reviewCount: 10 },
  ]
};

// ----------------------------------------------------------------------

export function ProductView() {
  const tabs = useTabs('description');

  const [publish, setPublish] = useState('');

  useEffect(() => {
    if (product) {
      setPublish(product?.publish);
    }
  }, [product]);

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);


  return (
    <DashboardContent>
      <ProductDetailsToolbar
        // backLink={paths.products.products.root}
        // editLink={paths.dashboard.product.edit(`${product?.id}`)}
        // liveLink={paths.product.details(`${product?.id}`)}
        publish={publish}
        onChangePublish={handleChangePublish}
        publishOptions={PRODUCT_PUBLISH_OPTIONS}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel images={product?.images ?? []} />
        </Grid>
        <Grid xs={12} md={6} lg={5}>
          {product && <ProductDetailsSummary disableActions product={product} />}
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {[
            { value: 'description', label: 'Description' },
            { value: 'reviews', label: `Reviews (${product?.reviews.length})` },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabs.value === 'description' && (
          <ProductDetailsDescription description={product?.description ?? ''} />
        )}

        {tabs.value === 'reviews' && (
          <ProductDetailsReview
            ratings={product?.ratings ?? []}
            reviews={product?.reviews ?? []}
            totalRatings={product?.totalRatings ?? 0}
            totalReviews={product?.totalReviews ?? 0}
          />
        )}
      </Card>

    </DashboardContent>
  );
}
