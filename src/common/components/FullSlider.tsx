import { Stack, FormLabel, Button, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import './FullSlider.css'

interface FullSliderProp {
    label : string,
    values : string [],
    disabled : boolean,
    defaultIndex? : number,
    onChange : (index : number, value : string )=>void 
    inverted? : boolean
}

export default function FullSlider( { label, values, disabled, defaultIndex =0, onChange: onChanged, inverted = false } : FullSliderProp){
    const [imageNum, setImageNum] = useState<number>(0);

    const handleSliderChange = (event: Event, newValue: number | number []) => {
        const index = newValue as number;
        setImageNum(index );
      };

    // invoke callback when the index changes
    useEffect(()=>{onChanged(imageNum,values[imageNum])},[imageNum]); // eslint-disable-line  react-hooks/exhaustive-deps

    // in case the value array changes, reset the index
    useEffect(()=>setImageNum(0),[setImageNum,values]);

    // set default index
    useEffect(()=>{if( defaultIndex > 0 ) setImageNum(defaultIndex) },[defaultIndex,setImageNum])

    return (
        <Stack direction='row' alignItems='center' spacing={2}>
            <FormLabel className="titleLabel">
                {label}
            </FormLabel>
            <Button 
                data-testid="left-click"
                variant="outlined" 
                onClick={()=>setImageNum(imageNum-1)} 
                disabled={imageNum===0||disabled} size='small'
            >
                <NavigateBeforeIcon fontSize="small"/> 
            </Button>
            <Slider 
                min={0} 
                value={imageNum} 
                max={values.length-1} 
                disabled={disabled} 
                onChange={handleSliderChange} 
                marks 
                sx={{width:"1024px", '& .MuiSlider-track': { height:"5px", border:'none'}, '& .MuiSlider-rail': {height:"5px", border:'none'}}}
                track={inverted ? "inverted" : "normal" } 
            />
            <Button 
                data-testid="right-click"
                variant="outlined" 
                onClick={()=>setImageNum(imageNum+1)} 
                disabled={imageNum===values.length-1||disabled} 
                size='small'
            >
                <NavigateNextIcon fontSize="small"/>
            </Button>
            <FormLabel 
                data-testid="result-label"
                className="resultLabel"
                sx={{fontSize:'small', padding:'2px'}}
                
             >
                {values[imageNum]}
            </FormLabel>
    </Stack>
    )
}