import { Fragment, useEffect, useState } from 'react'

import { withAuthenticationRequired } from '@auth0/auth0-react'
import Loading from '../components/Loading'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'
import TimePicker from 'react-time-picker'

export const Schedule = () => {
    // Object containing existing schedule information for user by email
    const [scheduleJSON, setScheduleJSON] = useState(undefined)
    // boolean value of if there is a connection to the db server api
    const [ISA, setISA] = useState(undefined)
    const [startTime, setStartTime] = useState('10:00')
    const [endTime, setEndTime] = useState('14:00')
    const [days, setDays] = useState([
        {id: 0, value: "Monday", isChecked: false},
        {id: 1, value: "Tuesday", isChecked: false},
        {id: 2, value: "Wednesday", isChecked: false},
        {id: 3, value: "Thursday", isChecked: false},
        {id: 4, value: "Friday", isChecked: false},
        {id: 5, value: "Saturday", isChecked: false},
        {id: 6, value: "Sunday", isChecked: false},
    ])

    const updateFieldChanged = index => e => {
        let newArr = [...days]; // copying the old days array
        newArr[index].isChecked = !newArr[index].isChecked
        setDays(newArr);
    }

    const {
        user,
      } = useAuth0()

    useEffect(() => {
        if(scheduleJSON === undefined) {
            async function fetchData() {
                const response = await axios.get(`http://localhost:5001/schedule/user/?email=${user.email}`)
                // setScheduleJSON(response.data.schedules)
                setScheduleJSON({})
            }
            fetchData()
        }
    }, [scheduleJSON, user.email])

    useEffect(() => {
        if(ISA === undefined) {
            async function fetchData() {
                const response = await axios.get(`http://localhost:5001/status`)
                if(response && response.status === 200) {
                    setISA(1)
                } else {
                    setISA(0)
                }
            }
            fetchData()
        }
    }, [ISA])

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
                scheduleJSON === undefined ?
                // No connection to ISA
                // Print error message to user
                <p>No Schedule Data is Currently Available</p> : (
                    // Does the user have an existing schedule?
                    !scheduleJSON[0] ?
                    // if no, show create schedule screen.
                    (
                        <div>
                            <p>You have no existing schedules...</p>
                            <h5>Create a Schedule Rule!</h5>
                            <p>Start Time:</p>
                            <div style={{flex: 1}}>
                                <TimePicker
                                    onChange={value => {
                                        setStartTime(value)
                                    }}
                                    value={startTime}
                                />
                                <p>End Time:</p>
                                <TimePicker
                                    onChange={value => {
                                        setEndTime(value)
                                    }}
                                    value={endTime}
                                />
                            </div>
                            <div>
                            <ul>
                                { days.map( (day, index) => (
                                    <li key={day.id}>
                                        <input
                                            type="checkbox"
                                            value={day.value}
                                            checked={day.isChecked}
                                            onChange={updateFieldChanged(index)}
                                        />
                                        {day.value}
                                    </li>
                                ))}
                            </ul>
                            </div>
                        </div>
                    ) :
                    // otherwise, display schedule information.
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
                )
            }
        </Fragment>
    )
}

export default withAuthenticationRequired(Schedule, {
    onRedirecting: () => <Loading />,
  })
