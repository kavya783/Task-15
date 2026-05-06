import { combineReducers } from "redux";

import { getProductReducer } from "./getProductReducer";
import { postReducer } from "./addProductReducer";
import { deleteReducer } from "./deleteProductReducer";
import { putReducer } from "./updateProductReducer";



 export  const rootReducer = combineReducers({
  getproductdata:getProductReducer,
   postproductata:postReducer,
   deleteproductdata:deleteReducer,
   updateproductdata:putReducer,
   
})

export default rootReducer;