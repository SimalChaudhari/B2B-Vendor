import { useDispatch } from 'react-redux';
import { deleteSubCategory, subcategoryList } from 'src/store/action/subcategoryActions';


export const useFetchSubCategoryData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(subcategoryList());
  };

  const fetchDeleteData = async (id) => {
    try {
      const response = await dispatch(deleteSubCategory(id));
      if (response) {
        fetchData(); // Refetch category data only on successful deletion
      } 
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return { fetchData, fetchDeleteData };
};
