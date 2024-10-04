import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { removeNotifications } from "../../state/notification";

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items);
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");

  const handleDelete = (id) => {
    dispatch(removeNotifications(id));
  };

  return (
    <Box m="30px">
      <Box
        sx={{
          p: `${isNonMobileScreen && "0px 55px 64px 55px"}`,
        }}
      >
        {notifications && notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <Card
              key={index}
              sx={{
                marginBottom: "16px",
                m: `${isNonMobileScreen && "0px 116px 2px 116px"}`,
              }}
            >
              <CardContent>
                <Typography variant="h6">{notification.title}</Typography>
                <Typography variant="bold">
                  {notification.body.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt="5px">
                  {notification.body.description}
                </Typography>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-end"
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(notification.body._id)}
                    sx={{ marginTop: "8px" }}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="h6" color="secondary">
            No notification available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Notifications;
