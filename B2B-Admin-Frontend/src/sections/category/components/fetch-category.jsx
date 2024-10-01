import { useDispatch } from 'react-redux';
import { categoryList, deleteCategory } from 'src/store/action/categoryActions';


export const useFetchCategoryData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(categoryList());
  };

  const fetchDeleteData = async (id) => {
    await dispatch(deleteCategory(id));
  };

  return { fetchData, fetchDeleteData };
};
