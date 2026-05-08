import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  Box,
  Typography,
  IconButton,
  Drawer,
  Snackbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { getProductDataActionInitiate } from "../redux/actions/getProductAction";
import Colors from "../colors";
import Person2Icon from "@mui/icons-material/Person2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Theme } from "../GlobalStyles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Badge from "@mui/material/Badge";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import { onAuthStateChanged } from "firebase/auth";
// import { useRef } from "react";
import { ref, push } from "firebase/database";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";

const phrases = [
  "Search Products...",
  "Search for Shampoo...",
  "Search for Hair Conditioner...",
  "Search for Body Wash..."
];

const AppBarr = ({ cartItems, setCartItems }) => {
  const [placeholderText, setPlaceholderText] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [menuType, setMenuType] = useState("");
  const [subMenu, setSubMenu] = useState("");
  const [nestedMenu, setNestedMenu] = useState(null);
  const [open, setOpen] = useState(false);

  const getPrice = (cost) => {
    if (!cost) return 0;
    const cleaned = String(cost).replace(/[^0-9.]/g, "");
    const value = Number(cleaned);
    return isNaN(value) ? 0 : value;
  };

  const subtotal = cartItems.reduce((total, item) => {
    return total + getPrice(item.price) * (item.quantity || 1);
  }, 0);

  const discount = 0;
  const shipping = 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data = [] } = useSelector((state) => state.getproductdata || {});

  const scrollToFooter = () => {
    document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
  };

  const estimatedTotal = subtotal - discount + shipping;

  const totalCartQuantity = cartItems.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);

  const navbarData =
    Array.isArray(data)
      ? data.find((item) => item.navbar)?.navbar || []
      : [];

  const homepageData =
    Array.isArray(data)
      ? data.find((item) => item.homepage)?.homepage || []
      : [];

  const allProducts = homepageData.flatMap(
    (item) => item.data || []
  );

  const filteredProducts = allProducts.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );
  const removeFromCart = (indexToRemove) => {
    setCartItems((prev) => prev.filter((_, index) => index !== indexToRemove));
    setSnackOpen(true);
  };

  const increaseQty = (index) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const decreaseQty = (index) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        setPlaceholderText(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
        typingSpeed = 50;
      } else {
        setPlaceholderText(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
        typingSpeed = 150;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    };

    const timer = setTimeout(type, typingSpeed);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCartItems((prev) =>
      prev.map((item) => ({
        ...item,
        quantity: item.quantity || 1,
      }))
    );
  }, [setCartItems]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });

    return () => unsubscribe();
  }, []);

  const handlePayment = () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    const amount = Math.round((estimatedTotal || 0) * 100);
    console.log(amount);
    if (!window.Razorpay) {
      alert("Razorpay script not loaded");
      return;
    }

    const options = {
      key: "rzp_test_SlYhoGItP2cIc0",
      amount,
      currency: "INR",
      handler: async function (response) {
        const orderRef = ref(db, "orders/" + currentUser.uid);

        await push(orderRef, {
          items: cartItems,
          total: estimatedTotal,
          paymentId: response.razorpay_payment_id,
          createdAt: new Date().toISOString(),
        });

        setCartItems([]);
        setOpen(false);
        toast.success("Payment Successful");
        navigate("/profilepage");
      },
      prefill: {
        name: currentUser.displayName || "User",
        email: currentUser.email,
        contact: "9999999999",
      },
      theme: { color: "#000" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(getProductDataActionInitiate());
  }, [dispatch]);


  return (

    <>
      <AppBar position="fixed" sx={{ backgroundColor: Colors.black, }}>
        <Toolbar sx={{ flexDirection: "column", alignItems: "flex-start" }}>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              // px: 2
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>


              <IconButton
                sx={{ display: { xs: "block", md: "none" }, color: "white", ml: 0 }}
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>

              {navbarData[0] && (
                <Box
                  component="img"
                  src={navbarData[0].image}
                  alt="Logo"
                  onClick={() => navigate("/")}
                  sx={{
                    width: { xs: 120, sm: 140, md: 200 },
                    height: 50,
                    objectFit: "contain",
                    cursor: "pointer",
                    borderRadius: "10px",
                    ml: { xs: 2, sm: 30, md: 5 }
                  }}
                />
              )}
              <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 2, ml: { xs: 3, sm: 25 } }}>
                {user?.photoURL ? (
                  <Box
                    component="img"
                    src={user.photoURL}
                    alt="profile"
                    onClick={() => navigate("/profilepage")}
                    sx={{
                      width: 35,
                      height: 35,
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <Person2Icon
                    sx={{ cursor: "pointer", color: "white" }}
                    onClick={() => {
                      if (user) navigate("/profilepage");
                      else navigate("/login");
                    }}
                  />
                )}
                <IconButton onClick={() => setOpen(true)}>
                  <Badge badgeContent={totalCartQuantity} color="error">
                    <ShoppingCartIcon sx={{ color: Colors.white, mr: { lg: 20 } }} />
                  </Badge>
                </IconButton>

              </Box>
            </Box>


            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {navbarData.slice(1, 4).map((item) => (
                <img
                  key={item.id}
                  src={item.image}
                  alt=""
                  style={{
                    width: { md: 120, lg: 140 },
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>


            <Box sx={{ position: "relative", display: { xs: "none", md: "flex" } }}>
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}

                placeholder={placeholderText}
                size="small"
                sx={{
                  background: "#fff",
                  borderRadius: 1,
                  width: 280,
                  mr: 0
                }}
              />

              {search && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 45,
                    left: 0,
                    width: "100%",
                    background: "#fff",
                    borderRadius: 2,
                    boxShadow: 3,
                    zIndex: 999,
                    maxHeight: 350,
                    overflowY: "auto"
                  }}
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((item1, index) => (
                      <Box
                        key={index}
                        onClick={() => {
                          navigate("/productdetails", {
                            state: { item: item1 },
                          });
                          setSearch("");
                        }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 1.5,
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                          "&:hover": {
                            background: "#f5f5f5"
                          }
                        }}
                      >
                        <Box
                          component="img"
                          src={item1.image}
                          sx={{
                            width: 55,
                            height: 55,
                            objectFit: "cover",
                            borderRadius: 2,
                            background: "#f5f5f5"
                          }}
                        />

                        <Box>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "#000"
                            }}
                          >
                            {item1.name}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "green",
                              mt: 0.5
                            }}
                          >
                            {item1.price}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography sx={{ p: 2, color: "black" }}>
                      No Products Found
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: { xs: 2, md: 0, lg: 5 }, mr: { md: 5, lg: 1 } }}>
              {user?.photoURL ? (
                <Box
                  component="img"
                  src={user.photoURL}
                  alt="profile"
                  onClick={() => navigate("/profilepage")}
                  sx={{
                    width: 35,
                    height: 35,
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <Person2Icon
                  sx={{ cursor: "pointer", color: "white" }}
                  onClick={() => {
                    if (user) navigate("/profilepage");
                    else navigate("/login");
                  }}
                />
              )}
              <IconButton onClick={() => setOpen(true)}>
                <Badge badgeContent={totalCartQuantity} color="error">
                  <ShoppingCartIcon sx={{ color: "white" }} />
                </Badge>
              </IconButton>


              <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
              >
                <Box
                  sx={{
                    width: { xs: 300, sm: 350 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >

                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "22px" }}>
                      Your Cart ({cartItems.length} items)
                    </Typography>
                    <IconButton onClick={() => setOpen(false)}>
                      <CloseIcon />
                    </IconButton>



                    {cartItems.length === 0 ? (
                      <Typography>No items</Typography>
                    ) : (
                      cartItems.map((item1, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            gap: 1,
                            mb: 2,
                            p: 1,
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            alignItems: "center"
                          }}
                        >
                          <img
                            src={item1.image}
                            alt=""
                            width="70"
                            style={{ borderRadius: "10px" }}
                          />

                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: "14px" }}>
                              {item1.name}
                            </Typography>

                            <Typography sx={{ fontWeight: "bold", color: "black", mt: 1 }}>
                              ₹{((getPrice(item1.price) || 0) * (item1.quantity || 1)).toFixed(2)}
                            </Typography>
                          </Box>


                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid #ccc",
                              borderRadius: "20px",
                              px: 1
                            }}
                          >
                            <Typography
                              sx={{ cursor: "pointer", px: 1 }}
                              onClick={() => decreaseQty(index)}
                            >
                              -
                            </Typography>

                            <Typography>{item1.quantity || 1}</Typography>

                            <Typography
                              sx={{ cursor: "pointer", px: 1 }}
                              onClick={() => increaseQty(index)}
                            >
                              +
                            </Typography>
                          </Box>

                          <DeleteIcon
                            sx={{ color: "black", cursor: "pointer" }}
                            onClick={() => removeFromCart(index)}
                          />
                        </Box>
                      ))
                    )}
                  </Box>


                  <Box
                    sx={{
                      borderTop: "1px solid #ddd",
                      p: 2,
                      background: "#fff",
                      position: "sticky",
                      bottom: 0
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "22px",
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <span>Estimated Total:</span>
                      <span>₹{estimatedTotal}</span>
                    </Typography>
                    {/* <Typography>MRP Total: ₹{subtotal.toFixed(2)}</Typography> */}
                    <Typography>Discount on MRP: ₹{discount.toFixed(2)}</Typography>
                    {/* <Typography>Prepaid Discount: ₹{prepaidDiscount.toFixed(2)}</Typography> */}
                    <Typography>
                      Shipping: {shipping === 0 ? "Free" : `₹${shipping}`}
                    </Typography>

                    <Box
                      sx={{
                        mt: 2,
                        background: "black",
                        color: "white",
                        textAlign: "center",
                        p: 1.5,
                        borderRadius: "10px",
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}
                      onClick={handlePayment}

                    >
                      Buy Now
                    </Box>
                  </Box>
                </Box>
              </Drawer>
            </Box>


          </Box>
          <Box sx={{ position: "relative", display: { xs: "flex", md: "none" } }}>
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}

              placeholder={placeholderText}
              size="small"
              sx={{
                background: "#fff",
                borderRadius: 1,

                width: { xs: 300, sm: 700 },
                mb: 2
              }}
            />


            {search && (
              <Box
                sx={{
                  position: "absolute",
                  top: 45,
                  left: 0,
                  width: "100%",
                  background: Colors.white,
                  borderRadius: 2,
                  boxShadow: 3,
                  zIndex: 999,
                  maxHeight: 350,
                  overflowY: "auto"
                }}
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((item1, index) => (
                    <Box
                      key={index}
                      onClick={() => {
                        navigate("/productdetails", {
                          state: { item: item1 },
                        });
                        setSearch("");
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 1.5,
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        "&:hover": {
                          background: "#0f0e0e"
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={item1.image}
                        sx={{
                          width: 55,
                          height: 55,
                          objectFit: "cover",
                          borderRadius: 2
                        }}
                      />

                      <Box>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: Colors.black
                          }}
                        >
                          {item1.name}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "green",
                            mt: 0.5
                          }}
                        >
                          {item1.price}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                <Typography sx={{ p: 2, color: "black" }}>
                      No Products Found
                    </Typography>
                )}
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 4,
              mt: 2,
              ml: { md: 1, lg: 20 },
              color: "white",
              fontSize: Theme.font16Bold
            }}
          >

            <Typography
              onMouseEnter={() => setMenuType("best")}
              onMouseLeave={() => setMenuType("")}
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 1,
                background: Colors.black,
                color: Colors.white,
                mb: 1,
                fontSize: Theme.font16Bold,
                cursor: "pointer"
              }}
            >
              Best Sellers <ArrowDropDownIcon />
            </Typography>


            <Typography sx={{ display: "flex", alignItems: "center", mt: 1, background: Colors.black, color: Colors.white, mb: 1, fontSize: Theme.font16Bold }}>New Launches</Typography>

            <Typography onMouseEnter={() => setMenuType("brands")}
              onMouseLeave={() => setMenuType("")} sx={{ display: "flex", alignItems: "center", mt: 1, background: Colors.black, color: Colors.white, mb: 1, fontSize: Theme.font16Bold }}>

              Brands <ArrowDropDownIcon />
            </Typography>

            <Typography onMouseEnter={() => setMenuType("concerns")}
              onMouseLeave={() => setMenuType("")} sx={{ display: "flex", alignItems: "center", mt: 1, background: Colors.black, color: Colors.white, mb: 1, fontSize: Theme.font16Bold }}>

              Concerns <ArrowDropDownIcon />
            </Typography>

            <Typography onMouseEnter={() => setMenuType("hair")}
              onMouseLeave={() => setMenuType("")} sx={{ display: "flex", alignItems: "center", mt: 1, background: Colors.black, color: Colors.white, mb: 1, fontSize: Theme.font16Bold }}>

              Hair Care <ArrowDropDownIcon />
            </Typography>

            <Typography onMouseEnter={() => setMenuType("skin")}
              onMouseLeave={() => setMenuType("")} sx={{ display: "flex", alignItems: "center", mt: 1, background: Colors.black, color: Colors.white, mb: 1, fontSize: Theme.font16Bold }}>

              Skin Care <ArrowDropDownIcon />
            </Typography>

            <Typography onMouseEnter={() => setMenuType("sun")}
              onMouseLeave={() => setMenuType("")} sx={{ display: "flex", alignItems: "center", mt: 1, background: Colors.black, color: Colors.white, mb: 1, fontSize: Theme.font16Bold }}>
              Sun Care <ArrowDropDownIcon />
            </Typography>

            <Typography onClick={scrollToFooter} sx={{ display: "flex", alignItems: "center", mt: 1, background: Colors.black, color: Colors.white, mb: 1, fontSize: Theme.font16Bold }}>
              Careers
            </Typography>

            <Typography onClick={scrollToFooter} sx={{ display: "flex", alignItems: "center", mt: 1, background: Colors.black, color: Colors.white, mb: 1, fontSize: Theme.font16Bold }}>
              About us
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => {
          setMobileOpen(false);
          setSubMenu(null);
          setNestedMenu(null);
        }}
      >
        <Box sx={{ width: 280, background: "#fff", height: "100%" }}>
          <Typography sx={{ display: "flex", alignItems: "center", mt: 1, background: Colors.black, color: Colors.white, p: 2 }}>
            <Person2Icon sx={{ mr: 1 }} />
            {user ? `Hi, ${user.displayName || user.email}` : "Hi, Guest"}
          </Typography>
          {!subMenu && (
            <Box sx={{ p: 2 }}>
              <Typography
                onClick={() => setSubMenu("best")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  p: 1
                }}
              >
                Best Sellers
                <ArrowRightIcon />
              </Typography>
              <Typography sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                p: 1
              }}>New Launches</Typography>
              <Typography onClick={() => setSubMenu("brands")} sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                p: 1
              }}>Brands   <ArrowRightIcon />  </Typography>
              <Typography onClick={() => setSubMenu("concerns")} sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                p: 1
              }}>Concerns   <ArrowRightIcon /></Typography>
              <Typography onClick={() => setSubMenu("hair")} sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                p: 1
              }}>Hair Care  <ArrowRightIcon /></Typography>
              <Typography onClick={() => setSubMenu("skin")} sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                p: 1
              }}>Skin Care   <ArrowRightIcon /></Typography>
              <Typography onClick={() => setSubMenu("sun")} sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                p: 1
              }}>Sun Care  <ArrowRightIcon /></Typography>
            </Box>
          )}


          {subMenu === "best" && (
            <>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderBottom: "1px solid #ddd",
                  gap: 1
                }}
              >
                <ArrowBackIosIcon
                  onClick={() => setSubMenu(null)}
                  sx={{ fontSize: 18, cursor: "pointer" }}
                />
                <Typography sx={{ fontWeight: "bold" }}>
                  BestSellers
                </Typography>
              </Box>


              {[
                "Bare Anatomy Bestsellers",
                "Chemist At Play Bestsellers",
                "SunScoop Bestsellers",

              ].map((item, i) => (
                <Typography
                  key={i}
                  sx={{
                    p: 2,
                    borderBottom: "1px solid #eee",
                    cursor: "pointer"
                  }}
                >
                  {item}
                </Typography>
              ))}
            </>
          )}
          {subMenu === "brands" && (
            <>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderBottom: "1px solid #ddd",
                  gap: 1
                }}
              >
                <ArrowBackIosIcon
                  onClick={() => setSubMenu(null)}
                  sx={{ fontSize: 18, cursor: "pointer" }}
                />
                <Typography sx={{ fontWeight: "bold" }}>
                  Brands
                </Typography>
              </Box>


              {[
                "Bare Anatomy ",
                "Chemist At Play",
                "SunScoop",
                "Vinchi"

              ].map((item, i) => (
                <Typography
                  key={i}
                  sx={{
                    p: 2,
                    borderBottom: "1px solid #eee",
                    cursor: "pointer"
                  }}
                >
                  {item}
                </Typography>
              ))}
            </>
          )}
          {subMenu === "concerns" && (
            <>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderBottom: "1px solid #ddd",
                  gap: 1
                }}
              >


              </Box>

              {subMenu === "concerns" && !nestedMenu && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
                    <ArrowBackIosIcon onClick={() => setSubMenu(null)} />
                    <Typography sx={{ ml: 1, fontSize: Theme.font16Bold }}>
                      Concerns
                    </Typography>
                  </Box>

                  <Typography sx={{ p: 2, fontSize: Theme.font16Bold }} onClick={() => setNestedMenu("hair")}>
                    Hair
                  </Typography>


                  <Typography sx={{ p: 2 }} onClick={() => setNestedMenu("skin")}>
                    Skin
                  </Typography>
                </>
              )}
              {subMenu === "concerns" && nestedMenu === "hair" && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
                    <ArrowBackIosIcon onClick={() => setNestedMenu(null)} />
                    <Typography sx={{ ml: 1, fontWeight: "bold" }}>
                      Hair Concerns
                    </Typography>
                  </Box>

                  {[
                    "Hair Growth",
                    "Hair fall",
                    "Dandruff",
                    "Frizz",
                    "Color Protection",
                    "Volume",
                    "Curl-Defining",
                    "Dry & Rough",
                    "Damage Repair"
                  ].map((item, i) => (
                    <Typography key={i} sx={{ p: 2, borderBottom: "1px solid #eee" }}>
                      {item}
                    </Typography>
                  ))}
                </>
              )}
              {subMenu === "concerns" && nestedMenu === "skin" && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
                    <ArrowBackIosIcon onClick={() => setNestedMenu(null)} />
                    <Typography sx={{ ml: 1, fontWeight: "bold" }}>
                      Skin Concerns
                    </Typography>
                  </Box>

                  {[
                    "Acne",
                    "Bumpy Skin",
                    "Ageing",
                    "Dryness",
                    "Stretchmarks",
                    "Dullness",
                    "Uneven-tone skin",
                    "Sun Damage"
                  ].map((item, i) => (
                    <Typography key={i} sx={{ p: 2, borderBottom: "1px solid #eee" }}>
                      {item}
                    </Typography>

                  ))}

                </>

              )}
              <Typography
                onClick={() => setSubMenu("careers")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  p: 1
                }}
              >
                Careers
              </Typography>
            </>
          )}





          {subMenu === "hair" && (
            <>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderBottom: "1px solid #ddd",
                  gap: 1
                }}
              >
                <ArrowBackIosIcon
                  onClick={() => setSubMenu(null)}
                  sx={{ fontSize: 18, cursor: "pointer" }}
                />
                <Typography sx={{ fontWeight: "bold" }}>
                  Hair Care
                </Typography>
              </Box>


              {[
                "View all",
                "New Launches",
                "Combos",
                "Hair Serums",
                "Shampoo",
                "Hair Spray",
                "Conditioner",
                "Hair Mask",
                "Leave-in Conditioner",
                "Hair Oil",
                "Scalp Care",
                "Styling"
              ].map((item, i) => (
                <Typography
                  key={i}
                  sx={{
                    p: 2,
                    borderBottom: "1px solid #eee",
                    cursor: "pointer"
                  }}
                >
                  {item}
                </Typography>
              ))}
            </>
          )}
          {subMenu === "skin" && (
            <>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderBottom: "1px solid #ddd",
                  gap: 1
                }}
              >
                <ArrowBackIosIcon
                  onClick={() => setSubMenu(null)}
                  sx={{ fontSize: 18, cursor: "pointer" }}
                />
                <Typography sx={{ fontWeight: "bold" }}>
                  Skin Care
                </Typography>
              </Box>


              {[
                "View all",
                "New Launches",
                "Combos",
                "Face Wash",
                "Face Serum",
                "Body Lotion",
                "Roll On",
                "Body Wash",
                "Face Toner",
                "Face Scrub",
                "Face Moisturizer",
                "Lip Balm"
              ].map((item, i) => (
                <Typography
                  key={i}
                  sx={{
                    p: 2,
                    borderBottom: "1px solid #eee",
                    cursor: "pointer"
                  }}
                >
                  {item}
                </Typography>
              ))}
            </>
          )}
          {subMenu === "sun" && (
            <>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderBottom: "1px solid #ddd",
                  gap: 1
                }}
              >
                <ArrowBackIosIcon
                  onClick={() => setSubMenu(null)}
                  sx={{ fontSize: 18, cursor: "pointer" }}
                />
                <Typography sx={{ fontWeight: "bold" }}>
                  Sun Care
                </Typography>
              </Box>


              {[
                "View all",
                "New Launches",
                "Combos",
                "Sunscreen For oily Skin",
                "Sunscreen for dry Skin",
                "Sunscreen for Combination Skin",
                "Sunscreen for Normal Skin",
                "Sunscreen for Sensitive Skin",
                "Spray/Pump Sunscreen",
                "Tube Sunscreen",

              ].map((item, i) => (
                <Typography
                  key={i}
                  sx={{
                    p: 2,
                    borderBottom: "1px solid #eee",
                    cursor: "pointer"
                  }}
                >
                  {item}
                </Typography>
              ))}
            </>
          )}

        </Box>
      </Drawer>


      {menuType && (
        <Box
          sx={{
            position: "absolute",
            top: "100px",
            left: 0,
            width: "100%",
            backgroundColor: "#f5f5f5",
            p: 4,
            zIndex: 999,
          }}
          onMouseLeave={() => setMenuType("")}
        >

          {menuType === "best" && (
            <Box sx={{ ml: 2 }}>
              <Typography sx={{ fontSize: Theme.font14SemiBold }}>Bare Anatomy Bestsellers</Typography>
              <Typography sx={{ fontSize: Theme.font14SemiBold }}>Chemist At Play Bestsellers</Typography>
              <Typography sx={{ fontSize: Theme.font14SemiBold }}>SunScoop Bestsellers</Typography>
            </Box>
          )}

          {menuType === "brands" && (
            <Box>
              <Typography sx={{ fontSize: Theme.font14SemiBold }}>Bare Anatomy</Typography>
              <Typography sx={{ fontSize: Theme.font14SemiBold }}>Chemist at Play</Typography>
              <Typography sx={{ fontSize: Theme.font14SemiBold }}>SunScoop</Typography>
              <Typography sx={{ fontSize: Theme.font14SemiBold }}>Vinchi</Typography>
            </Box>
          )}


          {menuType === "concerns" && (
            <Box sx={{ display: "flex", gap: 40, ml: 20 }}>

              <Box>
                <Typography sx={{ fontSize: Theme.font18Bold, ml: 2 }}>Hair</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Hair Growth</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Hair fall</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Dandruff</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Frizz</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Color Protection</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Volume</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Curl-Defining</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Dry & Rough</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Damage Repair</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: Theme.font18Bold }}>Skin</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Acne</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Bumpy Skin</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Ageing</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Dryness</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Stretchmarks</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Dullness</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Uneven-tone skin</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Sun Damage</Typography>
              </Box>

            </Box>
          )}


          {menuType === "hair" && (
            <Box sx={{ display: "flex", gap: 20 }}>
              <Box>
                <Typography sx={{ fontSize: Theme.font18Bold, ml: 2 }}>Explore</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Bestsellers</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>New Launches</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Combos</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: Theme.font18Bold }}>Hair Care</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Hair Serums</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Shampoo</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Conditioner</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Hair Spray</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Hair Mask</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Leave-in Conditioner</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Hair Oil</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Sclap Care</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Styling</Typography>
              </Box>
            </Box>
          )}


          {menuType === "skin" && (
            <Box sx={{ display: "flex", gap: 20 }}>
              <Box>
                <Typography sx={{ fontSize: Theme.font18Bold, ml: 2 }}>Explore</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Bestsellers</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>New Launches</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Combos</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: Theme.font18Bold }}>Skin Care</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Face Wash</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Face Serum</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Body Lotion</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Roll On</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Body Wash</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Face Toner</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Face Scrub</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Face Moisturizer</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Lip Balm</Typography>
              </Box>
            </Box>
          )}
          {menuType === "sun" && (
            <Box sx={{ display: "flex", gap: 20 }}>
              <Box>
                <Typography sx={{ fontSize: Theme.font18Bold, ml: 2 }}>Explore</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Bestsellers</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>New Launches</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Combos</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: Theme.font18Bold }}>Sun Care</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Sunscreen For oily Skin</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Sunscreen for dry Skin</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Sunscreen for Combination Skin</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Sunscreen for Normal Skin</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Sunscreen for Sensitive Skin</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Spray/Pump Sunscreen</Typography>
                <Typography sx={{ fontSize: Theme.font14SemiBold, ml: 2 }}>Tube Sunscreen</Typography>

              </Box>
            </Box>
          )}
          <Snackbar
            open={snackOpen}
            autoHideDuration={2000}
            onClose={() => setSnackOpen(false)}
            message="User is not Login"
            anchorOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
          />
        </Box>
      )}
    </>
  );
};

export default AppBarr; 