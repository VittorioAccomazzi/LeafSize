import ColourModels from "../../common/imgLib/ColourModels";
import Mask from "../../common/imgLib/Mask";
import { Colour } from "../../common/imgLib/Types";

/**
 * This class perform the segmentation of the leaf, given the image and thresholds
 */
export default class LeafSeg {

    private constructor( ) { } // singleton

    static Process(imgData : ImageData, hueThr : number, satThr : number, nLeafs : number ) : number [] {
        let areas : number [] = [];

        const {hue,sat} = ColourModels.toHSV(imgData);
        const rMask = new Mask(imgData.width, imgData.height);
        const mPixels = rMask.imagePixels;
        const hPixels = hue.imagePixels;
        const sPixels = sat.imagePixels;

        // background mask
        hueThr *= 360/255;
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

        leafs.forEach((m, i)=>{
            const col  = colours[i%colours.length];
            const area = m.area;
            areas.push(area);
            const dil  = m.Dilate(1);
            dil.Minus(m); // this is the outline.
            dil.Overlay(imgData, col);  
        })

        return areas;
    }

}