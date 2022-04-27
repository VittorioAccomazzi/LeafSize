import { Box } from "@mui/material";
import '../Settings.css'
import { useRef, useState } from "react";
import { useEffect } from "react";
import useCenterPos from "../../../common/useLib/useCenterPos";
import usePanZoom from "../../../common/useLib/usePanZoom";
import { ImageData } from "canvas";

interface DisplayPartProp {
    imageData : ImageData | null
}

interface CanvasSize { width : number, height : number }

export default function DisplayPart({ imageData }:DisplayPartProp) {
    const canvas = useRef<HTMLCanvasElement | null>(null)
    const mainDiv= useRef<HTMLDivElement|null>(null)
    const [canvasSize, setCanvasSize] = useState<CanvasSize>({width:1, height:1})

    // update the canvas when index changes
    useEffect( ()=> {
            if( imageData && canvas.current) {
                const width = imageData.width;
                const height= imageData.height;
                canvas.current.width = width;
                canvas.current.height= height;
                const ctx = canvas.current.getContext('2d');
                ctx?.putImageData(imageData,0,0);
                setCanvasSize({ width : imageData.width, height : imageData.height} );
            }
    },[imageData, setCanvasSize])

    const pzMatrix = usePanZoom(mainDiv,[mainDiv])
    let cpMatrix = useCenterPos(canvas, mainDiv, [canvasSize.width, canvasSize.height])
    cpMatrix.preMultiplySelf(pzMatrix)

    return (
        <Box className="displayPart" ref={mainDiv} >
            <canvas ref={canvas} className="mainCanvas" style={{ display:"block", transformOrigin: "0px 0px",  transform: cpMatrix.toString() }}/>
        </Box>
    )
}