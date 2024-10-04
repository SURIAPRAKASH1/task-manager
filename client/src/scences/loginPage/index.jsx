import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const { palette } = useTheme();
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");

  return (
    <Box>
      <Box
        width="100%"
        p="1rem 6%"
        backgroundColor={palette.background.alt}
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="grey">
          what's cookin' ?
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreen ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={palette.background.alt}
      >
        <Typography
          fontWeight="500"
          variant="h5"
          sx={{
            mb: "1.5rem",
          }}
        >
          Welcome to what's cookin'?
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
