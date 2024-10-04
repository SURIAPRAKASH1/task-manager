import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  useMediaQuery,
  Divider,
  useTheme,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../axiosConfig.js";
import { expiredTasks } from "../../state";
import PlateFormUsers from "../../components/PlateFormUsers.jsx";

const HomePage = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  const outdatedTasks = useSelector((state) => state.auth.expiredtasks);

  const token = useSelector((state) => state.auth.token);

  const fetchAllExpiredTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_API_URL}/api/tasks/expired-tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        dispatch(expiredTasks({ tasks: response.data }));
      }
    } catch (error) {
      console.log("error in fetching all expired tasks", error);
    }
  };

  // console.log(outdatedTasks);

  useEffect(() => {
    fetchAllExpiredTasks();
  }, []);

  return (
    <Box m="30px">
      {isNonMobileScreen ? (
        <Box display="grid" gridTemplateColumns="3fr 1fr" gap="10px">
          <Box
            sx={{
              // backgroundColor: palette.background.alt,
              m: "10px",
            }}
          >
            {/* HEADING  */}
            <Box display="flex" justifyContent="center">
              <Typography variant="h5" fontWeight="bold" color="grey">
                who's cookin's failed
              </Typography>
            </Box>
            <Divider />

            {/* TASKS  */}
            <Box>
              {outdatedTasks &&
                outdatedTasks.length > 0 &&
                outdatedTasks.map((task) => (
                  <Box
                    key={task._id}
                    sx={{
                      backgroundColor: palette.background.alt,
                      m: "1rem",
                      borderRadius: "0.75rem",
                    }}
                  >
                    <Box display="flex" p="1rem" alignItems="center" gap="1rem">
                      <img
                        style={{
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                        width="55px"
                        height="55px"
                        alt="user"
                        src={`${import.meta.env.VITE_REACT_API_URL}/assets/${
                          task.user.picturePath
                        }`}
                      />
                      <Typography fontWeight="bold" variant="h4" color="grey">
                        {task.user.firstName} {task.user.lastName}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      p="0 1rem 0 1rem"
                    >
                      <Typography fontWeight="bold" variant="h5" color="grey">
                        {task.title}
                      </Typography>
                      <Typography variant="h6" color="grey">
                        EndTime: {task.endTime}
                      </Typography>
                    </Box>
                    <Divider />
                    <Typography color="grey" p="1rem 1rem 1rem 1rem">
                      {task.description}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Box>

          <Box m="10px">
            {/* HEADER   */}
            <Box display="flex" justifyContent="center">
              <Typography variant="h5" fontWeight="bold" color="grey">
                peoples
              </Typography>
            </Box>
            <Divider />

            <PlateFormUsers />
          </Box>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" m="5px">
            <Typography variant="h5" fontWeight="bold" color="grey">
              who's cookin's failed
            </Typography>
          </Box>
          <Divider />

          <Box>
            {outdatedTasks &&
              outdatedTasks.length > 0 &&
              outdatedTasks.map((task) => (
                <Box
                  key={task._id}
                  sx={{
                    backgroundColor: palette.background.alt,
                    borderRadius: "0.75rem",
                    m: "10px",
                  }}
                >
                  <Box display="flex" p="1rem" alignItems="center" gap="1rem">
                    <img
                      style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      width="55px"
                      height="55px"
                      alt="user"
                      src={`${import.meta.env.VITE_REACT_API_URL}/assets/${
                        task.user.picturePath
                      }`}
                    />
                    <Typography fontWeight="bold" variant="h4" color="grey">
                      {task.user.firstName} {task.user.lastName}
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    p="0 1rem 0 1rem"
                  >
                    <Typography
                      fontWeight="bold"
                      variant="h5"
                      color="grey"
                      sx={{
                        minWidth: { xs: "100px", sm: "auto" }, // Set a minimum width for the button
                        whiteSpace: "nowrap",
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="grey"
                      sx={{
                        minWidth: { xs: "100px", sm: "auto" }, // Set a minimum width for the button
                        whiteSpace: "nowrap",
                      }}
                    >
                      EndTime: {task.endTime.split(" ")[1]}
                      {task.endTime.split(" ")[2]}
                    </Typography>
                  </Box>
                  <Divider />
                  <Typography color="grey" p="1rem 1rem 1rem 1rem">
                    {task.description}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
