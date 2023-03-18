import { getMetaData } from "../services/pinata";

export const getNftMetadata = async (nfts) => {
  console.log("inside helper function-------->");
  try {
    let nftsInfo = [];
    for (let index = 0; index < nfts.length; index++) {
      try {
        const nftMetadata = await (await getMetaData(nfts[index].ipfsHash)).data;
        console.log("the nftmetadata------>", nftMetadata);
        const nftInfo = {
          id: nfts[index].tokenId.toNumber(),
          owner: nfts[index].owner,
          title: nftMetadata.nftTitle,
          description: nftMetadata.nftDescription,
          price: nfts[index].price.toNumber(),
          mintedDate: nftMetadata.mintedDate,
          imageUrl: "https://ipfs.moralis.io/ipfs/" + nftMetadata.imgUrl,
          isListed: nfts[index].isListed,
        };
        nftsInfo.push(nftInfo);
      } catch (error) {}
    }
    // console.log(campaignsInfo);
    return nftsInfo;
  } catch (error) {
    return [];
  }
};
