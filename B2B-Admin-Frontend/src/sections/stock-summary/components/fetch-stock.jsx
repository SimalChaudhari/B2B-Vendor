import { useDispatch } from 'react-redux';
import { stockList } from 'src/store/action/stockSummaryActions';


export const useFetchStockData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(stockList());
  };




  return { fetchData};
};

