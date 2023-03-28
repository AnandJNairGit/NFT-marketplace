import { Box, Button, Container, Typography } from "@mui/material";
import React, { createContext, useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Create from "./Create";
import BackdropProgress from "../../components/common/BackdropProgress";
import List from "./List";
import Buy from "./Buy";
import MintingPrice from "./MintingPrice";

const AccordionContent = ({ summary, children }) => {
  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{summary}</Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </>
  );
};

export const ProgressContext = createContext();
const Admin = () => {
  const [openProgress, setOpenProgress] = useState(false);
  return (
    <>
      <ProgressContext.Provider value={setOpenProgress}>
        <Container sx={{ marginTop: 10 }}>
          {/* <AccordionContent summary="Minting Price">
            <MinimumContribution />
          </AccordionContent> */}
          <AccordionContent summary="NFT Creation">
            <Create />
          </AccordionContent>
          <AccordionContent summary="NFT Listing">
            <List />
          </AccordionContent>
          <AccordionContent summary="NFT Owner Transfer">
            <Buy />
          </AccordionContent>
          <AccordionContent summary="NFT Minting Price">
            <MintingPrice />
          </AccordionContent>
        </Container>
      </ProgressContext.Provider>

      <BackdropProgress open={openProgress} />
    </>
  );
};

export default Admin;
