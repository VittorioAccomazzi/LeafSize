import hash, { loadCanvas, testImage } from '../../common/utils/TestUtils';
import ImageLoader, { ImgLoaderFile, ImgLoaderFileHandle } from '../foreground/ImageLoader';
import CanvasUtils from '../../common/utils/CanvasUtils';
import LeafSeg, { BackgroundType } from './LeafSeg'
import { Point } from '../../common/imgLib/Types';


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
                const rescaled = area.leaf / ( scale * scale );
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

    test('shall measure the pathogen', async()=>{

        const getVals = (imgData : ImageData, pt : Point, radius : number, set : Set<number> ) => {
            const xMin = pt.x-radius;
            const yMin = pt.y-radius;
            const xMax = pt.x+radius;
            const yMax = pt.y+radius;
            for( let y=yMin; y<yMax; y++ ){
                for( let x=xMin; x<xMax; x++ ){
                    const dx = x-pt.x;
                    const dy = y-pt.y;
                    if( dx*dx+dy*dy<radius*radius ){
                        let ptr = ( y*imgData.width+x ) * 4;
                        let r = imgData.data[ptr++];
                        let g = imgData.data[ptr++];
                        let b = imgData.data[ptr++];
                        let val = LeafSeg.Pack(r,g,b);
                        set.add(val);
                        ptr -=3;
                        imgData.data[ptr++]/=2;
                        imgData.data[ptr++]/=2;
                        imgData.data[ptr++]/=2;
                    }
                }
            }
        }

        const imgLoader = new ImageLoader(files, 4, targetSize, getImageFromFile);

        expect(imgLoader.List.length).toBe(4);

        const htmlCnv = document.createElement('canvas');
        const hueThr = 68;
        const satThr = 91;
        const refPoint : Point [] =[
            {x:333,y:280}, {x:577,y:269}, 
            {x:340,y:324}, {x:513,y:260},
            {x:366,y:280}, {x:522,y:287},
            {x:338,y:319}, {x:536,y:247}
        ];
        const error = 2; // in persentage
        const radius= 30;
        const pathSet = new Set<number>();

        for( const [index, point] of refPoint.entries() ){
            const imgIndex = index/2 |0;
            const { imgData } = await imgLoader.getImage(imgIndex); 
            getVals(imgData!, point, radius, pathSet);
            CanvasUtils.PutImageData(htmlCnv,imgData!);
            const hsh = await hash(htmlCnv, `${index}-sample` );
            expect(hsh).toMatchSnapshot();
        }

        const res = [
            { leaf: 34325, path :7473 }, { leaf: 29743, path :6896 },
            { leaf: 41828, path :8142 }, { leaf: 28623, path :6588 },
            { leaf: 20141, path :10739}, { leaf: 16121, path :7337 },
            { leaf: 38463, path :7423 }, { leaf: 31542, path :10774}
        ]

        for( const [idx, name] of imgLoader.List.entries() ){
            const { imgData } = await imgLoader.getImage(idx);
            const {areas} = await LeafSeg.Process(imgData!, hueThr, satThr, 2, emptySet, pathSet);
            CanvasUtils.PutImageData(htmlCnv,imgData!);
            const hsh     = await hash(htmlCnv, `${name}-outline` );
            expect(hsh).toMatchSnapshot();
            let baseIndex = 2 * idx;
            areas.forEach(({leaf, path}, index)=>{
                const leafBaseline = res[baseIndex+index].leaf;
                const pathBaseline = res[baseIndex+index].path;
                expect(Math.abs(leaf-leafBaseline)).toBeLessThan(error/100*leafBaseline);
                expect(Math.abs(path-pathBaseline)).toBeLessThan(error/100*pathBaseline);
            }) 
        } 
    })

})