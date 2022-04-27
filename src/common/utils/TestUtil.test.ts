import hash, {testImage, loadCanvas } from './TestUtils'
import CanvasUtils from './CanvasUtils'


describe('TestUtils', ()=>{

    it('shall generate consistent hash', async ()=>{
        const canvas = await loadCanvas(testImage,4);
        const hash1  = await hash(canvas,'canvas');
        const htmlCnv= CanvasUtils.toHTML(canvas);
        const hash2  = await hash(htmlCnv,'htmlCanvas');
        const canvas1= CanvasUtils.fromHTML(htmlCnv);
        const hash3  = await hash(canvas1,'canvas1')
        
        expect(hash1).toBe(hash3);
        expect(hash2).toBe(hash3);
    })
})