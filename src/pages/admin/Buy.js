import { Switch, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { ProgressContext } from ".";
import { ContractContext } from "../../App";
import Centered from "../../components/common/Centered";

const Buy = () => {
  const [buyingStatus, setBuyingStatus] = React.useState(false);
  const contract = useContext(ContractContext).contract;
  const setProgress = useContext(ProgressContext);

  const getNFTbuyingStatus = async () => {
    const status = await contract.allowBuy();
    setBuyingStatus(status);
  };

  const updateNFTbuyingStatus = async (event) => {
    try {
      setBuyingStatus(event.target.checked);
      setProgress(true);
      const transaction = await contract.updateBuy(event.target.checked);
      await transaction.wait();
    } catch (error) {
    } finally {
      await getNFTbuyingStatus();
      setProgress(false);
    }
  };

  useEffect(() => {
    getNFTbuyingStatus();
  }, []);

  return (
    <Centered>
      <Switch
        checked={buyingStatus}
        onChange={updateNFTbuyingStatus}
        inputProps={{ "aria-label": "controlled" }}
      />
      <Typography>
        {buyingStatus ? "Buying Enabled" : "Buying Disabled"}
      </Typography>
    </Centered>
  );
};

export default Buy;
