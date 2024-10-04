import { Box } from "@mui/material";
import { useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserImage = ({ size = "100px" }) => {
  const { _id, picturePath } = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      onClick={() => navigate(`/profile/${_id}`)}
    >
      <img
        style={{
          objectFit: "cover",
          borderRadius: "50%",
          cursor: "pointer",
        }}
        width={size}
        height={size}
        alt="user"
        src={`${import.meta.env.VITE_REACT_API_URL}/assets/${picturePath}`}
      />
    </Box>
  );
};

export default UserImage;
