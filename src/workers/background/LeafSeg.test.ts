import hash, { loadCanvas, testImage } from '../../common/utils/TestUtils';
import ImageLoader, { ImgLoaderFile, ImgLoaderFileHandle } from '../foreground/ImageLoader';
import {loadImage} from 'canvas'
import CanvasUtils from '../../common/utils/CanvasUtils';
import LeafSeg from './LeafSeg'
import {Canvas} from 'canvas'
import { act } from 'react-dom/test-utils';
import { assert } from 'console';


describe('LeafSeg',()=>{

    class EmptyFileMock implements ImgLoaderFile  {
        constructor() {}
        async arrayBuffer() {
            return new ArrayBuffer(0)
        }
    }
    
    class FileHandleMock implements ImgLoaderFileHandle {
        public name : string = 'image';
        async getFile () { return new EmptyFileMock() }
    }

    test('shall measure the leaf correctly', async()=>{

        const getImageFromFile = async ( ) : Promise<HTMLImageElement> => {
            const image = await loadCanvas(testImage);
            return image as unknown as HTMLImageElement; 
        }

        const targetSize = 1024
        const files = [new FileHandleMock() ]
        const imgLoader = new ImageLoader(files, 4, targetSize, getImageFromFile);

        expect(imgLoader.List.length).toBe(4);

        const htmlCnv = document.createElement('canvas');
        const hueThr = 68;
        const satThr = 91;
        const refArea= [[421701,365059], [514353,351194], [246855,197252], [472529,387532]];
        const error = 2; // in persentage

        for( const [idx, name] of imgLoader.List.entries() ){
            const { scale, imageData } = await imgLoader.getImage(idx);
            const {areas} = await LeafSeg.Process(imageData!, hueThr, satThr, 2);
            CanvasUtils.PutImageData(htmlCnv,imageData!);
            const hsh     = await hash(htmlCnv, name );
            areas.forEach((area,index)=>{
                const rescaled = area / ( scale * scale );
                const target   = refArea[idx][index];
                const percErr  = Math.abs(rescaled-target)/target *100;
                expect(percErr).toBeLessThan(error);
            })
            expect(hsh).toMatchSnapshot();
        }
    })

})