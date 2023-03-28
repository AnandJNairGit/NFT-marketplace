import { Box } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import BackdropProgress from "./components/common/BackdropProgress";
import SnackNotification from "./components/common/SnackNotification";
import NavBar from "./components/navbar";
import Admin from "./pages/admin";
import Home from "./pages/home";
import Marketplace from "./pages/marketplace";
import NFT from "./pages/nft";
import Profile from "./pages/profile";
import getContract from "./services/ethers";

export const ContractContext = createContext();
export const SnackbarContext = createContext();

function App() {
  const [contract, setContract] = useState();
  const [contractConfig, setContractConfig] = useState();
  const [accountAddress, setAccountAddress] = useState();

  const [snackbarProps, setSnackbarProps] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const onSnackbarClose = () => {
    console.log("INSIDE ON SNACKBAR CLOSE");
    setSnackbarProps({
      open: false,
      message: "",
      type: "info",
    });
  };

  const updateContract = async () => {
    const { contract, accountAddress, contractConfig } = await getContract();
    setContract(contract);
    setAccountAddress(accountAddress);
    setContractConfig(contractConfig);
  };

  const onChangeInWallet = () => {
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
  };

  useEffect(() => {
    const init = async () => {
      const { contract, accountAddress, contractConfig } = await getContract();
      setContract(contract);
      setAccountAddress(accountAddress);
      setContractConfig(contractConfig);

      if (contract) {
        contract.on("updateContractInstance", updateContract);
      }
      onChangeInWallet();
    };

    init();
  }, []);

  return (
    <>
      {contract && accountAddress && contractConfig ? (
        <SnackbarContext.Provider value={setSnackbarProps}>
          <ContractContext.Provider
            value={{
              contract,
              updateContract,
              accountAddress,
              contractConfig,
            }}
          >
            <nav>
              <NavBar />
            </nav>
            <Box height="65px" />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Marketplace" element={<Marketplace />} />
              {/* <Route path="/Marketplace/nft/:id" element={<Marketplace />} /> */}

              {/* <Route path="/Create" element={<Create />} /> */}
              <Route path="/Profile" element={<Profile />} />
              <Route path="/nft/:id" element={<NFT />} />

              {contractConfig.isAdmin ? (
                <Route path="/admin" element={<Admin />} />
              ) : (
                ""
              )}
            </Routes>
          </ContractContext.Provider>
        </SnackbarContext.Provider>
      ) : (
        <BackdropProgress open={true} />
      )}
      <SnackNotification {...snackbarProps} handleClose={onSnackbarClose} />
    </>
  );
}

export default App;
