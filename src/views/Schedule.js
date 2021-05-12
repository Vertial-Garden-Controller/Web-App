import { Fragment, useEffect, useState } from "react";

import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";
// import axios from 'axios'

export const Schedule = () => {
    // const [plantJSON, setPlantJSON] = useState()
    // const [value, setValue] = useState('ALL')
    // const [currentPlant, setCurrentPlant] = useState()

    useEffect(() => {
        // if(!plantJSON) {
        //     async function fetchData() {
        //         const response = await axios.get('http://localhost:5001/plant_types')
        //         setPlantJSON(response.data.plant_types)
        //         setCurrentPlant(Object.values(response.data.plant_types))
        //         console.log(response.data.plant_types)
        //     }
        //     fetchData()
        // }
    }, [])

    return (
        <Fragment>
            <h1>Schedule Page</h1>
            {/* {
                !plantJSON ?
                <div>No Plant Data is Currently Available</div> :
                <div>
                    {
                        <div>
                            <select value={value} onChange={e => {
                                setValue(e.currentTarget.value)
                                if(e.currentTarget.value !== 'ALL') {
                                    setCurrentPlant([Object.values(plantJSON).find(
                                        f => f.name === e.currentTarget.value
                                    )])
                                } else {
                                    setCurrentPlant(Object.values(plantJSON))
                                }
                            }}>
                                <option value={'ALL'}>ALL</option>
                                {Object.values(plantJSON).map((plant) => (
                                    <option value={plant.name}>{plant.name}</option>
                                ))}
                            </select>
                            {
                                currentPlant ?
                                Object.values(currentPlant).map((plant) => (
                                    <div>
                                        <hr />
                                        <h2>{plant.name}</h2>
                                        <p>Water {plant.gallons_per_week} gallon(s) weekly.</p>
                                        {
                                            plant.early_stage ? 
                                            <p>! - This plant needs extra water during early growth.</p> :
                                            <div />
                                        }
                                        <p>{plant.flavor}</p>
                                    </div>
                                )) :
                                <p>Select a Plant</p>
                                
                            }
                        </div>
                        }
                    </div>
                
                
            } */}
        </Fragment>
    );
};

export default withAuthenticationRequired(Schedule, {
    onRedirecting: () => <Loading />,
  });