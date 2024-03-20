import React, { Component } from "react";
import { Box } from "grommet";
import { LineChart, Spinning } from "grommet-controls";
import { connect } from "react-redux";
//import { updateTimeseries } from "../redux/druid/actions";
//import { numberFormatter, byteFormatter } from "../utils/druid";

class ChartCard extends Component {
  componentDidMount() {
    const { dispatch, updater } = this.props;
    dispatch(updater());
  }

  // componentDidUpdate(prevProps) {
  //   const { interval, dispatch } = this.props;
  //   if (interval !== prevProps.interval) {
  //     dispatch(updater());
  //   }
  // }

  render() {
    const { druid, dataSrc, formatter } = this.props;
    const isFetching = druid[dataSrc].isFetching;
    const data = druid[dataSrc].data;
    return (
      <Box elevation="none" background="dark-1">
          {isFetching && (
             <Box align="center" justify="center" fill={true}>
              <Spinning kind="chasing-dots" />
            </Box>
          )}
          {!isFetching && (
            <LineChart
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
                      type: "time"
                    }
                  ],
                  yAxes: [
                    {
                      ticks: {
                        callback: formatter
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
    druid: state.druid,
    interval: state.timer
    //data: state.druid[dataSrc].data,
    //isFetching: state.druid[dataSrc].isFetching
  };
};

export default connect(mapStateToProps)(ChartCard);
