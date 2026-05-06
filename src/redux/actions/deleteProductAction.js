import * as types from "./actionTypes";
import { deleteProductData } from "../apis/deleteProductApi";

export const deleteProductDataStart = () => ({
  type: types.DELETE_PRODUCT_DATA_START,
});

export const deleteProductDataSuccess = (id) => ({
  type: types.DELETE_PRODUCT_DATA_SUCCESS,
  payload: id,
});

export const deleteProductDataError = (error) => ({
  type: types.DELETE_PRODUCT_DATA_ERROR,
  payload: error,
});

export const deleteProductDataActionInitiate = (id) => {
  return async function (dispatch) {
    dispatch(deleteProductDataStart());

    try {
      await deleteProductData(id);
      dispatch(deleteProductDataSuccess(id));
      return true;   
    } catch (error) {
      dispatch(deleteProductDataError(error));
    }
  };
};