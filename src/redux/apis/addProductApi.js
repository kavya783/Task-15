import axios from "axios";




export const saveProductData = async (newProduct) => {
  try {
    console.log("Adding new Product:", newProduct);

    const response = await axios.post(`https://react-website-a6ea5-default-rtdb.firebaseio.com/db.json`, newProduct);

    console.log("Add response:", response);

    return response.data; // { name: "firebase-generated-id" }

  } catch (error) {
    console.error("Error in saveProductData:", error);
    throw error;
  }
};