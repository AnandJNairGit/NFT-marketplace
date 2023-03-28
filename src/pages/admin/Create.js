import { Switch, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { ProgressContext } from ".";
import { ContractContext } from "../../App";
import Centered from "../../components/common/Centered";

const Create = () => {
  const [creationStatus, setCreationStatus] = React.useState(false);
  const contract = useContext(ContractContext).contract;
  const setProgress = useContext(ProgressContext);

  const getNFTCreationStatus = async () => {
    const status = await contract.allowCreate();
    setCreationStatus(status);
  };

  const updateNFTCreationStatus = async (event) => {
    try {
      setCreationStatus(event.target.checked);
      setProgress(true);
      const transaction = await contract.updateCreate(event.target.checked);
      await transaction.wait();
    } catch (error) {
    } finally {
      await getNFTCreationStatus();
      setProgress(false);
    }
  };

  useEffect(() => {
    getNFTCreationStatus();
  }, []);

  return (
    <Centered>
      <Switch
        checked={creationStatus}
        onChange={updateNFTCreationStatus}
        inputProps={{ "aria-label": "controlled" }}
      />
      <Typography>
        {creationStatus ? "Creation Enabled" : "Creation Disabled"}
      </Typography>
    </Centered>
  );
};

export default Create;
