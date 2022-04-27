import { Stack, FormLabel, Radio } from "@mui/material"

export interface OptionsListProp {
    imgSrc1 : string,
    imgSrc2 : string,
    label1 : string,
    label2 : string,
    selected1 : boolean,
    selected2 : boolean,
    click1 : () => void,
    click2 : () => void,
    title : string,
}

export default function OptionsList( props : OptionsListProp) {
    return (
        <Stack spacing={0} textAlign="left">
            <FormLabel>{props.title}</FormLabel>
            <HorizontalAlign imgSrc={props.imgSrc1} label={props.label1} selected={props.selected1} onClick={props.click1}/> 
            <HorizontalAlign imgSrc={props.imgSrc2} label={props.label2} selected={props.selected2} onClick={props.click2}/>
        </Stack>
    )
}

interface HorizontalAlignProp {
    imgSrc : string,
    label : string,
    selected : boolean,
    onClick : ()=>void 
}
function HorizontalAlign( {imgSrc, label, selected, onClick }: HorizontalAlignProp) {
    return (
        <Stack spacing={1} direction="row" alignItems="center" paddingRight={2}>
            <Radio checked={selected} onClick={onClick}/> 
            <img src={imgSrc} height="32px" />
            <FormLabel>{label}</FormLabel>
        </Stack>
    )
}