import * as Api from "../utils/api";
import DruidQuery from "../utils/DruidQuery";

export const RAWVALUES_START = "RAW_VALUES_START";
export const RAWVALUES_SUCCESS = "RAW_VALUES_SUCCESS";

const startRawValuesQuery = () => ({
  type: RAWVALUES_START
});

const successRawValuesQuery = data => ({
  type: RAWVALUES_SUCCESS,
  data
});


export const updateRawValues = () => (dispatch, getState) => {
  dispatch(startRawValuesQuery());

  const interval = getState().timer.interval;
  const filters = getState().filters;

  const json = new DruidQuery.Builder("dpi")
    .withQueryType("scan")
    .withIntervals(interval)
    .withFilter(filters)
    .withLimit(30)
    .build();

  let mydata = [];
  Api.postDruidQuery(json).then(data => {
    data.forEach(segment => {
      segment.events.forEach(event => {
        mydata.push(event);
      });
    });  
    dispatch(successRawValuesQuery(mydata));
  });
};
