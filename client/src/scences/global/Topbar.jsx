import { useState } from "react";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Icon,
  Select,
} from "@mui/material";
import {
  Search,
  Message,
  LightMode,
  DarkMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import FlexBetween from "../../components/FlexBetween";
import { setMode, setLogout } from "../../state";
import NotificationIcon from "../../components/NotificationIcon";

const Topbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const { palette } = useTheme();
  const fullName = `${user.firstName} ${user.lastName}` || "";

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "64px",
        zIndex: 10,
      }}
    >
      <FlexBetween p="1rem 6%" backgroundColor={palette.background.alt}>
        <FlexBetween gap="1.75rem">
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="grey"
            onClick={() => navigate("/home")}
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: palette.primary.main,
              },
            }}
          >
            What's cookin' ?
          </Typography>
          {/* {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={palette.netural.light}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )} */}
        </FlexBetween>

        {isNonMobileScreens ? (
          <FlexBetween gap="2rem">
            <IconButton onClick={() => dispatch(setMode())}>
              {palette.mode === "dark" ? (
                <DarkMode
                  sx={{
                    fontSize: "25px",
                  }}
                />
              ) : (
                <LightMode
                  sx={{
                    fontSize: "25px",
                    color: palette.netural.dark,
                  }}
                />
              )}
            </IconButton>
            <Message
              sx={{
                fontSize: "25px",
              }}
            />
            {/* <IconButton
              onClick={() => navigate("/notifications")}
              sx={{
                fontSize: "25px",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <Notifications
                sx={{
                  fontSize: "25px",
                }}
              />
            </IconButton> */}
            <NotificationIcon />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  background: palette.netural.light,
                  width: "150px",
                  p: "0.25rem 1rem",
                  borderRadius: "0.25rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: palette.netural.light,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        ) : (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <Menu />
          </IconButton>
        )}
        {!isNonMobileScreens && isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="500px"
            minWidth="300px"
            backgroundColor={palette.background.default}
          >
            <Box display="flex" justifyContent="flex-end" p="1rem">
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              >
                <Close />
              </IconButton>
            </Box>

            <FlexBetween
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap="2rem"
            >
              <IconButton onClick={() => dispatch(setMode())}>
                {palette.mode === "dark" ? (
                  <DarkMode sx={{ fontSize: "25px" }} />
                ) : (
                  <LightMode
                    sx={{ fontSize: "25px", color: palette.netural.dark }}
                  />
                )}
              </IconButton>
              <Message sx={{ fontSize: "25px" }} />

              <IconButton
                onClick={() => navigate("/notifications")}
                sx={{
                  fontSize: "25px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <Notifications
                  sx={{
                    fontSize: "25px",
                  }}
                />
              </IconButton>

              <Help sx={{ fontSize: "25px" }} />
              <FormControl variant="standard" value={fullName}>
                <Select
                  value={fullName}
                  sx={{
                    background: palette.netural.light,
                    width: "150px",
                    p: "0.25rem 1rem",
                    borderRadius: "0.25rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: palette.netural.light,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={fullName}>
                    <Typography> {fullName}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => dispatch(setLogout())}>
                    Log Out
                  </MenuItem>
                </Select>
              </FormControl>
            </FlexBetween>
          </Box>
        )}
      </FlexBetween>
    </Box>
  );
};

export default Topbar;
