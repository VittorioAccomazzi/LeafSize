import { FormLabel, Stack, SvgIconProps } from "@mui/material";

interface ResultValueProp {
    label : string,
    value : number,
    Icon :  React.ComponentType<SvgIconProps>
}

export default function ResultValue({label, value, Icon } : ResultValueProp) {
    return (
        <Stack direction='row' alignItems='center'> <Icon/> <FormLabel>  {label} <b>{value}</b></FormLabel></Stack>
    )
} 