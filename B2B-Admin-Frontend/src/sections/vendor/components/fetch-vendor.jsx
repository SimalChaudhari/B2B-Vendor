import { useDispatch } from 'react-redux';
import { deleteVendor, vendorList } from 'src/store/action/vendorActions';

export const useFetchVendorData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(vendorList());
  };

  const fetchDeleteData = async (id) => {

    try {
      const response = await dispatch(deleteVendor(id));;
      if (response) {
        fetchData(); // Refetch 
      }
    } catch (error) {
      console.error("Error deletingVendor:", error);
    }
  };


  return { fetchData, fetchDeleteData };
};

