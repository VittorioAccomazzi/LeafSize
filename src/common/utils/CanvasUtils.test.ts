import CanvasUtils from "./CanvasUtils";
import hash, {loadCanvas, testImage} from './TestUtils'

describe('CanvasUtils',  ()=>{
    test('it shall allow to export and import data', async()=>{
        const canvas1= await loadCanvas(testImage,8);
        const data   = CanvasUtils.GetImageData(canvas1);
        const hash1  = await hash(canvas1,'canvas1');
        const canvas2= document.createElement('canvas');
        canvas2.width = canvas1.width;
        canvas2.height= canvas1.height;
        CanvasUtils.PutImageData(canvas2,data);
        const hash2 = await hash(canvas2,'canvas2');

        expect(hash1).toBe(hash2);
    })
})