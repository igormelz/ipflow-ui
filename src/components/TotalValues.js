import React from "react";
import { Box, Text } from "grommet";

import { Spinning } from "grommet-controls";
import { connect } from "react-redux";
import { updateTotalValues, setTotalMetric } from "../actions/totalvalues";

import TotalValue from "./TotalValue";

class TotalValues extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(updateTotalValues());
  }

  componentDidUpdate(prevProps) {
    const { filters, interval, dispatch } = this.props;
    if (interval !== prevProps.interval || filters !== prevProps.filters) {
      dispatch(updateTotalValues());
    }
  }

  onChangeMetric(newMetric) {
    const { dispatch, metric } = this.props;
    if (newMetric !== metric) {
      dispatch(setTotalMetric(newMetric));
    }
  }

  render() {
    const {
      isFetching,
      isSuccess,
      message,
      values,
      metric
    } = this.props.totals;

    return (
      <Box>
        {isFetching && (
          <Box align="center">
            <Spinning kind="chasing-dots" />
          </Box>
        )}
        {!isFetching && !isSuccess && (
          <Box align="center" pad="medium" background="dark-1">
            <Text color="status-error">Error response: {message}</Text>
          </Box>
        )}
        {!isFetching && isSuccess && (
          <Box direction="row" gap="small">
            {values.map((v, i) => (
              <TotalValue
                key={`totalvalue-${i}`}
                label={v.label}
                value={v.value}
                index={i}
                active={v.metric === metric}
                onclick={() => this.onChangeMetric(v.metric)}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    totals: state.totals,
    filters: state.filters,
    interval: state.timer.interval
  };
};

export default connect(mapStateToProps)(TotalValues);
