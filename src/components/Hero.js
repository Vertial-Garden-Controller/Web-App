import React from "react";

import logo from "../assets/logo.svg";
import { useAuth0 } from "@auth0/auth0-react";

const Hero = () => {
  const {
    user,
    isAuthenticated,
  } = useAuth0();

  return (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
    <h1 className="mb-4">SMART IRRIGATION</h1>

    <p className="lead">
      This is the web application for the Smart Irrigation project, being created by Max, Man, and Josh.
    </p>
    {isAuthenticated && (
      <p> Hello {user.name}, you are in!</p>
    )}

  </div>
  );
};

export default Hero;
