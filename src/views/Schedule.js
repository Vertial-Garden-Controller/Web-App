import { Fragment, useEffect, useState } from "react";

import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";
import axios from 'axios'
import { useAuth0 } from "@auth0/auth0-react";

export const Schedule = () => {
    const [scheduleJSON, setScheduleJSON] = useState()
    const {
        user,
      } = useAuth0();

    useEffect(() => {
        if(!scheduleJSON) {
            async function fetchData() {
                const response = await axios.get(`http://localhost:5001/schedule/user/?email=${user.email}`)
                setScheduleJSON(response.data.schedules)
                console.log(response.data.schedules)
            }
            fetchData()
        }
    }, [scheduleJSON, user.email])
    
    return (
        <Fragment>
            <h1>Watering Schedules</h1>
            {
                !scheduleJSON ?
                <div>No Schedule Data is Currently Available</div> :
                <div>
                    <p>{scheduleJSON[0].start_time}</p>
                </div>
            }
        </Fragment>
    );
};

export default withAuthenticationRequired(Schedule, {
    onRedirecting: () => <Loading />,
  });