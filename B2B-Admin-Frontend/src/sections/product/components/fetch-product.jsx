import { useDispatch } from 'react-redux';
import { addressList, deleteAddress } from 'src/store/action/addressActions';
import { deleteProduct, productList } from 'src/store/action/productActions';


export const useFetchProductData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(productList());
  };

  const fetchDeleteData = async (id) => {

    try {
      const response = await dispatch(deleteProduct(id));;
      if (response) {
        fetchData(); // Refetch product data only on successful deletion
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };


  return { fetchData, fetchDeleteData };
};

