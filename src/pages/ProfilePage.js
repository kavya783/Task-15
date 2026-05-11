import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, get, remove, set } from "firebase/database";
import {
  Box,
  Typography,
  Button,
  Divider,
  Card,
  CardContent,
  Snackbar,
  TextField,

} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Colors from "../colors";
import { Theme } from "../GlobalStyles";
// import { GoogleAuthProvider,} from "firebase/auth";
import Person2Icon from "@mui/icons-material/Person2";
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ShareIcon from '@mui/icons-material/Share';
import AddCardIcon from '@mui/icons-material/AddCard';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CasesIcon from '@mui/icons-material/Cases';
import StyleIcon from '@mui/icons-material/Style';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Footer from "../components/Footer";
import DeleteIcon from "@mui/icons-material/Delete";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [showIcash, setShowIcash] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showReferrals, setShowReferrals] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [activeTab, setActiveTab] = useState("orders");
  const [snackOpen, setSnackOpen] = useState(false);
  const navigate = useNavigate();
  const removeOrderItem = async (orderIndex, itemIndex) => {
    const userId = auth.currentUser.uid;
    const orderRef = ref(db, `orders/${userId}`);

    const snapshot = await get(orderRef);

    if (snapshot.exists()) {
      let ordersData = Object.values(snapshot.val());

      ordersData[orderIndex].items.splice(itemIndex, 1);

      if (ordersData[orderIndex].items.length === 0) {
        ordersData.splice(orderIndex, 1);
      }

      await remove(orderRef);

      ordersData.forEach((order, i) => {
        set(ref(db, `orders/${userId}/order${i}`), order);
      });

      setOrders(ordersData);


      setSnackOpen(true);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({ ...currentUser });

        const userSnapshot = await get(ref(db, "users/" + currentUser.uid));

        if (userSnapshot.exists()) {
          setUserData(userSnapshot.val());
        }


        const orderSnapshot = await get(
          ref(db, "orders/" + currentUser.uid)
        );

        if (orderSnapshot.exists()) {
          setOrders(Object.values(orderSnapshot.val()));
        } else {
          setOrders([]);
        }
      } else {
        navigate("/login");
      }
    });


    return () => unsubscribe();
  }, [navigate]);
  // const provider = new GoogleAuthProvider();


  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleOrders = () => {
    setShowOrders(true);
    setShowIcash(false);
    setShowReferrals(false);
    setShowAddress(false);
    setShowChat(false);
    setActiveTab("orders");
  };

  const handleIcash = () => {
    setShowIcash(true);
    setShowOrders(false);
    setShowReferrals(false);
    setShowAddress(false);
    setShowChat(false);
    setActiveTab("icash");
  };

  const handleReferrals = () => {
    setShowReferrals(true);
    setShowOrders(false);
    setShowIcash(false);
    setShowAddress(false);
    setShowChat(false);
    setActiveTab("referrals");
  };
  const handleAddress = () => {
    setShowAddress(true);
    setShowReferrals(false);
    setShowOrders(false);
    setShowIcash(false);
    setShowChat(false);
    setActiveTab("address");
  };
  const handleChat = () => {
    setShowChat(true);
    setShowAddress(false);
    setShowReferrals(false);
    setShowOrders(false);
    setShowIcash(false);
    setActiveTab("chat");
  };

  const [copied, setCopied] = useState(false);

  const referralLink =
    "https://innovist.com/?nector_referral_code=ur2flqirfg&utm_source=nector&utm_medium=widget&utm_campaign=referral_ur2flqirfg";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };
  //  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  useEffect(() => {
    handleOrders();
  }, []);
  console.log(user?.photoURL);
  console.log(userData);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        mt: 15
      }}
    >

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: { xs: "column", sm: "row" }
        }}
      >

        <Box
          sx={{
            width: { xs: "100%", sm: 280 },
            background: "#f2e9e9",
            borderRight: "1px solid #ddd",
            p: 3,


          }}
        >
          <Box sx={{ background: Colors.black, p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

              {user && user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="profile"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <Person2Icon sx={{ fontSize: 40, color: "white" }} />
              )}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontSize: Theme.font14Bold, color: Colors.white }}
                >
                  {user?.displayName || "User"}
                </Typography>

                <Typography
                  sx={{ fontSize: Theme.font12SemiBold, color: Colors.white }}
                >
                  {user?.email}
                </Typography>
              </Box>

            </Box>

            <Divider sx={{ mt: 2 }} />
          </Box>
          <Box
            sx={{
              width: "100%",
              p: 1,
              display: { xs: "block", sm: "none" }
            }}
          >


            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                mb: 3,
                "& .MuiTabs-indicator": {
                  backgroundColor: Colors.black
                },
                "& .MuiTab-root": {
                  color: Colors.gray,
                  textTransform: "none",
                  minWidth: 80,
                  fontSize: Theme.font12SemiBold
                },
                "& .Mui-selected": {
                  color: Colors.black,
                  fontWeight: "bold"
                }
              }}
            >
              <Tab icon={<CasesIcon />} label="Orders" />
              <Tab icon={<AddCardIcon />} label="iCash" />
              <Tab icon={<StyleIcon />} label="Referrals" />
              <Tab icon={<HomeIcon />} label="Address" />
              <Tab icon={<ChatIcon />} label="Chat" />
              <Tab label="Logout" onClick={handleLogout} />
            </Tabs>
          </Box>

          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            {tabValue === 0 && (
              <>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <Card key={index} sx={{ mb: 2, boxShadow: 5 }}>
                      <CardContent>


                        {order.items.map((item1, i) => (
                          <Box key={i} sx={{ mt: 1 }}>
                            <Box
                              component="img"
                              src={item1.image}

                              sx={{
                                width: "100%",
                                height: 200,
                                objectFit: "cover",
                                borderRadius: 2,
                                cursor: "pointer"
                              }}
                            />
                            <Typography fontWeight="bold">
                              Order Total: ₹{order.total}
                            </Typography>
                            <Typography>{item1.name}</Typography>

                            <DeleteIcon
                              onClick={() => removeOrderItem(index, i)}
                              sx={{ ml: 20 }}
                            />
                          </Box>
                        ))}

                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card sx={{ mt: 10 }}>
                    <CardContent>
                      <Typography textAlign="center">
                        No Orders Found
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </>
            )}


            {tabValue === 1 && (
              <Box>


                <Box sx={{ textAlign: "center", mt: 5 }}>
                  <Typography sx={{ fontSize: Theme.font20Bold, color: "gray" }}>
                    Your ICash
                  </Typography>

                  <Typography sx={{ fontSize: Theme.headings, mt: 1 }}>
                    0 ICash
                  </Typography>

                  <Typography sx={{ mt: 2, fontSize: Theme.font14SemiBold, color: "gray" }}>
                    ICash expire in 6 months from the date they were rewarded
                  </Typography>

                  <Typography sx={{ fontSize: Theme.font14SemiBold, color: "gray" }}>
                    Expiry is calculated on rolling basis
                  </Typography>

                  <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
                    <Button variant="contained" sx={{ background: Colors.black, color: Colors.white }}>
                      Redeem ICash
                    </Button>

                    <Button variant="contained" sx={{ background: Colors.black, color: Colors.white }}>
                      Activity History
                    </Button>
                  </Box>
                </Box>


                <Box sx={{ mt: 8, textAlign: "center" }}>
                  <Typography sx={{ fontSize: Theme.headings }}>
                    Ways To Earn
                  </Typography>

                  <Typography sx={{ color: Colors.gray, mt: 1 }}>
                    Earn ICash with every purchase and redeem them for discounts!
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 3,
                      mt: 4,
                      flexWrap: "wrap"
                    }}
                  >
                    <Card sx={{ width: 300, p: 2 }}>
                      <CardContent>
                        <Typography sx={{ fontSize: Theme.font16Bold }}>
                          < PhoneIphoneIcon />Download the App
                        </Typography>
                        <Typography sx={{ fontSize: Theme.font12SemiBold, color: Colors.gray }}>
                          Get 25 ICash
                        </Typography>
                      </CardContent>
                    </Card>


                    <Card sx={{ width: 300, p: 2 }}>
                      <CardContent>
                        <Typography sx={{ fontSize: Theme.font16Bold }}>
                          <ShareIcon /> Refer & Earn
                        </Typography>
                        <Typography sx={{ fontSize: Theme.font12SemiBold, color: Colors.gray }}>
                          Get 100 ICash
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>

              </Box>
            )}


            {tabValue === 2 && (
              <Box>


                <Box sx={{ textAlign: "flex-start", mt: 5, }}>
                  <Typography sx={{ fontSize: Theme.font12Bold, color: "gray", ml: 0, p: 0 }}>
                    Share this link with a friend so they can claim the 100 ICash.
                  </Typography>
                </Box>
                <Box sx={{ mt: 3, display: "flex", justifyContent: "start", gap: 2 }}>
                  <Card sx={{ width: 100, p: 1, height: 150 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: Theme.font14Bold, mt: 1, color: Colors.gray }}>
                        They get
                      </Typography>

                      <Typography sx={{ mt: 2, fontSize: Theme.font14Bold, color: Colors.black }}>
                        100 ICash
                      </Typography>

                    </CardContent>
                  </Card>
                  <Card sx={{ width: 100, p: 2, height: 150 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: Theme.font14Bold, color: Colors.gray, mt: 1 }}>
                        You get
                      </Typography>
                      <Typography sx={{ mt: 2, fontSize: Theme.font14Bold, color: Colors.black }}>
                        100 ICash
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                <Typography sx={{ fontSize: Theme.font12SemiBold, color: Colors.gray, textAlign: "flex-start", mt: 3 }}>
                  Copy or share your referral link with your friends!
                </Typography>
                <Box sx={{ textAlign: "center", mt: 4 }}>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      justifyContent: "space-between",
                      background: "#f2f2f2",
                      borderRadius: "10px",
                      p: 1,
                      maxWidth: 300,
                      margin: "auto"
                    }}
                  >
                    <Typography
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        px: 0,
                        flex: 1
                      }}
                    >
                      {referralLink}
                    </Typography>

                    <Button
                      variant="contained"
                      onClick={handleCopy}
                      sx={{
                        background: "black",
                        textTransform: "none",
                        borderRadius: "8px"
                      }}
                      startIcon={<ContentCopyIcon />}
                    >
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
            {tabValue === 3 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", sm: 450, md: "70%" },
                    background: Colors.white,
                    borderRadius: 4,
                    boxShadow: 3,
                    p: 3,
                    border: `1px solid ${Colors.border}`
                  }}
                >

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                      flexWrap: "wrap",
                      gap: 2
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: Theme.font20Bold,
                        color: Colors.black
                      }}
                    >
                      My Address
                    </Typography>

                    <Button
                      variant="contained"
                      sx={{
                        background: Colors.yellow,
                        color: Colors.black,
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "none"
                      }}
                    >
                      Add Address
                    </Button>
                  </Box>


                  <Box
                    sx={{
                      background: "#fafafa",
                      borderRadius: 3,
                      p: 3,
                      border: `1px solid ${Colors.border}`
                    }}
                  >

                    <Typography
                      sx={{
                        display: "inline-block",
                        background: Colors.yellow,
                        color: Colors.black,
                        px: 2,
                        py: 0.5,
                        borderRadius: 5,
                        fontSize: Theme.font12Bold,
                        mb: 2
                      }}
                    >
                      Default
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: Theme.font16Bold,
                        color: Colors.black,
                        lineHeight: 1.8
                      }}
                    >
                      7-135/1, Market Street,
                      <br />
                      Angara, Kapileswarapuram Mandalam,
                      <br />
                      533307
                    </Typography>


                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: 3,
                        flexWrap: "wrap"
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          background: Colors.yellow,
                          color: Colors.black,
                          borderRadius: 3,
                          textTransform: "none",
                          px: 4,
                          boxShadow: "none"
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          px: 4,
                          color: Colors.black,
                          borderColor: Colors.gray
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
            {tabValue === 4 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                  mb: 4
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", sm: 420, md: 450 },
                    background: Colors.white,
                    borderRadius: 4,
                    boxShadow: 4,
                    p: 4,
                    border: `1px solid ${Colors.border}`
                  }}
                >
                  {/* Heading */}
                  <Typography
                    sx={{
                      fontSize: Theme.font24Bold,
                      color: Colors.black,
                      textAlign: "center",
                      mb: 1
                    }}
                  >
                    Innovist
                  </Typography>

                  {/* <Typography
                  sx={{
                    textAlign: "center",
                    color: Colors.gray,
                    fontSize: Theme.font14SemiBold,
                    mb: 4
                  }}
                >
                  We'd love to hear from you 
                </Typography> */}


                  <Typography
                    sx={{
                      mb: 1,
                      color: Colors.black,
                      fontSize: Theme.font14Bold
                    }}
                  >
                    Full Name
                  </Typography>

                  <TextField
                    fullWidth
                    placeholder="Enter your full name"
                    variant="outlined"
                    margin="dense"
                    sx={{
                      mb: 3,
                      input: {
                        color: Colors.black
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3
                      }
                    }}
                  />


                  <Typography
                    sx={{
                      mb: 1,
                      color: Colors.black,
                      fontSize: Theme.font14Bold
                    }}
                  >
                    Email
                  </Typography>

                  <TextField
                    fullWidth
                    placeholder="Enter your email"
                    type="email"
                    variant="outlined"
                    margin="dense"
                    sx={{
                      mb: 3,
                      input: {
                        color: Colors.black
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3
                      }
                    }}
                  />


                  <Typography
                    sx={{
                      mb: 1,
                      color: Colors.black,
                      fontSize: Theme.font14Bold
                    }}
                  >
                    Phone Number
                  </Typography>

                  <TextField
                    fullWidth
                    placeholder="Enter your phone number"
                    variant="outlined"
                    margin="dense"
                    sx={{
                      mb: 4,
                      input: {
                        color: Colors.black
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3
                      }
                    }}
                  />


                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      background: Colors.yellow,
                      color: Colors.black,
                      borderRadius: 3,
                      py: 1.5,
                      fontSize: Theme.font16Bold,
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": {
                        background: Colors.yellow
                      }
                    }}
                  >
                    Let's Chat
                  </Button>
                </Box>

              </Box>
            )}
          </Box>









          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              mt: 3
            }}
          >


            <Box sx={{ display: { xs: "none", sm: "block" }, }}>

              <Button
                fullWidth
                onClick={handleOrders}
                sx={{
                  mb: 2,
                  gap: 2,
                  color: activeTab === "orders" ? "white" : Colors.black,
                  backgroundColor: activeTab === "orders" ? "black" : "transparent",
                  "&:hover": {
                    backgroundColor: activeTab === "orders" ? "black" : "#eee"
                  }
                }}
                variant="outlined"
              >
                <CasesIcon /> My Orders
              </Button>

              <Button
                fullWidth
                onClick={handleIcash}
                sx={{
                  mb: 2,
                  gap: 2,
                  color: activeTab === "icash" ? "white" : Colors.black,
                  backgroundColor: activeTab === "icash" ? "black" : "transparent",
                  "&:hover": {
                    backgroundColor: activeTab === "icash" ? "black" : "#eee"
                  }
                }}
                variant="outlined"
              >
                <AddCardIcon /> iCash
              </Button>

              <Button
                fullWidth
                onClick={handleReferrals}
                sx={{
                  mb: 2,
                  gap: 2,
                  color: activeTab === "referrals" ? "white" : Colors.black,
                  backgroundColor: activeTab === "referrals" ? "black" : "transparent",
                  "&:hover": {
                    backgroundColor: activeTab === "referrals" ? "black" : "#eee"
                  }
                }}
                variant="outlined"
              >
                <StyleIcon /> Referrals
              </Button>

              <Button fullWidth
                onClick={handleAddress}
                sx={{
                  mb: 2,
                  gap: 2,
                  color: activeTab === "address" ? "white" : Colors.black,
                  backgroundColor: activeTab === "address" ? "black" : "transparent",
                  "&:hover": {
                    backgroundColor: activeTab === "address" ? "black" : "#eee"
                  }
                }}
                variant="outlined">
                <HomeIcon /> ADDRESS
              </Button>

              <Button fullWidth
                onClick={handleChat}
                sx={{
                  mb: 2,
                  gap: 2,
                  color: activeTab === "chat" ? "white" : Colors.black,
                  backgroundColor: activeTab === "chat" ? "black" : "transparent",
                  "&:hover": {
                    backgroundColor: activeTab === "chat" ? "black" : "#eee"
                  }
                }}
                variant="outlined">
                <ChatIcon /> Chat With Us
              </Button>

              <Button
                fullWidth
                variant="contained"
                color="error"
                sx={{ mt: 20 }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Box>


        <Box sx={{ flex: 1, p: 4, display: { xs: "none", sm: "block" }, }}>
          {/* <Typography variant="h4" mb={3}>
            Profile Page
          </Typography> */}
          <Box
            sx={{
              flex: 1,
              p: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          ></Box>

          {showOrders && (
            <>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <Card key={index} sx={{ mb: 2, boxShadow: 5, width: { sm: "70%", md: "70%" } }}>
                    <CardContent>



                      {order.items.map((item1, i) => (
                        <Box key={i} sx={{ mt: 1 }}>
                          <Box
                            component="img"
                            src={item1.image}

                            sx={{
                              width: { sm: "70%", md: "50%", lg: "20%" },
                              height: { sm: 200, md: 200 },
                              objectFit: "cover",
                              borderRadius: 2,
                              cursor: "pointer"
                            }}
                          />
                          <Typography sx={{ fontSize: Theme.font18Bold }}>{item1.name}</Typography>
                          <Typography sx={{ fontSize: Theme.font16Bold, color: Colors.gray }}>
                            Order Total: ₹{order.total}
                          </Typography>


                          <DeleteIcon
                            onClick={() => removeOrderItem(index, i)}
                            sx={{ ml: { sm: 30, md: 50, lg: 90 } }}
                          />

                        </Box>

                      ))}

                    </CardContent>
                  </Card>
                ))
              ) : (
                <>
                  <Card sx={{ borderRadius: 3, boxShadow: 4, mt: 5 }}>
                    <CardContent>
                      <Typography sx={{ textAlign: "center", color: Colors.orange, fontSize: Theme.font18Bold }}>My Orders</Typography>
                      <Typography sx={{ color: Colors.gray, fontSize: Theme.font14Bold }}>
                        You have not placed any orders
                      </Typography>
                    </CardContent>
                  </Card>
                </>
              )}

            </>
          )}
          {showIcash && (
            <Box>


              <Box sx={{ textAlign: "center", mt: 5 }}>
                <Typography sx={{ fontSize: Theme.font20Bold, color: "gray" }}>
                  Your ICash
                </Typography>

                <Typography sx={{ fontSize: Theme.headings, mt: 1 }}>
                  0 ICash
                </Typography>

                <Typography sx={{ mt: 2, fontSize: Theme.font14SemiBold, color: "gray",ml:0 }}>
                  ICash expire in 6 months from the date they were reward
                </Typography>

                <Typography sx={{ fontSize: Theme.font14SemiBold, color: "gray" }}>
                  Expiry is calculated on rolling basis
                </Typography>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
                  <Button variant="contained" sx={{ background: Colors.black, color: Colors.white }}>
                    Redeem ICash
                  </Button>

                  <Button variant="contained" sx={{ background: Colors.black, color: Colors.white }}>
                    Activity History
                  </Button>
                </Box>
              </Box>


              <Box sx={{ mt: 8, textAlign: "center" }}>
                <Typography sx={{ fontSize: Theme.headings }}>
                  Ways To Earn
                </Typography>

                <Typography sx={{ color: Colors.gray, mt: 1 }}>
                  Earn ICash with every purchase and redeem them for discounts!
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                    mt: 4,
                    flexWrap: "wrap"
                  }}
                >
                  <Card sx={{ width: 300, p: 2 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: Theme.font16Bold }}>
                        < PhoneIphoneIcon />Download the App
                      </Typography>
                      <Typography sx={{ fontSize: Theme.font12SemiBold, color: Colors.gray }}>
                        Get 25 ICash
                      </Typography>
                    </CardContent>
                  </Card>


                  <Card sx={{ width: 300, p: 2 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: Theme.font16Bold }}>
                        <ShareIcon /> Refer & Earn
                      </Typography>
                      <Typography sx={{ fontSize: Theme.font12SemiBold, color: Colors.gray }}>
                        Get 100 ICash
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>

            </Box>
          )}
          {showReferrals && (
            <Box>


              <Box sx={{ textAlign: "center", mt: 5 }}>
                <Typography sx={{ fontSize: Theme.font18Bold, color: "gray", display: { xs: "none", sm: "none", md: "block" } }}>
                  Share this link with a friend so they can claim the 100 ICash reward.
                </Typography>
                <Typography sx={{ fontSize: Theme.font12SemiBold, color: "gray", display: { xs: "none", sm: "block", md: "none" } }}>
                  Share this link with a friend so they can claim the 100 ICash reward.
                </Typography>
              </Box>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
                <Card sx={{ width: 150, p: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontSize: Theme.font16Bold, mt: 1, color: Colors.gray }}>
                      They get
                    </Typography>

                    <Typography sx={{ mt: 2, fontSize: Theme.font16Bold, color: Colors.black }}>
                      100 ICash
                    </Typography>

                  </CardContent>
                </Card>
                <Card sx={{ width: 150, p: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontSize: Theme.font16Bold, color: Colors.gray, mt: 1 }}>
                      You get
                    </Typography>
                    <Typography sx={{ mt: 2, fontSize: Theme.font16Bold, color: Colors.black }}>
                      100 ICash
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              <Typography sx={{ fontSize: Theme.font14SemiBold, color: Colors.gray, textAlign: "center", mt: 3, display: { xs: "none", sm: "none", md: "block" } }}>
                Copy or share your referral link with your friends to get 100 ICash once their order is delivered!
              </Typography>
              <Typography sx={{ fontSize: Theme.font10SemiBold, color: Colors.gray, textAlign: "center", mt: 3, display: { xs: "none", sm: "block", md: "none" } }}>
                Copy or share your referral link with your friends to get 100 ICash.
              </Typography>
              <Box sx={{ textAlign: "center", mt: 4 }}>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#f2f2f2",
                    borderRadius: "10px",
                    p: 1,
                    maxWidth: 500,
                    margin: "auto"
                  }}
                >
                  <Typography
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      px: 2,
                      flex: 1
                    }}
                  >
                    {referralLink}
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={handleCopy}
                    sx={{
                      background: "black",
                      textTransform: "none",
                      borderRadius: "8px",
                      mr: 4
                    }}
                    startIcon={<ContentCopyIcon />}
                  >
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </Box>
              </Box>






            </Box>
          )}
          {showAddress && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: 450, md: "70%" },
                  background: Colors.white,
                  borderRadius: 4,
                  boxShadow: 3,
                  p: 3,
                  border: `1px solid ${Colors.border}`
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    flexWrap: "wrap",
                    gap: 2
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: Theme.font20Bold,
                      color: Colors.black
                    }}
                  >
                    My Address
                  </Typography>

                  <Button
                    variant="contained"
                    sx={{
                      background: Colors.yellow,
                      color: Colors.black,
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 600,
                      boxShadow: "none"
                    }}
                  >
                    Add Address
                  </Button>
                </Box>


                <Box
                  sx={{
                    background: "#fafafa",
                    borderRadius: 3,
                    p: 3,
                    border: `1px solid ${Colors.border}`
                  }}
                >

                  <Typography
                    sx={{
                      display: "inline-block",
                      background: Colors.yellow,
                      color: Colors.black,
                      px: 2,
                      py: 0.5,
                      borderRadius: 5,
                      fontSize: Theme.font12Bold,
                      mb: 2
                    }}
                  >
                    Default
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: Theme.font16Bold,
                      color: Colors.black,
                      lineHeight: 1.8
                    }}
                  >
                    7-135/1, Market Street,
                    <br />
                    Angara, Kapileswarapuram Mandalam,
                    <br />
                    533307
                  </Typography>


                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 3,
                      flexWrap: "wrap"
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        background: Colors.yellow,
                        color: Colors.black,
                        borderRadius: 3,
                        textTransform: "none",
                        px: 4,
                        boxShadow: "none"
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        px: 4,
                        color: Colors.black,
                        borderColor: Colors.gray
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
          {showChat && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                mb: 4
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: 420, md: 450 },
                  background: Colors.white,
                  borderRadius: 4,
                  boxShadow: 4,
                  p: 4,
                  border: `1px solid ${Colors.border}`
                }}
              >
                {/* Heading */}
                <Typography
                  sx={{
                    fontSize: Theme.font24Bold,
                    color: Colors.black,
                    textAlign: "center",
                    mb: 1
                  }}
                >
                  Innovist
                </Typography>

                <Typography
                  sx={{
                    textAlign: "center",
                    color: Colors.gray,
                    fontSize: Theme.font14SemiBold,
                    mb: 4
                  }}
                >
                  We'd love to hear from you 👋
                </Typography>

                {/* Full Name */}
                <Typography
                  sx={{
                    mb: 1,
                    color: Colors.black,
                    fontSize: Theme.font14Bold
                  }}
                >
                  Full Name
                </Typography>

                <TextField
                  fullWidth
                  placeholder="Enter your full name"
                  variant="outlined"
                  margin="dense"
                  sx={{
                    mb: 3,
                    input: {
                      color: Colors.black
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3
                    }
                  }}
                />

                {/* Email */}
                <Typography
                  sx={{
                    mb: 1,
                    color: Colors.black,
                    fontSize: Theme.font14Bold
                  }}
                >
                  Email
                </Typography>

                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  type="email"
                  variant="outlined"
                  margin="dense"
                  sx={{
                    mb: 3,
                    input: {
                      color: Colors.black
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3
                    }
                  }}
                />

                {/* Phone Number */}
                <Typography
                  sx={{
                    mb: 1,
                    color: Colors.black,
                    fontSize: Theme.font14Bold
                  }}
                >
                  Phone Number
                </Typography>

                <TextField
                  fullWidth
                  placeholder="Enter your phone number"
                  variant="outlined"
                  margin="dense"
                  sx={{
                    mb: 4,
                    input: {
                      color: Colors.black
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3
                    }
                  }}
                />

                {/* Button */}
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: Colors.yellow,
                    color: Colors.black,
                    borderRadius: 3,
                    py: 1.5,
                    fontSize: Theme.font16Bold,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      background: Colors.yellow
                    }
                  }}
                >
                  Let's Chat
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>


      <Box sx={{ mt: { xs: "auto", sm: "auto" } }}>
        <div id="footer">
          <Footer />
        </div>
      </Box>
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        message="Product delete  successfully"
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      />


    </Box>

  );
}

export default ProfilePage;