import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import css from './Settings.module.css'
import SettingPart from "./parts/SettingsPart";
import DisplayPart from "./parts/DisplayPart";
import ImageLoader from "../../workers/foreground/ImageLoader";
import Pacer from '../../common/utils/Pacer'
import { useAppSelector, useAutomaticRedirect, useImagesToProcess } from "../../app/hooks";
import { selectFiles, selectNumDishes, selectNumLeafs } from "../selection/selectionSlice";
import LeafSeg, {BackgroundType} from "../../workers/background/LeafSeg";
import { selectHue, selectLeafVals, selectPathVals, selectSaturation } from "./settingSlice";
import useShiftKey from "../../common/useLib/useKeyPress";
import { imageSize } from "../../app/const";
import usePageTracking from "../../common/useLib/usePageTracking";
import useEditMode from "./useEditMode";


const delay = 200; // ms to wait for the user to complete the action prior to load the image

export default function Settings() {
    const fileList = useAppSelector(selectFiles);
    const numDishes= useAppSelector(selectNumDishes);
    const huethr = useAppSelector(selectHue);
    const satThr = useAppSelector(selectSaturation);
    const numLeaf= useAppSelector(selectNumLeafs);
    const leafVals = useAppSelector(selectLeafVals);
    const pathVals = useAppSelector(selectPathVals);
    const imgLoader= useMemo<ImageLoader>(()=>new ImageLoader(fileList, numDishes, imageSize),[fileList, numDishes]);
    const iNumPacer= useMemo<Pacer>(()=>new Pacer(delay),[]);
    const thrsPacer= useMemo<Pacer>(()=>new Pacer(delay),[]);
    const [imgData, setImgData] = useState<ImageData|null>(null);
    const [orgData, setOrgData] = useState<ImageData|null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const imagesToProcess = useImagesToProcess(imgLoader.List); 
    const shiftPress= useShiftKey();
    const editMode = useEditMode();


    // if nothing selected redirect on selection page.
    useAutomaticRedirect(fileList);

    // track usage
    usePageTracking();

    const loadData = async ( imageName : string ) => {
        const index = imgLoader.List.findIndex(v => v===imageName);
        if( index >=0 ){
            const { imgData } = await imgLoader.getImage(index);
            setImgData(imgData);
            setOrgData(imgData);
        }
    }

    const process = async () =>{
        if( orgData ){
            setIsLoading(true);
            const newImage = new ImageData( new Uint8ClampedArray(orgData.data), orgData.width, orgData.height);
            LeafSeg.Process(newImage, huethr, satThr, numLeaf, leafVals, pathVals, BackgroundType.Transparent );
            setImgData(newImage);
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        if( shiftPress ) thrsPacer.delayAction(()=>process());
    },[orgData, huethr, satThr])

    return (
        <Box className="fullPage" >
            <Box className={css.topFrame}>
                <SettingPart 
                    imageList={imagesToProcess}
                    disabled={isLoading} 
                    imageChange={(index)=> iNumPacer.delayAction(()=>loadData(index))} 
                    process={process} 
                    isAutoProc ={shiftPress}
                    editModeState={editMode}
                />
            </Box>
            <Box className={css.bottomFrame}>
                <DisplayPart
                    orgData={orgData}
                    ovlData={imgData}
                    editMode={editMode}
                />
            </Box>
        </Box>
    )
}