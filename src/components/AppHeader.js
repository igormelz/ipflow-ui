import React from "react";
import { Heading } from "grommet";
import { Header } from "grommet-controls";
import TimePicker from "./TimePicker";

const AppHeader = () => (
  <Header position="relative" elevation="none" pad="small">
    <Heading level="4" margin="none" size="small">
      openfs netflow
    </Heading>
    <TimePicker />
  </Header>
);
export default AppHeader;
