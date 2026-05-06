import { Box, Button,  Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Theme } from "../GlobalStyles";
import Colors from "../colors";

function Journal() {
  const { data = [] } = useSelector(
    (state) => state.getproductdata || {}
  );

  const cards5Data =
    Array.isArray(data)
      ? data.find((item) => item.cards5)?.cards5 || []
      : [];

  return (
    <>
      <Typography
        sx={{
          ml: { xs: 2, md: 15 },
          mt: 4,
          fontSize: Theme.font18Bold,
          color:Colors.gray,
          mb:1
        }}
      >
        From the Journal
      </Typography>

      <Typography
        sx={{
          ml: { xs: 2, md: 15 },
          mb: 3,
          fontSize: Theme.font14SemiBold
        }}
      >
        Your go-to read for all things self-care
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1450px",
          mx: "auto",
          overflow: "hidden",
          px: { xs: 1, sm: 2 }
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 2,
            //  px:5,
     
      ml: { xs: 3, md: 15 },
      mr: { xs: 3, md: 15 },
            "&::-webkit-scrollbar": {
              height: "6px"
            }
          }}
        >
          {cards5Data.map((item, index) => (
            <Box
              key={index}
              sx={{
              
                maxWidth: { xs: 300, md: 360 },
                flexShrink: 0,
                borderRadius: 4,
                overflow: "hidden",
                backgroundColor: Colors.white,
                boxShadow: 2
              }}
            >
         
              <Box
                component="img"
                src={item.image}
                sx={{
                  width: "100%",
                  height: { xs: 180, md: 180 },
                  objectFit: "cover"
                }}
              />

              <Box sx={{ p: 2.5 }}>
                <Typography
                  sx={{
                    fontSize:Theme.font18Bold,
                   
                   
                  }}
                >
                  {item.description}
                </Typography>

                <Typography
                  sx={{
                    mt: 1.5,
                    color:Colors.black,
                    fontSize:Theme.font14SemiBold,
                    lineHeight: 1.8,
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    minHeight: 82
                  }}
                >
                  {item.text}
                </Typography>

                <Box
                  sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Box
                      component="img"
                      src={item.image1}
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                    />

                    <Box>
                      <Typography
                        sx={{
                         fontSize:Theme.font14SemiBold
                        }}
                      >
                        {item.text1}
                      </Typography>

                      <Typography
                        sx={{
                          color: "gray",
                          fontSize: Theme.font12Bold
                        }}
                      >
                        {item.date}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    sx={{
                      backgroundColor:Colors.black,
                      color:Colors.white,
                      px: 3,
                      py: 1,
                      borderRadius: "30px",
                      textTransform: "none",
                     fontSize:Theme.font14Bold,
                      "&:hover": {
                        backgroundColor:Colors.black
                      }
                    }}
                  >
                    Read More
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default Journal;