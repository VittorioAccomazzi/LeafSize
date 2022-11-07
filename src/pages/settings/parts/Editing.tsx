import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { CSSProperties, MutableRefObject, useEffect, useRef } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import useMouse, { Point2DOM, umButtonPress, umDeviceTypes, umMouseEvent } from "../../../common/useLib/useMouse";
import LeafSeg from "../../../workers/background/LeafSeg";

interface EditingProp {
    inpData : ImageData|null, // data to magnefy
    ovlData : ImageData|null,
    outDiv  : MutableRefObject<HTMLElement | null>, // container div
    style   : CSSProperties,
    matrix  : DOMMatrix,
    isActive : boolean,
    radius : number, 
    color : string,
    addValues :  ActionCreatorWithPayload<number[], string>,
    stateSelector : (state: RootState) => Set<number>
}


export default function Editing ({inpData, ovlData, outDiv, style, matrix, isActive, radius, color, addValues, stateSelector} : EditingProp) {
    const canvas = useRef<HTMLCanvasElement|null>(null);
    const ctx = useRef<CanvasRenderingContext2D|null>(null)
    const dispatch = useAppDispatch();

    useEffect(()=>{
        if( inpData && canvas.current ){
            canvas.current.style.backgroundColor = "#00000000";
            canvas.current.width = inpData.width;
            canvas.current.height= inpData.height;
            ctx.current = canvas.current.getContext('2d');
        }
    },[inpData])

    useEffect(()=>{
        if( ovlData && ctx.current) ctx.current.clearRect(0,0,ctx.current.canvas.width,ctx.current.canvas.height);

    },[ovlData, ctx])

    const event = useMouse(outDiv)
    useEffect(()=>{
        if( isActive && ctx.current && event.device === umDeviceTypes.Mouse  ){
            const mouseEvent = event.event as umMouseEvent;
            const values = handleMouse(mouseEvent, inpData, ctx.current, matrix, radius, color);
            if( values.length > 0 ) dispatch(addValues(values));
        }
    },[event, isActive, ctx]); // eslint-disable-line  react-hooks/exhaustive-deps

    return (
        <canvas ref={canvas} style={style}/>
    )
}


function handleMouse( mouseEvent : umMouseEvent, inData : ImageData | null, ctx : CanvasRenderingContext2D, matrix : DOMMatrix, radius : number, color:string ) : number [] {
    const values : number[] = [];
    if( mouseEvent.button === umButtonPress.Left && mouseEvent.mousePoint && inData){
        const width = ctx.canvas.width;
        const height= ctx.canvas.height;
        let inv = matrix.inverse()
        inv.m33=1.0; // unfortunately this is necessary because otherwise it will not be recognized as 2D matrix
        inv.m44=1.0; // see issue #12 https://github.com/VittorioAccomazzi/LeafSize/issues/12 
        let vpPt= Point2DOM(mouseEvent.mousePoint) // point in viewport space
        let imPt= vpPt.matrixTransform(inv) // point in image space.
        const xImg = Math.round(imPt.x)
        const yImg = Math.round(imPt.y)
        if( xImg >=0 && xImg< width && yImg>=0 && yImg<height ){
            ctx.beginPath();
            ctx.strokeStyle="#00000000";
            ctx.fillStyle=color;
            ctx.arc(xImg,yImg,radius, 0, 2*Math.PI);
            ctx.fill();
            ctx.stroke();

            const xMin = Math.max(0, xImg-radius);
            const xMax = Math.min(width, xImg+radius+1);
            const yMin = Math.max(0, yImg-radius);
            const yMax = Math.min(height, yImg+radius+1);

            for( let y=yMin; y<yMax; y++){
                for( let x=xMin; x<xMax; x++){
                    const dx = x-xImg;
                    const dy = y-yImg;
                    if( dx*dx+dy*dy < radius*radius){
                        let offset = 4*(y * width + x);
                        const r = inData.data[offset++];
                        const g = inData.data[offset++];
                        const b = inData.data[offset++];
                        values.push(LeafSeg.Pack(r,g,b));
                    }
                }
            }
        }
    }
    return values; 
}