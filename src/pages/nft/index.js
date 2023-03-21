import { AssignmentTurnedIn, LocalMall } from "@mui/icons-material";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ContractContext, SnackbarContext } from "../../App";
import BackdropProgress from "../../components/common/BackdropProgress";
import FloatingButton from "../../components/common/FloatingButton";
import FundForm from "../../components/common/FundForm";
import ResponsiveModal from "../../components/common/ResponsiveModal";
import { getNftMetadata } from "../../helpers/getNFTMetadata";
import ActionMenu from "./ActionMenu";
import NftBanner from "./NftBanner";
import Numbers from "./Numbers";

const NFT = () => {
  const { nftId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [nft, setNft] = useState();
  const [progress, setProgress] = useState(false);
  const [openModel, setOpenModel] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { contract, accountAddress, contractConfig } =
    useContext(ContractContext);
  const setSnackbarProps = useContext(SnackbarContext);
  const getNftObject = async () => {
    const nft = await contract.getTokenById(nftId);
    const nftMetadata = await getNftMetadata([nft]);
    setNft(nftMetadata[0]);
  };

  useEffect(() => {
    if (location.state) {
      console.log("the loccation.state is-------->", location.state);
      setNft(location.state);
    } else {
      getNftObject();
    }
  }, []);

  const listNft = async (price) => {
    try {
      if (accountAddress == nft.owner) {
        setOpenModel(false);
        setProgress(true);
        const transaction = await contract.listToken(nft.id, price, {
          value: contractConfig.mintingPrice,
        });
        await transaction.wait();
        setSnackbarProps({
          open: true,
          message: "Listing Successfull",
          type: "success",
        });
      }
    } catch (error) {
      setSnackbarProps({
        open: true,
        message: "Listing Unsuccessfull",
        type: "error",
      });
    } finally {
      setProgress(false);
      navigate("/Profile");
    }
  };

  const onListClicked = () => {
    handleClose();
    setOpenModel(true);
  };

  const buyNft = async () => {
    try {
      if (accountAddress != nft.owner) {
        setProgress(true);
        const transaction = await contract.buyToken(nft.id, {
          value: nft.price,
        });
        await transaction.wait();
        setSnackbarProps({
          open: true,
          message: "Successfully bought the Token",
          type: "success",
        });
      }
    } catch (error) {
      setSnackbarProps({
        open: true,
        message: "Failed to buy the Token",
        type: "error",
      });
    } finally {
      setProgress(false);
      navigate("/Profile");
    }
  };

  const burnNft = async () => {
    try {
      if (accountAddress == nft.owner) {
        setProgress(true);
        const transaction = await contract.burnToken(nft.id);
        await transaction.wait();
        setSnackbarProps({
          open: true,
          message: "Successfully burnt the Token",
          type: "success",
        });
      }
    } catch (error) {
      setSnackbarProps({
        open: true,
        message: "Failed to burn the Token",
        type: "error",
      });
    } finally {
      setProgress(false);
      navigate("/Profile");
    }
  };

  const ActionButton = () => {
    return (
      <>
        {nft.isListed ? (
          accountAddress != nft.owner ? (
            <FloatingButton
              title="Buy"
              onClick={buyNft}
              Icon={AssignmentTurnedIn}
            />
          ) : (
            <FloatingButton
              title="Burn"
              onClick={burnNft}
              Icon={AssignmentTurnedIn}
            />
          )
        ) : accountAddress == nft.owner ? (
          <>
            <FloatingButton
              title="Actions"
              onClick={handleClick}
              Icon={LocalMall}
            ></FloatingButton>
            <ActionMenu
              {...{
                anchorEl,
                open,
                handleClose,
                onListClicked,
                burnNft,
              }}
            />
          </>
        ) : (
          ""
        )}
      </>
    );
  };
  return (
    <>
      {nft ? (
        <Box>
          <NftBanner nftObj={nft} />
          <Numbers nftObj={nft} />
          <ActionButton />
          <ResponsiveModal
            title="Set NFT Price :"
            open={openModel}
            onClose={() => {
              setOpenModel(false);
            }}
          >
            <FundForm btnName="List" onSubmit={listNft} />
          </ResponsiveModal>
          <BackdropProgress open={progress} />
        </Box>
      ) : (
        "LOADING"
      )}
    </>
  );
};

export default NFT;
