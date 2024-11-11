import { useDispatch } from 'react-redux';
import {itemList } from 'src/store/action/productActions';


export const useFetchStockData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(itemList());
  };




  return { fetchData};
};

