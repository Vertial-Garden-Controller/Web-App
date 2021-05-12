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
            }
            fetchData()
        }
    }, [scheduleJSON, user.email])

    function buildDays(SQLString) {
        const days = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ]
        const temp = SQLString
                        .replace('(', '')
                        .replace(')', '')
                        .split(',')
        let returnString = '| '
        for (const key in temp) {
            if (temp[key] === 't') {
                returnString = returnString.concat(`${days[key]} | `)
            }
        }
        return returnString
    }
    
    return (
        <Fragment>
            <h1>Watering Schedules</h1>
            {
                !scheduleJSON ?
                <div>No Schedule Data is Currently Available</div> :
                <div>
                    {
                        Object.values(scheduleJSON).map((schedule) => (
                            <div>
                                <hr />
                                <h3>Schedule Id: {schedule.rule_id}</h3>
                                <div>
                                    <p>Start Time: {schedule.start_time}</p>
                                    <p>End Time: {schedule.end_time}</p>
                                    <p>Days Active: {buildDays(schedule.days)}</p>
                                </div>
                            </div>
                            
                        ))    
                    }
                </div>
            }
        </Fragment>
    );
};

export default withAuthenticationRequired(Schedule, {
    onRedirecting: () => <Loading />,
  });