import {
  TOTALVALUES_START,
  TOTALVALUES_SUCCESS,
  TOTALVALUES_FAIL,
  TOTALVALUES_METRIC
} from "../actions/totalvalues";

const initState = {
  isFetching: false,
  values: [],
  isSuccess: false,
  metric: "count"
};

export default function TotalValuesReducer(state = initState, action) {
  switch (action.type) {
    case TOTALVALUES_START:
      return {
        ...state,
        isFetching: true
      };
      case TOTALVALUES_FAIL:
      return {
        ...state,
        isFetching: false,
        isSuccess: false,
        values: [],
        message: action.message
      };
    case TOTALVALUES_SUCCESS:
      return {
        ...state,
        values: Array.isArray(action.data) ? action.data : [],
        isFetching: false,
        isSuccess: true
      };
    case TOTALVALUES_METRIC:
      return {
        ...state,
        metric: action.metric
      };
    default:
      return state;
  }
}
