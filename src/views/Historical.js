import React, { Fragment, useState, useEffect, useRef } from "react";

import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";
import axios from "axios";
import Highcharts from "highcharts";

// using Highcharts: https://www.highcharts.com/docs/chart-concepts/legend

// 1 day is 86400000 millisecods
// 7 days is 604800000 milliseconds
// 1 month is 2592000000

var colors = Highcharts.getOptions().colors;

var data = {
  success: true,
  sensor_data: [
    {
      "humidity": 4.98,
      "temperature": 58.98,
      "moisture": 18.09,
      "light": 14.11,
      "date_created": "2021-04-21T04:40:38.325Z",
      "email": "jbarringer1999@gmail.com"
    },
    {
        "humidity": 77.6,
        "temperature": 2.37,
        "moisture": 70.65,
        "light": 63.8,
        "date_created": "2021-04-03T04:40:38.325Z",
        "email": "jbarringer1999@gmail.com"
    },
    {
        "humidity": 74.86,
        "temperature": 32.1,
        "moisture": 11.14,
        "light": 26.05,
        "date_created": "2021-04-19T04:40:38.325Z",
        "email": "jbarringer1999@gmail.com"
    },
    {
        "humidity": 34.76,
        "temperature": 87.39,
        "moisture": 70.62,
        "light": 88.82,
        "date_created": "2021-04-18T04:40:38.325Z",
        "email": "jbarringer1999@gmail.com"
    },
    {
        "humidity": 97.69,
        "temperature": 78.86,
        "moisture": 59.26,
        "light": 6.16,
        "date_created": "2021-04-17T04:40:38.325Z",
        "email": "jbarringer1999@gmail.com"
    },
  ],
};

