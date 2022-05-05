import WorkerPool from "./WorkerPool";

describe('Worker Pool',()=>{

    class Worker {
        private url : string;
        public onmessage: (()=>void)|null;
        public onmessageerror: (()=>void)|null;
        constructor(stringUrl:string) {
          this.url = stringUrl;
          this.onmessage = null;
          this.onmessageerror=null;
        }
        postMessage(msg:string) {}
        terminate() {}
        addEventListener() {}
        removeEventListener() {}
        dispatchEvent():boolean {return true}
        onerror(){}

      }

    test('shall cache the workers', ()=>{

        let numAllocated = 0;
        const allocator = () : Worker =>{
            numAllocated++;
            return new Worker('nonExistant.js')
        }

        const workerPool = new WorkerPool(allocator)

        const w1 = workerPool.get();
        const w2 = workerPool.get();

        expect(numAllocated).toBe(2);

        workerPool.release(w1);
        workerPool.release(w2);

        let wrk = workerPool.get();
        expect(numAllocated).toBe(2); // shall reuse
        expect(wrk == w1).toBe(true)

    })
})