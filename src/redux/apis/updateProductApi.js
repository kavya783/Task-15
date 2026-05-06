import axios from "axios";


const endPoints = "Product";

export const updateProductData = async (Product, id) => {
  const response = await axios.put(
    `https://react-website-a6ea5-default-rtdb.firebaseio.com/${endPoints}/${id}.json`,
    Product
  );
  return response.data;
};