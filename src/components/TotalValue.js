import React from "react";
import { Text, Box, Button } from "grommet";
import { Value } from "grommet-controls";
import { Descend, Sort } from "grommet-icons";
import { colorFromIndex } from "grommet-controls/utils";

const TotalValue = ({ label, value, index, active, onclick }) => (
  <Box flex="grow" background={active ? {color:"brand",opacity:'medium'} : "dark-1"}>
    <Button onClick={onclick}>
      <Box
        direction="row"
        pad="small"
        gap="medium"
        align="center"
        justify="between"
      >
        {active ? <Descend /> : <Sort />}
        <Value
          color={colorFromIndex(index + 1)}
          size="xxlarge"
          value={value}
          label={<Text>{label}</Text>}
        />
      </Box>
    </Button>
  </Box>
);

export default TotalValue;
