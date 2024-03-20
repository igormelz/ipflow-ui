import { convertValueToInterval } from "../utils/timeUtils";
import { UPDATE_INTERVAL } from "../actions/timepicker";

const INIT_VALUE = "now-15m:now";

const initState = {
  timepicker: INIT_VALUE,
  interval: convertValueToInterval(INIT_VALUE)
};

export default function TimePickerReducer(state = initState, action) {
  switch (action.type) {
    case UPDATE_INTERVAL:
      return {
        ...state,
        interval: action.data.interval,
        timepicker: action.data.timepicker
      };
    default:
      return state;
  }
}
