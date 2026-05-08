
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppBarr from "./components/appBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupForm from "./components/SignupForm";
import { ToastContainer } from "react-toastify";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsDetailsPage from "./pages/ProductsDetailsPage";
import { auth} from "./firebase"
import { useEffect, useState } from "react";
import {db} from "./firebase";



function App() {
   const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
   useEffect(() => {
       localStorage.setItem("cartItems", JSON.stringify(cartItems));
     }, [cartItems]);
   
  return (
    
<Provider store={store}>
   <BrowserRouter>
 <AppBarr cartItems={cartItems} setCartItems={setCartItems} />
  <Routes>
    <Route path="/" element={
      <HomePage
       cartItems={cartItems}
        setCartItems={setCartItems} />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupForm />} />
    <Route
      path="/profilepage"
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />
    <Route
  path="/productdetails"
  element={
    <ProductsDetailsPage
      cartItems={cartItems}
      setCartItems={setCartItems}
    />
  }
/>
  </Routes>

  <ToastContainer />
</BrowserRouter>
    </Provider>
  );
}

export default App;





      
      