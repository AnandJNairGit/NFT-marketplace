import { CampaignRounded } from "@mui/icons-material";
import { Fab } from "@mui/material";
import React from "react";

const FloatingButton = ({ onClick, title, Icon, children }) => {
  return (
    <>
      <Fab
        onClick={onClick}
        variant="extended"
        sx={{
          background: "#52eb34",
          position: "fixed",
          bottom: 30,
          right: 20,
        }}
      >
        <Icon />
        {title}
      </Fab>
      {children}
    </>
  );
};

export default FloatingButton;
