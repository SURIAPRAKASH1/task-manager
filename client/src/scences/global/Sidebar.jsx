// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Avatar,
  IconButton,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ScheduleIcon from "@mui/icons-material/Schedule";

import zIndex from "@mui/material/styles/zIndex";
import { MenuOutlined, Transform } from "@mui/icons-material";
import UserImage from "../../components/UserImage";

const Item = ({ title, to, selected, setSelected, icon, onClick }) => {
  const { palette } = useTheme();

  return (
    <MenuItem
      component={<Link />}
      to={to}
      active={selected == title}
      onClick={() => {
        setSelected(title);
        if (onClick) onClick();
      }}
      icon={icon}
      style={{
        color: "grey",
      }}
      rootStyles={{
        ".ps-menu-button": {
          // color: "rgb(90, 255, 20) !important", // default color
          "&:hover": {
            backgroundColor: `${palette.netural.medium} !important`, // hover background color
            color: "#f6f6f6 !important", // hover text color
          },
        },
        ".pro-menu-icon.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const UserSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { palette } = useTheme();

  const user = useSelector((state) => state.auth.user);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("HOME PAGE");
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    toggleSidebar();
  }, [isCollapsed]);

  const handleMenuItemClick = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <Box zIndex={10} mt="79px" position="fixed">
      <Box
        backgroundColor={palette.netural.light}
        sx={{
          // position: isMobile ? "fixed" : "relative",
          position: "fixed",
          height: "100vh",
          // height: isMobile ? "100vh" : undefined,
          transform:
            isCollapsed && isMobile ? "translateX(-100%)" : "translateX(0)", // Slide out on mobile
          transition: "transform 0.4s ease-in-out", // Smooth slide transition
        }}
      >
        <Sidebar
          collapsed={isCollapsed}
          width={isCollapsed ? "0px" : isMobile ? "250px" : "250px"}
          collapsedWidth="0px"
          backgroundColor={palette.netural.light}

          // transitionDuration="1000ms"
        >
          <Menu iconShape="square">
            <MenuItem
              // backgroundColor={palette.primary.light}
              onClick={() => setIsCollapsed(!isCollapsed)}
              suffix={<MenuIcon />}
              style={{
                margin: "0px -16px 0 0",
                backgroundColor: palette.netural.light,
              }}
            ></MenuItem>

            {/* USER IMAGE */}
            <Box mb="25px">
              <UserImage />

              <Box textAlign="center">
                <Typography
                  variant="h4"
                  color="grey"
                  fontWeight="bold"
                  sx={{
                    m: "10px 0 0 0",
                  }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
            </Box>

            {/* MENU ITEM */}
            <Box textAlign="center">
              <Item
                title="HOME PAGE"
                to="/home"
                icon={<DashboardIcon />}
                selected={selected}
                setSelected={setSelected}
                onClick={handleMenuItemClick}
              />

              <Item
                title="TASKS"
                icon={<AddCircleIcon />}
                to="/create-tasks"
                selected={selected}
                setSelected={setSelected}
                onClick={handleMenuItemClick}
              />
              <Item
                title="COMPLETED TASKS"
                icon={<ScheduleIcon />}
                to="/completed-tasks"
                selected={selected}
                setSelected={setSelected}
                onClick={handleMenuItemClick}
              />
              <Item
                icon={<DeleteIcon />}
                title="EXPIRED TASKS"
                to="/expired-tasks"
                selected={selected}
                setSelected={setSelected}
                onClick={handleMenuItemClick}
              />
              {isMobile && (
                <Item
                  icon={<DeleteIcon />}
                  title="PEOPLES"
                  to="/peoples"
                  selected={selected}
                  setSelected={setSelected}
                  onClick={handleMenuItemClick}
                />
              )}
            </Box>
          </Menu>
        </Sidebar>

        {isCollapsed && (
          <Box
            sx={{
              marginLeft: isCollapsed ? "0px" : isMobile ? "0px" : undefined, // Align icon next to the sidebar when expanded
              transition: "margin-left 300ms",
            }}
          >
            <MenuIcon
              onClick={() => setIsCollapsed(!isCollapsed)}
              sx={{
                cursor: "pointer",
                position: "absolute",
                top: "15px",
                left: "10px",
                zIndex: 200,
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserSidebar;
