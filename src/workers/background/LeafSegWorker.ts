// the next line declare that we are in the web workers

/// <reference lib="webworker" />

//
// Using the model directly supported by Webpack 5 https://webpack.js.org/guides/web-workers/
//

import { imageSize } from "../../app/const";
import { Bbox } from "../../common/imgLib/Types";
import ImageLoader from "../foreground/ImageLoader";
import { LeafCrop } from "./LeafCrop";
import LeafSeg from "./LeafSeg";

export interface QueryMessage {
    file    : FileSystemFileHandle, 
    nDishes : number,
    name    : string,
    hueThr  : number, 
    satThr  : number, 
    nLeafs  : number 
}
export interface AnswerMessage {
    imgData : ImageData, 
    areas   : number[]
}

/* eslint-disable-next-line no-restricted-globals */
self.onmessage=async (ev:MessageEvent<QueryMessage>)=> {
    const {file, name, nDishes, hueThr, satThr, nLeafs } = ev.data
    const imgLoader = new ImageLoader([file], nDishes, imageSize);
    const imgIndex  = imgLoader.List.indexOf(name);
    const {imgData, scale} = await imgLoader.getImage(imgIndex)
    const {areas, bboxs } = LeafSeg.Process(imgData!, hueThr, satThr, nLeafs);
    const result = LeafCrop.Process(areas, bboxs, imgData!, scale);
    sendMessage(result);
}

function sendMessage( msg : AnswerMessage ) {
    /* eslint-disable-next-line no-restricted-globals */
    self.postMessage(msg);
}