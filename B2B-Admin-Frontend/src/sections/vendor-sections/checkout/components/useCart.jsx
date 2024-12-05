// useCart.js
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { cartList } from 'src/store/action/cartActions';

const useCart = () => {
  const dispatch = useDispatch();
  
  const addToCartData = useSelector((state) => state.cart?.cart || []);
  console.log("🚀 ~ useCart ~ addToCartData:", addToCartData)

  useEffect(() => {
    dispatch(cartList());
  }, [dispatch]);

  const mappedData = addToCartData.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    stockQuantity: item.stockQuantity,
    userId: item.userId,
    price: item.product.sellingPrice,
    totalAmount: item.product.sellingPrice * item.quantity,
    name: item.product.itemName,
    productID: item.product.id,
    dimensionalFiles: item.product.dimensionalFiles,
  }));

  return mappedData;
};

export default useCart;