export const Historical = ({ query }) => {
  const [sensorData, setSensorData] = useState(data.sensor_data)
  const [dataSource, setDataSource] = useState([]);

  const refMoisture = useRef(null);
  const refTemp = useRef(null);
  const refHumidity = useRef(null);
  const refLight = useRef(null);

  


  // useEffect(() => {
  //   function buildData() {
  //     const tempBody = [
  //       {
  //         name: "Humidity",
  //         data: [],
  //       },
  //       {
  //         name: "Temperature",
  //         data: [],
  //       },
  //       {
  //         name: "Moisture",
  //         data: [],
  //       },
  //       {
  //         name: "Light",
  //         data: [],
  //       },
  //     ];
  //     for (var i = 0; i < data.sensor_data.length; i++) {
  //       tempBody[0].data.push(sensorData[i].humidity);
  //       tempBody[1].data.push(sensorData[i].temperature);
  //       tempBody[2].data.push(sensorData[i].moisture);
  //       tempBody[3].data.push(sensorData[i].light);
  //     }
  //     setDataSource(tempBody);
  //   }

  //   if (!sensorData) {
  //     async function fetchData() {
  //       const response = await axios.get(
  //         "http://localhost:5001/soil/?garden_id=1"
  //       );

  //       setSensorData(Object.values(response.data.sensor_data));
  //     }
  //     fetchData();
  //   }
  //   if (!dataSource && sensorData) {
  //     buildData();
  //   }
  // }, [sensorData]);

  useEffect(() => {
    setTimeout(() => {
      const tempBody = [
        {
          name: "Humidity",
          data: [],
        },
        {
          name: "Temperature",
          data: [],
        },
        {
          name: "Moisture",
          data: [],
        },
        {
          name: "Light",
          data: [],
        },
      ];
      for (var i = 0; i < data.sensor_data.length; i++) {
        tempBody[0].data.push(sensorData[i].humidity);
        tempBody[1].data.push(sensorData[i].temperature);
        tempBody[2].data.push(sensorData[i].moisture);
        tempBody[3].data.push(sensorData[i].light);
      }
      setDataSource(tempBody);
      console.log("==datasource:",dataSource)
    }, 2000);
  }, []);

  useEffect(() => {
    const chartMoisture = Highcharts.chart(refMoisture.current, {
      title: {
        text: "Historical Moisture Data",
      }, // title of the chart
      subtitle: {
        text: "A line chart showing your previous moisture data.",
      }, // subtitle of the chart
      xAxis: {
        title: {
          text: "Time"
        },
        accessibility: {
          description: "Range of dates",
        },
        // Maybe set the dates here?
        // categories: []
      },
      yAxis: {
        title: {
          text: "Moisture",
        }, // the title of the Y Axis
        accessibility: {
          description: "The y-axis title description"
        }
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },
      legend: {
        enabled: false
      },
      series: 
        ( dataSource.length > 0 ? 
          [{  data: dataSource[2].data, 
              color: colors[3],
            }] : 
          []
        )
    });

    const chartHumidity = Highcharts.chart(refHumidity.current, {
      title: {
        text: "Historical Humidity Data",
      }, // title of the chart
      subtitle: {
        text: "A line chart showing your previous humidity data.",
      }, // subtitle of the chart
      xAxis: {
        title: {
          text: "Time"
        },
        accessibility: {
          description: "Range of dates",
        },
        // Maybe set the dates here?
        // categories: []
      },
      yAxis: {
        title: {
          text: "Relative Humidity (%)",
        }, // the title of the Y Axis
        accessibility: {
          description: "The y-axis title description"
        }
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },
      legend: {
        enabled: false
      },
      series: ( dataSource.length > 0 ? 
        [{ data: dataSource[0].data, color: colors[7] }] : 
        []
      )
    });

    const chartLight = Highcharts.chart(refLight.current, {
      title: {
        text: "Historical Light Data",
      }, // title of the chart
      subtitle: {
        text: "A line chart showing your previous light data.",
      }, // subtitle of the chart
      xAxis: {
        title: {
          text: "Time"
        },
        accessibility: {
          description: "Range of dates",
        },
        // Maybe set the dates here?
        // categories: []
      },
      yAxis: {
        title: {
          text: "Lumens",
        }, // the title of the Y Axis
        accessibility: {
          description: "The y-axis title description"
        }
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },
      legend: {
        enabled: false
      },
      series: ( dataSource.length > 0 ? 
        [{ data: dataSource[3].data, color: colors[1] }] : 
        []
      )
    });

    const chartTemp = Highcharts.chart(refTemp.current, {
      title: {
        text: "Historical Temperature Data",
      }, // title of the chart
      subtitle: {
        text: "A line chart showing your previous temperature data.",
      }, // subtitle of the chart
      xAxis: {
        title: {
          text: "Time"
        },
        accessibility: {
          description: "Range of dates",
        },
        // Maybe set the dates here?
        // categories: []
      },
      yAxis: {
        title: {
          text: "Fahrenheight",
        }, // the title of the Y Axis
        accessibility: {
          description: "The y-axis title description"
        }
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },
      legend: {
        enabled: false
      },
      series: ( dataSource.length > 0 ? 
        [{ data: dataSource[2].data, color: colors[5] }] : 
        []
      )
    });

    if (dataSource.length > 0) {
      chartMoisture.hideLoading();
      chartHumidity.hideLoading();
      chartLight.hideLoading();
      chartTemp.hideLoading();
    } else {
      chartMoisture.showLoading();
      chartHumidity.showLoading();
      chartLight.showLoading();
      chartTemp.showLoading();
    }
  }, [dataSource]);  

  const [ inputQuery, setInputQuery ] = useState(query || "7");
  const [ apiQuery, setApiQuery ] = useState("7");
  // const [ startTime, setStartTime ] = useState();
  // const [ endTime, setEndTime ] = useState();

  // const currDate = new Date(Date.now());
  // setEndTime(`${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()}`)
  // console.log("== current Date:", currDate.getDate())
  // console.log("== current Month:", currDate.getMonth())
  // console.log("== current Year:", currDate.getFullYear())

  

  // console.log("== query:", inputQuery);
  // console.log("== start Date:", start.getDate())
  // console.log("== start Month:", start.getMonth())
  // console.log("== start Year:", start.getFullYear())


  const email = "jbarringer1999@gmail.com"

  useEffect(() => {
    var currDate = new Date(Date.now());
    var start = new Date(Date.parse(currDate) - (apiQuery * 86400000))
    var startTime = (`${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`)
    var endTime = (`${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate() + 1}`)
    console.log("==start Time:", startTime);
    console.log("==end Time:", endTime);
    // async function fetchData() {
    //   const response = await axios.get(`http://localhost:5001/soil/?start_time=${startTime}&end_time=${endTime}&email=${user.email}`)
    //   setSensorData(Object.values(response.data.sensor_data))
    // }

  }, [ apiQuery ]);

  

  return (
    <Fragment>
      <h1>Historical Data</h1>
      
      <form onSubmit={(e) => {
          e.preventDefault();
          setApiQuery(inputQuery);
      }}>
        <div>
          <input value={inputQuery} onChange={e => setInputQuery(e.target.value)} />
          
        </div>
      </form>
      
      {/* <form onSubmit={handleSubmit}>
        Showing the last <input type="text" name="nValue" value={nValue} /> days of data. <br />
        <input type="button"  value="Submit" />
      </form> */}
      {/* {
                (!sensorData || !dataSource) ?
                <div>No Sensor Data is Currently Available</div> :
                <div ref={refMoisture} />
                <div ref={refHumidity} />
                <div ref={refLight} />
                <div ref={refTemp} />
            } */}
      <div ref={refMoisture} />
      <div ref={refHumidity} />
      <div ref={refLight} />
      <div ref={refTemp} />
    </Fragment>
  );
};

export default withAuthenticationRequired(Historical, {
  onRedirecting: () => <Loading />,
});
