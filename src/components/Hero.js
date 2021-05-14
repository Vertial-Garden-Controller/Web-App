import React, { useEffect, useState } from "react";

import logo from "../assets/logo.svg";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { checkAndAddUser } from "../utils/addUser";

const Hero = () => {
  const [gardenSize, setGardenSize] = useState()
  const [currentEmail, setCurrentEmail] = useState()
  const [editToggle, setEditToggle] = useState(false)
  const [newGardenSize, setNewGardenSize] = useState(100)

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
        setGardenSize(response.data.user.garden_size)
      }
      fetchData()
    }
  }, [gardenSize, currentEmail])

  const handleFormSubmit = async e => {
    e.preventDefault()
    if(!user) {
      alert('Whoops! Something is broken...')
    } else {
      await axios
        .put(
          `http://localhost:5001/user/updateGarden/?email=${user.email}`,
          { garden_size: newGardenSize }
        )
        .catch(error => {
          if(error.response) {
            alert(error.response.data.detail)
          }
        })
    }
    setGardenSize(undefined)
  }

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
      <p>Hi {user.given_name ? user.given_name : user.email}, welcome!</p>
      <p>The current size of your garden is {gardenSize} square feet.</p>
      <button
        onClick={() => {
          setEditToggle(!editToggle)
        }}
      >
        Edit Garden Size
      </button>
      {
        editToggle ? (<div>
          <p></p>
          <form onSubmit={handleFormSubmit}>
            <p>New Size (ft<sup>2</sup>):</p>
            <input
              type="number"
              name="name"
              value={newGardenSize}
              onChange={e => {
                if(e.target.value >= 1) {
                  setNewGardenSize(e.target.value)
                }
              }}
              />
            <input type="submit" value="Submit" />
          </form>
        </div>) :
        <div></div>
      }
    </div>
    )
  )
};

export default Hero;
