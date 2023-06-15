import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import logger from 'redux-logger';
import axios from 'axios';
import createSagaMiddleware from 'redux-saga';
import { takeLatest, put } from 'redux-saga/effects';

// this startingPlantArray should eventually be removed
// const startingPlantArray = [
//   { id: 1, name: 'Rose' },
//   { id: 2, name: 'Tulip' },
//   { id: 3, name: 'Oak' }
// ];

const plantList = (state = [], action) => {
  switch (action.type) {
    case 'ADD_PLANT':
      return  action.payload 
    default:
      return state;
  }
};

// Genarator Function

function* getPlant () {
  try {

    const plantResponse = yield axios.get('/api/plant')
    // after server responds, then this generator function/saga continues.
      yield put ({type:'ADD_PLANT', payload: plantResponse.data})
  }
  catch(err) {
    console.log('error getting plants', err);
  }
}


function* postPlant (action) {

  try {
      yield axios.post('/api/plant', action.payload)

      yield put ({type:'GET_PLANT'})

  }
  catch(error) {
    console.log('error', error);
  }

}

function* deletePlant (action) {
  try { yield axios.delete(`/api/plant/${action.payload}`)
  yield put ({type: 'GET_PLANT'})

}
catch(error) {
  console.log('Error Deleting Plant', error);
}

}
// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Create the rootSaga generator function
function* rootSaga() {
  yield takeLatest('GET_PLANT',getPlant)
  yield takeLatest('POST_PLANT', postPlant)
  yield takeLatest('DELETE_PLANT', deletePlant)
}

const store = createStore(
  combineReducers({ plantList }),


  applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware

sagaMiddleware.run(rootSaga)



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);