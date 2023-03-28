import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { ProgressContext } from ".";
import { ContractContext } from "../../App";
import Centered from "../../components/common/Centered";
import FundForm from "../../components/common/FundForm";
import ResponsiveModal from "../../components/common/ResponsiveModal";

const MintingPrice = () => {
  const contract = useContext(ContractContext).contract;
  const setProgress = useContext(ProgressContext);
  const [mintingPrice, setMintingPrice] = useState();
  const [openModal, setOpenModal] = useState(false);

  const getMintingPrice = async () => {
    const listingPrice = await contract.mintingPrice();
    const formatedListPrice = ethers.utils.formatUnits(listingPrice);

    // console.log("the minimum contribution-----", formatedContribution);
    setMintingPrice(formatedListPrice);
  };

  const updateMintingPrice = async (value) => {
    try {
      setOpenModal(false);
      setProgress(true);
      const transaction = await contract.updateMintingPrice(value);
      await transaction.wait();
      await getMintingPrice();
    } catch (error) {
    } finally {
      setProgress(false);
    }
  };

  useEffect(() => {
    getMintingPrice();
  }, []);

  return (
    <>
      {mintingPrice ? (
        <Box textAlign="center">
          <Typography variant="h4">{mintingPrice}</Typography>
          <Typography fontSize="20px">Minting Price (ETH)</Typography>
          <Button
            variant="contained"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Change
          </Button>
        </Box>
      ) : (
        <Centered>
          <CircularProgress />
        </Centered>
      )}
      <ResponsiveModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        title="Update Minting Price"
      >
        <FundForm onSubmit={updateMintingPrice} btnName="Update" />
      </ResponsiveModal>
    </>
  );
};

export default MintingPrice;
