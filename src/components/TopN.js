import React, { Component } from "react";
import {
  Box,
  Text,
  Select,
  DropButton,
  Button,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  Meter
} from "grommet";
import { Spinning } from "grommet-controls";
import { connect } from "react-redux";

import { updateQuery } from "../actions/query";
import {
  addSelectorFilter,
  clearDimensionFiltres
} from "../actions/filterselector";

import numeral from "numeral";

const METRICS = ["count", "bytes"];
const fmt = data => (Array.isArray(data) && data.length > 0 ? data[0].result : []);
const formatMetricValue = (r, m) =>
  m === "bytes" || m === "sent"
    ? numeral(r[m]).format("0.0 b")
    : numeral(r[m]).format("0.0 a");

class TopN extends Component {
  onAddFilter = selected => {
    const { dispatch } = this.props;
    dispatch(addSelectorFilter(selected));
  };

  clearFilters = dimension => {
    const { dispatch } = this.props;
    dispatch(clearDimensionFiltres(dimension));
  };

  onChangeMetric = selected => {
    const { dispatch, query, interval, filters } = this.props;
    dispatch(updateQuery(query, interval, filters, selected));
  };

  componentDidMount() {
    const { dispatch, query, interval, filters, totalMetric } = this.props;
    dispatch(updateQuery(query, interval, filters, totalMetric));
  }

  componentDidUpdate(prevProps) {
    const { filters, interval, dispatch, query, totalMetric } = this.props;
    if (
      interval !== prevProps.interval ||
      filters !== prevProps.filters ||
      totalMetric !== prevProps.totalMetric
    ) {
      dispatch(updateQuery(query, interval, filters, totalMetric));
    }
  }

  render() {
    const { query, totalValues } = this.props;

    // draw Dimension as Header
    // const drawDimHeader = (
    //   <Box direction="row" gap="xsmall">
    //     <Text color="accent-2" weight="bold">
    //       {query.dimension}
    //     </Text>
    //     {filters.find(f => f.dimension === query.dimension) && (
    //       <Button
    //         label={<Text size="small">clear filter</Text>}
    //         primary
    //         color={{ color: "neutral-2", opacity: "medium" }}
    //         onClick={() => this.clearFilters(query.dimension)}
    //         plain
    //       />
    //     )}
    //   </Box>
    // );

    // draw Metric as Header
    const drawMetricBtn = (
      <Select
        alignSelf="end"
        plain={true}
        options={METRICS}
        valueLabel={
          <Text color="accent-2" weight="bold">
            {query.metric}
          </Text>
        }
        onChange={({ value }) => this.onChangeMetric(value)}
      />
    );

    // draw Dimension value
    const drawDimValue = (r, dimension, metric) => (
      <Box pad="none" margin="none">
        <DropButton
          label={String(r[dimension]).replace(/^(.{32}).+$/, "$1...")}
          plain={true}
          size="small"
          dropAlign={{ top: "bottom", right: "right" }}
          dropContent={
            <Box direction="column" pad="small" gap="small" size="small">
              <Button
                plain={true}
                label={
                  <Text color="accent-3" size="small">
                    Filter Is ...
                  </Text>
                }
                onClick={() =>
                  this.onAddFilter({
                    type: "selector",
                    dimension: dimension,
                    value: r[dimension]
                  })
                }
              />
              <Button
                plain={true}
                label={
                  <Text color="accent-4" size="small">
                    Filter Is Not ...
                  </Text>
                }
                onClick={() =>
                  this.onAddFilter({
                    type: "not",
                    dimension: dimension,
                    value: r[dimension]
                  })
                }
              />
            </Box>
          }
        />
        {drawMetricValue(r, metric)}
      </Box>
    );

    // draw MetricPercent
    //const drawMetricPercent = (r, m) => ((r[m] / raw) * 100).toFixed(3);
    const drawMetricValue = (r, m) => {
      const tv = totalValues.find(v => v.metric === m);
      if (tv && Number.isInteger(tv.raw)) {
        // console.log(r[m]+':'+tv.raw);
        //Number((r[m] / tv.raw) * 100).toFixed(0)
        const v1 = numeral(r[m])
          .divide(tv.raw)
          .multiply(100);
        const vvv = [{ value: v1.value(), label: "metric" }];
        return (
          <Meter type="bar" thickness="xsmall" size="small" values={vvv} />
        );
      }
    };

    return (
      <Box background="dark-1">
        {query.isFetching && (
          <Box align="center">
            <Spinning kind="chasing-dots" />
          </Box>
        )}
        {!query.isFetching && !query.isSuccess && (
          <Box align="center" pad="medium" background="dark-1">
            <Text color="status-error">Error response: {query.message}</Text>
          </Box>
        )}
        {!query.isFetching && query.isSuccess && (
          <Table margin="none" caption="Top10">
            <TableHeader>
              <TableRow>
                <TableCell scope="col" border="bottom">
                  <Text color="accent-2" weight="bold">
                    {query.dimension}
                  </Text>
                </TableCell>
                <TableCell scope="col" border="bottom" align="end">
                  {drawMetricBtn}
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fmt(query.data).map((r, i) => (
                <TableRow key={i}>
                  <TableCell scope="row">
                    {drawDimValue(r, query.dimension, query.metric)}
                  </TableCell>
                  <TableCell align="end">
                    {formatMetricValue(r, query.metric)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  timepicker: state.timer.timepicker,
  interval: state.timer.interval,
  filters: state.filters,
  totalMetric: state.totals.metric,
  totalValues: state.totals.values
});

export default connect(mapStateToProps)(TopN);
