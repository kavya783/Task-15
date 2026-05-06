import * as types from "./actionTypes";
import { saveProductData } from "../apis/addProductApi";

export const addProductDataStart = () => 
  ({
     type: types.CREATE_PRODUCT_DATA_START });
export const addProductDataSuccess = (PRODUCT) => ({
  type: types.CREATE_PRODUCT_DATA_SUCCESS,
payload: PRODUCT 
});
export const addProductDataError = (error) => ({
  type: types.CREATE_PRODUCT_DATA_ERROR,
  payload: error
});

export const addProductDataActionInitiate = (Product) => {
  return async (dispatch) => {
    dispatch(addProductDataStart());
    try {
      const res = await saveProductData(Product);
      const newProduct = { ...Product, id: res.name }; // Firebase generated ID
      dispatch(addProductDataSuccess(newProduct));
    } catch (error) {
      dispatch(addProductDataError(error.message));
    }
  };
};