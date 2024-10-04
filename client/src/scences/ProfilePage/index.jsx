import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import UserImage from "../../components/UserImage";
import axios from "axios";
import FriendListWidget from "../widgets/FriendListWidget";

const ProfilePage = () => {
  const { palette } = useTheme();

  const { userId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [user, setUser] = useState(null);

  // console.log(user);

  const getUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_API_URL}/user/${userId}`,
        {
          headers: {
            Authorization: ` Bearer ${token}`,
          },
        }
      );

      if (response) {
        const userData = response.data;
        // console.log(userData);
        setUser(userData);
      }
    } catch (error) {
      console.log("Error while getting user", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) return null;

  return (
    <Box
      display="grid"
      // height="100%"
      gridTemplateRows="200px auto"
      gap="10px"
      p="20px"
    >
      <Box display="flex" justifyContent="center" p="2px 10px 2px 10px">
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          width={isNonMobileScreens ? "400px" : "300px"}
          columnGap="20px"
          sx={{
            backgroundColor: palette.background.alt,
            borderRadius: "0.75rem",
            p: "10px",
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              style={{
                objectFit: "cover",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              width={isNonMobileScreens ? "150px" : "100px"}
              height={isNonMobileScreens ? "150px" : "100px"}
              alt="user"
              src={`${import.meta.env.VITE_REACT_API_URL}/assets/${
                user.picturePath
              }`}
            />
          </Box>
          <Box
            display="flex"
            flexBasis="100%"
            flexDirection="column"
            justifyContent="space-between"
            color={palette.netural.main}
          >
            <Typography m="10px 10px 2px 10px" variant="h4" fontWeight="bold">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="h6" ml="10px">
              {user.friends.length} friends
            </Typography>
            <Divider />
            <Typography m="10px">TASKS</Typography>
          </Box>
        </Box>
      </Box>

      <Box display="flex" p="30px">
        <FriendListWidget userId={userId} />
      </Box>
    </Box>
  );
};

export default ProfilePage;
