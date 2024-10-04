import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

import { setFriends } from "../state";
import FlexBetween from "./FlexBetween";

import { useState, useEffect } from "react";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.primary.main;
  const medium = palette.primary.medium;

  const patchFriend = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_API_URL}/user/${_id}/${friendId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      // console.log(data);
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.log("Error while patching friend", error);
    }
  };

  const isAuthUser = _id === userId;

  return (
    <FlexBetween
      sx={{
        backgroundColor: palette.background.alt,
        borderRadius: "0.75rem",
        p: "10px",
        gap: "1rem",
      }}
    >
      <FlexBetween gap="1rem">
        <Box display="flex" justifyContent="center" alignItems="center">
          <img
            style={{
              objectFit: "cover",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            width="55px"
            height="55px"
            alt="user"
            src={`${
              import.meta.env.VITE_REACT_API_URL
            }/assets/${userPicturePath}`}
          />
        </Box>
        <Box>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="1.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>

      {isAuthUser ? (
        <IconButton
          onClick={() => patchFriend()}
          sx={{
            backgroundColor: primaryLight,
            p: "0.6rem",
          }}
        >
          <PersonRemoveOutlined
            sx={{
              color: primaryDark,
            }}
          />
        </IconButton>
      ) : (
        <IconButton
          sx={{
            backgroundColor: primaryLight,
            p: "0.6rem",
          }}
        >
          <LockIcon />
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
