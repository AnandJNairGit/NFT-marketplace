import React from "react";
import MintNft from "../../components/MintNft";
import ListedNFTs from "./ListedNfts";

const Marketplace = () => {
  return (
    <>
      <ListedNFTs />
      <MintNft />
    </>
  );
};

export default Marketplace;
