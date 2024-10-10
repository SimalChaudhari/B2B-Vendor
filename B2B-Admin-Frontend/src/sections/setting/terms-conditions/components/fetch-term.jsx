import { useDispatch } from 'react-redux';
import { deleteTerm, termList } from 'src/store/action/settingActions';


export const useFetchTermData = () => {
    const dispatch = useDispatch();

    const fetchTermData = async () => {
        await dispatch(termList());
    };

    const fetchDeleteTermData = async (id) => {

        try {
            const response = await dispatch(deleteTerm(id));;
            if (response) {
                fetchTermData(); // Refetch Term data only on successful deletion
            }
        } catch (error) {
            console.error("Error deleting Term:", error);
        }
    };


    return { fetchTermData, fetchDeleteTermData };
};
