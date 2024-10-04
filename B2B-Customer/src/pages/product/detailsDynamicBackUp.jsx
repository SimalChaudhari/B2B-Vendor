import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
import { CONFIG } from 'src/config-global';
import { ProductShopDetailsView } from 'src/sections/product/view';
import { getproductListData } from 'src/Store/action/productActions';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const metadata = { title: `Product details - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();
  const { id = '' } = useParams();

  const productReducer = useSelector((state) => state.products || { getproductList: null });

  // Fetch product data
  useEffect(() => {
    console.log('Current productReducer state:', productReducer?.getproductList);

    const fetchProductData = async () => {
      try {
        // Check if productReducer has the required product
        if (!productReducer?.getproductList) {
          await dispatch(getproductListData(id)); // Fetch the product list based on ID
        }
      } catch (error) {
        toast.error('Failed to fetch products.');
      }
    };

    fetchProductData();
  }, [dispatch, id, productReducer?.getproductList]); // Use productReducer?.getproductList instead

  // Using the fetched product details from productReducer
  // const { product, productLoading, productError } = useGetProduct(id); // Fetch product, loading, and error states
   // Get product from productReducer
   const product = productReducer?.getproductList; // Use productReducer for product
   const productLoading = !product; // Assuming loading is true when product is not present
   const productError = product ? null : 'Product not found'; // Error message if product is not found
 

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <ProductShopDetailsView 
        product={product} 
        loading={productLoading} 
        error={productError} 
      />
    </>
  );
}
