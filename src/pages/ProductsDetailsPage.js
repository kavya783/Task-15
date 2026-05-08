import {
  Box,
  Button,
  Rating,
  Typography,
  IconButton,
  Modal,
  Snackbar
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { Theme } from "../GlobalStyles";
import Colors from "../colors";

import PercentIcon from "@mui/icons-material/Percent";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import "swiper/css";
import "swiper/css/mousewheel";

import Footer from "../components/Footer";

function ProductsDetailsPage({ cartItems = [], setCartItems }) {
  const [snackOpen, setSnackOpen] = useState(false);

  const location = useLocation();
  const item = location.state?.item;

  const swiperRef = useRef(null);

  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);

  if (!item) {
    return <Typography sx={{ mt: 10 }}>No Product Found</Typography>;
  }

  // JSON structure batti images
  const images = [
    item.image,
    item.subimages?.[0]?.image1,
    item.subimages?.[0]?.image2,
    item.subimages?.[0]?.image3,
    item.subimages?.[0]?.image4
  ].filter(Boolean);

  const handleCart = (item1) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.name === item1.name
    );

    if (existingItemIndex !== -1) {
      const updatedCart = cartItems.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
          : cartItem
      );

      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...item1, quantity: 1 }]);
    }

    setSnackOpen(true);
  };

  return (
    <Box
      sx={{
        mt: { xs: 12, md: 18 },
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          flex: 1
        }}
      >
        {/* LEFT SIDE */}

        <Box
          sx={{
            width: { xs: "100%", md: "52%" },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "90px 1fr" },
            gap: 2
          }}
        >
          

          <Box
            sx={{
              display: { xs: "block", md: "none" },
              position: "relative",
              mt: { xs: 3, sm: 5 }
            }}
          >
            <Box
              component="img"
              src={images[value]}
              onClick={() => setOpen(true)}
              sx={{
                width: "100%",
                height: { xs: 300, sm: 700 },
                borderRadius: 4,
                objectFit: "cover",
                cursor: "zoom-in",
                boxShadow: 4
              }}
            />

            <Box
              sx={{
                position: "absolute",
                bottom: 15,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 1
              }}
            >
              {images.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setValue(index)}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    cursor: "pointer",
                    backgroundColor:
                      value === index ? "#000" : "#d4b483"
                  }}
                />
              ))}
            </Box>
          </Box>

      

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
              ml: { md: 0, lg: 20 }
            }}
          >
            <IconButton onClick={() => swiperRef.current?.slidePrev()}>
              <KeyboardArrowUpIcon />
            </IconButton>

            <Box sx={{ width: 90, height: 360 }}>
              <Swiper
                direction="vertical"
                slidesPerView={4}
                spaceBetween={8}
                mousewheel={true}
                modules={[Mousewheel]}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                style={{ height: "100%" }}
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <Box
                      component="img"
                      src={img}
                      onClick={() => setValue(index)}
                      sx={{
                        width: 75,
                        height: 75,
                        borderRadius: 2,
                        cursor: "pointer",
                        objectFit: "cover",
                        border:
                          value === index
                            ? "2px solid black"
                            : "1px solid #ddd"
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>

            <IconButton onClick={() => swiperRef.current?.slideNext()}>
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>

       

          <Box
            sx={{
              position: "relative",
              display: { xs: "none", md: "block" }
            }}
          >
            <Box
              component="img"
              src={images[value]}
              onClick={() => setOpen(true)}
              sx={{
                width: { md: 450, lg: "80%" },
                height: { md: 500, lg: 500 },
                borderRadius: 4,
                objectFit: "cover",
                cursor: "zoom-in",
                ml: { md: 0, lg: 15 },
                boxShadow: 4
              }}
            />
          </Box>

       

          <Modal open={open} onClose={() => setOpen(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                outline: "none"
              }}
            >
              <IconButton
                onClick={() => setOpen(false)}
                sx={{
                  position: "absolute",
                  top: -15,
                  right: -15,
                  bgcolor: "white",
                  zIndex: 2
                }}
              >
                <CloseIcon />
              </IconButton>

              <Box
                component="img"
                src={images[value]}
                sx={{
                  width: "100%",
                  maxHeight: "90vh",
                  objectFit: "contain",
                  borderRadius: 3
                }}
              />
            </Box>
          </Modal>
        </Box>

      

        <Box
          sx={{
            width: { xs: "100%", md: "48%" },
            ml: { xs: 0, sm: 0, md: 10, lg: 0 }
          }}
        >
          <Typography
            sx={{
              fontSize: Theme.headings,
              color: Colors.gray,
              ml: 1
            }}
          >
            {item.name}
          </Typography>

       

          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
              flexWrap: "wrap",
              ml: { xs: 2, md: 1 }
            }}
          >
            {item.features?.map((feature, i) => (
              <Typography
                key={i}
                sx={{
                  border: "1px solid #ddd",
                  px: 1,
                  py: 0.5,
                  borderRadius: 2
                }}
              >
                {feature}
              </Typography>
            ))}
          </Box>

          

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              alignItems: "center",
              ml: { xs: 2, md: 1 }
            }}
          >
            <Rating
              value={parseFloat(item.rating)}
              precision={0.1}
              readOnly
              size="small"
            />

            <Typography>{item.rating}</Typography>
          </Box>

  
          <Typography
            sx={{
              fontSize: Theme.headings,
              fontWeight: 700,
              mt: 2,
              ml: { xs: 2, md: 1 }
            }}
          >
            {item.price}
          </Typography>

         

          <Typography sx={{ mt: 1, ml: { xs: 2, md: 1 } }}>
            {item.text}
          </Typography>

          

          <Typography
            sx={{
              color: "green",
              mt: 2,
              display: "flex",
              alignItems: "center",
              ml: { xs: 2, md: 1 }
            }}
          >
            <PercentIcon
              sx={{
                background: Colors.green,
                color: "#fff",
                borderRadius: "50%",
                mr: 1
              }}
            />

            {item.get}
          </Typography>

     

          <Typography
            sx={{
              mt: 3,
              fontWeight: 700,
              ml: { xs: 2, md: 1 }
            }}
          >
            Secure checkout with:
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
              flexWrap: "wrap",
              ml: { xs: 2, md: 1 }
            }}
          >
            {item["Secure-checkout"]?.map((img, index) => (
              <Box
                key={index}
                component="img"
                src={img}
                sx={{
                  width: 55,
                  height: 34,
                  border: "1px solid #ddd",
                  borderRadius: 1
                }}
              />
            ))}
          </Box>

  

          <Box sx={{ mt: 4 }}>
            <Button
              fullWidth
              sx={{
                color: Colors.black,
                fontSize: Theme.font14Bold,
                mt: 1,
                background: Colors.yellow,
                gap: 1,
                borderRadius: 10,
                ml: 1,
                mb: 3,
                width: 220
              }}
              onClick={() => handleCart(item)}
            >
              <ShoppingBagOutlinedIcon fontSize="small" />
              ADD TO CART
            </Button>
          </Box>
        </Box>
      </Box>

   

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        message="Product added to cart successfully"
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      />

      <Box sx={{ mt: "auto", width: "100%" }}>
        <div id="footer">
  <Footer />
</div>
      </Box>
    </Box>
  );
}

export default ProductsDetailsPage;