import React, { Fragment, useState, useEffect } from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";
import Table from "../components/Table/Table";
import axios from 'axios'
import { checkAndAddUser } from "../utils/addUser";

export const Dashboard = () => {
    const [sensorData, setSensorData] = useState(0)
    const [tHeadData, setTHeadData] = useState(0)
    const [tBodyData, setTBodyData] = useState(0)

    const {
        user,
      } = useAuth0()

    useEffect(() => {
        checkAndAddUser(user)
    }, [user])

    useEffect(() => {
        function buildTable() {
            const tempBody = [];
            for (const key in sensorData) {
                tempBody.push({
                    id: key,
                    items: [
                        sensorData[key].humidity,
                        sensorData[key].temperature,
                        sensorData[key].moisture,
                        sensorData[key].light,
                        sensorData[key].date_created,
                        sensorData[key].email
                    ],
                });
            }
            setTBodyData(tempBody)
        }

        if(!sensorData) {
            async function fetchData() {
                const response = await axios.get(`http://localhost:5001/soil/?email=${user.email}`)

                setSensorData(Object.values(response.data.sensor_data))
        }
            fetchData()
        }
        if(!tHeadData && sensorData && sensorData.length > 0) {
            setTHeadData(Object.keys(sensorData[0]))
        }
        if(tHeadData && sensorData && !tBodyData) {
            buildTable()
        }
    }, [sensorData, tHeadData, tBodyData, user.email])
    
    return (
        <Fragment>
            <h1>Dashboard</h1>
            <p className="lead">
                {/* Implement input box for custom weather data */}
                Showing the dashboard.                
            </p>
            {
                (!sensorData || !tHeadData || !tBodyData) ?
                <div>No Sensor Data is Currently Available</div> :
                <Table tHeadData={tHeadData} tBodyData={tBodyData}/>
            }
        </Fragment>
    );
};

export default withAuthenticationRequired(Dashboard, {
    onRedirecting: () => <Loading />,
  });