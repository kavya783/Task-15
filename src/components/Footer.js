import { Box, Typography, Grid, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import Colors from "../colors";
import { useSelector } from "react-redux";
import { Theme } from "../GlobalStyles";

function Footer() { const { data = [] } = useSelector(
    (state) => state.getproductdata || {}
  );

  const footerData =
    Array.isArray(data)
      ? data.find((item) => item.footer)?.footer || []
      : [];

  return (
    <Box
      sx={{
        backgroundColor:Colors.black,
        color:Colors.white,
        mt: 6,
        px: { xs: 3, sm: 5, md: 12 },
        py: 3
      }}
    >
      <Grid container spacing={4}>
      
        <Grid item xs={12} sm={6} md={4}>
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: "bold",
              mb: 2,
              letterSpacing: 1
            }}
          >
            INNOVIST
          </Typography>

          <Typography
            sx={{
              color: "#ccc",
              fontSize: "14px",
              lineHeight: 1.8
            }}
          >
           Clean|Transparent|Science
          </Typography>

          <Box sx={{ mt: 2 }}>
            <IconButton sx={{ color:Colors.white }}>
              <FacebookIcon />
            </IconButton>

            <IconButton sx={{ color:Colors.white }}>
              <InstagramIcon />
            </IconButton>

            <IconButton sx={{ color: Colors.white  }}>
              <YouTubeIcon />
            </IconButton>

            <IconButton sx={{ color: Colors.white }}>
              <TwitterIcon />
            </IconButton>
          </Box>
          <Typography>Experiecne The Innovist Mobile App</Typography>
           <Box
    sx={{
      display: "flex",
      gap: { xs: 1.5, sm: 2, md: 2 },
      overflowX: "auto",
      scrollBehavior: "smooth",
      pb: 2,
     mt:2,
     

     
    }}
  >
  {footerData.slice(0, 2).map((item, index) => (
    <Box sx={{ position: "relative" }}>
              <Box
                component="img"
                src={item.image}
                sx={{
                  width: "100%",
                  height: 30,
                  objectFit: "cover",
                  borderRadius: 2,
                  ml:0
                }}
              />
              </Box>

  ))}

  </Box>
        </Grid>
         
        <Grid item xs={6} sm={3} md={2}>
            <Box sx={{ml:{xs:2,md:20}}}>
          <Typography sx={{fontSize:Theme.font18Bold, mb: 2, borderBottom: "2px solid #333" }}>
            Shop
          </Typography>
          <ul >
          <li sx={{ mb: 2, }}>All Products</li>
          <li sx={{ mb: 2 }}>BestSellers</li>
          <li sx={{ mb: 2 }}>NewLaunches</li>
          <li sx={{ mb: 2 }}>Hair care</li>
            <li sx={{ mb: 2 }}>Skin care</li>
              <li sx={{ mb: 2 }}>Sun care</li>
              </ul>
             </Box> 
        </Grid>

       
        <Grid item xs={6} sm={3} md={3}>
             <Box sx={{ml:2}}>
                <ul>
          <Typography sx={{ fontSize:Theme.font16Bold, mb: 2, borderBottom: "2px solid #333", }}>
          Know More
          </Typography>
          
          <li sx={{ mb: 1, }}>About Us</li>
          <li sx={{ mb: 1 }}>Careers</li>
          <li sx={{ mb: 1 }}>Innovist Insider</li>
          <li sx={{ mb: 1 }}>Blogs</li>
          <li sx={{ mb: 1 }}>Return/Exchange</li>
          <li sx={{ mb: 1 }}>Track Order</li>
          <li sx={{ mb: 1 }}>Contact Us</li>
          <li sx={{ mb: 1 }}>Terms and Conditions</li>
           <li sx={{ mb: 1 }}>Privacy Policy</li>
             <li sx={{ mb: 1 }}>Shipping and Returns Policy</li>

          </ul>
          </Box>
        </Grid>

       
       <Grid item xs={12} sm={6} md={3}>
  <Typography
    sx={{
      fontSize:Theme.font16Bold,
      mb: 2,
      borderBottom: "2px solid #333"
    }}
  >
    Explore
  </Typography>

  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2
    }}
  >
    {footerData.slice(2, 6).map((item) => (
      <Box
        component="img"
        key={item.id}
        src={item.image}
        sx={{
          width: 45,
          height: 30,
          objectFit: "contain",
          borderRadius: 1,
          cursor: "pointer"
        }}
      />
    ))}
  </Box>



  <Typography
    sx={{
     fontSize:Theme.font16Bold,
      mb: 2,
      mt:3,
      borderBottom: "2px solid #333"
    }}
  >
    Secure Payment
  </Typography>

  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2
    }}
  >
    {footerData.slice(6, 11).map((item) => (
      <Box
        component="img"
        key={item.id}
        src={item.image}
        sx={{
          width: 45,
          height: 30,
          objectFit: "contain",
          borderRadius: 1,
          cursor: "pointer"
        }}
      />
    ))}
  </Box>
  </Grid>

      </Grid>

      <Box
        sx={{
          borderTop: "1px solid #333",
          mt: 4,
          pt: 3,
          textAlign: "center"
        }}
      >
        <Typography sx={{ color: "#aaa",  fontSize:Theme.font14Bold, }}>
       Copyright © 2026 Onesto Labs Private Limited. All Rights Reserved
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;