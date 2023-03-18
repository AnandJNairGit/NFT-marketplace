import NFTMarketplace from "../contractABI/NFTMarketplace.json";

async function getContract() {
  const ethers = require("ethers");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const accountAddress = await signer.getAddress();

  // Create the contract instance
  const contract = new ethers.Contract(
    "0x527E4987b3A82B5de475D28DFB34E1961a0353C2",
    NFTMarketplace.abi,
    signer
  );

  // Call multiple contract methods at once using Promise.all()
  const [isAdmin, mintingPrice, allowCreate, allowListing, allowBuy] =
    await Promise.all([
      contract.isAdmin(),
      contract.mintingPrice(),
      contract.allowCreate(),
      contract.allowListing(),
      contract.allowBuy(),
    ]);

  const contractConfig = {
    isAdmin,
    mintingPrice,
    allowCreate,
    allowListing,
    allowBuy,
  };

  return { accountAddress, contract, contractConfig };
}

export default getContract;
