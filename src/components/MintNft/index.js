import React, { useContext, useState } from "react";

import CreateForm from "./CreateForm";
import FloatingButton from "../common/FloatingButton";
import ResponsiveModal from "../common/ResponsiveModal";
import BackdropProgress from "../common/BackdropProgress";
import { ContractContext, SnackbarContext } from "../../App";
import { Create } from "@mui/icons-material";

const MintNft = () => {
  const [open, setOpen] = React.useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const setSnackbarProps = useContext(SnackbarContext);
  const { allowCreate } = useContext(ContractContext).contractConfig;

  const handleClickOpen = () => {
    if (allowCreate) {
      setOpen(true);
    } else {
      console.log("INSIDE NFT CREATION");
      setSnackbarProps({
        open: true,
        message:
          "Sorry, NFT minting is currently disabled. Please try again later.",
        type: "info",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div>
        <ResponsiveModal
          open={open}
          onClose={handleClose}
          title="Mint NFT :"
        >
          <CreateForm
            closeModal={handleClose}
            setProgressOpen={setProgressOpen}
          />
        </ResponsiveModal>
      </div>
      <FloatingButton onClick={handleClickOpen} title="Mint NFT" Icon={Create}/>
      <BackdropProgress open={progressOpen} />
    </>
  );
};

export default MintNft;
