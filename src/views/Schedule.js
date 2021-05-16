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
//The calendar
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// //import events
// import events from './events';
// //localizer
// const localizer = momentLocalizer(moment);

import DisplayCalendar from '../components/DisplayCalendar'

export const Schedule = () => {
    // Object containing existing schedule information for user by email
    const [scheduleJSON, setScheduleJSON] = useState(undefined)
    const [adjustSchedule, setAdjustSchedule] = useState(undefined)
    const [rain, setRain] = useState()
    const [userRain, setUserRain] = useState(undefined)
    const [resetFlag, setResetFlag] = useState(true)

    const history = useHistory()


    const {
        user,
      } = useAuth0()
    /**
     * Once the user object has loaded,
     * check that the user exists in db
     * if not, add user to db
     */
    useEffect(() => {
        if(user.email) {
            checkAndAddUser(user)
        }
    }, [user])

    /**
     * Once the inital schedule has loaded,
     * deep copy schedule data to new object
     * for adjusting
     */
    useEffect(() => {
        setAdjustSchedule(update(scheduleJSON, {}))
    }, [scheduleJSON])

    /**
     * If reset flag is triggered, pull new info from
     * db and reset values of scheduleJSON, rain, and userRain
     */
    useEffect(() => {
        async function fetchData() {
            setResetFlag(false)
            await axios
                .get(
                    `http://localhost:5001/schedule/user/?email=${user.email}`
                    )
                .then(res => {
                    setScheduleJSON(res.data.schedules)
                    setRain(
                        res.data.precip === 0
                        ? undefined
                        : res.data.precip
                        )
                    setUserRain(res.data.precip)
                })
        }
        if(resetFlag) {
            fetchData()
        }
    }, [resetFlag])

    /**
     * when rain value is updated, adjust the display of
     * schedule times to show what the new schedule would
     * adjust to
     */
    useEffect(() => {
        if (scheduleJSON && scheduleJSON[0]){
            /**
             * adds number of minutes to provided date
             * @param {Date} date
             * @param {number} minutes
             * @returns Date
             */
            function addMinutes(date, minutes) {
                return new Date(date.getTime() + minutes*60000*100);
            }
            /**
             * subtracts number of minutes to provided date
             * @param {Date} date
             * @param {number} minutes
             * @returns Date
             */
            function subMinutes(date, minutes) {
                return new Date(date.getTime() - minutes*60000*100);
            }
            /**
             * returns the date that is the average between two dates
             * @param {Date} date1
             * @param {Date} date2
             * @returns
             */
            function rainFinder(date1, date2) {
                const goal = new Date((date1.getTime() + date2.getTime())/2);
                return goal
            }
            /**
             * takes date object and returns format used for updating the
             * adjustSchedule object
             * @param {Date} date
             * @returns string
             */
            function dateToTimeString(date) {
                return (
                    ((date.getHours() < 10)?"0":"") + date.getHours() +":"
                    + ((date.getMinutes() < 10)?"0":"") + date.getMinutes() + ":"
                    + ((date.getSeconds() < 10)?"0":"") + date.getSeconds()
                )
            }

            function getDate(){

            }

            function getTime(){

            }


            const rainUpdate = async () => {
                let newArr = update(scheduleJSON, {})

                for (const key in Object.values(scheduleJSON)) {
                    const startTime = new Date(Date.parse(`2020-01-01T${scheduleJSON[key].start_time}`))
                    const endTime = new Date(Date.parse(`2020-01-01T${scheduleJSON[key].end_time}`))

                    let newStart = addMinutes(startTime, rain)
                    let newEnd = subMinutes(endTime, rain)
                    if(newStart >= newEnd) {
                        newStart = rainFinder(startTime, endTime)
                        newEnd = rainFinder(startTime, endTime)
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

////
            if(rain !== undefined) {
                rainUpdate()
            }
        }
    }, [rain, userRain])
///useEffect end
    /**
     * schedule delete handler call API to delete
     * the schedule and trigger the reset flag
     */
    const handleClick = async e => {
        e.preventDefault()
        await axios
            .delete(
                `http://localhost:5001/schedule/?schedule_id=${e.target.id}`,
                { crossDomain: true }
            )
            .then((res) => {
                setAdjustSchedule(undefined)
                setResetFlag(true)
            })
            .catch((err) => {
                if(err.response) {
                    alert(`Error: ${err.response.data.error}
                    Detail: ${err.response.data.detail}
                    `)
                }
            })
    }

    /**
     * schedule edit button handler.
     * redirects user to /schedule/edit/:schedule_id route
     * within the web page.  * not an api call
     */
    const editSchedule = async e => {
        e.preventDefault()
        history.push(`schedule/edit/${e.target.id}`)
    }

    /**
     * Jank function that is making react object states work
     * for some reason.  no touch.
     */
    const updateFieldChanged = newSchedule => {
        let newArr = [...newSchedule]; // copying the old days array
        setAdjustSchedule(newArr);
    }

    /**
     * Takes 24-hr time string and converts into a 12-hr string with AM / PM
     * @param {string} time
     * @returns string
     */
    const toStandardTime = (time) => {
        const parsedDate = new Date(
            Date.parse(`2020-01-01T${time}`)
        )
        const hours = parsedDate.getHours()
        const minutes = parsedDate.getMinutes()
        const seconds = parsedDate.getSeconds()

        return hours <= 12
        ? time + " AM"
        : (
            hours-12 + ":"
            + ((minutes < 10)?"0":"") + minutes + ":"
            + ((seconds < 10)?"0":"") + seconds
            + " PM"
        )
    }

    /**
     * form submit handler for the rain submit button
     * updates the db with the new rain information for the user
     */
    const handleFormSubmit = async e => {
        e.preventDefault()
        await axios
            .put(
                `http://localhost:5001/user/precip/?email=${user.email}`,
                {
                    precip: rain
                }
            )
            .then(() => {
                setResetFlag(true)
            })
    }

    /**
     * takes the horrible postgres array string and converts into
     * text to be printed on the screen for displaying active days.
     * @param {string} SQLString
     * @returns string
     */
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
                !adjustSchedule || !scheduleJSON ?
                // No connection to ISA
                // Print error message to user
                <p>No Schedule Data is Currently Available</p> :
                // otherwise, display schedule information.
                (
                    scheduleJSON[0] && adjustSchedule[0] ?
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
                                for (const schedule of tempObj) {
                                    delete schedule.date_created
                                    delete schedule.last_modified
                                    delete schedule.email
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
                        <form
                            onSubmit={handleFormSubmit}
                        >
                        <p>Estimated Rainfall Tomorrow (inch): </p>
                        <input
                            type="number"
                            name="estPrecip"
                            min='0'
                            step='0.001'
                            placeholder={"ex: 0.6, 1.013"}
                            value={rain}
                            onChange={e => {
                                setRain(e.target.value)
                            }}
                        />
                        <input type="submit"></input>
                        </form>
                        <p>Rain Value = {userRain} in.</p>
                        <hr />
                        <div>
                            {Object.values(adjustSchedule).map((schedule, index) => (
                                <div>
                                    <h3>Schedule Id: {schedule.rule_id} {
                                        schedule.start_time !== scheduleJSON[index].start_time
                                        ? "*"
                                        : ''
                                    }</h3>
                                    <div>
                                        <p>Start Time: {toStandardTime(schedule.start_time)}</p>
                                        <p>End Time: {toStandardTime(schedule.end_time)}</p>
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
                                    {
                                        schedule.start_time !== scheduleJSON[index].start_time
                                        ? (<div>
                                            <p></p>
                                            <h6>* - Watering Schedule Shown is adjusted due to expected precipitation</h6>
                                        </div>)
                                        : <div></div>
                                    }
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


            //Display Calendar
            // <div>
            //   <Calendar
            //     localizer={localizer}
            //     events={events}
            //      startAccessor="start"
            //      endAccessor="end"
            //      style={{ height: 500 }}
            //      step={60}
            //     showMultiDayTimes
            //      defaultDate={new Date(2015, 3, 13, 7, 0, 0)}
            //   />
            // </div>

            }

            <DisplayCalendar />

        </Fragment>
    )
}

export default withAuthenticationRequired(Schedule, {
    onRedirecting: () => <Loading />,
  })
