import URLParams from "../../app/urlParams";
import BoundingBox from "../../common/imgLib/BoundingBox";
import ColourModels from "../../common/imgLib/ColourModels";
import Mask from "../../common/imgLib/Mask";
import { Bbox, Colour, Point } from "../../common/imgLib/Types";
import { LeafArea } from "../../pages/process/ProcessSlice";

export enum BackgroundType {
    Image,
    Transparent
}

interface MaskWithLocation {
    mask : Mask,
    ulc  : Point
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
    static Process(imgData : ImageData, hueThr : number, satThr : number, nLeafs : number, leafSet : Set<number>, pathSet:Set<number>, backgroundType: BackgroundType = BackgroundType.Image ) :  { areas : LeafArea[], bboxs : Bbox[] }  {

        const leaves = LeafSeg.leafs(imgData, hueThr, satThr, nLeafs);
        const pathogen= LeafSeg.pathogen(leaves, imgData, leafSet, pathSet);
        const res    = LeafSeg.overlay(leaves, pathogen, imgData, backgroundType);
        return res;
    }

    /**
     * Packing Functions
     * these are the function which packs the RGB values for the pathogen segementation.
     * the colour model and the channel used in the packing heavily affect the generalization
     * of the segmentation process.  See https://github.com/VittorioAccomazzi/LeafSize/issues/9
     * @param r 
     * @param g 
     * @param b 
     * @returns token which encode the color's value.
     */

    // Note typescript dosn't directly support static constructors, and here I'm effectively
    // creating one with an auto evaluation function
    public static Pack : (r:number, g:number,b:number) => number = LeafSeg.SelectDefaultPacking();

    // necessary for service worker where the URLParam is initialized latter
    public static  SetPackFunction() {
        LeafSeg.Pack = LeafSeg.SelectDefaultPacking();
    }

    private static SelectDefaultPacking () : (r:number, g:number,b:number) => number  {
        let pack = LeafSeg.LabPack;
        switch(URLParams.PackMode) {
            case "RGB" : {
                pack = LeafSeg.RgbPack;
                break;
            }
            case "HSV": {
                pack = LeafSeg.HsvPack;
                break;
            }
        }
        return pack;
    }  

    /**
     * Packing function using the RGB component. Low generalization, but very easy control
     * on the reagion to select.
     */
    private static RgbPack(r:number, g:number,b:number) : number {
        return (r<<16)|(g<<8)|b
    }

    /**
     * Packing function using the HSV model. 
     */
    private static HsvPack(r:number, g:number,b:number) : number {
        r /= 255;
        g /= 255;
        b /= 255;
        
       let {h,s,v} = ColourModels.Rgb2Hsv(r,g,b);

       h = h|0;
       s = (s*255)|0

       return (h<<8)|s 
    }

    /**
     *  Packing function using the Lab model. Very good generalization, for tomato leaves.
     */
    private static LabPack(r:number, g:number,b:number) : number {
        r /= 255;
        g /= 255;
        b /= 255;
        
       let {l,a,b:bb} = ColourModels.Rgb2Lab(r,g,b);

       a  = (a*255/256)|0;
       bb = (bb*255/256)|0; 
       a  += 128;
       bb += 128;

       //if( a< 0 || a > 255 ) throw Error(`a is ${a}`);
       //if( bb<0 || bb> 255 ) throw Error (`b is ${b}`)

       return (a<<8)|bb 
    }

    /**
     * Segment the pathogen areas of the leaves.
     * @param leaves 
     * @param imgData 
     * @param leafSet 
     * @param pathSet 
     * @returns 
     */
    private static pathogen ( leaves : Mask [], imgData : ImageData, leafSet : Set<number>, pathSet:Set<number> ) {
        const pathMasks : MaskWithLocation [] = [];

        if( pathSet.size > 0 ){
            leaves.forEach(leaf=>{
                const path = LeafSeg.getPathMask(leaf, imgData, leafSet, pathSet );
                pathMasks.push(path);
            })
        }

        return pathMasks;
    }

    private static overlay( leafs : Mask [], pathogen : MaskWithLocation[], imgData : ImageData, backgroundType : BackgroundType ) {
        let areas: LeafArea[] = [];
        let bboxs: Bbox[]= [];

        // overlay
        const colours : Colour [] = [{r:255,g:0,b:0},{r:255,g:255,b:0}];
        const pathColor : Colour =  {r:255, g:128, b:0};

        // set background
        LeafSeg.setBackground(backgroundType, imgData);

        leafs.forEach((m, i)=>{
            const col  = colours[i%colours.length];
            const leaf = m.area;
            const bbox = m.Boundaries();
            const path = pathogen[i]?.mask.area ?? 0;
            areas.push({leaf,path});
            bboxs.push(bbox);
            const dil  = m.Dilate(1);
            dil.Minus(m); // this is the outline.
            dil.Overlay(imgData, col);  
        })

        pathogen.forEach(({mask, ulc})=>{
            mask.Not();
            const dMask = mask.Dilate(1);
            dMask.Minus(mask);
            dMask.Overlay(imgData, pathColor, ulc)
        })

        return {areas, bboxs}
    }

    private static leafs(imgData: ImageData, hueThr: number, satThr: number, nLeafs: number) {
        const { hue, sat } = ColourModels.toHSV(imgData);
        const rMask = new Mask(imgData.width, imgData.height);
        const mPixels = rMask.imagePixels;
        const hPixels = hue.imagePixels;
        const sPixels = sat.imagePixels;

        // background mask
        hueThr *= 360 / 255; // rage expected by the library
        satThr *= 1 / 255;
        hPixels.forEach((v, i) => mPixels[i] = v > hueThr || sPixels[i] < satThr);

        // fill holes
        const bMask = rMask.Fill(1, 1);
        const dMask = bMask;

        // foregound mask
        dMask.Not();

        // extract components
        const leafs = dMask.Components(nLeafs);

        return leafs;
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

    private static getPathMask(leaf : Mask, imgData : ImageData, leafSet : Set<number>, pathSet:Set<number>  ) : MaskWithLocation {
        const tMask = new Mask(leaf.width, leaf.height);
        const lPixels = leaf.imagePixels;
        const pPixels = tMask.imagePixels;
        const {data} = imgData;
        let ptr = 0;

        // Threshold the image
        lPixels.forEach((v,i)=>{
            if( v ){
                const r = data[ptr++];
                const g = data[ptr++];
                const b = data[ptr++];
                ptr++; // alpha
                const val = LeafSeg.Pack(r,g,b);
                pPixels[i] = !leafSet.has(val) && pathSet.has(val);
            } else {
                ptr += 4;
            }
        })

        // dilate the image
        const dMask = tMask.Dilate(1);

        // Crop 
        const bbox = dMask.Boundaries();
        const dBox = BoundingBox.Dilate(bbox, 1, 1);
        const cMask= BoundingBox.CropMask(dBox, dMask);

        // fill holes and opening.
        cMask.Not(); // backgound mask
        let bMask = cMask.Fill(0,0); 
        bMask = bMask.Dilate(2); // erosion
        bMask.Not(); // foreground mask
        bMask = bMask.Dilate(2); // dilation


        // get largest component or an empty mask
        const  comp = bMask.Components(1);
        let path = comp.length ? comp[0] : new Mask(0,0)

        return {
            mask : path,
            ulc  : dBox.ulc 
        };
    }
}