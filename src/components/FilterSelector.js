import React, { Component } from "react";
import { Tags } from "grommet-controls";
import { connect } from "react-redux";
import { removeSelectorFilter } from "../actions/filterselector";

class FilterSelector extends Component {
  onRemovePackage = selected => {
    const { dispatch } = this.props;
    dispatch(removeSelectorFilter(selected.f));
  };

  render() {
    const { filters } = this.props;
    const tags = filters
      ? filters.map((f, i) =>
          f.type === "selector"
            ? {
                label:
                  f.dimension +
                  " = " +
                  String(f.value).replace(/^(.{40}).+$/, "$1..."),
                color: "accent-3",
                f: f
              }
            : {
                label:
                  f.dimension +
                  " != " +
                  String(f.value).replace(/^(.{40}).+$/, "$1..."),
                color: "accent-4",
                f: f
              }
        )
      : [];
    return (
      <Tags
        pad="xsmall"
        margin="none"
        placeholder="Filters ..."
        value={tags}
        onChange={({ option }) => this.onRemovePackage(option)}
        tagProps={{
          size: "small",
          background: "dark-1",
          pad: "xsmall",
          round: "small"
        }}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    filters: state.filters
  };
};

export default connect(mapStateToProps)(FilterSelector);
