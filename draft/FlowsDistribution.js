import React, { Component } from "react";
import { Box, Distribution } from "grommet";
import { Spinning, Value } from "grommet-controls";
import { colorFromIndex } from "grommet-controls/utils/colors";
import { connect } from "react-redux";
import { byteFormatter } from "../utils/druid";

class FlowsDistribution extends Component {
  render() {
    const { isFetching, data, gridArea } = this.props;
    const values = data => {
      const items = [];
      //for (let i = 0; i < data.length; i++) {
      data.forEach((d, index) => {
        items.push({
          name: d.customer,
          value: d.rx_bytes,
          color: colorFromIndex(index),
        });
      });
      return items.sort((a, b) => b.value - a.value);
    };

    return (
      <Box elevation="none" background="dark-1" gridArea={gridArea}>
        {isFetching && (
          <Box align="center" justify="center" fill={true}>
            <Spinning />
          </Box>
        )}
        {!isFetching && (
          <Distribution
            values={values(data)}
            basis="medium"
            style={{ height: "100%" }}
            fill={true}
          >
            {item => (
              <Box
                background={item.color}
                border="all"
                fill={true}
                align="center"
              >
                <Box direction="row" align="center" fill="vertical">
                  <Value
                    value={byteFormatter(item.value)}
                    size="small"
                    gap={null}
                    label={item.name}
                  />
                </Box>
              </Box>
            )}
          </Distribution>
        )}
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.druid.topN.data,
    isFetching: state.druid.topN.isFetching
  };
};

export default connect(mapStateToProps)(FlowsDistribution);
