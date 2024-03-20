import * as Api from "../utils/druid";
import { updateInterval } from "./timepicker";

export const LOAD_FLOWS_START = 'FLOW_COUNT_RETRIEVE';
export const LOAD_FLOWS_SUCCESS = "FLOW_COUNT_REQUEST";

export const LOAD_TOP_CUSTOMERS_RETRIEVE = 'TOP_CUSTOMERS_RETRIEVE';
export const TOP_CUSTOMER_REQUEST = "TOP_CUSTOMER_REQUEST";

export const LOAD_USAGE_START = "USAGE_COUNT_REQUEST";
export const LOAD_USAGE_SUCCESS = 'USAGE_COUNT_RETRIEVE';

export const LOAD_PROTO_START = 'PROTO_REQUEST';
export const LOAD_PROTO_SUCCESS = 'PROTO_RETRIVE';

const requestUsage = query => ({
  type: LOAD_USAGE_START,
  query
});

const requestTop = query => ({
  type: LOAD_TOP_CUSTOMERS_RETRIEVE,
  query
});

const requestFlow = query => ({
  type: LOAD_FLOWS_START,
  query
});

const reciveUsage = data => ({
  type: LOAD_USAGE_SUCCESS,
  data
});

const receiveTimeseries = data => ({
  type: LOAD_FLOWS_SUCCESS,
  data
});

const receiveTopN = data => ({
  type: LOAD_TOP_CUSTOMERS_RETRIEVE,
  data
});

const requestProto = data => ({
  type: LOAD_PROTO_START,
  data
});

const reciveProto = data => ({
  type: LOAD_PROTO_SUCCESS,
  data: Api.formatTopNDatasets(data, [{name: "RX"}], "peer")
});

export const updateProto = () => (dispatch, getState) => {
  dispatch(requestProto("PROTO"));
  const interval = getState.interval;
  Api.druidTopQuery(interval, 10, "peer", "RX", [
    {
      type: "longSum",
      name: "RX",
      fieldName: "recv"
    }
  ]).then(data => dispatch(reciveProto(data)));
};

export const updateTopN = () => (dispatch, getState) => {
  dispatch(requestTop("FLOW"));
  const interval = getState.interval;
  Api.druidTopQuery(interval).then(data => dispatch(receiveTopN(data)));
};

export const updateTimeseries = () => (dispatch, getState) => {
  const interval = getState.interval;
  dispatch(requestFlow("FLOW"));
  Api.druidTimeseriesQuery(interval).then(data =>
    dispatch(receiveTimeseries(data))
  );
};

export const updateUsage = () => (dispatch, getState) => {
  const interval = getState.interval;
  dispatch(requestUsage("FLOW"));
  Api.druidTimeseriesQuery(interval, [
    {
      name: "TX",
      type: "longSum",
      fieldName: "sent"
    },
    {
      name: "RX",
      type: "longSum",
      fieldName: "recv"
    }
  ]).then(data => dispatch(reciveUsage(data)));
};

export const updateIntervalData = interval => dispatch => {
  dispatch(requestFlow("FLOW"));
  dispatch(requestTop("FLOW"));
  dispatch(requestUsage("TX"));

  dispatch(updateInterval(interval));
  Api.druidTimeseriesQuery(interval).then(data =>
    dispatch(receiveTimeseries(data))
  );
  Api.druidTopQuery(interval).then(data => dispatch(receiveTopN(data)));
  Api.druidTimeseriesQuery(interval, [
    {
      name: "TX",
      type: "longSum",
      fieldName: "sent"
    },
    {
      name: "RX",
      type: "longSum",
      fieldName: "recv"
    }
  ]).then(data => dispatch(reciveUsage(data)));
};
