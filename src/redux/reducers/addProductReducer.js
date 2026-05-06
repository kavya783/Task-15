import * as types from '../actions/actionTypes'

const initialState={
    data:[],
    loading:false,
    error:null
}

export const postReducer=(state=initialState,action)=>{

    switch(action.type){
        case types.CREATE_PRODUCT_DATA_START:
        return{
            ...state,
            loading:true,
            error:null
        }

        case types.CREATE_PRODUCT_DATA_SUCCESS:
        return{
            ...state,
           data: [...state.data, action.payload] ,
            loading:false,
            error:null
        }

        case types.CREATE_PRODUCT_DATA_ERROR:
        return {
            ...state,
            loading: false,
            error: action.payload
        };

        default:
        return state;
    }
}