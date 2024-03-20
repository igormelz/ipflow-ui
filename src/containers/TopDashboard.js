import React from "react";
import { Box } from "grommet";
import FilterSelector from "../components/FilterSelector";
import TotalValues from "../components/TotalValues";
import Section from "../components/Section";
import RawValues from "../components/RawValues";
import GridTopN from "../components/GridTopN";
const TopDashboard = () => (
  <Box pad={{ vertical: "small", horizontal: "large" }} gap="small">
    <FilterSelector />
    <Section title="Totals" children={<TotalValues />} open={true} />
    <Section title="TopN" children={<GridTopN />} open={true} />
    <Section title="Top Raw" children={<RawValues />} />
  </Box>
);

export default TopDashboard;
