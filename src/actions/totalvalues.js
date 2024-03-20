import * as Api from "../utils/api";
import DruidQuery from "../utils/DruidQuery";
import numeral from "numeral";

const formatResult = ({ result } = {}) => [
  // {
  //   metric: "customer",
  //   label: "Customers",
  //   raw: result.customer,
  //   value: numeral(result.customer).format("0.0 a")
  // },
  {
    metric: "count",
    label: "Sessions",
    raw: result.count,
    value: numeral(result.count).format("0.0 a")
  },
  {
    metric: "bytes",
    label: "Bytes",
    raw: result.bytes,
    value: numeral(result.bytes).format("0.0 b")
  },
  // {
  //   metric: "remoteIp",
  //   label: "Remote Hosts",
  //   raw: result.remoteIp,
  //   value: numeral(result.remoteIp).format("0.0 a")
  // },
  // {
  //   metric: "customerIp",
  //   label: "Local Hosts",
  //   raw: result.customerIp,
  //   value: numeral(result.customerIp).format("0.0 a")
  // }
];

export const TOTALVALUES_START = "TOTAL_VALUES_START";
const startTotalValuesQuery = () => ({
  type: TOTALVALUES_START
});

export const TOTALVALUES_SUCCESS = "TOTAL_VALUES_SUCCESS";
const successTotalValuesQuery = data => ({
  type: TOTALVALUES_SUCCESS,
  data: data
});

export const TOTALVALUES_METRIC = "TOTAL_VALUES_METRIC";
export const setTotalMetric = metric => ({
  type: TOTALVALUES_METRIC,
  metric
});

export const TOTALVALUES_FAIL = "TOTAL_VALUES_FAIL";
export const failTotalValuesQuery = message => ({
  type: TOTALVALUES_FAIL,
  message
});

export const updateTotalValues = () => (dispatch, getState) => {
  dispatch(startTotalValuesQuery());

  const interval = getState().timer.interval;
  const filters = getState().filters;

  const json = new DruidQuery.Builder("dpi")
    .withQueryType("timeseries")
    .withIntervals(interval)
    .withFilter(filters)
    .withAggregations(Api.AGGREGATIONS)
    .build();

  Api.postDruidQuery(json).then(data => {
    // validate
    if (data.error !== undefined) {
      console.log(data.error+':'+data.errorMessage);
      dispatch(failTotalValuesQuery(data.error));
    } else {
      dispatch(successTotalValuesQuery(formatResult(data[0])));
    }
  });
};
