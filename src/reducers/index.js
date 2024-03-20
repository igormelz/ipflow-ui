import { createStore, applyMiddleware, combineReducers } from 'redux';
import TimePickerReducer from "./timepicker";
import FilterSelectorReducer from "./filterselector";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import QueryReducer from './query';
import TotalValuesReducer from "./totalvalues";
import RawValueReducer from "./rawvalues";

const netflowApp = combineReducers({
    timer : TimePickerReducer,
    queries: QueryReducer,
    filters : FilterSelectorReducer,
    totals: TotalValuesReducer,
    scan: RawValueReducer
});

/* eslint-disable no-underscore-dangle */
export const store = createStore(
    netflowApp,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );

