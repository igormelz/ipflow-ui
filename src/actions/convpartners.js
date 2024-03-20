import * as Api from "../utils/api";
import DruidQuery from "../utils/DruidQuery";

export const CONV_PARTNER_START = "CONV_PARTNER_START";
export const CONV_PARTNER_SUCCESS = "CONV_PARTNER_SUCCESS";

const startCPQuery = () => ({
  type: CONV_PARTNER_START
});

const successCPQuery = data => ({
  type: CONV_PARTNER_SUCCESS,
  data
});


export const updateCPValues = () => (dispatch, getState) => {
  dispatch(startCPQuery());

  const interval = getState().timer.interval;
  const filters = getState().filters;

  const json = new DruidQuery.Builder("dpi")
    .withQueryType("groupBy")
    .withDimensions(["remote_ip", "local_ip"])
    .withIntervals(interval)
    .withFilter(filters)
    .withContext({"groupByStrategy":"v2"})
    .withLimit({ "type": "default", "limit": 10, "columns": ["remote_ip"] })
    .withAggregations([
      { type: "count", name: "count", fieldName: "count" },
      { type: "longSum", name: "bytes", fieldName: "sum_bytes" }
    ])
    .build();

  Api.postDruidQuery(json).then(data => {
    dispatch(successCPQuery(data.map(e => e.event)));
  });
};
