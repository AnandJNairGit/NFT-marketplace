import NFTMarketplace from "../contractABI/NFTMarketplace.json";

async function getContract() {
  const ethers = require("ethers");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const accountAddress = await signer.getAddress();

  // Create the contract instance
  const contract = new ethers.Contract(
    "0x8c6e46B82D6c75D64563362a8659F3E0C5EA1630",
    NFTMarketplace.abi,
    signer
  );

  console.log("----------->", await contract.getAllMyTokens());

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
