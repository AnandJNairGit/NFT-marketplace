import { Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";

const Home = () => {

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      // Metamask is installed
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts.length > 0) {
            // User is connected
            // setIsConnected(true);
            console.log("the accounts are----->", accounts);
            console.log("connected");
          }else {
            console.log("not connected");
            
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h2" sx={{ mb: 4 }}>
        Welcome to the NFT Marketplace
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 8 }}>
        Discover, buy, and sell unique digital assets
      </Typography>
      <Button variant="contained" color="primary">
        Explore Marketplace
      </Button>
    </Box>
  );
};

export default Home;
