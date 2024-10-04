import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Badge, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { clearUnreadCount } from "../state/notification";
import { useNavigate } from "react-router-dom";

const NotificationIcon = () => {
  const dispatch = useDispatch();
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/notifications");
    dispatch(clearUnreadCount());
  };

  return (
    <IconButton color="inherit" onClick={handleClick}>
      <Badge badgeContent={unreadCount} color="secondary">
        <NotificationsIcon
          sx={{
            fontSize: "25px",
          }}
        />
      </Badge>
    </IconButton>
  );
};

export default NotificationIcon;
