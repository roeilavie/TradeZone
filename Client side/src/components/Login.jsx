import React from "react";
import { Box, Button, TextField, IconButton } from "@mui/material";
import { Formik } from "formik";
import Header from "./Header";
import { useState, useContext } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
import { api_production, validateEmail } from "../service/service";
import { ChartsContext } from "../scenes/global/Context";
import { useNavigate } from "react-router-dom"; // import useHistory
import SignWithGoogle from "./SignWithGoogle";

export default function Login() {
  const navigate = useNavigate(); // get history from react-router
  const register = () => navigate("/register"); // navigate to login page on button click
  const [validEmail, setValidEmail] = useState(false);
  //   const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //Toggle the show password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const checkKeyUp = async (event) => {
    await setValidEmail(validateEmail(event.target.value));
  };
  const { userLogged, setUserLogged } = useContext(ChartsContext);
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
      }).then((result) => {
        if (result.isConfirmed) {
          // User clicked the confirm button
          // You can perform the delete operation here
        }
      });
      return;
    }

    //If all the inputs are valid, then we will try to get the user from DB.
    console.log("Email is: " + values.email, "Password is: " + values.password);

    const url = `${api_production}/Users`;
    //let bla = `?email=${values.email}&pwd=${values.password}`;
    let user = {
      Email: values.email,
      Pwd: values.password,
    };
    fetch(url, {
      method: "POST",
      body: JSON.stringify(user),
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then(
        (user) => {
          //Checking if the user is not null, if not he will be passed to the dashboard.
          if (user == null) {
            Swal.fire({
              icon: "info",
              title: "Unknown user",
              text: "You are not registered, press Confirm to register",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
            }).then((result) => {
              if (result.isConfirmed) {
                register();
              }
            });
          } else {
            setUserLogged({
              FirstName: user.First_name,
              Email: user.Email,
              LastName: user.Last_name,
              IsLogged: true,
              Image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX1mtYL8f3jCPWwGO9yCiCJlbi8LikmuJMew&usqp=CAU",
            });
            let dashboard = () => navigate("/");
            dashboard();
          }

          //Check what is the
          // setUserLogged({
          //   FirstName: user.First_name,
          //   Email: user.Email,
          //   LastName: user.Last_name,
          // });
          // console.log(userLogged.FirstName);
        },
        (error) => {
          console.log("err post=", error);
        }
      );
  };

  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <Box m="20px">
      <Header title="Sign in" subtitle="Sign in to your account" />
      <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
        {({ handleBlur, values, handleSubmit, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            >
              <TextField
                required={true}
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                // onMouseLeave={validateEmail}
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
              />
            </Box>

            {/* If the email is not valid after onMouseLeave so we will show this component. */}
            {/* {!!values.email && validEmail === false && (
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert variant="outlined" severity="warning">
                  Please enter a valid email address
                </Alert>
              </Stack>
            )} */}

            <br />
            <br />
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            >
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
              />
            </Box>
            <Box justifyContent="start" mt="50px" display="flex" gap="30px">
              <Button type="submit" color="secondary" variant="contained">
                Login
              </Button>
              <SignWithGoogle />
            </Box>
          </form>
        )}
      </Formik>
         
    </Box>
  );
}
