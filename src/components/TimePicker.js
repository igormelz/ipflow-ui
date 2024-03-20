import React, { Component } from "react";
import { connect } from "react-redux";
import { Box, DropButton, Button, Text, Heading, Calendar } from "grommet";
import { MaskedInput } from "grommet-controls";
import * as Icons from "grommet-icons";
import { setInterval } from "../actions/timepicker";
import { convertValueToInterval } from "../utils/timeUtils";
import * as moment from "moment";
import SearchFilter from "./SearchFilter";

const timeRange = [
  [
    { label: "Last 2 days", value: "now-2d:now" },
    { label: "Last 7 days", value: "now-7d:now" },
    { label: "Last 30 days", value: "now-30d:now" },
    { label: "Last 90 days", value: "now-90d:now" },
    { label: "Last 6 months", value: "now-6M:now" },
    { label: "Last 1 year", value: "now-1y:now" },
    { label: "Last 2 years", value: "now-2y:now" },
    { label: "Last 5 years", value: "now-5y:now" }
  ],
  [
    { label: "Yesterday", value: "now-1d/d:now-1d/d" },
    { label: "Day before yesterday", value: "now-2d/d:now-2d/d" },
    { label: "This day last week", value: "now-7d/d:now-7d/d" },
    { label: "Previous week", value: "now-1w/w:now-1w/w" },
    { label: "Previous month", value: "now-1M/M:now-1M/M" },
    { label: "Previous year", value: "now-1y/y:now-1y/y" }
  ],
  [
    { label: "Today", value: "now/d:now/d" },
    { label: "Today so far", value: "now/d:now" },
    { label: "This week", value: "now/w:now/w" },
    { label: "This week so far", value: "now/w:now" },
    { label: "This month", value: "now/M:now/M" },
    { label: "This month so far", value: "now/M:now" },
    { label: "This year", value: "now/y:now/y" },
    { label: "This year so far", value: "now/y:now" }
  ],
  [
    { label: "Past 5 minutes", value: "now-5m:now" },
    { label: "Past 15 minutes", value: "now-15m:now" },
    { label: "Past 30 minutes", value: "now-30m:now" },
    { label: "Past 1 hour", value: "now-1h:now" },
    { label: "Past 3 hours", value: "now-3h:now" },
    { label: "Past 6 hours", value: "now-6h:now" },
    { label: "Past 12 hours", value: "now-12h:now" },
    { label: "Past 24 hours", value: "now-24h:now" }
  ]
];

class TimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTime: undefined,
      fromISOString: props.interval.split("/")[0],
      toISOString: props.interval.split("/")[1],
      fromLabel: props.timepicker.split(":")[0],
      toLabel: props.timepicker.split(":")[1]
    };
    this.refreshData = this.refreshData.bind(this);
  }

  changeInterval(selectedInterval) {
    const { dispatch } = this.props;
    const timeinterval = convertValueToInterval(selectedInterval.value);
    this.setState({
      showTime: false,
      fromISOString: timeinterval.split("/")[0],
      toISOString: timeinterval.split("/")[1]
    });
    dispatch(
      setInterval({
        timepicker: selectedInterval.value,
        interval: timeinterval
      })
    );
  }

  refreshData(e) {
    e.preventDefault();
    const { timepicker, dispatch } = this.props;
    dispatch(setInterval({timepicker: timepicker, interval: convertValueToInterval(timepicker)}));
  }

  fromSelected(isoDate) {
    const tm = moment(isoDate)
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    this.setState({ fromISOString: tm, fromLabel: tm });
  }

  toSelected(isoDate) {
    const tm = moment(isoDate)
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    this.setState({ toISOString: tm, toLabel: tm });
  }

  render() {
    const {
      showTime,
      fromISOString,
      fromLabel,
      toISOString,
      toLabel
    } = this.state;
    const { timepicker } = this.props;

    let intervalLabel = timepicker;
    timeRange.forEach(tr => {
      tr.forEach(r => {
        if (r.value === intervalLabel) {
          intervalLabel = r.label;
        }
      });
    });

    const drawTimeRange = index => (
      <Box>
        {timeRange[index].map(item => (
          <Button
            plain
            key={item.value}
            onClick={() => this.changeInterval(item)}
            label={
              intervalLabel === item.label ? (
                <Text size="small" color="accent-2">
                  {item.label}
                </Text>
              ) : (
                <Text size="small">
                  {item.label}
                </Text>
              )
            }
          />
        ))}
      </Box>
    );

    return (
      <Box
        direction="row"
        align="center"
        justify="end"
        gap="small"
        tag="nav"
        margin="none"
        size="small"
      >
        <SearchFilter />

        <DropButton
          icon={<Icons.Clock />}
          label={intervalLabel}
          plain={true}
          open={showTime}
          onClick={() => this.setState({ showTime: !showTime })}
          hoverIndicator={true}
          dropAlign={{ top: "bottom", right: "right" }}
          dropContent={
            <Box direction="row" justify="between" pad="small" gap="medium">
              <Box gap="xsmall" align="start" direction="column">
                <Heading level="4" margin="none" size="small">
                  Custom range
                </Heading>
                <Text size="small">From:</Text>
                <MaskedInput
                  value={fromLabel}
                  dropIcon={<Icons.Calendar />}
                  dropContent={
                    <Box pad="small">
                      <Calendar
                        firstDayOfWeek={1}
                        animate={false}
                        locale="ru-RU"
                        size="small"
                        date={fromISOString}
                        onSelect={isoDate => this.fromSelected(isoDate)}
                      />
                    </Box>
                  }
                />
                <Text size="small">To:</Text>
                <MaskedInput
                  value={toLabel}
                  dropIcon={<Icons.Calendar />}
                  dropContent={
                    <Box pad="small">
                      <Calendar
                        size="small"
                        date={toISOString}
                        onSelect={isoDate => this.toSelected(isoDate)}
                      />
                    </Box>
                  }
                />
              </Box>
              <Box gap="xsmall" align="start" direction="column">
                <Heading level="4" margin="none" size="small">
                  Quick ranges
                </Heading>
                <Box direction="row" gap="medium">
                  {drawTimeRange(0)}
                  {drawTimeRange(1)}
                  {drawTimeRange(2)}
                  {drawTimeRange(3)}
                </Box>
              </Box>
            </Box>
          }
        />
        <Button
          icon={<Icons.Refresh />}
          onClick={this.refreshData}
          hoverIndicator={true}
        />
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    interval: state.timer.interval,
    timepicker: state.timer.timepicker
  };
};

export default connect(mapStateToProps)(TimePicker);
