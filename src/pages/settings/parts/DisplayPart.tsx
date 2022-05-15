import { Box } from "@mui/material";
import css from '../Settings.module.css'
import { useRef } from "react";
import { useEffect } from "react";
import useCenterPos from "../../../common/useLib/useCenterPos";
import usePanZoom from "../../../common/useLib/usePanZoom";
import { ImageData } from "canvas";
import AutoZoom from './AutoZoom';
import {EditModeType, EditModes} from '../useEditMode';

interface DisplayPartProp {
    orgData : ImageData | null,
    ovlData : ImageData | null,
    editMode : EditModeType
}

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

    return (
        <Box className={css.displayPart} ref={mainDiv} >
            <canvas ref={orgCanvas} style={{ display:"block", transformOrigin: "0px 0px",  transform: orgMatrix.toString() }}/>
            <canvas ref={ovlCanvas} style={{ display:"block", transformOrigin: "0px 0px",  transform: orgMatrix.toString(), position:'relative', top:`${yOffset}px` }}/>
            <AutoZoom inData={orgData} outDiv={mainDiv} matrix={orgMatrix} />
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
