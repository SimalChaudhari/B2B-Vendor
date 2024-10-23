import { useDispatch } from 'react-redux';
import { deleteOrder, orderList } from 'src/store/action/orderActions';


export const useFetchOrderData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(orderList());
  };

  const fetchDeleteData = async (id) => {

    try {
      const response = await dispatch(deleteOrder(id));;
      if (response) {
        fetchData(); // Refetch product data only on successful deletion
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return { fetchData, fetchDeleteData };
};

