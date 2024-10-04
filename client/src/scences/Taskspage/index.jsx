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
import moment from "moment-timezone";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import utc from "dayjs/plugin/utc";

import { setTasks, removeTask } from "../../state";

dayjs.extend(utc);

const CreateTask = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endTime, setEndTime] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const { _id } = useSelector((state) => state.auth.user);
  const task = useSelector((state) => state.auth.tasks);
  const [allTasks, setAllTasks] = useState([]);
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

      setAllTasks(response.data);
      dispatch(setTasks({ tasks: response.data }));
    } catch (error) {
      console.log("all user tasks error", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_API_URL}/api/tasks`,
        {
          title,
          description,
          endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("User time", endTime);
      if (response) {
        dispatch(setTasks({ tasks: response.data }));
        userTasks();
        handleClose();
      }
    } catch (error) {
      console.error("creating error", error);
    }
  };

  useEffect(() => {
    userTasks();
  }, []);

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

      // dispatch(removeTask({ taskId: taskId }))
      userTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_REACT_API_URL}/api/tasks/${taskId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        dispatch(setTasks({ tasks: response.data }));
        userTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const inProgressTasks =
    task.length > 0 && task.filter((task) => task.status === "in progress");

  return (
    <Box m="30px">
      <Box
        sx={{
          p: `${isNonMobileScreen && "0px 55px 64px 55px"}`,
        }}
      >
        {inProgressTasks.length > 0 &&
          inProgressTasks.map((task) => (
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
                  {isNonMobileScreen && (
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="flex-start"
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
                    </Box>
                  )}

                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-end"
                    gap="5px"
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        mt: 2,
                      }}
                      onClick={() => handleCompleteTask(task._id)}
                    >
                      complete
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
                </Box>
              </CardContent>
            </Card>
          ))}

        {/* FORM COMPOENT */}
        <IconButton
          onClick={handleOpen}
          color="primary"
          sx={{
            m: `${isNonMobileScreen && "0px 116px 2px 116px"}`,
            boxShadow: 1,
            bgcolor: palette.netural.light,
            borderRadius: "5px",
            "&:hover": {
              bgcolor: palette.netural.light,
            },
          }}
        >
          <AddIcon
            sx={{
              // boxShadow: 1,
              borderRadius: "70%",
            }}
          />
          <Typography pl={0.6}>Add task</Typography>
        </IconButton>

        <Modal open={open} onClose={handleClose}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              bgcolor: "background.paper",
              transform: "translate(-50%, -50%)",
              boxShadow: 24,
              p: 4,
              width: 400,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              // m: `${isNonMobileScreen && "0px 116px 2px 116px"}`,
            }}
          >
            {/* <IconButton onClick={handleClose} sx={{ alignSelf: "flex-end" }}>
              <CloseIcon />
            </IconButton> */}
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              variant="standard"
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              variant="standard"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                timezone="UTC"
                label="End Time"
                value={endTime}
                onChange={(newValue) => {
                  setEndTime(newValue);
                }}
              />
            </LocalizationProvider>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              gap="5px"
            >
              <Button variant="outlined" color="primary" type="submit">
                Create Task
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default CreateTask;
