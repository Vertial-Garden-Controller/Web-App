import React, { Fragment, useState } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";
import axios from 'axios';

//What I import for Submit forms
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
import DatePicker from "react-widgets/DatePicker";
import NumberPicker from "react-widgets/NumberPicker";

//import calendar
import Scheduler from "../components/Scheduler";
export const WateringSchedule = () => {
//  var tempLocation = 97330;

const dropdata=["0:00", "1:00", "2:00", "3:00", "4:00", "500", "6:00", "7:00", "8:00"];
  return (
    //The Schedule Adjustment form start
      <Fragment>
          <h1>Schedule Adjusment</h1>

            <label>Select Date</label>
            <div>
              <DatePicker
                defaultValue={new Date()}
                className="w-3/5"
              />
            </div>
            <label>Select Time</label>
            <div>
              <DropdownList
                data= {dropdata}
                textField="label"
                className="w-2/5 mt-0"
              />
            </div>
              <label>Set Water Duration</label>
            <div>
            <NumberPicker
              precision={1}
              defaultValue={0.0}
              step={0.1}
            />
            </div>
            //The Schedule Adjustment form end
            //Scheduler
              <Scheduler />

      </Fragment>
  );
};

export default withAuthenticationRequired(WateringSchedule, {
    onRedirecting: () => <Loading />,
  });
