import axios from "axios";

export const fetchProductData = async () => {
  try {
    const response = await axios.get(
      "https://react-website-a6ea5-default-rtdb.firebaseio.com/productdetails.json"
    );

    const data = response.data;

    console.log("API response:", data);

    if (!data) return [];

   
    return Object.values(data);

  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  }
};