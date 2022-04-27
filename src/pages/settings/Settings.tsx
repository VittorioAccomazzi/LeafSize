import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import './Settings.css'
import SettingPart from "./parts/SettingsPart";
import DisplayPart from "./parts/DisplayPart";
import ImageLoader from "../../workers/foreground/ImageLoader";
import Pacer from '../../common/utils/Pacer'
import { useAppSelector, useAutomaticRedirect } from "../../app/hooks";
import { selectFiles, selectNumDishes, selectNumLeafs } from "../selection/selectionSlice";
import LeafSeg from "../../workers/background/LeafSeg";
import { selectHue, selectSaturation } from "./settingSlice";
import useShiftKey from "../../common/useLib/useKeyPress";


const delay = 200; // ms to wait for the user to complete the action prior to load the image
const imageSize=1024;

export default function Settings() {
    const fileList = useAppSelector(selectFiles);
    const numDishes= useAppSelector(selectNumDishes);
    const huethr = useAppSelector(selectHue);
    const satThr = useAppSelector(selectSaturation);
    const numLeaf= useAppSelector(selectNumLeafs);
    const imgLoader= useMemo<ImageLoader>(()=>new ImageLoader(fileList, numDishes, imageSize),[fileList, numDishes]);
    const imageList= useMemo<string[]>(()=>imgLoader.List,[imgLoader]);
    const iNumPacer= useMemo<Pacer>(()=>new Pacer(delay),[]);
    const [imageData,setImageData] = useState<ImageData|null>(null);
    const [orgData, setOrgData]    = useState<ImageData|null>(null);
    const [isLoading,setIsLoading]= useState<boolean>(false);
    const shiftPress= useShiftKey();


    // if nothing selected redirect on seletion page.
    useAutomaticRedirect(fileList);

    const loadData = async ( index : number ) => {
        const { scale, imageData } = await imgLoader.getImage(index);
        setImageData(imageData);
        setOrgData(imageData);
        if( shiftPress ) process();
    }

    const process = async () =>{
        if( orgData ){
            setIsLoading(true);
            const newImage = new ImageData( new Uint8ClampedArray(orgData.data), orgData.width, orgData.height);
            const areas = LeafSeg.Process(newImage, huethr, satThr, numLeaf );
            setImageData( newImage);
            setIsLoading(false);
        }
    }

    return (
        <Box className="fullPage" >
            <Box className="topFrame">
                <SettingPart 
                    imageList={imageList}
                    disabled={isLoading} 
                    imageChange={(index)=>iNumPacer.delayAction(()=>loadData(index))} 
                    process={process} 
                />
            </Box>
            <Box className="bottomFrame">
                <DisplayPart
                    imageData={imageData}
                />
            </Box>
        </Box>
    )
}