import Pacer from "./Pacer";
import {wait} from './FileUtils'

describe('Pacer', ()=>{
    it('shall delay the righ ammount', async () =>{
        const delay = 150;
        const start = Date.now();
        const pacer = new Pacer(delay);
        pacer.delayAction(()=>{
            const end = Date.now();
            expect(end-start).toBeGreaterThanOrEqual(delay*0.95);// 5% tollerance
        })
    })

    it('shall pace multiple calls', async()=>{
        const delay = 150;
        const fastD = 10;
        const pacer = new Pacer(delay);
        let nInvoked =0;

        pacer.delayAction(()=>{ throw new Error ('this should not be invoked.')});
        await wait(fastD);
        pacer.delayAction(()=>{ throw new Error ('this should not be invoked as well.')} );
        await wait(fastD);
        pacer.delayAction(()=> nInvoked++);
        await wait(delay)

        expect(nInvoked).toBe(1);

    })

    it('shall pace multiple calls', async()=>{
        const delay = 150;
        const fastD = 20;
        const pacer = new Pacer(delay);
        let nInvoked =0;

        for( let i=0; i<2*delay/fastD; i++ ){
            pacer.delayAction(()=>{ throw new Error(`Iteration ${i} : this should not be invoked.`)} );
            await wait(fastD);
        }
        pacer.delayAction(()=> nInvoked++);
        await wait(delay)

        expect(nInvoked).toBe(1);
    })

})