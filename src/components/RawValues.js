import React from "react";
import { connect } from "react-redux";
import { Grid, Table, TableHeaderRow } from "dx-react-grid-grommet";
import {
  DataTypeProvider,
  IntegratedSorting,
  SortingState
} from "@devexpress/dx-react-grid";
import { Box, Text } from "grommet";
import { Spinning } from "grommet-controls";
import { updateRawValues } from "../actions/rawvalues";
import moment from "moment";
import numeral from "numeral";

const DateFormatter = ({ value }) => moment(value).format("HH:mm:ss");

const DateTypeProvider = props => (
  <DataTypeProvider formatterComponent={DateFormatter} {...props} />
);

const ByteFormatter = ({ value }) => numeral(value).format("0.00 b");

const ByteTypeProvider = props => (
  <DataTypeProvider formatterComponent={ByteFormatter} {...props} />
);

const TableHeaderContent = ({ column, children, ...rest }) => (
  <TableHeaderRow.Content column={column} {...rest}>
    <Text size="small" color="accent-2" weight="bold">
      {children}
    </Text>
  </TableHeaderRow.Content>
);

class RawValues extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sorting: [{ columnName: "__time", direction: "desc" }],
      columns: [
        {
          name: "__time",
          title: "time"
        },
        {
          name: "customer",
          title: "Customer"
          //getCellValue: row => String(row.customer).replace(/^(.{32}).+$/, "$1...")
        },
        //{ name: "vlan", title: "VlanID" },
        { name: "proto", title: "Proto" },
        //{ name: "service", title: "Apps" },
        {
          name: "local_ip",
          title: "Local",
          //getCellValue: row => row.localIp + ":" + row.localPort
        },
        {
          name: "remote_ip",
          title: "Remote",
          //getCellValue: row => row.remoteIp + ":" + row.remotePort
        },
        {
          name: "direction",
          title: "Direction"
          //getCellValue: row => String(row.asname).replace(/^(.{32}).+$/, "$1...")
        },
        { name: "count", title: "Count" },
        { name: "sum_bytes", title: "Bytes" }
      ]
    };
    this.changeSorting = sorting => this.setState({ sorting });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(updateRawValues());
  }

  componentDidUpdate(prevProps) {
    const { filters, interval, dispatch } = this.props;
    if (interval !== prevProps.interval || filters !== prevProps.filters) {
      dispatch(updateRawValues());
    }
  }

  render() {
    const { rawdata, isFetching, filters } = this.props;
    const { sorting, columns } = this.state;
    const filteredColumns = columns.filter(
       c => !filters.find(f => f.dimension === c.name)
    );

    return (
      <Box background="dark-1">
        <Grid columns={filteredColumns} rows={rawdata}>
          <DateTypeProvider for={["__time"]} />
          <ByteTypeProvider for={["sent", "recv"]} />
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <IntegratedSorting />
          <Table
            columnExtensions={[
              { columnName: "customer", width: 250, wordWrapEnabled: true },
              { columnName: "asname", width: 250, wordWrapEnabled: true },
              { columnName: "remoteIp", width: 200 },
              { columnName: "customerIp", width: 200 },

            ]}
          />
          <TableHeaderRow
            showSortingControls
            titleComponent={TableHeaderContent}
          />
        </Grid>
        {isFetching && <Spinning />}
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    interval: state.timer.interval,
    filters: state.filters,
    rawdata: state.scan.rawdata,
    isFetching: state.scan.isFetching
  };
};

export default connect(mapStateToProps)(RawValues);
