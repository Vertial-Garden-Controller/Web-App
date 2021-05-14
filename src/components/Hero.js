import React, { useEffect, useState } from "react";

import logo from "../assets/logo.svg";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { checkAndAddUser } from "../utils/addUser";

const Hero = () => {
  const [gardenSize, setGardenSize] = useState()
  const [currentEmail, setCurrentEmail] = useState()

  const {
    user,
    isAuthenticated,
  } = useAuth0();

  useEffect(() => {
    if(user && user.email) {
      setCurrentEmail(user.email)
      checkAndAddUser(user)
    }
  }, [user])

  useEffect(() => {
    if(!gardenSize && currentEmail) {
      async function fetchData() {
        const response = await axios.get(
          `http://localhost:5001/user/email/?email=${currentEmail}`
        )
        console.log(response.data)
        setGardenSize(response.data.user.garden_size)
      }
      fetchData()
    }
  }, [gardenSize, currentEmail])

  return (
    !isAuthenticated ? (
      <div className="text-center hero my-5">
        <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
        <h1 className="mb-4">SMART IRRIGATION</h1>

        <p className="lead">
          This is the web application for the Smart Irrigation project, being created by Max, Man, and Josh.
        </p>
        <p>Please log in to begin!</p>
    </div>
  ) : (
    <div>
      <h1 className="mb-4">SMART IRRIGATION</h1>
      <p>Hi {user.given_name}, welcome!</p>
      <p>The current size of your garden is {gardenSize}</p>
    </div>
    )
  )
};

export default Hero;
