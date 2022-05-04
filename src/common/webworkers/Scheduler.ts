
type WaitRequest = ()=>void;

export default class Scheduler<InpType, OutType> {
    private maxWorkers : number;
    private numRuning : number;
    private func :  ( inp : InpType) => Promise<OutType>;
    private queue : WaitRequest[] = [];

    constructor( maxWorkers : number, func : ( inp : InpType) => Promise<OutType> ){
        this.maxWorkers = maxWorkers;
        this.func = func;
        this.numRuning=0;
    }

    async execute( inp : InpType ) : Promise<OutType> {
        if( this.numRuning >= this.maxWorkers ) await this.QueueRequest(); // wait for next slot
        this.numRuning++;
        const res  = await this.func(inp);
        this.numRuning--;
        this.DequeueRequest();
        return res;
    }


    // handle the queue of request to wait for the execution.
    private QueueRequest() : Promise<void> {
        return new Promise( res => this.queue.push(res))
    }

    private DequeueRequest() {
        let req = this.queue.shift();
        if( req ) req();
    }
}