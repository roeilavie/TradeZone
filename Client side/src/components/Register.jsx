import { Box, Button, TextField,IconButton } from "@mui/material";
import { Formik, insert } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "./Header";
import { ChartsContext } from "../scenes/global/Context";

import { useContext, useState } from "react";
import { validateEmail } from "../service/service";
import Swal from "sweetalert2";
import { checkEmailExist, dashboard, insertUser } from "../data/ServiceFunctions";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [validEmail, setValidEmail] = useState(false);
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [showPassword, setShowPassword] = useState(false);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const {setUserLogged} = useContext(ChartsContext);
  const handleFormSubmit = (values) => {
    console.log(values);
    if (!validEmail) {
      Swal.fire({
        icon: "info",
        title: "Email is not valid",
        text: "Enter a valid email!",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      })
      return;
    }

    //We need to make sure the user doesn't exist, we will get the user by email.
    checkEmailExist(values.email).then((result) => {
      if (result == 1) {
        Swal.fire({
          icon: "info",
          title: "Email is already in use",
          text: "",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        });
        return;
      }
      console.log(result);
      let user = {
        email: values.email,
        given_name: values.firstName,
        family_name: values.lastName,
        sub:values.password
      };
      console.log(user);
      insertUser(user).then((result) => {
        console.log(user);
        if(result == 1){
          console.log("registered successfully");
          //Navigate to dashboard after user logged in.
          setUserLogged({
            FirstName: values.firstName,
            Email: user.email,
            LastName: user.lastName,
            IsLogged: true,
            Image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX1mtYL8f3jCPWwGO9yCiCJlbi8LikmuJMew&usqp=CAU",
          });
          return navigate("/");      
        }
      })

    });
  };

  const checkKeyUp = async (event) => {
    await setValidEmail(validateEmail(event.target.value));
  };
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password:"",
  };

  return (
    <Box m="20px">
      <Header title="Register" subtitle="Create a New User Profile" />
      <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              mt="30px"
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(1, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 1" },
              }}
            >
              <TextField
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ width: "30%" }}
              />
              <TextField
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ width: "30%" }}
              />
              <TextField
                required={true}
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                onKeyUp={checkKeyUp}
                name="email"
                id="email"
                // Pass the validateEmail function as a prop
                error={!!values.email && !validateEmail(values.email)}
                helperText={
                  !values.email || validateEmail(values.email)
                    ? ""
                    : "Please enter a valid email address"
                }
                sx={{ width: "30%" }}
              />
               <TextField
                variant="filled"
                required={true}
                value={values.password}
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  //Where the password toggle will be shown, end is at the end of the textfield.
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{width:"30%"}}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Register
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}
