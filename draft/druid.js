import moment from "moment";
import numeral from "numeral";

//const dev = process.env.NODE_ENV !== "production";
//const DRUID_API = (dev) ? "/druid/v2": "http://10.200.0.62:8082/druid/v2/";
const DRUID_API = "/druid/v2/";

export const formatTimeseriesDatasets = (
  json,
  agg = [{ name: "TX" }, { name: "RX" }]
) => {
  const datasets = agg.map(a => {
    return {
      label: a.name,
      borderWidth: 1,
      pointRadius: 2,
      data: [],
      fill: true
    };
  });

  for (let i = 0; i < json.length; i++) {
    for (let l = 0; l < agg.length; l++) {
      datasets[l].data.push({
        x: new Date(json[i].timestamp).getTime(),
        y: json[i].result[agg[l].name]
      });
    }
  }
  return {
    datasets
  };
};


export const formatTopNDatasets = (
  json,
  agg = [{ name: "TX" }, { name: "RX" }],
  label = "protocol"
) => {
  const labels = [];
  const datasets = agg.map(a => {
    return {
      label: a.name,
      borderWidth: 1,
      data: [],
      fill: true
    };
  });

  for (let i = 0; i < json.length; i++) {
    const entry = json[i];
    labels.push(entry[label]);
    for (let l = 0; l < agg.length; l++) {
      datasets[l].data.push(entry[agg[l].name]);
    }
  }
  return {
    labels: labels, 
    datasets: datasets,
  };
};

// call druid api
const druidQuery = query =>
  fetch(DRUID_API, {
    method: "POST",
    body: JSON.stringify(query),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .catch(error => console.error(error));

export const druidTimeseriesQuery = async (
  t = "hour",
  agg = [
    {
      name: "CountFlows",
      type: "count"
    }
  ]
) => {
  const query = {
    queryType: "timeseries",
    dataSource: "netflow",
    intervals: [
      moment
        .utc()
        .subtract(1, t)
        .format() +
        "/" +
        moment.utc().format()
    ],
    // filter: {
    //   type: "selector",
    //   dimension: "vlan",
    //   value: "111"
    // },
    granularity: {
      type: "period",
      period: t === "day" ? "PT15M" : t === "week" ? "PT1H" : "PT5M",
      timeZone: "Etc/UTC"
    },
    aggregations: agg
  };
  const result = await druidQuery(query);
  return formatTimeseriesDatasets(result, agg);
};

export const druidTopQuery = async (
  t = "hour",
  n = 10,
  d = "customer",
  m = "flows",
  agg = [
    {
      type: "count",
      name: "flows",
      fieldName: "flows"
    },
    {
      type: "longSum",
      name: "tx_bytes",
      fieldName: "sent"
    },
    {
      type: "longSum",
      name: "rx_bytes",
      fieldName: "recv"
    }
  ]
) => {
  const query = {
    queryType: "topN",
    dataSource: "netflow",
    intervals: [
      moment
        .utc()
        .subtract(1, t)
        .format() +
        "/" +
        moment.utc().format()
    ],
    dimension: d,
    threshold: n,
    metric: m,
    granularity: "all",
    aggregations: agg
  };
  const json = await druidQuery(query);
  return json[0].result;
};

export const numberFormatter = (value, index, values) => {
  return numeral(value).format("0.0a");
};

export const byteFormatter = b => {
  return numeral(b).format("0.00 b");
};

export const smallDate = (t = 0) => {
  return t === 0
    ? moment().format("MM/DD/YYYY")
    : moment()
        .subtract(t, "day")
        .format("MM/DD/YYYY");
};
