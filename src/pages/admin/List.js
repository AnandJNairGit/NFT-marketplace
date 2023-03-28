import { Switch, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { ProgressContext } from ".";
import { ContractContext } from "../../App";
import Centered from "../../components/common/Centered";

const List = () => {
  const [listingStatus, setListingStatus] = React.useState(false);
  const contract = useContext(ContractContext).contract;
  const setProgress = useContext(ProgressContext);

  const getNFTlistingStatus = async () => {
    const status = await contract.allowListing();
    setListingStatus(status);
  };

  const updateNFTListingStatus = async (event) => {
    try {
      setListingStatus(event.target.checked);
      setProgress(true);
      const transaction = await contract.updateList(event.target.checked);
      await transaction.wait();
    } catch (error) {
    } finally {
      await getNFTlistingStatus();
      setProgress(false);
    }
  };

  useEffect(() => {
    getNFTlistingStatus();
  }, []);

  return (
    <Centered>
      <Switch
        checked={listingStatus}
        onChange={updateNFTListingStatus}
        inputProps={{ "aria-label": "controlled" }}
      />
      <Typography>
        {listingStatus ? "Listing Enabled" : "Listing Disabled"}
      </Typography>
    </Centered>
  );
};

export default List;
