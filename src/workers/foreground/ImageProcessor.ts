import ImageLoader from "./ImageLoader";
import LeafSegProxy, { Result } from "./LeafSegProxy";


export type ProcessProgress = ( num : number, total : number) => void

/**
 * process all the images.
 */
export default class ImageProcessor {

    private progress : ProcessProgress;
    private workers : LeafSegProxy;
    private hueThr : number;
    private satThr : number;
    private nLeafs : number;
    private isDisposed : boolean = false;
    private numDone : number;
    private nProcess: number;
    private leafVals: number[];
    private pathVals: number[];

    constructor( imageLoader : ImageLoader, progress : ProcessProgress, nProcess : number, hueThr : number, satThr : number, nLeafs : number, leafVals : number[], pathVals: number[] ){
        this.progress = progress;
        this.hueThr = hueThr;
        this.satThr = satThr;
        this.nLeafs = nLeafs;
        this.nProcess= nProcess;
        this.leafVals=leafVals;
        this.pathVals=pathVals;
        this.numDone= 0;
        this.workers = new LeafSegProxy(imageLoader);
    }

    /**
     * process the image, and generate bitmap and measurements.
     * @param name 
     * @returns 
     */
    async getImage( name : string ) : Promise<Result | null> {
        let leaf : Result | null = null
        if( !this.isDisposed ){
            leaf = await this.workers.process(name, this.hueThr, this.satThr, this.nLeafs, this.leafVals, this.pathVals);
        }
        this.numDone++;
        this.progress(this.numDone, this.nProcess);
        return leaf
    }

    dispose(){
        this.isDisposed = true;
        this.workers.dispose();
    }
}