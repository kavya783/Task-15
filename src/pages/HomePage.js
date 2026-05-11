import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductDataActionInitiate } from "../redux/actions/getProductAction";
import Carousel from "react-material-ui-carousel";
import { Box, Card, CardContent, Rating, Tooltip, Typography, Button } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Colors from "../colors";
import { Theme } from "../GlobalStyles";
import PercentIcon from '@mui/icons-material/Percent';
import Journal from "../components/Journal";
import { useRef } from "react";
import { Snackbar } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { toast } from "react-toastify";
function HomePage({ cartItems, setCartItems }) {
  const [snackOpen, setSnackOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const footerRef = useRef(null);

  const { data = [], loading, error } = useSelector(
    (state) => state.getproductdata
  );
const handleCart = (product) => {
  setCartItems((prev) => {
    const existingItem = prev.find(
      (item) => item.name === product.name
    );

    if (existingItem) {
      return prev.map((item) =>
        item.name === product.name
          ? {
              ...item,
              quantity: (item.quantity || 1) + 1,
            }
          : item
      );
    }

    return [
      ...prev,
      {
        ...product,
        quantity: 1,
      },
    ];
  });

  toast.success("Item Added To Cart");
};
  // const scrollRef = useRef(null);
  const scrollRefs = useRef([]);
  const scrollLeft = (index) => {
    scrollRefs.current[index]?.scrollBy({
      left: -300,
      behavior: "smooth"
    });
  };

  const scrollRight = (index) => {
    scrollRefs.current[index]?.scrollBy({
      left: 300,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    dispatch(getProductDataActionInitiate());
  }, [dispatch]);

  const carouselData =
    Array.isArray(data)
      ? data.find((item) => item.carousel)?.carousel || []
      : [];
  const homepageData =
    Array.isArray(data)
      ? data.find((item) => item.homepage)?.homepage || []
      : [];

  console.log("homepageData", data[2]);
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;
  console.log(homepageData);
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
      <Box
        sx={{
          ml: { xs: 3, md: 15 },
          mr: { xs: 3, md: 15 },

          "&::-webkit-scrollbar": {
            height: "6px"
          },
        }}
      >



        {homepageData.map((item, index) => (
          <Box key={index} sx={{ mb: 5 }}>

            <Typography variant="h4" sx={{
              ml: { xs: 2, md: 1, },
              mt: 4,
              mb: 1,
              fontSize: Theme.font18Bold,
              color: Colors.gray
            }}
            >
              {item.title}
            </Typography>

            <Typography sx={{
              ml: { xs: 2, md: 1 },
              mb: 3,
              fontSize: Theme.font14SemiBold,
              color: Colors.gray
            }}>
              {item.subheading}
            </Typography>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center"
              }}
            >
              <ArrowBackIosIcon
                onClick={() => scrollLeft(index)}
                sx={{
                  cursor: "pointer",
                  position: "absolute",
                  left: 0,
                  zIndex: 20,
                  background: "white",
                  borderRadius: "50%",
                  p: 1,
                  boxShadow: 2
                }}
              />

              <Box
                ref={(el) => (scrollRefs.current[index] = el)}
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  scrollBehavior: "smooth",

                  scrollbarWidth: "none",
                  msOverflowStyle: "none",

                  "&::-webkit-scrollbar": {
                    display: "none"
                  }
                }}
              >

                {item.data?.map((item1, index1) => (

                  <Card
                    sx={{
                      position: "relative",
                      minWidth: { xs: 230, sm: 230, md: 250 },
                      maxWidth: { xs: 200, sm: 230, md: 250 },
                      flexShrink: 0,
                      boxShadow: 2,
                      borderRadius: 3,
                      p: 0,
                      backgroundColor: Colors.white,
                      borderLeft: `1px solid ${Colors.border}`,
                      borderBottom: `1px solid ${Colors.border}`,
                      borderRight: `1px solid ${Colors.border}`,
                      display: "flex",
                      flexDirection: "column",
                      height: { xs: 490, sm: 480, md: 550 }
                    }}
                  >
                    <Box
                      component="img"
                      src={item1.image}
                      onClick={() => navigate('/productdetails', { state: { item: item1 } })}

                      sx={{
                        width: "100%",
                        height: 220,
                        objectFit: "cover",
                        borderRadius: 2,
                        cursor: "pointer"
                      }}
                    />
                    {item1.static && (
                      <Typography
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          backgroundColor: Colors.background,
                          color: Colors.brown,
                          px: 1,
                          py: 0.4,
                          fontSize: Theme.font12Bold,
                          borderRadius: 1,
                          zIndex: 10,
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 1,
                          borderBottomRightRadius: 8
                        }}
                      >
                        {item1.static}
                      </Typography>
                    )}


                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        flex: 1
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: "auto",
                          ml: 1
                        }}
                      >
                        <Rating
                          value={parseFloat(item1.rating)}
                          precision={0.1}
                          readOnly
                          size="small"
                        />

                        <Typography sx={{ fontSize: "11px" }}>
                          {item1.rating}
                        </Typography>
                      </Box>



                      <Typography
                        sx={{
                          mt: "auto",
                          fontSize: Theme.font16Bold,
                          minHeight: 42,
                          ml: 1,
                          display: { xs: "none", md: "flex" },
                          mb: 2
                        }}
                      >
                        {item1.name}
                      </Typography>

                      <Tooltip title={item1.name} arrow>
                        <Typography
                          sx={{
                            color: Colors.black,
                            fontSize: Theme.font16Bold,

                            display: { xs: "-webkit-box", md: "none" },

                            overflow: "hidden",
                            textOverflow: "ellipsis",

                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",

                            lineHeight: 1.4,
                            minHeight: "38px",
                            maxWidth: "170px",
                            ml: 2
                          }}
                        >
                          {item1.name}
                        </Typography>
                      </Tooltip>
                      <Typography
                        sx={{
                          mt: "auto",
                          color: "#555",
                          fontSize: Theme.font12SemiBold,
                          lineHeight: 1.5,
                          minHeight: 30,
                          ml: 0,
                          mb: 2

                        }}
                      >{item1.heading}</Typography>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            ml: 1,
                            mt: "auto",
                          }}
                        >
                          <Typography sx={{ fontSize: Theme.font14Bold }}>
                            {item1.price}
                          </Typography>

                          {item1.discount && (
                            <Typography
                              sx={{
                                color: "gray",
                                textDecoration: "line-through",
                                fontSize: Theme.font10SemiBold
                              }}
                            >
                              {item1.discount}
                            </Typography>
                          )}

                          <Typography sx={{ fontSize: Theme.font14Bold, ml: "auto", mr: 1 }}>
                            {item1.offer}
                          </Typography>
                        </Box>

                        <Typography sx={{ color: "green", fontSize: "12px", ml: 1, mt: "auto", }}>
                          <PercentIcon sx={{ fontSize: 15, background: Colors.green, color: Colors.white }} />
                          {item1.get}
                        </Typography>

                        <Button
                          fullWidth
                          sx={{
                            color: Colors.black,
                            fontSize: Theme.font14Bold,

                            background: Colors.yellow,
                            borderRadius: 10,
                            mb: 1,
                            mt: "auto",
                          }}
                       onClick={() => handleCart(item1)}  
                        >
                          <ShoppingBagOutlinedIcon fontSize="small" />
                          ADD To Cart
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>

                ))}


              </Box>
              <ArrowForwardIosIcon
                onClick={() => scrollRight(index)}
                sx={{
                  cursor: "pointer",
                  position: "absolute",
                  right: 0,
                  zIndex: 20,
                  background: "white",
                  borderRadius: "50%",
                  p: 1,
                  boxShadow: 2
                }}
              />
            </Box>
          </Box>
        ))}
        <Box sx={{ ml: 0 }}>
          <Journal />
        </Box>

      </Box>
      <div id="footer">
        <Footer />
      </div>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        message="Product added to cart"
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      />
    </Box>

  )
}




export default HomePage;