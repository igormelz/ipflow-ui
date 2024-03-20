//const dev = process.env.NODE_ENV !== "production";
// const DRUID_API = "http://10.200.0.62:8082/druid/v2/";
const DRUID_API = "/druid/v2/";

export const AGGREGATIONS = [
  //{ type: "cardinality", name: "customer", fields: ["customer"], round: true },
  { type: "count", name: "count", fieldName: "count" },
  { type: "longSum", name: "bytes_in", fieldName: "sum_bytes_in" },
  { type: "longSum", name: "bytes_out", fieldName: "sum_bytes_out" },
  //{ type: "cardinality", name: "remoteIp", fields: ["remoteIp"], round: true },
  //{ type: "cardinality", name: "customerIp", fields: ["customerIp"], round: true }
];

// post druid query
export const postDruidQuery = async query =>
  fetch(DRUID_API, {
    method: "POST",
    body: query,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .catch(error => console.error(error));
