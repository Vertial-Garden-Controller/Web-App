import React, { Fragment, useState, useEffect, useRef } from "react";

import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";
import axios from "axios";
import Highcharts from "highcharts";

// using Highcharts: https://www.highcharts.com/docs/chart-concepts/legend

var colors = Highcharts.getOptions().colors;

var data = {
  success: true,
  sensor_data: [
    {
      garden_id: 1,
      humidity: 4.98,
      temperature: 58.98,
      moisture: 18.09,
      light: 14.11,
      date_created: "2021-04-21T04:40:38.325Z",
    },
    {
      garden_id: 1,
      humidity: 77.6,
      temperature: 2.37,
      moisture: 70.65,
      light: 63.8,
      date_created: "2021-04-21T04:40:38.325Z",
    },
    {
      garden_id: 1,
      humidity: 74.86,
      temperature: 32.1,
      moisture: 11.14,
      light: 26.05,
      date_created: "2021-04-21T04:40:38.325Z",
    },
    {
      garden_id: 1,
      humidity: 34.76,
      temperature: 87.39,
      moisture: 70.62,
      light: 88.82,
      date_created: "2021-04-21T04:40:38.325Z",
    },
    {
      garden_id: 1,
      humidity: 97.69,
      temperature: 78.86,
      moisture: 59.26,
      light: 6.16,
      date_created: "2021-04-21T04:40:38.325Z",
    },
  ],
};

export const Historical = () => {
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
          text: "What are the units of moisture?",
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
          text: "What are the units of humidity?",
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
          text: "What are the units of light?",
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

  return (
    <Fragment>
      <h1>Historical Data</h1>
      <p className="lead">
        {/* Implement input box for custom weather data */}
        Showing the history in graphs.
      </p>
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
