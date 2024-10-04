import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPlateFormUsers, setFriends } from "../state";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
// import { IconButton } from "@mui/icons-material";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import axios from "../axiosConfig";

import { useNavigate } from "react-router-dom";

const PlateFormUsers = () => {
  const plateformUsers = useSelector(
    (state) => state.auth.plateformUsers || []
  );
  const { palette } = useTheme();
  const { _id: userId } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const friends = useSelector((state) => state.auth.user.friends || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(plateformUsers);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_API_URL}/user/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        dispatch(setPlateFormUsers({ users: response.data }));
      }
    } catch (error) {
      console.error("Error while fetching users", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleAddRemoveUserFriends = async (friendId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_REACT_API_URL}/user/${userId}/${friendId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        dispatch(setFriends({ friends: response.data }));
        console.log(`User with id ${friendId} added to friends.`);
      }
    } catch (error) {
      console.error("Got error when setting user friends", error);
    }
  };

  const nonFriendUsers =
    plateformUsers.length > 0 &&
    plateformUsers.filter(
      (user) =>
        !friends.some((friend) => friend._id === user._id) &&
        user._id !== userId // Exclude current user and their friends
    );

  return (
    <Box m="2px">
      <Box display="flex" flexDirection="column" mt="1rem">
        {nonFriendUsers.length > 0 &&
          nonFriendUsers.map((user) => (
            <Box
              key={user._id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p="10px"
              // border="1px solid #ccc"
              sx={{
                borderRadius: "0.75rem",
                mb: "5px",
                backgroundColor: palette.background.alt,
              }}
            >
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                columnGap="1.2rem"
                onClick={() => navigate(`/profile/${user._id}`)}
                sx={{
                  cursor: "pointer",
                  color: "grey",
                  "&:hover": {
                    color: palette.primary.main,
                  },
                }}
              >
                <img
                  style={{
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  width="55px"
                  height="55px"
                  alt="user"
                  src={`${import.meta.env.VITE_REACT_API_URL}/assets/${
                    user.picturePath
                  }`}
                />
                <Typography variant="h6" fontWeight="200px">
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
              <IconButton onClick={() => handleAddRemoveUserFriends(user._id)}>
                <PersonAddOutlined />
              </IconButton>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default PlateFormUsers;
