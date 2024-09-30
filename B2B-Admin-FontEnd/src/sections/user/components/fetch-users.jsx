import { useDispatch } from 'react-redux';
import { addressList, deleteAddress } from 'src/store/action/addressActions';
import { deleteUser, userList } from 'src/store/action/userActions';


export const useFetchUserData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(userList());
  };

  const fetchDeleteData = async (id) => {
    await dispatch(deleteUser(id));
  };

  return { fetchData, fetchDeleteData };
};



export const useFetchAddressData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(addressList());
  };

  const fetchDeleteData = async (id) => {
    await dispatch(deleteAddress(id));
  };

  return { fetchData, fetchDeleteData };
};
