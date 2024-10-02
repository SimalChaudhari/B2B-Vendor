import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { ProductItem } from './product-item';
import { ProductItemSkeleton } from './product-skeleton';

import { useDispatch, useSelector } from 'react-redux';
import { productListData } from 'src/Store/action/productActions';
import { useEffect } from 'react';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export function ProductList({ products, loading, ...other }) {
  console.log(products, " products 111");
  const dispatch = useDispatch();
  const productReducer = useSelector((state) => state?.products?.product);
  console.log(productReducer, " productReducer 111");

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        if (!productReducer?.product || productReducer.product.length === 0) {
          await dispatch(productListData());
        }
      } catch (error) {
        toast?.error('Failed to fetch products.');
      }
    };

    fetchProductData();
  }, [dispatch]);

  const renderLoading = <ProductItemSkeleton />;

  const renderList = productReducer.map((product) => <ProductItem key={product.id} product={product} />);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        {...other}
      >
        {loading ? renderLoading : renderList}
      </Box>

      {products.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
