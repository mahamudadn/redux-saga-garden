import React, { useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';


function PlantList() {
    const dispatch = useDispatch();

    const reduxState = useSelector(store => store.plantList);

    useEffect(() => {
        console.log('component did mount');
        // dispatch an action to request the plantList from the API
        dispatch({type:'GET_PLANT'})
    }, []); 

    return (
        <div>
            <h3>This is the plant list</h3>
            {/* <pre>{JSON.stringify(reduxState)}</pre> */}
            {reduxState.map((plant, i) => {
                return <div>
                    <li key={i}>{plant.name}</li>
                <button onClick={() => dispatch({type: 'DELETE_PLANT' , payload: plant.id})}>Delete</button>
                </div>
            })}
        </div>
    );
}

export default PlantList;
