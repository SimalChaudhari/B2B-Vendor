import { useDispatch } from 'react-redux';
import { ledgerList, ledgerGetByList } from 'src/store/action/accountingActions';


export const useFetchData = () => {
    const dispatch = useDispatch();

    const fetchData = async () => {
        await dispatch(ledgerList());
    };

    const fetchByIdData = async (id) => {
        await dispatch(ledgerGetByList(id));
    };


    return { fetchData, fetchByIdData };
};

