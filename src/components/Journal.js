import { Box, Button,  Card,  CardContent,  Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Theme } from "../GlobalStyles";
import Colors from "../colors";

function Journal() {
  const { data = [] } = useSelector(
    (state) => state.getproductdata || {}
  );

  const journalData =
    Array.isArray(data)
      ? data.find((item) => item.journal)?.journal || []
      : [];
  console.log("journalData", data[3]);
   console.log(journalData)
  return (
    <>
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
     
      ml: { xs: 0, md: 0 },
      mr: { xs: 3, md: 15 },
            "&::-webkit-scrollbar": {
              height: "6px"
            }
          }}
        >
          {journalData.map((item, index) => (
           <Box key={index} sx={{ mb: 5 }}>

            <Typography variant="h4" sx={{
              ml: { xs: 0, md: 0, },
              mt: 4,
              mb: 1,
              fontSize: Theme.font18Bold,
              color: Colors.gray
            }}
            >
              {item.title}
            </Typography>

            <Typography sx={{
              ml: { xs: 0, md: 0 },
              mb: 3,
              fontSize: Theme.font14SemiBold,
              color: Colors.gray
            }}>
              {item.subheading}
            </Typography>
            
              <Box
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
                  key={index1}
                  sx={{
                    minWidth: {
                      xs: 230,
                      sm: 230,
                      md: 350
                    },
                    maxWidth: {
                      xs: 250,
                      sm: 280,
                      md: 250
                    },
                    flexShrink: 0,
                    boxShadow: 2,
                    borderRadius: 3,
                borderLeft: `1px solid ${Colors.border}`,
                borderBottom: `1px solid ${Colors.border}`,
                borderRight:`1px solid ${Colors.border}`,
                    p: 0,
                    backgroundColor: Colors.white,
                    display: "flex",
                    flexDirection: "column",
                    height: {
                      xs: 490,
                      sm: 520,
                      md: 460
                    }
                  }}
                >
              <Box
                component="img"
                src={item1.image}
                sx={{
                  width: "100%",
                  height: { xs: 180, md: 180 },
                  objectFit: "cover"
                }}
              />
              <CardContent>
              <Box sx={{ p: 2.5,mt:"auto" }}>
                <Typography
                  sx={{
                    fontSize:Theme.font18Bold,
                   
                   
                  }}
                >
                  {item1.name}
                </Typography>

                <Typography
                  sx={{
                    mt:"auto" , 
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
                  {item1.text}
                </Typography>

                <Box
                  sx={{
                   mt:"auto" ,
                    pt: 3,
                    borderTop: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1.5,mt:"auto " }}>
                    {/* <Box
                      component="img"
                      src={item1.images}
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        objectFit: "cover"
                      }} */}
                    {/* /> */}

                    <Box sx={{ }}>
                      <Typography
                        sx={{
                         fontSize:Theme.font14SemiBold
                        }}
                      >
                        {item1.text1}
                      </Typography>

                      <Typography
                        sx={{
                          color: "gray",
                          fontSize: Theme.font12Bold
                        }}
                      >
                        {item1.date}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    sx={{
                      backgroundColor:Colors.black,
                      mt:"auto",
                      color:Colors.white,
                      px: 3,
                      py: 1,
                       
                      borderRadius: "30px",
                      textTransform: "none",
                     fontSize:Theme.font14Bold,
                      "&:hover": {
                        backgroundColor:Colors.black,
                       
                      }
                    }}
                  >
                    Read More
                  </Button>
                  </Box>
                  </Box>
                  </CardContent>
                  </Card>
               ))}
                </Box>
              </Box>
            
          ))}
        </Box>
      </Box>
    </>
  );
}

export default Journal;