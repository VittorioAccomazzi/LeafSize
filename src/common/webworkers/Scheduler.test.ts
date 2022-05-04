import Scheduler from "./Scheduler";
import {wait} from '../utils/FileUtils'

describe('scheduler', ()=>{

    test('shall honor the max number of request', async()=>{

        const numWorkers = 100;
        const maxWorkers = 5;

        let numExecuting = 0
        let invokations : number[] = [];

        const worker = async ( num : number ) : Promise<void> => { 
            numExecuting++;
            invokations.push(numExecuting);
            await wait(num); 
            numExecuting--;
        }

        const workers : number [] = new Array<number>(numWorkers).fill(Math.random()*100+100); 

        // request all the workers at once:
        const scheduler = new Scheduler<number, void>( maxWorkers, worker );
        const promises = workers.map(v=>scheduler.execute(v));
        await Promise.all(promises);

        expect(invokations.length).toBe(numWorkers);

        // make sure that we a number of invokation which is less then maxWorkers and not decreasing
        invokations.forEach((v,i)=>{
            expect(v).toBeLessThanOrEqual(maxWorkers);
            if( i> 0 ) expect(v).toBeGreaterThanOrEqual(invokations[i-1]);
        })

    })

    test('shall honor the request order', async()=>{

        const numWorkers = 80;
        const maxWorkers = 6;

        let invokations : number[] = [];

        const worker = async ( id : number ) : Promise<void> => { 
            invokations.push(id);
            const ms = Math.random()*100+100;
            await wait(ms); 
        }

        // request all the workers at once:
        const scheduler = new Scheduler<number, void>( maxWorkers, worker );

        const promises : Promise<void>[] = [];
        for( let id = 0; id<numWorkers; id++ ) promises[id] = scheduler.execute(id);

        await Promise.all(promises);

        invokations.forEach((v,i)=>expect(v).toBe(i));
    })
})