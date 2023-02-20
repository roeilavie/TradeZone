import React, { useState } from 'react'
import { Box, TextField } from "@mui/material";
import { tokens } from "../theme";



export default function NumberTextField(props) {
    const colors = tokens();
    const [value, setValue] = useState(props.value);
  return (
    <Box backgroundColor={colors.primary[400]}>
          <TextField
            id="outlined-number"
            label={props.name}
            value={value}
            type="number"
            onChange={(e) => {
                props.handleChange(e.target.value, name);
                setValue(e.target.value);
              }}
          />
        </Box>
  )
}
