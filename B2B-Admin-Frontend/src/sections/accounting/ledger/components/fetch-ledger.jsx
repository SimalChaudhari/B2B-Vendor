import { useDispatch } from 'react-redux';
import { ledgerList, deleteAllLedger } from 'src/store/action/accountingActions';


export const useFetchData = () => {
    const dispatch = useDispatch();

    const fetchData = async () => {
        await dispatch(ledgerList());
    };

    const fetchDeleteData = async (id) => {
        await dispatch(deleteAllLedger(id));
    };

    return { fetchData, fetchDeleteData };
};

