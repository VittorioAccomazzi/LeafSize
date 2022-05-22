import { AnswerMessage } from "../background/LeafSegWorker";
import WorkerPool from "../../common/webworkers/WorkerPool";
import Scheduler from "../../common/webworkers/Scheduler";
import ImageLoader from "./ImageLoader";
import { LeafArea } from "../../pages/process/ProcessSlice";


export interface Result {
    areas : LeafArea[], 
    imgData : ImageData
}

interface WorkerPayload {
    name  : string,
    hueThr : number, 
    satThr : number, 
    nLeafs : number,
    leafVals : number [],
    pathVals : number []
}

export default class LeafSegProxy {

    private  static pool : WorkerPool = new WorkerPool( LeafSegProxy.workerAllocator );
    private  scheduler : Scheduler<WorkerPayload, Result>;
    private  imgLoader : ImageLoader

    constructor(imgLoader : ImageLoader ) {
        const maxWorkers = Math.max( 1, navigator.hardwareConcurrency-1 );
        this.scheduler = new Scheduler<WorkerPayload,Result>(maxWorkers, this.executeWorker.bind(this));
        this.imgLoader = imgLoader;
    }

    dispose(){
        this.scheduler.dispose();
    }

    async process(name : string, hueThr : number, satThr : number, nLeafs : number, leafVals : number [], pathVals : number [] ) :  Promise<Result|null>  {
        const workerPayload = { name, hueThr, satThr, nLeafs, leafVals, pathVals };
        const answerMessage= await this.scheduler.execute(workerPayload);
        return answerMessage;
    }

    // create a new worker
    private static workerAllocator( ){
        return new Worker(new URL('../background/LeafSegWorker.ts', import.meta.url))
    }

    // send the message to worker and wait for response.
    private async executeWorker(msg : WorkerPayload ) : Promise<Result> {
        const name    = msg.name;
        const file    = this.imgLoader.FileHandle(name);
        const nDishes = this.imgLoader.NumDishes;
        const queryMessage = { name, file, nDishes, hueThr : msg.hueThr, satThr : msg.satThr, nLeafs : msg.nLeafs, leafVals : msg.leafVals, pathVals : msg.pathVals, urlParam : window.location.search }
        return new Promise(res=>{
            const worker = LeafSegProxy.pool.get();
            worker.onmessage = ((ev:MessageEvent<AnswerMessage>)=>{
                LeafSegProxy.pool.release(worker);
                res({...ev.data })
            })
            worker.postMessage(queryMessage)
        })
    }

}