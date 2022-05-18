import hash, { loadCanvas, testImage } from '../../common/utils/TestUtils';
import ImageLoader, { ImgLoaderFile, ImgLoaderFileHandle } from '../foreground/ImageLoader';
import CanvasUtils from '../../common/utils/CanvasUtils';
import LeafSeg, { BackgroundType } from './LeafSeg'


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

    const getImageFromFile = async ( ) : Promise<ImageBitmap> => {
        const image = await loadCanvas(testImage);
        return image as unknown as ImageBitmap; 
    }
    const targetSize = 1024
    const files = [new FileHandleMock() ]
    const emptySet = new Set<number>();

    test('shall measure the leaf correctly', async()=>{

        const imgLoader = new ImageLoader(files, 4, targetSize, getImageFromFile);

        expect(imgLoader.List.length).toBe(4);

        const htmlCnv = document.createElement('canvas');
        const hueThr = 68;
        const satThr = 91;
        const refArea= [[421701,365059], [514353,351194], [246855,197252], [472529,387532]];
        const error = 2; // in persentage

        for( const [idx, name] of imgLoader.List.entries() ){
            const { scale, imgData } = await imgLoader.getImage(idx);
            const {areas} = await LeafSeg.Process(imgData!, hueThr, satThr, 2, emptySet, emptySet);
            CanvasUtils.PutImageData(htmlCnv,imgData!);
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

    test('shall retun a transparent image', async ()=>{
        const imgLoader = new ImageLoader(files, 1, targetSize, getImageFromFile);

        expect(imgLoader.List.length).toBe(1);

        const htmlCnv = document.createElement('canvas');
        const hueThr = 68;
        const satThr = 91;
        const { imgData } = await imgLoader.getImage(0);
        await LeafSeg.Process(imgData!, hueThr, satThr, 2, emptySet, emptySet, BackgroundType.Transparent);
        CanvasUtils.PutImageData(htmlCnv,imgData!);
        const hsh     = await hash(htmlCnv, 'transparent' );
        expect(hsh).toMatchSnapshot();
    })

})