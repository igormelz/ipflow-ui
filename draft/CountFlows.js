import React from "react";
import { Box, Grid } from "grommet";
import ChartCard from "../src/components/ChartCard";
import CustomerTable from "../src/components/CustomerTable";
import { numberFormatter, byteFormatter} from "../utils/druid";
import { updateTimeseries, updateUsage } from "../src/actions/OverviewDashboard";
import FlowsDistribution from "../src/components/FlowsDistribution";
import PeerPie from "../src/components/PeerPie";

const CountFlows = () => (
  <Box fill="vertical" direction="column" gap="small">
    <Grid
      columns={["flex", "flex", "flex", "small"]}
      rows={["small", "medium", "flex"]}
      gap="small"
      areas={[
        // row 0
        {name: 'flow', start: [0,0], end:[0,0]},
        {name: 'usage', start: [1,0], end:[1,0]},
        {name: 'bar', start: [2,0], end:[2,0]},
        {name: 'count', start: [3,0], end:[3,0]},
        // row 1
        {name: 'distr', start: [0,1], end:[2,1]},
        {name: 'metr', start:[3,1], end:[3,2]},
        // row 2
        {name: 'top', start: [0,2], end:[2,2]},
      ]}
      fill={true}
    >
      <ChartCard gridArea="flow" dataSrc="timeseries" formatter={numberFormatter} updater={updateTimeseries}/>
      <ChartCard gridArea="usage" dataSrc="usage" formatter={byteFormatter} updater={updateUsage} />
      <PeerPie />
      <Box gridArea='count' background="dark-1" fill={true}/>
      <CustomerTable gridArea="top" />
      <FlowsDistribution gridArea='distr' />
      <Box gridArea='metr' background="dark-1" fill={true}/>
    </Grid>
  </Box>
);

export default CountFlows;
