import ImageLoader from "./ImageLoader";
import LeafSeg from "../background/LeafSeg";
import LeafRes from "./LeafRes";
import BoundingBox from "../../common/imgLib/BoundingBox";


export type ProcessProgress = ( num : number, total : number, item?: LeafRes) => void
export interface Leaf {
    imageData : ImageData,
    areas : number[] 
}
const dilation = 25;

export default class ImageProcessor {

    private progress : ProcessProgress;
    private imageLoader : ImageLoader;
    private hueThr : number;
    private satThr : number;
    private nLeafs : number;
    private isDisposed : boolean = false;
    private numDone : number;

    constructor( imageLoader : ImageLoader, progress : ProcessProgress, hueThr : number, satThr : number, nLeafs : number ){
        this.imageLoader = imageLoader;
        this.progress = progress;
        this.hueThr = hueThr;
        this.satThr = satThr;
        this.nLeafs = nLeafs;
        this.numDone= 0;
    }

    async getImage( name : string ) : Promise<Leaf | null> {
        if( this.isDisposed ) return null;
        const index = this.imageLoader.List.indexOf(name);
        const { scale, imageData } = await this.imageLoader.getImage(index);
        const { areas, bboxs } = LeafSeg.Process(imageData!, this.hueThr, this.satThr, this.nLeafs);
        const box = BoundingBox.Merge(bboxs);
        let leafData  : ImageData = imageData!;
        let leafAreas : number [] = [];
        if( !BoundingBox.IsEmpty(box) ){
            const dBox = BoundingBox.Dilate(box, dilation, dilation);
            leafData = BoundingBox.CropImage(dBox, imageData!)!;
            leafAreas= areas.map(v=>(v/(scale*scale)|0));
        }
        this.numDone++;
        this.progress(this.numDone, this.imageLoader.List.length);
        return {
            imageData : leafData,
            areas : leafAreas
        };
    }

    dispose(){
        this.isDisposed = true;
    }
}