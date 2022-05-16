import { Box } from "@mui/material";
import css from '../Settings.module.css'
import { useRef } from "react";
import { useEffect } from "react";
import useCenterPos from "../../../common/useLib/useCenterPos";
import usePanZoom from "../../../common/useLib/usePanZoom";
import { ImageData } from "canvas";
import AutoZoom from './AutoZoom';
import {EditModeType, EditModes} from '../useEditMode';
import Editing from './Editing'
import {addLeafVals, addPathVals, selectLeafVals, selectPathVals} from "../settingSlice";

interface DisplayPartProp {
    orgData : ImageData | null,
    ovlData : ImageData | null,
    editMode : EditModeType
}

const radiusSize = 5; // editing radius
const patColor = "#FFFF00";
const leafColor= "#FFA00A";

export default function DisplayPart({ orgData, ovlData, editMode }:DisplayPartProp) {
    const orgCanvas = useRef<HTMLCanvasElement | null>(null)
    const ovlCanvas = useRef<HTMLCanvasElement | null>(null)
    const mainDiv= useRef<HTMLDivElement|null>(null)

    // update the canvas when index changes
    useEffect( ()=> {
        setCanvas(orgData, orgCanvas);
    },[orgData])

    useEffect (()=>{
        setCanvas(ovlData, ovlCanvas);       
    },[ovlData])

    const pzMatrix = usePanZoom(mainDiv, editMode.mode===EditModes.Image, [mainDiv])
    let orgMatrix = useCenterPos(orgCanvas, mainDiv, [orgData?.width, orgData?.height])
    orgMatrix.preMultiplySelf(pzMatrix)
    const yOffset = orgCanvas.current ? -orgCanvas.current.height : 0;
    const radius = editMode.mode!==EditModes.Image ? radiusSize : 0;
    const color  = editMode.mode===EditModes.Pathogen ? patColor : leafColor;

    return (
        <Box className={css.displayPart} ref={mainDiv} >
            <canvas ref={orgCanvas} style={{ display:"block", transformOrigin: "0px 0px",  transform: orgMatrix.toString() }}/>
            <canvas ref={ovlCanvas} style={{ display:"block", transformOrigin: "0px 0px",  transform: orgMatrix.toString(), position:'relative', top:`${yOffset}px` }}/>
            <Editing 
                inData={orgData} 
                outDiv={mainDiv} 
                matrix={orgMatrix}  
                radius={radiusSize} 
                color={patColor}
                isActive={editMode.mode===EditModes.Pathogen}  
                addValues = {addPathVals}
                stateSelector={selectPathVals}
                style={{ display:"block", transformOrigin: "0px 0px",  transform: orgMatrix.toString(), position:'relative', top:`${2*yOffset}px` }} 
            />
            <Editing 
                inData={orgData} 
                outDiv={mainDiv} 
                matrix={orgMatrix}  
                radius={radiusSize} 
                color={leafColor}
                isActive={editMode.mode===EditModes.Leaf}  
                addValues = {addLeafVals}
                stateSelector={selectLeafVals}
                style={{ display:"block", transformOrigin: "0px 0px",  transform: orgMatrix.toString(), position:'relative', top:`${3*yOffset}px` }} 
            />
            <AutoZoom 
                inData={orgData} 
                outDiv={mainDiv} 
                matrix={orgMatrix} 
                radius={radius} 
                color={color}
            />
        </Box>
    )
}

function setCanvas(orgData: ImageData | null, canvas : React.MutableRefObject<HTMLCanvasElement | null>) {
    if (orgData && canvas.current) {
        const width = orgData.width;
        const height = orgData.height;
        canvas.current.width = width;
        canvas.current.height = height;
        const ctx = canvas.current.getContext('2d');
        ctx?.putImageData(orgData, 0, 0);
    }
}
