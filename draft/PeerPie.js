import React, { Component } from "react";
import { Box } from "grommet";
import { Spinning, DoughnutChart } from "grommet-controls";
import { updateProto } from "../src/actions/OverviewDashboard";
import { connect } from "react-redux";

class ProtoBar extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(updateProto());
  }

  componentDidUpdate(prevProps) {
    if (this.props.interval !== prevProps.interval) {
      const { dispatch } = this.props;
      dispatch(updateProto());
    }
  }

  render() {
    const { isFetching, data } = this.props;
    return (
      <Box elevation="none" background="dark-1" gridArea="bar">
        {isFetching && (
          <Box align="center" justify="center" fill={true}>
            <Spinning />
          </Box>
        )}
        {!isFetching && (
          <DoughnutChart
            data={data}
            options={{
              animation: {
                duration: 0
              },
              hover: {
                animationDuration: 0
              },
              legend: {
                display: true
              },
              themedData: true
            }}
          />
        )}
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.druid.proto.data,
    isFetching: state.druid.proto.isFetching,
    interval: state.timer
  };
};

export default connect(mapStateToProps)(ProtoBar);
