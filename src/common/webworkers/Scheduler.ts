type WaitRequest = ()=>void;

/**
 * This is a class which schedule the job for a asyncronous function.
 * It make sure that at most 'maxWorkers' are running at any time
 * @param InpType - input type for the asyncronous function
 * @param OutType - return value for the asyncronous function
 */
export default class Scheduler<InpType, OutType> {
    private maxWorkers : number;
    private numRuning : number;
    private func :  ( inp : InpType) => Promise<OutType>;
    private queue : WaitRequest[] = [];
    private isDisposed : boolean;

    /**
     * Create an instance of the object.
     * @param maxWorkers maximum number of workers running at any time.
     * @param func function which perform the asyncronous work
     */
    constructor( maxWorkers : number, func : ( inp : InpType) => Promise<OutType> ){
        this.maxWorkers = maxWorkers;
        this.func = func;
        this.numRuning=0;
        this.isDisposed= false;
    }

    /**
     * Execute a request.
     * @param inp task input
     * @returns 
     */
    async execute( inp : InpType ) : Promise<OutType|null> {
        if( this.numRuning >= this.maxWorkers ) await this.QueueRequest(); // wait for next slot
        this.numRuning++;
        const res  = this.isDisposed ? null : await this.func(inp);
        this.numRuning--;
        this.DequeueRequest();
        return res;
    }

    /**
     * deallocate all the resources and skip the  one queue, which will have a result of null
     */
    dispose(){
        this.isDisposed=true;
        this.queue.forEach(req => req()); // flush
        this.queue=[];
    }

    // handle the queue of request to wait for the execution.
    private QueueRequest() : Promise<void> {
        return this.isDisposed ? Promise.resolve()  : new Promise( res => this.queue.push(res))
    }

    private DequeueRequest() {
        let req = this.queue.shift();
        if( req ) req();
    }
}