import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
import { CONFIG } from 'src/config-global';
import { useGetProduct } from 'src/actions/product';
import { ProductShopDetailsView } from 'src/sections/product/view';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Container } from '@mui/material'; // Import Container if you're using Material-UI
import { ProductDetailsSkeleton } from 'src/sections/product/product-skeleton';
import { fetchProductsFailure, fetchProductsStart, fetchProductsSuccess } from 'src/redux/ProductReducer';
import { fetchItems } from 'src/services/productApi';

// ----------------------------------------------------------------------

const metadata = { title: `Product details - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();
  const dispatch = useDispatch();
  
  // Fetch product data from Redux store
  const ProductData = useSelector((state) => state.product.items.data) || []; // Ensure ProductData is an array
  const ProductLoading = useSelector((state) => state.product.loading); // Ensure ProductData is an array
  const productFilterData = ProductData.find(item => item.id === id) || null;
  const { productLoading } = useGetProduct(id);

  // Fetch products if ProductData is empty
  useEffect(() => {
    const getProducts = async () => {
      dispatch(fetchProductsStart());

      try {
        const data = await fetchItems();
        dispatch(fetchProductsSuccess(data));
      } catch (error) {
        dispatch(fetchProductsFailure(error.message));
      }
    };

    // Fetch products only if ProductData is empty
    if (ProductData.length === 0) {
      getProducts();
    }
  }, [ProductData.length, dispatch]); // Add ProductData.length as a dependency

  // Display loading skeleton if products are being fetched
  if (ProductLoading) {
    return (
      <Container sx={{ mt: 5, mb: 10 }}>
        <ProductDetailsSkeleton />
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      {/* Render the product details if data is available */}
      <ProductShopDetailsView product={productFilterData} />
    </>
  );
}
