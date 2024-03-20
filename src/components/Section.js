import React from "react";
import { Box, Button,Heading } from "grommet";
import { FormDown, FormNext } from "grommet-icons";
import SectionOptModal from "./SectionOptModal";

class Section extends React.Component {
  constructor(props) {
    super(props);
    const { open } = props;
    this.state = {
      show: open
    };
  }
  // <Box direction="row" align="center">
  render() {
    const { title, children } = this.props;
    const { show } = this.state;

    return (
      <Box elevation="none" pad="none" gap="xsmall">
        <Box
          pad="xsmall"
          gap="small"
          direction="row"
          justify="between"
          align="center"
          background={!show ? "dark-1" : null}
        >
          <Button
            icon={show ? <FormDown /> : <FormNext />}
            onClick={() => this.setState({ show: !show })}
            label={<Heading margin="small" level={3}>{title}</Heading>}
            plain
          />
          <SectionOptModal section={title} />
        </Box>
        {show ? children : null}
      </Box>
    );
  }
}
export default Section;
