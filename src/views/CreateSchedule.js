import { Fragment, useEffect, useState } from 'react'

import { withAuthenticationRequired } from '@auth0/auth0-react'
import Loading from '../components/Loading'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'
import TimePicker from 'react-time-picker'
import { useHistory } from 'react-router-dom'

export const AddSchedule = () => {
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

    const {
        user,
      } = useAuth0()

    const history = useHistory()

    const updateFieldChanged = index => e => {
        let newArr = [...days]; // copying the old days array
        newArr[index].isChecked = !newArr[index].isChecked
        setDays(newArr);
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const reqBody = {
            start_time: startTime,
            end_time: endTime,
            email: user.email,
            days: { 
                mon: days[0].isChecked,
                tue: days[1].isChecked,
                wed: days[2].isChecked,
                thu: days[3].isChecked,
                fri: days[4].isChecked,
                sat: days[5].isChecked,
                sun: days[6].isChecked
            }
        }
        const response = await axios.post('http://localhost:5001/schedule/', reqBody)
        if(response.data.error) {
            alert(response.data.error)
        } else {
            history.push('/schedule')
        }
    }

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
    
    return (
        <Fragment>
            <h1>Scheduler</h1>
            {
                ISA ?
                (<form
                    onSubmit={
                        handleSubmit
                    }
                 >
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
                    <button
                        onClick={() => {
                            history.push('/schedule')
                        }}
                    >
                        Back
                    </button>
                    <input type="submit" value="Submit" />
                </form>) :
                // otherwise, display schedule information.
                <div>
                    <p>Cannot add new schedule at this time.</p>
                </div>
            }
        </Fragment>
    )
}

export default withAuthenticationRequired(AddSchedule, {
    onRedirecting: () => <Loading />,
  })
