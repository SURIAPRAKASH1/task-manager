import {
  Box,
  Typography,
  useTheme,
  TextField,
  Button,
  Card,
  CardContent,
  useMediaQuery,
  IconButton,
  Divider,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { dayjs } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { setTasks } from "../../state";

const ExpiredTasks = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  // const { _id } = useSelector((state) => state.user);
  // const [allTasks, setAllTasks] = useState([]);
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");

  const allTasks = useSelector((state) => state.auth.tasks);

  const userTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_API_URL}/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        dispatch(setTasks({ tasks: response.data }));
      }
    } catch (error) {
      console.log("all user tasks error", error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_API_URL}/api/tasks/${taskId}/remove`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      userTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const expired = allTasks.filter((task) => task.status === "expired");

  return (
    <Box m="30px">
      <Box
        sx={{
          p: `${isNonMobileScreen && "0px 55px 64px 55px"}`,
        }}
      >
        {expired.length > 0 &&
          expired.map((task) => (
            <Card
              key={task._id}
              sx={{
                m: `${isNonMobileScreen && "0px 116px 2px 116px"}`,
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <Typography variant="h6" component="div">
                    {task.title}
                  </Typography>
                  <Typography>{task.status}</Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                  }}
                >
                  {task.description}
                </Typography>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Button
                    variant="outlined"
                    sx={{
                      mt: 2,

                      minWidth: { xs: "100px", sm: "auto" }, // Set a minimum width for the button
                      whiteSpace: "nowrap",
                    }}
                  >
                    {task.endTime}
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      mt: 2,
                    }}
                    onClick={() => handleTaskDelete(task._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}

        {expired.length === 0 && (
          <Box
            sx={{
              m: `${isNonMobileScreen && "0px 116px 2px 116px"}`,
              backgroundColor: palette.netural.light,
              p: "8px 8px 8px 20px",
              borderRadius: "20px",
            }}
          >
            <Typography variant="h5" color="primary" fontWeight="400px">
              you got no expired tasks
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ExpiredTasks;
