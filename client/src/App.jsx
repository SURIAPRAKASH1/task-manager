import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { themeSettings } from "./theme";
import { Routes, Route, useLocation } from "react-router-dom";
import NProgress from "nprogress";

import subscribeUser from "./subscription";

import { useSelector } from "react-redux";
import {
  LoginPage,
  HomePage,
  Notifications,
  Topbar,
  UserSidebar,
  ProfilePage,
  CreateTask,
  CompletedTasks,
  ExpiredTasks,
  Peoples,
} from "./scences";
import { MailLockOutlined } from "@mui/icons-material";

function App() {
  const mode = useSelector((state) => state.auth.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const isHomePage = location.pathname == "/home";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (isHomePage && token && !isSubscribed) {
      subscribeUser(token)
        .then(() => {
          setIsSubscribed(true);
        })
        .catch((error) => {
          console.error("Subscription Failed", error);
        });
    }
  }, [isHomePage, token]);

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {!isLoginPage && <Topbar />}
        <div className="main-container">
          {!isLoginPage && (
            <UserSidebar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          )}

          <Box
            className="content"
            style={{
              paddingTop: !isLoginPage ? "100px" : 0,
              paddingLeft:
                !isLoginPage && !isMobile && isSidebarOpen ? "250px" : "10px",
              transition: "padding-left 0.3s ease-in-out",
              // padding: !isLoginPage && "30px",
            }}
          >
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="home" element={<HomePage />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="create-tasks" element={<CreateTask />} />
              <Route path="completed-tasks" element={<CompletedTasks />} />
              <Route path="expired-tasks" element={<ExpiredTasks />} />
              <Route path="profile/:userId" element={<ProfilePage />} />
              <Route path="peoples" element={<Peoples />} />
              {/* {isMobile && <Route path="peoples" element={<Peoples />} />} */}
            </Routes>
          </Box>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
