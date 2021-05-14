import { Fragment, useEffect, useState } from 'react'

import { withAuthenticationRequired } from '@auth0/auth0-react'
import Loading from '../components/Loading'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'
import { NavLink } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { exportCSV } from '../utils/exportCSV'
import FileSaver from 'file-saver'
import { checkAndAddUser } from '../utils/addUser'
import update from 'immutability-helper'

export const Schedule = () => {
    // Object containing existing schedule information for user by email
    const [scheduleJSON, setScheduleJSON] = useState(undefined)
    const [adjustSchedule, setAdjustSchedule] = useState(undefined)
    const [rain, setRain] = useState(0)

    const history = useHistory()

    const {
        user,
      } = useAuth0()

    useEffect(() => {
        if(user.email) {
            checkAndAddUser(user)
        }
    }, [user])

    useEffect(() => {
        if(scheduleJSON === undefined || adjustSchedule === undefined) {
            async function fetchData() {
                const response = await axios
                    .get(
                        `http://localhost:5001/schedule/user/?email=${user.email}`
                        )
                setScheduleJSON(response.data.schedules)
            }
            fetchData()
        }
        if(adjustSchedule === undefined && scheduleJSON) {
            setAdjustSchedule(update(
                scheduleJSON,
                {}
            ))
        }
    }, [adjustSchedule, scheduleJSON, user.email])

    const handleClick = async e => {
        e.preventDefault()
        const response = await axios
            .delete(
                `http://localhost:5001/schedule/?schedule_id=${e.target.id}`,
                { crossDomain: true }
            )
        if(response.status !== 200) {
            alert(`Error: ${response.data.error}
            Detail: ${response.data.detail}
            `)
        }
        setScheduleJSON(undefined)
    }

    const editSchedule = async e => {
        e.preventDefault()
        history.push(`schedule/edit/${e.target.id}`)
    }    

    const updateFieldChanged = newSchedule => {
        let newArr = [...newSchedule]; // copying the old days array
        setAdjustSchedule(newArr);
        // console.log(scheduleJSON)
    }

    useEffect(() => {
        if (scheduleJSON && scheduleJSON[0]){
            function addMinutes(date, minutes) {
                return new Date(date.getTime() + minutes*60000*15);
            }
            function subMinutes(date, minutes) {
                return new Date(date.getTime() - minutes*60000*15);
            }
            function rainFinder(date1, date2) {
                const goal = new Date((date1.getTime() + date2.getTime())/2);
                return (goal.getTime()-date1.getTime())/(60000*15)-1
            }
            function dateToTimeString(date) {
                return ((date.getHours() < 10)?"0":"") + date.getHours() +":"+ ((date.getMinutes() < 10)?"0":"") + date.getMinutes() + ":00"
            }
            const rainUpdate = async () => {
                let newArr = update(scheduleJSON, {})
                
                for (const key in Object.values(scheduleJSON)) {
                    const startTime = new Date(Date.parse(`2020-01-01T${scheduleJSON[key].start_time}`))
                    const endTime = new Date(Date.parse(`2020-01-01T${scheduleJSON[key].end_time}`))

                    let newStart = addMinutes(startTime, rain)
                    let newEnd = subMinutes(endTime, rain)
                    // console.log(rainFinder(startTime, endTime))
                    if(newStart >= newEnd) {
                        newStart = addMinutes(startTime, rainFinder(startTime, endTime))
                        newEnd = subMinutes(endTime, rainFinder(startTime, endTime))
                    }
                    newArr = update(newArr, {
                        [key]: {
                            start_time: {
                                $set: dateToTimeString(newStart)
                            },
                            end_time: {
                                $set: dateToTimeString(newEnd)
                            },
                        }
                    })
                }
                updateFieldChanged(newArr)
            }

            if(rain !== undefined) {
                rainUpdate()
            }
        }
    }, [rain])


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
        return returnString === '| '
            ? '(none)'
            : returnString
    }
    
    return (
        <Fragment>
            <h1>Watering Schedules</h1>
            {
                adjustSchedule === undefined ?
                // No connection to ISA
                // Print error message to user
                <p>No Schedule Data is Currently Available</p> :
                // otherwise, display schedule information.
                (
                    scheduleJSON[0] ?
                    (<div>
                        <NavLink
                        to="/schedule/create"
                        className="btn btn-primary">
                            Click Here to Add a New Schedule
                        </NavLink>
                        <hr />
                        <button
                            onClick={() => {
                                let tempObj = scheduleJSON
                                for (const key in tempObj) {
                                    delete tempObj[key].date_created
                                    delete tempObj[key].last_modified
                                    delete tempObj[key].email
                                }
                                const csv = exportCSV(tempObj)

                                const blob = new Blob(
                                    [csv],
                                    {type: "text/plain;charset=utf-8"},
                                )
                                const exportDate = new Date(Date.now())
                                FileSaver.saveAs(blob, `Schedule_Export_${exportDate.toUTCString()}.csv`)
                            }}
                        >
                            Export All Schedule Data
                        </button>
                        <hr />
                        <p>Estimated Rainfall Tomorrow (inch): </p>
                        <input
                            type="number"
                            name="estPrecip"
                            value={rain}
                            onChange={e => {
                                if(e.target.value >= 0) {
                                    setRain(e.target.value)
                                }
                            }}
                        />
                        <hr />
                        <div>
                            {Object.values(adjustSchedule).map((schedule) => (
                                <div>
                                    <h3>Schedule Id: {schedule.rule_id}</h3>
                                    <div>
                                        <p>Start Time: {schedule.start_time}</p>
                                        <p>End Time: {schedule.end_time}</p>
                                        <p>Days Active: {buildDays(schedule.days)}</p>
                                    </div>
                                    <button
                                        id={schedule.rule_id}
                                        onClick={handleClick}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        id={schedule.rule_id}
                                        onClick={editSchedule}
                                    >
                                        Edit
                                    </button>
                                    <hr />
                                </div>
                            ))}
                        </div>
                    </div>) :
                    (<div>
                        <p>You have no schedules!</p>
                        <NavLink
                        to="/schedule/create"
                        className="btn btn-primary">
                            Click Here to Add One!
                        </NavLink>
                    </div>)
                )
            }
        </Fragment>
    )
}

export default withAuthenticationRequired(Schedule, {
    onRedirecting: () => <Loading />,
  })
