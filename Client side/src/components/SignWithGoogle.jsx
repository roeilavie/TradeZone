import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom"; // import useHistory
import { ChartsContext } from "../scenes/global/Context";
import { getUser, insertUser } from "../data/ServiceFunctions";
import Swal from "sweetalert2";

export default function SignWithGoogle() {
  const { setUserLogged, userLogged } = useContext(ChartsContext);
  const navigate = useNavigate(); // get history from react-router
  const dashboard = () => navigate("/"); // navigate to login page on button click
  const register = () => navigate("/register"); // Navigate to register page on confirm click swal.
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const user = jwt_decode(credentialResponse.credential);
        //Matching the correct object format to the getUser function.
        let userObj = {
          email: user.email,
          password: user.sub,
        };
        //Check if the user exist in our DB.
        getUser(userObj).then((returnedUser) => {
          if (returnedUser == null) {
            Swal.fire({
              icon: "info",
              title: "Not registered user",
              text: "You are not registered, press Ok to sign up with google.",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
            }).then((result) => {
              // if the user press ok then we add the user to the DB.
              if (result.isConfirmed) {
                //Insert to DB the user.
                console.log("im here");
                console.log(user);
                //Using service function to insert user to DB.
                insertUser(user).then((result) => {
                  result == 1 ? dashboard(): console.log("Failed to register");
                });  
              }
              else{
                console.log("you need to log in");
              }
            });
          } else {
            setUserLogged({
              FirstName: user.given_name,
              Email: user.email,
              LastName: user.family_name,
              IsLogged: true,
              Image:user.picture
            });
            dashboard();
          }
        });

      }}
      onError={() => {
        console.log("Not authorized");
      }}
    />
  );
}
