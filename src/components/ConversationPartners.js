import React from "react";
import { connect } from "react-redux";
import { Box, DataTable } from "grommet";
import { Spinning } from "grommet-controls";
import { updateCPValues } from "../actions/convpartners";
import numeral from "numeral";

const byteFormatter = v => numeral(v).format("0.0 b");
const numberFormatter = v => numeral(v).format("0.0 a");

class ConversationPartners extends React.Component {
  
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(updateCPValues());
  }

  componentDidUpdate(prevProps) {
    const { interval, filters, dispatch } = this.props;
    if (interval !== prevProps.interval || filters !== prevProps.filters ) {
      dispatch(updateCPValues());
    }
  }

  render() {
    const { isFetching, data } = this.props;
    return (
      <Box elevation="none" background="dark-1" >
        {isFetching && (
          <Box align="center" justify="center" fill={true}>
            <Spinning kind="chasing-dots" />
          </Box>
        )}
        {!isFetching && (
          <DataTable
            columns={[
              {
                property: "customerIp",
                header: "Local",
                primary: true,
                // render: datum => (
                //   <Text truncate={true} a11yTitle="XXX">
                //     {datum.customer}
                //   </Text>
                // ),
                search: false
              },
              {
                property: "remoteIp",
                header: "Remote"
                //render: datum => byteFormatter(datum.recv)
              },
              {
                property: "recv",
                header: "Recv",
                render: datum => byteFormatter(datum.recv)
              },
              {
                property: "sent",
                header: "Sent",
                render: datum => byteFormatter(datum.sent)
              },
                                  {
                                    property: "pkts",
                                    header: "Pkts",
                                    render: datum => numberFormatter(datum.pkts)
                                  },
                                  {
                                    property: "sessions",
                                    header: "Sessions",
                                    render: datum => numberFormatter(datum.sessions)
                                  },
                                  {
                                    property: "flows",
                                    header: "Flows",
                                    render: datum => numberFormatter(datum.flows)
                                  },
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
    data: state.convpartner.rawdata,
    isFetching: state.convpartner.isFetching,
    interval: state.timer,
    filters: state.filters
  };
};

export default connect(mapStateToProps)(ConversationPartners);
