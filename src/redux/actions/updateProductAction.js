import { updateProductData } from '../apis/updateProductApi';
import * as types from './actionTypes';


export const updateProductDataStart = () => {
  return {
    type: types.UPDATE_PRODUCT_DATA_START,
  }
};

export const updatePProductDataSuccess = (data) => {
  console.log("this is update action call----->")
  return {
    type: types.UPDATE_PRODUCT_DATA_SUCCESS,
    payload: data,
  }
};

export const updateProductDataError = (error) => {
  return {
    type: types.UPDATE_PRODUCT_DATA_ERROR,
    payload: error,
  }
}
export const updateProductDataActionInitiate = (Product, id) => {
  return async (dispatch) => {
    dispatch(updateProductDataStart());
    try {
       await updateProductData(Product, id);
      dispatch(updateProductDataSuccess({ ...Product, id }));
    } catch (error) {
      dispatch(updateProductDataError(error.message));
    }
  };
};