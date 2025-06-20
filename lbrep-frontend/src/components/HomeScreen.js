import React, { useState } from "react";

// MUI imports
import { Button, Typography, Box } from "@mui/material";

// Components
import CustomCard from "./CustomCard";


// Assets
import city from "./Assets/city.jpg";



function Home() {
  const [btnColor, setBtnColor] = useState("error");
  


  return (
    <>
    <div style={{ position: "relative"}}>
      <img src={city} style={{ width: "100%", height: "92vh" }} />
      <Box
        sx={{
          position: 'absolute',
          zIndex: 100,
          top: '100px',
          left: '20px',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          FIND YOUR{' '}
          <Box component="span" sx={{ color: 'green' }}>
            NEXT PROPERTY
          </Box>{' '}
          ON THE LBREP WEBSITE
        </Typography>

        <Button
          variant="contained"
          sx={{
            fontSize: '3.5rem',
            borderRadius: '15px',
            backgroundColor: 'green',
            marginTop: '2rem',
            boxShadow: '3px 3px 3px white',
            '&:hover': {
              backgroundColor: 'darkgreen',
            },
          }}
        >
          SEE ALL PROPERTIES
        </Button>
      </Box>
      </div>
    </>
  );
}

export default Home;