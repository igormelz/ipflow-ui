import { RAWVALUES_START, RAWVALUES_SUCCESS } from "../actions/rawvalues";

const initState = {
  isFetching: false,
  rawdata: [],
};

export default function RawValuesReducer(state = initState, action) {
  switch (action.type) {
    case RAWVALUES_START:
      return {
        ...state,
        isFetching: true
      };
    case RAWVALUES_SUCCESS:
      return {
        ...state,
        rawdata: Array.isArray(action.data) ? action.data : [], 
        isFetching: false
      };
    default:
      return state;
  }
}
