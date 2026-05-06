import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductDataActionInitiate } from "../redux/actions/getProductAction";
import Carousel from "react-material-ui-carousel";
import { Box } from "@mui/material";
import BestSellers from "../components/BestSellers";
import PowerCare from "../components/PowerCare";
import FreshSeason from "../components/FreshSeason";
import NewLaunches from "../components/NewLaunches";
import Vinci from "../components/Vinci";
import Journal from "../components/Journal";
import Footer from "../components/Footer";


function HomePage({ cartItems, setCartItems }) {

  const dispatch = useDispatch();

  const { data = [], loading, error } = useSelector(
    (state) => state.getproductdata
  );

  useEffect(() => {
    dispatch(getProductDataActionInitiate());
  }, [dispatch]);

  const carouselData =
    Array.isArray(data)
      ? data.find((item) => item.carousel)?.carousel || []
      : [];

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <Box
      sx={{
        mt: { xs: 13, sm: 13, md: 16, lg: 12 },
        width: "100%",
        overflow: "hidden"
      }}
    >
      {carouselData.length > 0 && (
        <Carousel
          autoPlay
          interval={2000}
          animation="slide"
          navButtonsAlwaysInvisible
          indicators
        >
          {carouselData.map((item, index) => (
            <Box
              key={index}
              component="img"
              src={item.image}
              sx={{
                width: "100%",
                height: {
                  xs: "220px",
                  sm: "320px",
                  md: "450px",
                  lg: "550px"
                },
              
                display: "block"
              }}
            />
          ))}
        </Carousel>
      )}
      <BestSellers  
        cartItems={cartItems}
        setCartItems={setCartItems}/>
      <PowerCare  
         cartItems={cartItems}
        setCartItems={setCartItems}/>
      <FreshSeason  
      cartItems={cartItems}
      setCartItems={setCartItems}/>
      <NewLaunches   
        cartItems={cartItems}
        setCartItems={setCartItems} />
      <Vinci  
        cartItems={cartItems}
        setCartItems={setCartItems}/>
      <Journal/>
      <Footer/>
    </Box>
    
  );
  
}

export default HomePage;