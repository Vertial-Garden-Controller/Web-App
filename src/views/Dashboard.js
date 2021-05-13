import React, { Fragment, useState, useEffect } from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";
import Table from "../components/Table/Table";
import axios from 'axios'

export const Dashboard = () => {
    const [sensorData, setSensorData] = useState(0)
    const [tHeadData, setTHeadData] = useState(0)
    const [tBodyData, setTBodyData] = useState(0)

    const {
        user,
      } = useAuth0()

    useEffect(() => {
        function buildTable() {
            const tempBody = [];
            for (var i = 0; i < tHeadData.length-1; i++) {
                tempBody.push({
                    id: i,
                    items: [sensorData[i].garden_id,
                    sensorData[i].humidity,
                    sensorData[i].temperature,
                    sensorData[i].moisture,
                    sensorData[i].light,
                    sensorData[i].date_created],
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
        if(!tHeadData && sensorData) {
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