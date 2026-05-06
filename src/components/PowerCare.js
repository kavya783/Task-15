import { Box, Rating, Button, Typography, Tooltip } from "@mui/material";
import { Theme } from "../GlobalStyles";
import { useSelector } from "react-redux";
import Colors from "../colors";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PercentIcon from '@mui/icons-material/Percent';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Drawer } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
function PowerCare({ cartItems = [], setCartItems }) {

  const [snackOpen, setSnackOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data = [] } = useSelector(
    (state) => state.getproductdata || {}
  );

  const cards1Data =
    Array.isArray(data)
      ? data.find((item) => item.cards1)?.cards1 || []
      : [];
  const isInCart = (item) => {
    return cartItems.some((cartItem) => cartItem.description === item.description);
  };
  const handleCart = (item) => {
    if (isInCart(item)) {

      setCartItems(cartItems.filter(
        (cartItem) => cartItem.description !== item.description
      ));
    } else {

      setCartItems([...cartItems, item]);
      setSnackOpen(true);
    }
  };


  return (
    <>
      <Typography sx={{
        ml: { xs: 2, md: 15 },
        mt: 4,
        mb: 1,
        fontSize: Theme.font18Bold,
        color: Colors.gray
      }}>Power Care Combos</Typography>
      <Typography sx={{
        ml: { xs: 2, md: 15 },
        mt: 1,
        fontSize: Theme.font14SemiBold,
        mb: 3,
        color: Colors.gray
      }}>Essentials that works from root to glow</Typography>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1450px",
          mx: "auto",
          overflow: "hidden",
          px: { xs: 1, sm: 2, md: 2 }
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            scrollBehavior: "smooth",
            pb: 2,

            ml: { xs: 3, md: 15 },
            mr: { xs: 3, md: 15 },

            "&::-webkit-scrollbar": {
              height: "6px"
            },
          }}
        >
          {cards1Data.slice(0, 9).map((item, index) => (
            <Box

              key={index}
              sx={{
                minWidth: {
                  xs: 230,
                  sm: 230,
                  md: 250
                },
                maxWidth: {
                  xs: 200,
                  sm: 230,
                  md: 250
                },
                flexShrink: 0,
                boxShadow: 2,
                borderRadius: 3,
                p: 0,
                backgroundColor: Colors.white,
                display: "flex",
                flexDirection: "column",
                height: {
                  xs: 490,
                  sm: 480,
                  md: 510
                }
              }}
            >

              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={item.image}
                  onClick={() => navigate('/productdetails', { state: { item } })}
                  sx={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                    borderRadius: 2,
                    cursor: "pointer"
                  }}
                />
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
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 1,
                    borderBottomRightRadius: 8
                  }}
                >
                  {item.static}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 1,
                  ml: 2
                }}
              >
                <Rating
                  value={parseFloat(item.rating)}
                  precision={0.1}
                  readOnly
                  size="small"
                />
                <Typography sx={{ fontSize: "11px" }}>
                  {item.rating}
                </Typography>
              </Box>

              <Typography
                sx={{
                  mt: 1,
                  fontSize: Theme.font16Bold,
                  minHeight: 42,
                  ml: 1,
                  mb: 2,
                  display: { xs: "none", md: "flex" }
                }}
              >
                {item.description}
              </Typography>
              <Tooltip title={item.description} arrow>
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
                  {item.description}
                </Typography>
              </Tooltip>


              <Typography
                sx={{
                  mt: 2,
                  color: "#555",
                  fontSize: Theme.font12SemiBold,
                  lineHeight: 1.5,
                  minHeight: 42,
                  ml: 1,

                }}
              >
                {item.button1}
                {item.button2 && ` | ${item.button2}`}
                {item.button3 && ` | ${item.button3}`}
              </Typography>


              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: "auto",
                  ml: 2
                }}
              >
                <Typography
                  sx={{
                    fontSize: Theme.font14Bold,
                  }}
                >
                  {item.cost}
                </Typography>

                {item.count && (
                  <Typography
                    sx={{
                      color: "gray",
                      textDecoration: "line-through",
                      fontSize: Theme.font10SemiBold
                    }}
                  >
                    {item.count}
                  </Typography>
                )}
                <Typography sx={{ fontSize: Theme.font14Bold, ml: 1 }}>{item.c}</Typography>
              </Box>

              <Typography
                sx={{
                  color: "green",
                  fontSize: "12px",
                  mt: 0.5,
                  ml: 2
                }}
              >
                <PercentIcon sx={{ fontSize: "15px", background: Colors.green, color: Colors.white }} />  {item.discount}
              </Typography>

              <Box sx={{ mt: "auto" }}>
                <Button
                  fullWidth
                  sx={{
                    color: Colors.black,
                    fontSize: Theme.font14Bold,
                    mt: 1,
                    background: isInCart(item) ? Colors.orange : Colors.yellow,
                    gap: 1,
                    borderRadius: 10,
                    ml: 1,
                    mb: 3,
                    width: 200
                  }}
                  onClick={() => handleCart(item)}
                >
                  <ShoppingBagOutlinedIcon fontSize="small" />
                  {isInCart(item) ? "REMOVE FROM CART" : "ADD TO CART"}
                </Button>

              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        variant="temporary"
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: 280, sm: 350 },
            p: 2
          }
        }}
      >
        <Typography sx={{ fontWeight: "bold", mb: 2 }}>
          Cart
        </Typography>

        <Typography>Your product added to cart</Typography>

        <Button
          fullWidth
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => setOpen(false)}
        >
          Close
        </Button>
      </Drawer>
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
    </>
  )
}
export default PowerCare;