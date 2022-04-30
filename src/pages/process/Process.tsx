import { Box, Button, Stack, Typography } from "@mui/material";
import  css from './Process.module.css'
import PreviousPage from "../../common/components/NavButtons";
import { NextPage } from "../../common/components/NavButtons";
import { imageSize, resultPath, settingsPath } from "../../app/const";
import { useAppSelector, useAutomaticRedirect } from "../../app/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import ImageLoader from "../../workers/foreground/ImageLoader";

import { selectFiles, selectNumDishes, selectNumLeafs } from "../selection/selectionSlice";
import { selectHue, selectSaturation } from "../settings/settingSlice";
import ImageProcessor from "../../workers/foreground/ImageProcessor";
import ProcessResult from "./ProcessResult";

export default function Process() {
    const fileList = useAppSelector(selectFiles);
    const numDishes= useAppSelector(selectNumDishes);
    const huethr   = useAppSelector(selectHue);
    const satThr   = useAppSelector(selectSaturation);
    const numLeaf  = useAppSelector(selectNumLeafs);
    const [perc, setPerc] = useState<number>(0)
    const imgLoader= useMemo<ImageLoader>(()=>new ImageLoader(fileList, numDishes, imageSize),[fileList, numDishes]);
    const progress = (done : number, total : number )=> setPerc((100*done/total)|0);
    const imgProcessor = useMemo<ImageProcessor>(()=>new ImageProcessor(
            imgLoader,
            progress, 
            huethr, 
            satThr,
            numLeaf
         ),[])

        // if nothing selected redirect on seletion page.
        useAutomaticRedirect(fileList);

         // dispose the image processor when we exit this page.
         useEffect(()=>{
            return ()=>imgProcessor.dispose();
         },[imgProcessor])

         const onDelete = (name:string)=>{

         }



    return (
        <Box className={css.fullPage} >
            <Box className={css.topFrame}>
                <Stack direction='row' spacing={10}>
                    <PreviousPage page={settingsPath} />
                     processing {perc}%
                    <NextPage  page={resultPath} />
                </Stack>
            </Box>
            <Box className={css.bottomFrame} overflow='scroll' display='flex' flexDirection='row' flexWrap='wrap' justifyContent='center' >
                {
                    imgLoader.List.map(el => <ProcessResult name = {el} imageProcessor={imgProcessor} key={el} onDelete={onDelete} />)
                }
            </Box>
        </Box>
    )
}