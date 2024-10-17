import { useDispatch } from 'react-redux';
import { deleteContact, contactList } from 'src/store/action/settingActions';


export const useFetchContactData = () => {
    const dispatch = useDispatch();

    const fetchContactData = async () => {
        await dispatch(contactList());
    };

    const fetchDeleteContactData = async (id) => {

        try {
            const response = await dispatch(deleteContact(id));;
            if (response) {
                fetchContactData(); // Refetch contact data only on successful deletion
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    };


    return { fetchContactData, fetchDeleteContactData };
};
