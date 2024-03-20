import * as moment from "moment";

const parse = str => str.replace(/(\d+)([mhdwMy])(.*)/y, "$1:$2");

export const convertValueToInterval = value =>
  value.replace(/now(.*):now(.*)/, (m, sp, ep, o, s) => {
    let sp_time = moment.utc();
    if (sp.indexOf("-") > -1) {
      const [ts, tp] = parse(sp.substring(sp.indexOf("-") + 1)).split(":");
      sp_time.subtract(ts, tp);
    }
    if (sp.indexOf("/") > -1) {
      sp_time.startOf(sp.substring(sp.indexOf("/") + 1));
    }

    let ep_time = moment.utc();
    if (ep.indexOf("-") > -1) {
      const [ts, tp] = parse(ep.substring(ep.indexOf("-") + 1)).split(":");
      ep_time.subtract(ts, tp);
    }
    if (ep.indexOf("/") > -1) {
      ep_time.endOf(ep.substring(ep.indexOf("/") + 1));
    }
    return [sp_time.format(), ep_time.format()].join("/");
  });
