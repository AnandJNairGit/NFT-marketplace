import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { ContractContext } from "../../App";
import BackdropProgress from "../../components/common/BackdropProgress";
import FundForm from "../../components/common/FundForm";
import NFTTile from "../../components/common/NFTTile";
import ResponsiveModal from "../../components/common/ResponsiveModal";
import { getNftMetadata } from "../../helpers/getNFTMetadata";

const MyNfts = () => {
  const { contract, contractConfig } = useContext(ContractContext);
  const [myNFTs, setMyNFTs] = useState();

  const getMyNFTs = async () => {
    const myNFTs = await contract.getAllMyTokens();
    const MyNFTMetadata = await getNftMetadata(myNFTs);
    setMyNFTs(MyNFTMetadata);
    console.log("my NFTs---------->>", MyNFTMetadata);
  };

  const listNft = async (id, price) => {
    const value = contractConfig.mintingPrice;
    const transaction = await contract.listToken(id, price, { value });
  };
  useEffect(() => {
    getMyNFTs();
  }, []);
  return (
    <>
      {myNFTs ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {myNFTs.map((nft) => (
            <NFTTile nftObj={nft} showStatusBadge />
          ))}
        </Box>
      ) : (
        <BackdropProgress open={true} />
      )}
      <ResponsiveModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        title="Fund Campaign"
      >
        <FundForm onSubmit={transferfund} />
      </ResponsiveModal>
    </>
  );
};

export default MyNfts;
