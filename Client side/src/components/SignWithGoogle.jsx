import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom"; // import useHistory
import { ChartsContext } from "../scenes/global/Context";
export default function SignWithGoogle() {
  const { setUserLogged, userLogged } = useContext(ChartsContext);
  const navigate = useNavigate(); // get history from react-router
  const dashboard = () => navigate("/"); // navigate to login page on button click

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        let user = jwt_decode(credentialResponse.credential);
        console.log(user);
        setUserLogged({
          FirstName: user.given_name,
          LastName: user.family_name,
          Email: user.email,
          Image: user.picture,
          IsLogged: 1,
        });
        dashboard();
      }}
      onError={() => {
        console.log("Not authorized");
      }}
    />
  );
}
