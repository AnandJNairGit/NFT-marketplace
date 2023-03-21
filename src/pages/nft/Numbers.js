import { Box, Typography } from "@mui/material";
import React from "react";
import { ethers } from "ethers";

const weiToEther = (wei) => {
  const requiredAmountWei = ethers.BigNumber.from(`${wei}`);
  return ethers.utils.formatEther(requiredAmountWei);
};

const unixTimestampToIST = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
};
const Numbers = ({ nftObj }) => {
  const { price, mintedDate } = nftObj;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        "& > :not(style)": {
          marginY: 5,
        },
      }}
    >
      <Box textAlign="center">
        <Typography variant="h4" color="#5af25f">
          {weiToEther(price)}
        </Typography>
        <Typography>Price (ETH)</Typography>
      </Box>
      <Box textAlign="center">
        <Typography variant="h4" color="#f2a641">
          {unixTimestampToIST(mintedDate)}
        </Typography>
        <Typography>Minted Date</Typography>
      </Box>
    </Box>
  );
};

export default Numbers;
