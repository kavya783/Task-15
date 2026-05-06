import { fetchProductData } from '../apis/getProductApi';
import * as types from './actionTypes';


export const getProductDataStart = () => {
    return{
        type: types.LOAD_PRODUCT_DATA_START,
    }  
};

export const getProductDataSuccess = (data) => { 
    console.log("this is get action call----->")
    return{
        type: types.LOAD_PRODUCT_DATA_SUCCESS,
        payload: data,
    }  
};

export const getProductDataError = (error) => {
    return{
        type: types.LOAD_PRODUCT_DATA_ERROR,
        payload: error,
    } 
}
export const getProductDataActionInitiate = () => {
  return async function (dispatch) {
    dispatch(getProductDataStart());
  
    try {
      const res = await fetchProductData();

      dispatch(getProductDataSuccess(res)); 

    } catch (error) {
      dispatch(getProductDataError(error.message)); 
    }
  };
};