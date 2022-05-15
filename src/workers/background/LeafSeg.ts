import ColourModels from "../../common/imgLib/ColourModels";
import Mask from "../../common/imgLib/Mask";
import { Bbox, Colour } from "../../common/imgLib/Types";

export enum BackgroundType {
    Image,
    Transparent
}

/**
 * This class perform the segmentation of the leaf, given the image and thresholds
 */
export default class LeafSeg {

    private constructor( ) { } // singleton

    /**
     * Perform the identification of the leaf(s) in the input image
     * @param imgData  input image
     * @param hueThr  hue threshold [0,255]
     * @param satThr saturation threshold [0,255]
     * @param nLeafs number of leafs 1 or 2
     * @returns areas : array with the areas measured, bboxs : bounding box for each leaf measured.
     */
    static Process(imgData : ImageData, hueThr : number, satThr : number, nLeafs : number, backgroundType: BackgroundType = BackgroundType.Image ) :  { areas : number[], bboxs : Bbox[] }  {
        let areas : number [] = [];
        let bboxs : Bbox[]    = [];

        const {hue,sat} = ColourModels.toHSV(imgData);
        const rMask = new Mask(imgData.width, imgData.height);
        const mPixels = rMask.imagePixels;
        const hPixels = hue.imagePixels;
        const sPixels = sat.imagePixels;

        // background mask
        hueThr *= 360/255; // rage expected by the library
        satThr *= 1/255;
        hPixels.forEach((v,i)=>mPixels[i]= v > hueThr || sPixels[i] < satThr); 

        // fill holes
        const bMask = rMask.Fill(1,1);
        const dMask = bMask;

        // foregound mask
        dMask.Not();

        // extract components
        const leafs = dMask.Components(nLeafs);

        // overlay
        const colours : Colour [] = [{r:255,g:0,b:0},{r:255,g:255,b:0}];

        // set background
        LeafSeg.setBackground(backgroundType, imgData);

        leafs.forEach((m, i)=>{
            const col  = colours[i%colours.length];
            const area = m.area;
            const bbox = m.Boundaries();
            areas.push(area);
            bboxs.push(bbox);
            const dil  = m.Dilate(1);
            dil.Minus(m); // this is the outline.
            dil.Overlay(imgData, col);  
        })

        return { areas, bboxs};
    }


    private static setBackground(backgroundType: BackgroundType, imgData: ImageData) {
        const len = backgroundType === BackgroundType.Image ? 0 : imgData.data.length;
        let data= imgData.data;
        let ptr = 0;
        while (ptr < len) {
            data[ptr++] = 0;
            data[ptr++] = 0
            data[ptr++] = 0;
            data[ptr++] = 0;
        }
    }
}