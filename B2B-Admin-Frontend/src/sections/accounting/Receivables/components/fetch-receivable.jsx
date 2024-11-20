import { useDispatch } from 'react-redux';
import { deleteReceivable, receivableGetByList, receivableList } from 'src/store/action/accountingActions';


export const useFetchData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(receivableList());
  };

  const fetchByIdData = async (id) => {
    await dispatch(receivableGetByList(id));
  };

  const fetchDeleteData = async (id) => {
    await dispatch(deleteReceivable(id));
  };


  return { fetchData, fetchByIdData ,fetchDeleteData};
};

