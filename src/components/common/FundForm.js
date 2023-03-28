import { Box, Button, MenuItem, Select, TextField } from "@mui/material";
import { ethers } from "ethers";
import React, { useState } from "react";

const ValueGenerator = ({ onSubmit, btnName }) => {
  const [fund, setFund] = useState(100);
  const [unit, setUnit] = useState(0);
  const submit = async () => {
    console.log("inside submit");
    const value =
      unit === 0 ? Math.round(fund) : ethers.utils.parseEther(fund.toString());
    console.log(value);
    await onSubmit(value);
  };

  return (
    <>
      <Box margin="5px">
        <TextField
          label="Fund"
          value={fund}
          type="number"
          onChange={(event) => {
            console.log(parseInt(event.target.value));

            setFund(event.target.value);
          }}
        />
        <Box marginTop="6px"></Box>
        <Select
          width="20px"
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          fullWidth
          value={unit}
          label="unit"
          onChange={(e) => {
            console.log("the unit ------------->", e.target.value);
            setUnit(e.target.value);
          }}
        >
          <MenuItem value={0}>Wei</MenuItem>
          <MenuItem value={1}>Ether</MenuItem>
        </Select>
        <Button
          disabled={!(fund > 0 && !isNaN(fund))}
          sx={{ marginTop: 2 }}
          variant="contained"
          onClick={submit}
        >
          {btnName}
        </Button>
      </Box>
    </>
  );
};

export default ValueGenerator;
