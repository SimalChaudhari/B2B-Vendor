import React, { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { useDispatch, useSelector } from "react-redux";
import { ProductShopView } from 'src/sections/product/view';
import { fetchProductsFailure, fetchProductsStart, fetchProductsSuccess } from 'src/redux/ProductReducer';
import { fetchItems } from 'src/services/productApi';
import { Container } from '@mui/material'; 
import { EmptyContent } from "src/components/empty-content";

// Metadata for the page title
const metadata = { title: `Product shop - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  // Get product data from Redux store
  const { items: products, loading: productsLoading } = useSelector((state) => state.product);

  // Fetch products on component mount
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

    getProducts();
  }, [dispatch]);

  // Check for loading state or no products
  if (productsLoading) {

    // return <p><ProductItemSkeleton /></p>; // Optionally add a loading state message
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p style={{ fontSize: '16px', fontWeight: 'bold',  }}>Loading products...</p>
    </div>
  }

  const renderNotFound = <EmptyContent filled sx={{ py: 10 }} />;
  // Show "No Data" message if no products are available
  if (!products || products?.length === 0) {
    return (
      <Container style={{ textAlign: 'center', marginTop: '200px'}}>
      {renderNotFound}
      </Container>
    );
  }

  // Render product view if products exist
  return (
    <div>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <ProductShopView products={products.data} loading={productsLoading} />
    </div>
  );
}
