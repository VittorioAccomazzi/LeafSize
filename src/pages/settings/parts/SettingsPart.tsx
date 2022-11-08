import { Box, Button, FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
import css from '../Settings.module.css'
import PreviousPage from "../../../common/components/NavButtons";
import { NextPage } from "../../../common/components/NavButtons";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setHue, setSaturation, resetVals, selectHue, selectSaturation } from '../settingSlice';
import FullSlider from '../../../common/components/FullSlider';
import { processingPath, selectionPath } from "../../../app/const";
import {EditModes, EditModeType} from '../useEditMode';
import Outline from '../../../common/components/Outline';

interface SettingPartProp {
    disabled : boolean,
    imageList: string [],
    imageChange : (imageName:string) =>void,
    process : ()=>void,
    isAutoProc : boolean,
    editModeState : EditModeType
}

const minHue = 50;
const maxHue = 200;
const minSat = 0;
const maxSat = 150;
const generateArray = ( min : number, max:number ) => Array(max-min+1).fill(0).map((v,i)=>`${i+min}`)

export default function SettingPart({disabled, imageChange: imageChanges, process, imageList, isAutoProc, editModeState} : SettingPartProp ) {
    const hueArray = useMemo<string[]>(()=>generateArray(minHue,maxHue),[]);
    const saturationArray = useMemo<string[]>(()=>generateArray(minSat,maxSat),[]);
    const dispatch  = useAppDispatch();
    const hue = useAppSelector(selectHue);
    const sat = useAppSelector(selectSaturation);
    const hueDef = useMemo<number>(()=>hue,[]); // eslint-disable-line  react-hooks/exhaustive-deps
    const satDef = useMemo<number>(()=>sat,[]); // eslint-disable-line  react-hooks/exhaustive-deps
    const {mode, setMode} = editModeState;
    
    return (
        <Stack className={css.settigsPart} spacing={2} paddingTop={2} paddingBottom={5} overflow='hidden'>
            <Outline label="Leaves Selection">
            <Box width='85em' style={{justifyContent:'center'}}>
                    <FullSlider
                        label="Hue"
                        values={hueArray}
                        defaultIndex={hueDef-minHue}
                        onChange={(index,val)=>{dispatch(setHue(parseInt(val)))}}
                        disabled={disabled}
                    />
                    <FullSlider
                        label="Saturation"
                        values={saturationArray}
                        defaultIndex={satDef-minSat}
                        onChange={(index,val)=>{dispatch(setSaturation(parseInt(val)))}}
                        disabled={disabled}
                        inverted={true}
                    />
                </Box>
            </Outline>
            <Outline label="Pathogen Selection">
                <Stack direction='row' spacing={12} width='85em' style={{justifyContent:'center'}}  >
                    <RadioGroup value={mode} onChange={(e)=>{setMode(e.target.value)}}>
                        <Stack direction='row' spacing={6}>
                            <FormControlLabel value={EditModes.Image}    control={<Radio/>} label="Pan and Zoom the image" />
                            <FormControlLabel value={EditModes.Pathogen} control={<Radio/>} label="Select Pathogen region" />
                            <FormControlLabel value={EditModes.Leaf}     control={<Radio/>} label="Select Leaf region" />
                        </Stack>
                    </RadioGroup>
                    <Button 
                        variant='outlined'
                        onClick={()=>dispatch(resetVals())}
                    > 
                        Reset Selection
                    </Button>
                </Stack>
            </Outline>
            <FullSlider
                label="Image"
                values={imageList}
                onChange={(index,val)=>{imageChanges(val)}}
                disabled={disabled}
            />
            <Stack direction='row' spacing={10}>
                <PreviousPage 
                    page={selectionPath}
                    disabled={disabled} 
                />
                <Button 
                    variant="outlined"
                    disabled={disabled}
                    onClick={process}
                >
                    { isAutoProc ? '⚡️ ': '' }
                    Preview
                </Button>
                <NextPage 
                    page={processingPath} 
                    disabled={disabled}
                />
            </Stack>
        </Stack>
    )
}
