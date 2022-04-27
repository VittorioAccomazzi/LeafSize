import ImageLoader , {ImgLoaderFileHandle, ImgLoaderFile} from './ImageLoader';
import {loadImage } from 'canvas';
import hash, { loadCanvas, testImage } from '../../common/utils/TestUtils'
import CanvasUtils from '../../common/utils/CanvasUtils';


// for the interface declaration with constructor refer to 
// https://fettblog.eu/typescript-interface-constructor-pattern/

class FileHandleMock<T extends ImgLoaderFile> implements ImgLoaderFileHandle {
    private filename = '';
    private factory : new ()=> T;

    constructor ( name : string, factory : new ()=>T ){
        this.filename = name
        this.factory = factory;
    }
    get name() : string {
        return this.filename;
    }
    async getFile () {
        const val : T = new this.factory();
        return val;
    }
}

describe('ImageLoader File list',()=>{

    class EmptyFileMock implements ImgLoaderFile  {
        constructor() {}
        async arrayBuffer() {
            return new ArrayBuffer(0)
        }
    }

    const files : FileHandleMock<EmptyFileMock> [] =[
        new FileHandleMock<EmptyFileMock>('image1.jpg',EmptyFileMock),
        new FileHandleMock<EmptyFileMock>('file.txt',EmptyFileMock),
        new FileHandleMock<EmptyFileMock>('name',EmptyFileMock)
    ]

    const names1 = [
        'image1',
        'file',
        'name'
    ]

    const names4 = [
        'image1-Q0',
        'image1-Q1',
        'image1-Q2',
        'image1-Q3',
        'file-Q0',
        'file-Q1',
        'file-Q2',
        'file-Q3',
        'name-Q0',
        'name-Q1',
        'name-Q2',
        'name-Q3'
    ]
    
    test('dish 1 use case',()=>{
        const imageLoader = new ImageLoader(files, 1, 1000 );
        expect(imageLoader.List).toStrictEqual(names1)
    })

    test('dish 4 use case',()=>{
        const imageLoader = new ImageLoader(files, 4, 1000);
        expect(imageLoader.List).toStrictEqual(names4)
    })

    test('shall throw if dishes is wrong',()=>{
        expect(()=>{
            new ImageLoader(files, 3, 1000)
        }).toThrow()
    })
      
})


describe('ImageLoader', ()=>{

    const imageDownsample = 4;

    class CanvasFileMock implements ImgLoaderFile  {
        constructor() {}
        async arrayBuffer() {
            const canvas =  await loadCanvas(testImage,imageDownsample);
            return canvas.toBuffer().buffer;
        }
    }

    const files : FileHandleMock<CanvasFileMock> [] =[
        new FileHandleMock<CanvasFileMock>('SampleImage.jpg',CanvasFileMock)
    ];


    const getImageFromFile = async ( handle : ImgLoaderFileHandle) : Promise<HTMLImageElement> => {
        const file = await handle.getFile();
        const buffer= await file.arrayBuffer();
        const image = await loadImage(Buffer.from(buffer));
        return image as unknown as HTMLImageElement; 
    }

    it('shall split the images properly', async ()=>{

        let numInvocations = 0;
        const getImageWithCount= async ( handle : ImgLoaderFileHandle) : Promise<HTMLImageElement> => {
            numInvocations++
            return getImageFromFile(handle);
        }

        const imgLoader = new ImageLoader( files, 4, 600, getImageWithCount );
        expect(imgLoader.List.length).toBe(4);
        const canvas = document.createElement('canvas');
        for( let i=0; i<imgLoader.List.length; i++ ){
            const {imageData} = await imgLoader.getImage(i);
            CanvasUtils.PutImageData(canvas,imageData!);
            const fileName = `canvas-${i}`;
            const hsh = await hash(canvas, fileName);
            expect(hsh).toMatchSnapshot();
        }

        expect(numInvocations).toBe(1);

    })

    it('shall scale the image properly', async ()=>{
        // this test relies on the actual image size
        const orgWidth = 6000;
        const orgHeight= 4000;
        let actWidth = orgWidth/imageDownsample;
        let actHeight= orgHeight/imageDownsample;
        actWidth /= 2; // since we have 4 dishes in an image
        actHeight/= 2; 
        const actualDig= Math.sqrt(actWidth*actWidth+actHeight*actHeight);
        const expScale = 0.5;
        const expectDig= actualDig*expScale;

        const imgLoader = new ImageLoader( files, 4, expectDig, getImageFromFile );
        expect(imgLoader.List.length).toBe(4);
        const canvas = document.createElement('canvas');
        for( let i=0; i<imgLoader.List.length; i++ ){
            const  { scale, imageData} = await imgLoader.getImage(i);
            CanvasUtils.PutImageData(canvas, imageData!);
            expect(scale).toBeCloseTo(expScale,2);

        }
    })

})