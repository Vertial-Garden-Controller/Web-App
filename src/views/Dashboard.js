import React, { Fragment } from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";
import Table from "../components/Table/Table";
import sensorData from "../assets/sensor_data.json";


export const Dashboard = () => {
    var theadData = Object.keys(sensorData.sensor_data[0]);
    console.log("== headings:", theadData)

    const tbodyData = [];
    for (var i = 0; i < theadData.length-1; i++) {
        tbodyData.push({
            id: i,
            items: [sensorData.sensor_data[i].garden_id, sensorData.sensor_data[i].humidity, sensorData.sensor_data[i].temperature, sensorData.sensor_data[i].moisture, sensorData.sensor_data[i].light, sensorData.sensor_data[i].date_created],
        });
    }

    console.log("== data:", tbodyData)
    return (
        <Fragment>
            <h1>Dashboard</h1>
            <p className="lead">
                {/* Implement input box for custom weather data */}
                Showing the dashboard.                
            </p>
            <Table theadData={theadData} tbodyData={tbodyData} />
        </Fragment>
    );
};

export default withAuthenticationRequired(Dashboard, {
    onRedirecting: () => <Loading />,
  });