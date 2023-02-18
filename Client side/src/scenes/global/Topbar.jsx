import { Box, IconButton } from "@mui/material";
import { useContext } from "react";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom"; // import useHistory
import { ChartsContext } from "./Context";

const Topbar = () => {
  const navigate = useNavigate(); // get history from react-router
  const { setUserLogged } = useContext(ChartsContext);
  const login = () => {
    setUserLogged({
      FirstName: "",
      LastName: "",
      Email: "",
      IsLogged: false,
      Image:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-9.jpg",
    });
    //toggle userLogged
    navigate("/login");
  }; // navigate to login page on button click
  return (
    <Box display="flex" justifyContent="flex-end" p={2}>
      {/* ICONS */}
      <Box display="flex">
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
        <IconButton onClick={login}>
          <LoginIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
