import { Box, Menu, MenuItem } from "@mui/material";
import React from "react";

const ActionMenu = ({ anchorEl, open, handleClose, onListClicked, burnNft }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: window.innerHeight, left: window.innerWidth }}
    >
      <MenuItem onClick={burnNft}>Burn</MenuItem>
      <MenuItem onClick={onListClicked}>List</MenuItem>
    </Menu>
  );
};

export default ActionMenu;
