import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import css from './Settings.module.css'
import SettingPart from "./parts/SettingsPart";
import DisplayPart from "./parts/DisplayPart";
import ImageLoader from "../../workers/foreground/ImageLoader";
import Pacer from '../../common/utils/Pacer'
import { useAppSelector, useAutomaticRedirect, useImagesToProcess } from "../../app/hooks";
import { selectFiles, selectNumDishes, selectNumLeafs } from "../selection/selectionSlice";
import LeafSeg from "../../workers/background/LeafSeg";
import { selectHue, selectSaturation } from "./settingSlice";
import useShiftKey from "../../common/useLib/useKeyPress";
import { imageSize } from "../../app/const";
import usePageTracking from "../../common/useLib/usePageTracking";


const delay = 200; // ms to wait for the user to complete the action prior to load the image

export default function Settings() {
    const fileList = useAppSelector(selectFiles);
    const numDishes= useAppSelector(selectNumDishes);
    const huethr = useAppSelector(selectHue);
    const satThr = useAppSelector(selectSaturation);
    const numLeaf= useAppSelector(selectNumLeafs);
    const imgLoader= useMemo<ImageLoader>(()=>new ImageLoader(fileList, numDishes, imageSize),[fileList, numDishes]);
    const iNumPacer= useMemo<Pacer>(()=>new Pacer(delay),[]);
    const [imageData,setImageData] = useState<ImageData|null>(null);
    const [orgData, setOrgData]    = useState<ImageData|null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const imagesToProcess = useImagesToProcess(imgLoader.List); 
    const shiftPress= useShiftKey();


    // if nothing selected redirect on seletion page.
    useAutomaticRedirect(fileList);

    // track usage
    usePageTracking();

    const loadData = async ( imageName : string ) => {
        const index = imgLoader.List.findIndex(v => v===imageName);
        if( index >=0 ){
            const { imgData } = await imgLoader.getImage(index);
            setImageData(imgData);
            setOrgData(imgData);
        }
    }

    const process = async () =>{
        if( orgData ){
            setIsLoading(true);
            const newImage = new ImageData( new Uint8ClampedArray(orgData.data), orgData.width, orgData.height);
            LeafSeg.Process(newImage, huethr, satThr, numLeaf );
            setImageData( newImage);
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        if( shiftPress ) process();
    },[orgData])

    if( shiftPress) throw Error('Booom !!')
    
    return (
        <Box className="fullPage" >
            <Box className={css.topFrame}>
                <SettingPart 
                    imageList={imagesToProcess}
                    disabled={isLoading} 
                    imageChange={(index)=> iNumPacer.delayAction(()=>loadData(index))} 
                    process={process} 
                    isAutoProc ={shiftPress}
                />
            </Box>
            <Box className={css.bottomFrame}>
                <DisplayPart
                    imageData={imageData}
                />
            </Box>
        </Box>
    )
}