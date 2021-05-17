import React, { Fragment, useState, useEffect, useRef } from "react";

import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";
import axios from "axios";
import Highcharts from "highcharts";
import { useAuth0 } from '@auth0/auth0-react'


// using Highcharts: https://www.highcharts.com/docs/chart-concepts/legend

var colors = Highcharts.getOptions().colors;

export const Historical = () => {
  const [sensorData, setSensorData] = useState(undefined)
  const [dataSource, setDataSource] = useState([]);
  const [ inputQuery, setInputQuery ] = useState("100");
  const [ apiQuery, setApiQuery ] = useState("7");

  const {
      user,
    } = useAuth0()

  const refMoisture = useRef(null);
  const refTemp = useRef(null);
  const refHumidity = useRef(null);
  const refLight = useRef(null);

  useEffect(() => {
    async function fetchData() {
      await axios
        .get(
          `http://localhost:5001/soil/?email=${user.email}`
        )
        .then((res) => {
          setSensorData(res.data.sensor_data)
        })
        .catch((err) => {
          if(err.response) {
            alert(err.response.data.detail)
          }
        })
    }

    fetchData()
  }, [user.email])

  function readableDates(dateString) {
    var x = new Date(Date.parse(dateString))
    return (`${x.getFullYear()}-${x.getMonth()+1}-${x.getDate()+1}`)
  }

  useEffect(() => {
    var currDate = new Date(Date.now());
    console.log("== currDate:", Date.parse(currDate))
    var start = new Date(Date.parse(currDate) - (apiQuery * 86400000))
    var startTime = (`${start.getFullYear()}-${start.getMonth()+1}-${start.getDate()}`)
    var endTime = (`${currDate.getFullYear()}-${currDate.getMonth()+1}-${currDate.getDate() + 1}`)
    console.log("==start Time:", startTime);
    console.log("==end Time:", endTime);
    async function fetchData() {
      const response = await axios.get(`http://localhost:5001/soil/?start_time=${startTime}&end_time=${endTime}&email=${user.email}`)
      console.log("== api call:", Object.values(response.data.sensor_data))
      setSensorData(Object.values(response.data.sensor_data))
    }
    fetchData()
  }, [ apiQuery ]);

  useEffect(() => {
    const tempBody = [
      {
        name: "Humidity",
        data: [],
        dates: []
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
    for (const key in sensorData) {
      tempBody[0].data.push(sensorData[key].humidity);
      tempBody[1].data.push(sensorData[key].temperature);
      tempBody[2].data.push(sensorData[key].moisture);
      tempBody[3].data.push(sensorData[key].light);
      tempBody[0].dates.push(readableDates(sensorData[key].date_created))
    }
    setDataSource(tempBody);
    console.log("==datasource:",dataSource)
  }, [sensorData]);



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
        categories: ( dataSource.length > 0 ? dataSource[0].dates : [] )
          
      },
      yAxis: {
        title: {
          text: "% water",
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
        categories: ( dataSource.length > 0 ? dataSource[0].dates : [] )
      },
      yAxis: {
        title: {
          text: "mg/L",
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
        categories: ( dataSource.length > 0 ? dataSource[0].dates : [] )
      },
      yAxis: {
        title: {
          text: "Lux",
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
        categories: ( dataSource.length > 0 ? dataSource[0].dates : [] )
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

  return (
    <Fragment>
      <h1>Historical Data</h1>
      <form onSubmit={(e) => {
          e.preventDefault();
          setApiQuery(inputQuery);
      }}>
        <div>
          Showing data for the last <input value={inputQuery} onChange={e => setInputQuery(e.target.value)} /> days.
          
        </div>
      </form>      
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
