import * as Api from "../utils/api";
import DruidQuery from "../utils/DruidQuery";

export const QUERY_ADD = "QUERY_ADD";
export const addQuery = ({ id = "", dimension = "" }) => ({
  type: QUERY_ADD,
  query: {
    queryId: id,
    type: "topN",
    dimension: dimension,
    metric: "count",
    isFetching: false
  }
});

export const QUERY_REMOVE = "QUERY_REMOVE";
export const removeQuery = id => ({
  type: QUERY_REMOVE,
  queryId: id
});

export const QUERY_START = "QUERY_START";
const startQuery = id => ({
  type: QUERY_START,
  queryId: id
});

export const QUERY_SUCCESS = "QUERY_SUCCESS";
const successQuery = query => ({
  type: QUERY_SUCCESS,
  query
});

export const QUERY_FAIL = "QUERY_FAIL";
export const failQuery = (id, message) => ({
  type: QUERY_FAIL,
  queryId: id,
  message: message
});

export const updateQuery = (
  query = {},
  interval = "",
  filters = [],
  metric = ""
) => dispatch => {
  dispatch(startQuery(query.queryId));
  const qmetric = metric === "" ? query.metric : metric;
  const json = new DruidQuery.Builder("dpi")
    .withQueryType(query.type)
    .withIntervals(interval)
    .withFilter(filters)
    .withDimension(query.dimension)
    .withMetric(qmetric)
    .withThreshold(10)
    .withAggregations(qmetric)
    .build();

  Api.postDruidQuery(json).then(data => {
    if (data.error !== undefined) {
      console.log(data.error + ":" + data.errorMessage);
      dispatch(failQuery(query.queryId, data.error));
    } else {
      dispatch(
        successQuery({ queryId: query.queryId, data: data, metric: qmetric })
      );
    }
  });
};
