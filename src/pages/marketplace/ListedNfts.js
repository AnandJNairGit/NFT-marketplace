import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { ContractContext } from "../../App";
import BackdropProgress from "../../components/common/BackdropProgress";
import NFTTile from "../../components/common/NFTTile";
import { getNftMetadata } from "../../helpers/getNFTMetadata";

const ListedNFTs = () => {
  const { contract, contractConfig } = useContext(ContractContext);
  const [listedNFTs, setListedNFTs] = useState();

  const getlistedNFTs = async () => {
    console.log("inside get NFT");
    const listedNFTs = await contract.getAllListedTokens();
    console.log("THE LISTED NFTS ARE--------->", listedNFTs);
    const MyNFTMetadata = await getNftMetadata(listedNFTs);
    setListedNFTs(MyNFTMetadata);
    console.log("my NFTs---------->>", MyNFTMetadata);
  };

  useEffect(() => {
    getlistedNFTs();
  }, []);
  return (
    <>
      {listedNFTs ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {listedNFTs.map((nft) => (
            <NFTTile nftObj={nft} />
          ))}
        </Box>
      ) : (
        <BackdropProgress open={true} />
      )}
    </>
  );
};

export default ListedNFTs;
