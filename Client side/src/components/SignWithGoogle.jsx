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
            insertUser(user).then((result) => {
              if (result == 1) {
                console.log("Added successfully");
              }
            });
          }
          setUserLogged({
            FirstName: user.given_name,
            Email: user.email,
            LastName: user.family_name,
            IsLogged: true,
            Image: user.picture,
          });
          dashboard();
        });
      }}
      onError={() => {
        console.log("Not authorized");
      }}
    />
  );
}
