import { Box, Button, LinearProgress, Stack } from "@mui/material";
import  css from './Process.module.css'
import PreviousPage from "../../common/components/NavButtons";
import { NextPage } from "../../common/components/NavButtons";
import { imageSize, resultPath, settingsPath } from "../../app/const";
import { useAppDispatch, useAppSelector, useAutomaticRedirect, useImagesToProcess } from "../../app/hooks";
import { useEffect, useMemo, useState } from "react";
import ImageLoader from "../../workers/foreground/ImageLoader";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {addImagesToFinalized, ImageFinalized, selectFinalized} from './ProcessSlice'
import { selectFiles, selectNumDishes, selectNumLeafs } from "../selection/selectionSlice";
import { selectHue, selectLeafVals, selectPathVals, selectSaturation } from "../settings/settingSlice";
import ImageProcessor from "../../workers/foreground/ImageProcessor";
import ProcessResult from "./ProcessResult";
import usePageTracking from "../../common/useLib/usePageTracking";
import GA from "../../common/utils/GA";
import { LeafArea } from "./ProcessSlice";

export default function Process() {
    const fileList = useAppSelector(selectFiles);
    const numDishes= useAppSelector(selectNumDishes);
    const huethr   = useAppSelector(selectHue);
    const satThr   = useAppSelector(selectSaturation);
    const numLeaf  = useAppSelector(selectNumLeafs);
    const leafVals = useAppSelector(selectLeafVals);
    const pathVals = useAppSelector(selectPathVals);
    const dispatch  = useAppDispatch();
    const imgFinalized = useAppSelector(selectFinalized);
    const [perc, setPerc] = useState<number>(0)
    const [finalized, setFinalized] = useState<ImageFinalized[]>([]);
    const [isFinalized, setIsFinalized] = useState<boolean>(false);
    const imgLoader= useMemo<ImageLoader>(()=>new ImageLoader(fileList, numDishes, imageSize),[fileList, numDishes]);
    const progress = (done : number, total : number )=>{setPerc((100*done/total)|0)};
    const start = useMemo<number>(()=>Date.now(),[]);
    const imagesToProcess = useImagesToProcess(imgLoader.List); 
    const imgProcessor = useMemo<ImageProcessor>(()=>new ImageProcessor(
            imgLoader,
            progress, 
            imagesToProcess.length,
            huethr, 
            satThr,
            numLeaf,
            [...leafVals],
            [...pathVals]
         ),[]) // eslint-disable-line  react-hooks/exhaustive-deps -- run only once.

        // if nothing selected redirect on seletion page.
        useAutomaticRedirect(fileList);

        // track usage
        usePageTracking();

         // dispose the image processor when we exit this page.
         useEffect(()=>{
            return ()=>imgProcessor.dispose();
         },[imgProcessor])

         // tracking performances
         useEffect(()=>{
             if( perc === 100 ){
                const elaps = Date.now()-start;
                GA.event('Performances','Processing', 'Images processed', imagesToProcess.length);
                GA.event('Performances','Processing', 'Time per image',elaps/imagesToProcess.length);
             }
         },[perc, start]); // eslint-disable-line  react-hooks/exhaustive-deps

         // images which segmentation has been rejected.
         const onDelete = (name:string)=>{
            const index = finalized.findIndex(v=>v.name===name);
            if( index >= 0 ) {
                finalized.splice(index, 1);
                setFinalized([...finalized])
            }
         }

         // images result.
         const onResult = (name: string, areas : LeafArea [] ) => {
            const item = { name, areas };
            setFinalized((state)=>[...state,item])
         }

         // finalize all the result in the local state : push them in the application store
         // and disable further modification.
         const onFinalze = ()=>{
            setIsFinalized(true);
            dispatch(addImagesToFinalized(finalized));
         }

         const nImagesToReview = imgLoader.List.length - imgFinalized.length;
    return (
        <Box className={css.fullPage} >
            <Box className={css.topFrame}>
                <Stack direction='row' spacing={10} alignItems='center'>
                    <PreviousPage 
                        page={settingsPath} 
                        disabled = { nImagesToReview === 0 } 
                    />
                    <LinearProgress 
                        variant='determinate' 
                        value={perc} 
                        className={ perc < 100 ? css.progressBar : css.hidden} 
                    />
                    <Button 
                        variant='outlined' 
                        className={ perc < 100 ? css.hidden :''} 
                        onClick = {onFinalze}
                        disabled={isFinalized}> 
                            <CheckBoxIcon/> Accept 
                    </Button>
                    <NextPage  
                        page={resultPath} 
                        disabled = {imgFinalized.length === 0} 
                    />
                </Stack>
            </Box>
            <Box className={css.bottomFrame} overflow='scroll' display='flex' flexDirection='row' flexWrap='wrap' justifyContent='center' >
                {
                    imagesToProcess.map(el => <ProcessResult name = {el} imageProcessor={imgProcessor} key={el} onDelete={onDelete} onResult={onResult} allowDelete={!isFinalized}/>)
                }
            </Box>
        </Box>
    )
}