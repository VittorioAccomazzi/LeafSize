
/**
 * Maintain a pool of web workers.
 * Notice : it assumes that the caller manages the _number_ of workers
 */
export default class WorkerPool {
    private pool : Worker [];
    private allocator : ()=>Worker;

    constructor( allocator : ()=>Worker ) {
        this.allocator = allocator;
        this.pool = [];
    }

    /**
     * get a worker
     */
    get() : Worker {
        let worker = this.pool.shift();
        if( !worker ) worker = this.allocator();
        return worker;
    }

    /**
     * release a worker
     * @param worker worker to release
     */
    release( worker : Worker ) {
        worker.onmessage = null;
        this.pool.push(worker);
    }
}