import { Person } from "@mui/icons-material";
import { Chip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const NftBanner = ({ nftObj }) => {
  const { id, imageUrl, title, description, owner } = nftObj;
  console.log({ id, imageUrl, title, description });
  // const formattedTitle = title.replace(/\b(\w)/g, (match) =>
  //   match.toUpperCase()
  // );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "16px",
        padding: "32px",
        // overflow: "hidden",
        // background:"red"
      }}
    >
      <Typography variant="h3">{title}</Typography>
      <img
        src={imageUrl}
        alt={title}
        style={{ width: "100%", maxWidth: "600px" }}
      />
      <Chip
        sx={{ marginTop: 1 }}
        icon={<Person />}
        label={owner}
        color="default"
      />
      <Typography variant="body1">{description}</Typography>
    </Box>
  );
};

export default NftBanner;
