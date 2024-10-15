import React, { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { useDispatch, useSelector } from "react-redux";
import { ProductShopView } from 'src/sections/product/view';
import { fetchProductsFailure, fetchProductsStart, fetchProductsSuccess } from 'src/redux/ProductReducer';
import { fetchItems } from 'src/services/productApi';

// Metadata for the page title
const metadata = { title: `Product shop - ${CONFIG.site.name}` };

// Mock Login Component (replace with your actual Login component)
const LoginScreen = () => <p>Please log in to view products.</p>;

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


  // Show login screen if no products are available
  if (!products || products.length === 0) {
    return <LoginScreen />;
  }

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      {/* Render product view if products exist */}
      <ProductShopView products={products.data} loading={productsLoading} />
    </>
  );
}
