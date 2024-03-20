import {
  QUERY_START,
  QUERY_SUCCESS,
  QUERY_FAIL,
  QUERY_ADD,
  QUERY_REMOVE
} from "../actions/query";

const initState = [
  {
    queryId: "customer",
    type: "topN",
    dimension: "subnet",
    metric: "count",
    isFetching: false
  },
  // {
  //   queryId: "protocol",
  //   type: "topN",
  //   dimension: "protocol",
  //   metric: "sessions",
  //   isFetching: false
  // },
  // {
  //   queryId: "service",
  //   type: "topN",
  //   dimension: "service",
  //   metric: "sessions",
  //   isFetching: false
  // }
];

export default function QueryReducer(state = initState, action) {
  switch (action.type) {
    case QUERY_ADD:
      return [...state, action.query];
    case QUERY_REMOVE:
      return state.filter(q => q.queryId !== action.queryId);
    case QUERY_START:
      return state.map(q => {
        if (q.queryId === action.queryId) {
          return {
            ...q,
            isFetching: true
          };
        }
        return q;
      });
      case QUERY_FAIL:
      return state.map(q => {
        if (q.queryId === action.queryId) {
          return {
            ...q,
            data: {},
            isFetching: false,
            isSuccess: false,
            message: action.message
          };
        }
        return q;
      });
    case QUERY_SUCCESS:
      return state.map(q => {
        if (q.queryId === action.query.queryId) {
          return {
            ...q,
            metric: action.query.metric,
            data: action.query.data,
            isFetching: false,
            isSuccess: true
          };
        }
        return q;
      });
    default:
      return state;
  }
}
