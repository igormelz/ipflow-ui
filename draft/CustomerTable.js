import React, { Component } from "react";
import { Box, DataTable, Text } from "grommet";
import { Spinning } from "grommet-controls";
import { updateTopN } from "../src/actions/OverviewDashboard";
import { numberFormatter, byteFormatter } from "../utils/druid";
import { connect } from "react-redux";

class CustomerTable extends Component {
  
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(updateTopN());
  }

  componentDidUpdate(prevProps) {
    const { interval, dispatch } = this.props;
    if (interval !== prevProps.interval) {
      dispatch(updateTopN());
    }
  }

  render() {
    const { isFetching, data } = this.props;
    return (
      <Box elevation="none" background="dark-1" gridArea="top" basis="300px">
        {isFetching && (
          <Box align="center" justify="center" fill={true}>
            <Spinning kind="chasing-dots" />
          </Box>
        )}
        {!isFetching && (
          <DataTable
            columns={[
              {
                property: "customer",
                header: "Top 10 Customers (by flows)",
                primary: true,
                render: datum => (
                  <Text truncate={true} a11yTitle="XXX">
                    {datum.customer}
                  </Text>
                ),
                search: false
              },
              {
                property: "flows",
                header: "Flows",
                render: datum => numberFormatter(datum.flows)
              },
              {
                property: "rx_bytes",
                header: "Recv",
                render: datum => byteFormatter(datum.rx_bytes)
              },
              {
                property: "tx_bytes",
                header: "Sent",
                render: datum => byteFormatter(datum.tx_bytes)
              }
            ]}
            data={data}
            sortable={true}
          />
        )}
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.druid.topN.data,
    isFetching: state.druid.topN.isFetching,
    interval: state.timer
  };
};

export default connect(mapStateToProps)(CustomerTable);
