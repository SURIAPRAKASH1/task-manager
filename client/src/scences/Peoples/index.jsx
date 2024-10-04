import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import PlateFormUsers from "../../components/PlateFormUsers.jsx";

const Peoples = () => {
  return (
    <Box p="2rem">
      <Typography variant="h6" color="grey" textAlign="center">
        peoples
      </Typography>

      <Divider />
      <PlateFormUsers />
    </Box>
  );
};

export default Peoples;
