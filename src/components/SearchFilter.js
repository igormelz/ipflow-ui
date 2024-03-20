import React from "react";
import { connect } from "react-redux";
import { Text, Paragraph, Box, TextInput } from "grommet";
import { SearchAdvanced } from "grommet-icons";
import DruidQuery from "../utils/DruidQuery";
import * as Api from "../utils/api";
import { addSelectorFilter } from "../actions/filterselector";

const SEARCH_DIMENSIONS = ["customer", "login", "local_ip"];

class SearchFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      searchResults: undefined,
      open: undefined
    };
  }

  createSuggestions = () => {
    const { searchResults } = this.state;
    const suggestions = [];
    if (searchResults) {
      searchResults.forEach(p => {
        suggestions.push({
          label: (
            <Box fill="horizontal" pad="xsmall">
              <Box direction="row" justify="between">
                <Text size="small">
                  <strong>{p.dimension}</strong>
                </Text>
                <Box>
                  <Text size="small">{p.count}</Text>
                </Box>
              </Box>
              <Paragraph size="small" margin="none">
                {p.value}
              </Paragraph>
            </Box>
          ),
          value: {
            type: "selector",
            dimension: p.dimension,
            value: p.value
          }
        });
      });
    }
    return suggestions;
  };

  onSearch = ({ target }) => {
    this.setState({ search: target.value });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (target.value) {
      const { interval, filters } = this.props;
      const json = new DruidQuery.Builder("dpi")
        .withQueryType("search")
        .withIntervals(interval)
        .withFilter(filters)
        .withLimit(10)
        .withSearchDimensions(SEARCH_DIMENSIONS)
        .withQuery(target.value)
        .build();

      this.timeout = setTimeout(() => {
        Api.postDruidQuery(json).then(data => {
          this.setState({ searchResults: data[0].result });
        });
      }, 1000);
    } else {
      this.setState({ searchResults: undefined });
    }
  };

  onSelect = ({ suggestion }) => {
    const { dispatch } = this.props;
    dispatch(addSelectorFilter(suggestion.value));
    this.setState({ search: "", searchResults: undefined, open: false });
  };

  // <DropButton
  //   plain={true}
  //   icon={<SearchAdvanced />}
  //   open={open}
  //   onClick={() => this.setState({ open: !open })}
  //   dropContent={
  render() {
    const { search, focus } = this.state;
    return (
      <Box direction="row" align="center" size="small" 
      border={{ side: 'bottom', color: focus ? 'focus' : 'border' }} >
        <SearchAdvanced />
        <TextInput
          value={search}
          dropHeight="medium"
          placeholder="Filter customer, vlan, ipaddr, ..."
          plain={true}
          dropAlign={{ top: "bottom", right: "right" }}
          onChange={this.onSearch}
          onSelect={this.onSelect}
          suggestions={this.createSuggestions()}
          onFocus={() => this.setState({ focus: true })}
          onBlur={() => this.setState({ focus: false })}
        />
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    filters: state.filters,
    interval: state.timer.interval
  };
};

export default connect(mapStateToProps)(SearchFilter);
