import { Fragment, useEffect, useState } from "react";
import axios from 'axios'

const Plants = () => {
    const [plantJSON, setPlantJSON] = useState(0)

    useEffect(() => {
        if(plantJSON === 0) {
            async function fetchData() {
                const response = await axios.get('http://localhost:5001/plant_types')
                setPlantJSON(response.data.plant_types)
            }
            fetchData()
        }
    }, [plantJSON])

    return (
        <Fragment>
            <h1>Plant Watering Information</h1>
            {
                !plantJSON ?
                <div>No Plant Data is Currently Available</div> :
                <div>
                    {
                        Object.values(plantJSON).map((plant) => (
                            <div>
                                <h2>{plant.name}</h2>
                                <p>Water {plant.gallons_per_week} gallon(s) weekly.</p>
                                {
                                    plant.early_stage ? 
                                    <p>! - This plant needs extra water during early growth.</p> :
                                    <div></div>
                                }
                            </div>
                            
                        ))
                    }
                </div>
                
                
            }
        </Fragment>
    );
};

export default Plants;