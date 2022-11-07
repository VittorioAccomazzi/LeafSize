import { MutableRefObject, useEffect, useRef } from "react";
import ColourModels from "../../../common/imgLib/ColourModels";
import { Point } from "../../../common/imgLib/Types";
import useMouse, { Point2DOM, umDeviceTypes, umMouseEvent } from "../../../common/useLib/useMouse";


interface AutoZoomProp {
    inData : ImageData|null, // data to magnefy
    outDiv : MutableRefObject<HTMLElement | null> // container div
    matrix: DOMMatrix,
    radius : number,
    color : string
}


const show : React.CSSProperties = { display:'block', width:'256px', height:'256px', position:'absolute', bottom:'0', right:'0', background:'#A0A0A0' };
const hide : React.CSSProperties = { display:'none'};
const autoZoom = 2;

export default function AutoZoom({inData, outDiv, matrix, radius, color} : AutoZoomProp){
    const inpImage = useRef<ImageBitmap|null>(null);
    const outCanvas= useRef<HTMLCanvasElement|null>(null);

    
    // cache the image bitmap
    useEffect(()=>{
        if( inpImage.current ) {
            inpImage.current.close();
            inpImage.current = null; 
        }
        if( inData ){
            createImageBitmap(inData).then((imageBitmap)=>inpImage.current=imageBitmap)
        }
    },[inData]);

    // hode show the canvas as necessary
    const event = useMouse(outDiv)
    let canvasStyle = hide;
    if( event.device === umDeviceTypes.Mouse && inpImage.current &&outCanvas.current && inData ){
        const mouseEvent = event.event as umMouseEvent;
        if ( mouseEvent.mousePoint != null ) {
            canvasStyle = show;
            displayCanvas(matrix, outCanvas.current, inpImage.current, inData, mouseEvent.mousePoint, radius, color);
        }
    }

    return (
        <canvas ref={outCanvas} style= {canvasStyle}/>
    )
}


function displayCanvas( settings : DOMMatrix, canvas : HTMLCanvasElement, image : ImageBitmap, inData : ImageData, point : Point, radius : number, color : string) : void {
    canvas.width = canvas.clientWidth
    canvas.height= canvas.clientHeight
    let inv = settings.inverse();
    inv.m33=1.0; // unfortunately this is necessary because otherwise it will not be recognized as 2D matrix
    inv.m44=1.0; // see issue #12 https://github.com/VittorioAccomazzi/LeafSize/issues/12 
    let vpPt= Point2DOM(point) // point in viewport space
    let imPt= vpPt.matrixTransform(inv) // point in image space.
    imPt.x = Math.round(imPt.x)
    imPt.y = Math.round(imPt.y)
    let xMin = imPt.x - canvas.width / (2*autoZoom);
    let yMin = imPt.y - canvas.height/ (2*autoZoom);
    let xMax = xMin + canvas.width/autoZoom;
    let yMax = yMin + canvas.height/autoZoom;
    let width = xMax - xMin
    let height= yMax - yMin
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const cW = canvas.width
    const cH = canvas.height
    ctx.clearRect(0, 0, cW, cH)
    ctx.drawImage( image, xMin, yMin, width, height, 0, 0, cW, cH)
    ctx.strokeStyle= '#000000'
    ctx.beginPath()
    ctx.moveTo(0,     cH/2)
    ctx.lineTo(cW/3,  cH/2)
    ctx.moveTo(cW,    cH/2)
    ctx.lineTo(2*cW/3,cH/2) 
    ctx.moveTo(cW/2,  0)
    ctx.lineTo(cW/2,  cH/3)
    ctx.moveTo(cW/2,  cH)
    ctx.lineTo(cW/2,  2*cH/3) 
    ctx.stroke()
    ctx.strokeStyle= '#FFFFFF'
    ctx.beginPath()
    ctx.moveTo(0,     cH/2+1)
    ctx.lineTo(cW/3,  cH/2+1)
    ctx.moveTo(cW,    cH/2+1)
    ctx.lineTo(2*cW/3,cH/2+1) 
    ctx.moveTo(cW/2+1,  0)
    ctx.lineTo(cW/2+1,  cH/3)
    ctx.moveTo(cW/2+1,  cH)
    ctx.lineTo(cW/2+1,  2*cH/3) 
    ctx.stroke();

    if( radius > 0 ){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.arc(cW/2,cH/2,radius * autoZoom,0, 2*Math.PI);
        ctx.stroke();
    }

    // display the pixel value
    const imX= imPt.x | 0;
    const imY= imPt.y | 0;
    if( imX >=0 && imX < image.width && imY >=0 && imY < image.height ){
        let offset = 4*(imY * inData.width + imX);
        if( offset < inData.data.length) {
            const r = inData.data[offset++];
            const g = inData.data[offset++];
            const b = inData.data[offset++];
            let { h, s, v } = ColourModels.Rgb2Hsv(r/255, g/255, b/255);
            h *= 255/360;
            s *= 255;
            v *= 255;
            const str = `h: ${h.toFixed(0)}\ns: ${s.toFixed(0)}\nv: ${v.toFixed(0)}`;
            ctx.font = "18px serif";
            ctx.fillStyle="#0A0A0A"
            ctx.fillText(str, 4, cH-(9)); // shadow
            ctx.fillStyle="#FFFF00"
            ctx.fillText(str, 5, cH-(10)); //  foreground
        }
    }

}