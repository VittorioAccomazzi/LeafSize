import { InputBaseComponentProps, TextField, Box } from '@mui/material';
import React, { ForwardedRef } from 'react';


// see https://stackoverflow.com/questions/55032966/how-can-i-imitate-the-look-of-the-outline-and-label-from-material-uis-outlined

interface OutlineProps {
    label : string,
    children : React.ReactNode;
}

const InputComponent = React.forwardRef((props: InputBaseComponentProps, ref: ForwardedRef<typeof Box>) => (
    //@ts-ignore -- unfortunateky this is necessary because the box component is not really an input component.
    <Box ref={ref} {...props} /> 
  )); 

export default function Outline({label, children} : OutlineProps ) {
    return (
        <TextField
          variant="outlined"
          label={label}
          multiline
          InputLabelProps={{ shrink: true }}
          InputProps={{
            inputComponent: InputComponent
          }}
          inputProps={{ children: children }}
        />
      );
}