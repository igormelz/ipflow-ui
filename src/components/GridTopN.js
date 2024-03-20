import React from "react";
import { Grid } from "grommet";
import { connect } from "react-redux";
import TopN from "./TopN";

class GridTopN extends React.Component {
  render() {
    const { queries } = this.props;

    return (
      <Grid columns="medium" gap="small" basis="medium">
        {queries
          // .filter(
          //   q =>
          //     !filters.find(f => f.dimension === q.dimension) ||
          //     q.data[0].result.length !== 1
          // )
          .map(q => (
            <TopN key={q.queryId} query={q} />
          ))}
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    queries: state.queries,
    //filters: state.filters
  };
};

export default connect(mapStateToProps)(GridTopN);
