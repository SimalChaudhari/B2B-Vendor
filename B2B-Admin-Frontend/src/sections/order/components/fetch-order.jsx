import { useDispatch } from 'react-redux';
import { deleteOrder, orderGetByList, orderList } from 'src/store/action/orderActions';


export const useFetchOrderData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(orderList());
  };

  const fetchByIdData = async (id) => {
    await dispatch(orderGetByList(id));
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

  return { fetchData, fetchByIdData, fetchDeleteData };
};

