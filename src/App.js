import React, { Component } from "react";
import { Grommet, Box } from "grommet";
import { black } from "grommet-controls/themes";
import AppHeader from "./components/AppHeader";
import TopDashboard from "./containers/TopDashboard";

class App extends Component {
  render() {
    return (
      <Grommet theme={black} full>
        <Box style={{ height: "auto", minHeight: "100vh" }}>
          <AppHeader />
          <TopDashboard />
        </Box>
      </Grommet>
    );
  }
}

export default App;
