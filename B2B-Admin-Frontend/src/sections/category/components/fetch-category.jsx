import { useDispatch } from 'react-redux';
import { categoryList, deleteCategory } from 'src/store/action/categoryActions';


export const useFetchCategoryData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(categoryList());
  };

  const fetchDeleteData = async (id) => {
    try {
      const response = await dispatch(deleteCategory(id));
      if (response) {
        fetchData(); // Refetch category data only on successful deletion
      } 
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return { fetchData, fetchDeleteData };
};
