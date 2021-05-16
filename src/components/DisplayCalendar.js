import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'
import "react-big-calendar/lib/css/react-big-calendar.css";
import events from '../views/events';
moment.locale("en-GB");
const localizer = momentLocalizer(moment);
//const {user} = useAuth0();
//const myEventsList = {} //empty object for now




class DisplayCalendar extends Component {

  constructor(props) {
    super(props)

    this.state = {
      // let {
      //         user,
      //       } = useAuth0()
  //    user: useAuth0(),

      cal_events: [
        //State is updated via componentDidMount
      ],
    }

  }

 //const user = useAuth0()
  // const {
  //         user,
  //       } = useAuth0()

  convertDate = (date) => {
    return moment.utc(date).toDate()
  }

  componentDidMount() {

//`http://localhost:5001/schedule/user/?email=${user.email}`
  axios.get('http://localhost:5001/schedule')

    .then(response => {
      //console.log(response.data);
      let schedules = response.data;
      console.log("schedule data" + schedules)
      for (let i = 0; i < schedules.length; i++) {

        schedules[i].start = this.convertDate("2015-01-01" + schedules[i].start_time)
    //    console.log ("Print start time: schedules[i].start" + schedules[i].start)
        schedules[i].end = this.convertDate("2015-01-01" + schedules[i].end_time)
      //  console.log ("Print end time: schedules[i].end" + schedules[i].end)
      }

      this.setState({
        cal_events:schedules
      })

    })
    .catch(function (error) {
      console.log(error);
    });
}

  render() {

 const { cal_events } = this.state

    return (
        <Calendar
         localizer={localizer}
        // events={myEventsList}
        // startAccessor="start"
        // endAccessor="end"
events={cal_events}
//events={events}
step={30}
defaultView='week'
views={['month','week','day']}
//defaultDate={new Date()}
defaultDate={new Date(2015, 3, 13, 7, 0, 0)}
        />
    );
  }
}

export default DisplayCalendar;
