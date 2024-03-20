import React, { Component } from "react";
import { Box, Text } from "grommet";
import { Spinning, HorizontalBarChart } from "grommet-controls";
import { updateProto } from "../redux/druid/actions";
import { numberFormatter, byteFormatter } from "../utils/druid";
import { connect } from "react-redux";

class ProtoBar extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(updateProto());
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
          <HorizontalBarChart
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
              scales: {
                xAxes: [
                  {
                    ticks: {
                      callback: numberFormatter
                    }
                  }
                ]
              }
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
    isFetching: state.druid.proto.isFetching
  };
};

export default connect(mapStateToProps)(ProtoBar);
