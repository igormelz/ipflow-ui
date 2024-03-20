import { CONV_PARTNER_START, CONV_PARTNER_SUCCESS } from "../actions/convpartners";

const initState = {
  isFetching: false,
  rawdata: [],
};

export default function ConvPartnerReducer(state = initState, action) {
  switch (action.type) {
    case CONV_PARTNER_START:
      return {
        ...state,
        isFetching: true
      };
    case CONV_PARTNER_SUCCESS:
      return {
        ...state,
        rawdata: Array.isArray(action.data) ? action.data : [], 
        isFetching: false
      };
    default:
      return state;
  }
}
