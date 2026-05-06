import axios from "axios";

export const deleteProductData = async (id) => {
  try {
    console.log("Deleting Product with ID:", id);
    const response = await axios.delete(`https://react-website-a6ea5-default-rtdb.firebaseio.com/db/${id}.json`);
    console.log("Delete response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in deleteProductData:", error);
    throw error;
  }
};