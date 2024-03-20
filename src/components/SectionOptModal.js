import React from "react";
import { connect } from "react-redux";
import { Box, Layer, Button, Heading, CheckBox } from "grommet";
import { IconButton } from "grommet-controls";
import { ChapterAdd, Close } from "grommet-icons";
import { addQuery, removeQuery } from "../actions/query";

/*
                <Box
                  key={label}
                  direction="row"
                  align="center"
                  justify="between"
                  pad="small"
                >
                  <Text>{label}</Text>
                  */

class SectionOptModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  onClickBtn() {
    // const { interval, filters } = this.props;
    // const json = new DruidQuery.Builder("netflow")
    //   .withQueryType("scan")
    //   .withIntervals(interval)
    //   .withFilter(filters)
    //   .withLimit(30)
    //   .build();

    // let mydata = [];
    // Api.druidQuery(json).then(data => {
    //   data.forEach(segment => {
    //     segment.events.forEach(event => {
    //       mydata.push(event);
    //     });
    //   });
    this.setState({ showModal: true });
  }

  onChange(label, target) {
    const { dispatch } = this.props;
    if (target.checked) {
      dispatch(addQuery({ id: label, dimension: label }));
    } else {
      dispatch(removeQuery(label));
    }
  }

  render() {
    const { showModal } = this.state;
    const { section, queries } = this.props;

    let layerNode;
    if (showModal) {
      const onClose = () => this.setState({ showModal: false, mydata: [] });
      layerNode = (
        <Layer
          onEsc={onClose}
          onClickOutside={onClose}
          full="vertical"
          modal={true}
          position="right"
        >
          <Box fill="vertical" pad="small">
            <Box
              direction="row"
              align="center"
              justify="between"
              border="bottom"
            >
              <Heading level={3}>{`${section} Options`}</Heading>
              <Button icon={<Close />} onClick={onClose} />
            </Box>

            {[
              "customer",
              "direction",
              "vlan",
              "proto",
              "downlink",
              "uplink",
              "local_ip",
              "local_port",
              "remote_ip",
              "remote_port"
            ].map((label, index) => (
              <Box key={index} pad="xsmall">
                <CheckBox
                  label={label}
                  checked={
                    queries.find(q => q.dimension === label) !== undefined
                  }
                  toggle
                  onChange={({ target }) => this.onChange(label, target)}
                />
              </Box>
            ))}
          </Box>
        </Layer>
      );
    }

    return (
      <Box>
        <IconButton icon={<ChapterAdd />} onClick={() => this.onClickBtn()} />
        {layerNode}
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    filters: state.filters,
    queries: state.queries
  };
};

export default connect(mapStateToProps)(SectionOptModal);
