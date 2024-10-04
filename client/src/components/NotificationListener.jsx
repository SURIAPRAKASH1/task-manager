import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../state/notification";
import axios from "../axiosConfig";

import { setTasks } from "../state";

const NotificationListener = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

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

      dispatch(setTasks({ tasks: response.data }));
    } catch (error) {
      console.log("all user tasks error", error);
    }
  };

  //   useEffect(() => {
  //     if ("serviceWorker" in navigator) {
  //       navigator.serviceWorker.addEventListener("message", (event) => {
  //         console.log("Message recived from serviceWorker", event.data);

  //         dispatch(addNotification(event.data));
  //         userTasks();
  //       });
  //     }
  //   }, [dispatch]);

  useEffect(() => {
    const handleServiceWorkerMessage = (event) => {
      console.log("Message received from serviceWorker:", event.data);

      dispatch(addNotification(event.data));
      userTasks();
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage
      );
    }

    // Clean up event listener
    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage
        );
      }
    };
  }, [dispatch, userTasks]);

  return null;
};

export default NotificationListener;
