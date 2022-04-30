import { Button, Stack } from "@mui/material";
import css from '../Settings.module.css'
import PreviousPage from "../../../common/components/NavButtons";
import { NextPage } from "../../../common/components/NavButtons";
import { useMemo } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { setHue, setSaturation } from '../settingSlice';
import FullSlider from '../../../common/components/FullSlider';
import { processingPath, selectionPath } from "../../../app/const";

interface SettingPartProp {
    disabled : boolean,
    imageList: string [],
    imageChange : (imageNum:number) =>void,
    process : ()=>void,
    isAutoProc : boolean
}

const minHue = 50;
const maxHue = 200;
const defHue = 68;
const minSat = 0;
const maxSat = 150;
const defSat = 91;
const generateArray = ( min : number, max:number ) => Array(max-min+1).fill(0).map((v,i)=>`${i+min}`)

export default function SettingPart({disabled, imageChange: imageChanges, process, imageList, isAutoProc} : SettingPartProp ) {
    const hueArray = useMemo<string[]>(()=>generateArray(minHue,maxHue),[]);
    const saturationArray = useMemo<string[]>(()=>generateArray(minSat,maxSat),[]);
    const dispatch  = useAppDispatch();
    
    return (
        <Stack className={css.settigsPart} spacing={2} paddingTop={2} paddingBottom={5} overflow='hidden'>
            <FullSlider
                label="Image Selection"
                values={imageList}
                onChange={(index,val)=>{imageChanges(index)}}
                disabled={disabled}
            />
            <FullSlider
                label="Hue"
                values={hueArray}
                defaultIndex={defHue-minHue}
                onChange={(index,val)=>{dispatch(setHue(parseInt(val)))}}
                disabled={disabled}
            />
            <FullSlider
                label="Saturation"
                values={saturationArray}
                defaultIndex={defSat-minSat}
                onChange={(index,val)=>{dispatch(setSaturation(parseInt(val)))}}
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
                    Process
                </Button>
                <NextPage 
                    page={processingPath} 
                    disabled={disabled}
                />
            </Stack>
        </Stack>
    )
}
