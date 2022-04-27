import Mask, { isMask } from './Mask';
import {Point} from './Types';
import {ImageFactory, isImage} from './ImageBase';
import CanvasUtils from '../utils/CanvasUtils';
import hash, { loadCanvas, testImage } from '../utils/TestUtils';
import ColourModels from './ColourModels';


describe('Mask', ()=>{

    test('shall create an empty mask', ()=>{
        const width = 8;
        const height= 5;
        const mask = new Mask(width, height);
        expect(mask.width).toBe(width);
        expect(mask.height).toBe(height);
        mask.foreachPixel((x,y,v) => expect(v).toBe(false));
    })

    test('shall allow to set and read the values', ()=>{
        const mask = new Mask(8,5);
        const x = 3;
        const y = 2;
        mask.set(x,y,true);
        expect(mask.get(x,y)).toBe(true)

        expect(()=>{
            mask.set(88,2,false);
        }).toThrow();

        expect(()=>{
            mask.get(88,2);
        }).toThrow();
    })

    test('shall calculate the area',()=>{
        const mask = new Mask(8,5);

        mask.set(2,3,true);
        expect(mask.area).toBe(1)

        mask.set(1,3,true);
        expect(mask.area).toBe(2)

        mask.set(1,1,true);
        expect(mask.area).toBe(3)
    })

    test('shall allow to access the pixel array',()=>{
        const width =8;
        const height=5;
        const mask = new Mask(width, height);
        mask.set(2,3,true);
        mask.set(3,1,true);
        mask.set(3,3,true);
        const pixels = mask.imagePixels;
        mask.foreachPixel((x,y,v) => {
            const offset = x+y*width;
            expect(pixels[offset]).toBe(v);
        });
    })

    test('shall look thought all the pixel of the mask', ()=>{
        let nPixels = 0;
        let xMax = 0;
        let yMax = 0;
        const width =8;
        const height=5;
        const mask = new Mask(width, height);
        mask.foreachPixel((x,y,v) => {
            nPixels++;
            xMax = Math.max(x, xMax);
            yMax = Math.max(y, yMax)
        });
        expect( nPixels ).toBe( width*height);
        expect( xMax ).toBe( width-1 );
        expect( yMax ).toBe( height-1 );
    })

    test('shall invert the mask', ()=>{
        const width =8;
        const height=5;
        const mask = new Mask(width, height);
        const xP=3;
        const yP=2;
        mask.set(xP,yP,true);
        mask.Not()
        mask.foreachPixel((x,y,v)=>{
            if( x === xP && y === yP) {
                expect(v).toBe(false);
            } else {
                expect(v).toBe(true);
            }
        })
    })

    test('shall AND two masks',()=>{
        const width =8;
        const height=5;
        const xP=3;
        const yP=2;
        const mask1 = new Mask(width, height);
        const mask2 = new Mask(width, height);

        mask1.set(xP,yP,true);
        mask2.set(xP,yP,true);
        mask1.set(1,1,true);
        mask2.set(2,2,true);

        mask1.And(mask2);

        mask1.foreachPixel((x,y,v)=>{
            if( x === xP && y === yP) {
                expect(v).toBe(true);
            } else {
                expect(v).toBe(false);
            }
        })
    })

    test('shall OR two masks', ()=>{
        const width =8;
        const height=5;
        const mask1 = new Mask(width, height);
        const mask2 = new Mask(width, height);

        const pt1 = [[1,2],[3,2]];
        const pt2 = [[1,2],[2,3]];

        pt1.forEach(v=>mask1.set(v[0],v[1],true));
        pt2.forEach(v=>mask2.set(v[0],v[1],true));

        mask1.Or(mask2);

        mask1.foreachPixel((x,y,v)=>{
            const inP1 = pt1.find(v=>v[0]===x&&v[1]===y);
            const inP2 = pt2.find(v=>v[0]===x&&v[1]===y);
            if( inP1 || inP2 ){
                expect(v).toBe(true)
            } else {
                expect(v).toBe(false)
            }
        })
    })

    test('Shall clone the mask',()=>{
        const width =8;
        const height=5;
        const xP=3;
        const yP=2;
        const mask1 = new Mask(width, height);
        mask1.set(xP, yP, true);
        const mask2 = Mask.Clone(mask1);

        // make sure they are identical
        mask1.foreachPixel((x,y,v)=>{
            expect(mask2.get(x,y)).toBe(v);
        })

        // it shall be a shallow copy
        mask1.set(1,2,true);
        mask1.set(2,2,true);
        mask2.foreachPixel((x,y,v)=>{
            expect(v).toBe(x === xP && y === yP);
        })
    })

    test('shall provide minus operator', ()=>{
        const width =8;
        const height=5;
        const mask1 = new Mask(width, height);
        const mask2 = new Mask(width, height);

        mask1.set(2,3,true);
        mask2.set(2,3,true);

        const xP =3;
        const yP =2;

        mask1.set(xP,yP, true);

        mask1.Minus(mask2);

        mask1.foreachPixel((x,y,v)=>{
            expect(v).toBe( x===xP && y===yP);
        })
    })

    test('shall provide fill operation ', ()=>{
        const width = 128;
        const height= 128;
        const num = 500;

        const NeigbourdPoints : Point [] = [ { x:-1, y:0 },
            { x:1, y:0 },
            { x:0, y:1 },
            { x:0, y:-1 },
            { x:1, y:1 },
            { x:-1, y:1 },
            { x:1, y:-1 },
            { x:-1, y:-1 }
        ]

        const mask = new Mask(width, height);

        const xSeed = width/4;
        const ySeed = height/2

        let x = xSeed;
        let y = ySeed;

        // generate a random path between 0 to width-10
        for(let i=0; i<num; i++ ){
            mask.set(x,y,true);
            const index = Math.floor( Math.random() * NeigbourdPoints.length );
            const pt = NeigbourdPoints[index];
            x += pt.x;
            y += pt.y;
            
            x = Math.min(x, width-10-1);
            x = Math.max(x, 0 );
            y = Math.min(y, height-1);
            y = Math.max(y, 0)
        }

        // add two extra point in the are not covered by the path
        mask.set(width-5, height/2, true);
        mask.set(width-5, height/2+1, true);

        // get connected components.
        const cMask = mask.Fill(xSeed, ySeed);

        expect(cMask.area).toBe(mask.area-2);

        cMask.foreachPixel((x,y,v)=>{
            if( x < width-10 ){
                expect(v).toBe(mask.get(x,y))
            } else {
                expect(v).toBe(false);
            }
        })
    })

    test('shall provide the dilate operation', ()=>{
        const width = 128;
        const height= 128;
        const num = 500;
        const mask = new Mask(width,height);

        for(let n=0; n<num; n++ ){
            const x = Math.floor(Math.random()*width);
            const y = Math.floor(Math.random()*height);
            mask.set(x,y,true);
        }
        mask.set(10,10,true);

        const halfMask = 1;
        const dMask = mask.Dilate(halfMask);
        expect(dMask.area).toBeGreaterThan(mask.area);

        dMask.foreachPixel((x,y,v)=>{
                if( x>= halfMask && x<width-halfMask && y>=halfMask && y<height-halfMask ){
                // there must be a pixel set to true in the mask
                const xMin = Math.max(0, x-halfMask);
                const xMax = Math.min(width, x+halfMask+1);
                const yMin = Math.max(0, y-halfMask);
                const yMax = Math.min(height, y+halfMask+1);
                let val = false;
                for( let yK = yMin; yK<yMax; yK++){
                    for(let xK=xMin; xK<xMax; xK++) {
                        val ||= mask.get(xK,yK);
                    }
                }
                expect(v).toBe(val);
            }
        })
    })

    test('shall provide instance of',()=>{
        const myMask = new Mask(4,8);
        const myImage= ImageFactory.Uint8(4,8);

        expect (isMask(myMask)).toBeTruthy();
        expect (isMask(myImage)).toBeFalsy();
        expect (isImage(myMask)).toBeFalsy();
        expect (isImage(myImage)).toBeTruthy();
    })

    test('shall overlay the mask on the image', async ()=>{
        const canvas = await loadCanvas(testImage,8);
        const imgData= CanvasUtils.GetImageData(canvas);
        const {hue, sat } = ColourModels.toHSV(imgData);
        const mask = new Mask(sat.width, sat.height);
        const maskPixels = mask.imagePixels;
        const thr = 80/255;
        sat.imagePixels.forEach((v,i)=>{ maskPixels[i] = v < thr; })
        const bMask = mask.Fill(1,1); // hole filling
        bMask.Overlay(imgData,{r:0, g:0, b:0, a:128 });
        CanvasUtils.PutImageData(canvas,imgData);
        const hsh1 = await hash(canvas,'overlay');
        expect(hsh1).toMatchSnapshot();
        const line = bMask.Dilate(1);
        line.Minus(bMask);
        line.Overlay(imgData,{r:255,g:255,b:0});
        CanvasUtils.PutImageData(canvas, imgData);
        const hsh2 = await hash(canvas,'overlay-line');
        expect(hsh2).toMatchSnapshot();
    })

    test('shall return the connected components',async()=>{
        const canvas = await loadCanvas(testImage,12);
        const imgData= CanvasUtils.GetImageData(canvas);
        const {hue, sat } = ColourModels.toHSV(imgData);
        const mask = new Mask(sat.width, sat.height);
        const maskPixels = mask.imagePixels;
        const thr = 80/255;
        sat.imagePixels.forEach((v,i)=>{ maskPixels[i] = v < thr; })
        const bMask = mask.Fill(1,1); // hole filling
        const dMask = bMask.Dilate(1); // split small bridges
        dMask.Not(); // foreground components
        const masks = dMask.Components(8);
        // draw on a mask
        const colours = [ {r:255,g:255,b:0}, {r:255,g:0,b:0}, {r:0,g:255,b:0}, {r:0,g:255,b:255}, 
                          {r:255,g:255,b:255}, {r:255,g:0,b:255}, {r:0,g:0,b:255}, {r:0,g:0,b:0}];
        masks.forEach((m,i)=>{
            const d = m.Dilate(1);
            d.Minus(m)
            d.Overlay(imgData,colours[i])
        })
        CanvasUtils.PutImageData(canvas,imgData);
        const hsh = await hash(canvas,'components')
        expect(hsh).toMatchSnapshot();
    })

    test('Shall determine the bounding box', async()=>{
        const canvas = await loadCanvas(testImage,12);
        const imgData= CanvasUtils.GetImageData(canvas);
        const {hue, sat } = ColourModels.toHSV(imgData);
        const mask = new Mask(sat.width, sat.height);
        const maskPixels = mask.imagePixels;
        const thr = 90/255;
        sat.imagePixels.forEach((v,i)=>{ maskPixels[i] = v < thr; })
        const dMask = mask.Dilate(1);
        dMask.Not(); 
        dMask.Overlay(imgData,{r:255,g:255,b:0,a:255});
        CanvasUtils.PutImageData(canvas,imgData);
        const bbx = dMask.Boundaries();
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = "#FF0000";
        ctx.beginPath()
        ctx.rect(bbx.ulc.x, bbx.ulc.y, bbx.lrc.x-bbx.ulc.x, bbx.lrc.y-bbx.ulc.y);
        ctx.stroke();
        const hsh = await hash(canvas,'bounding box');
        expect(hsh).toMatchSnapshot();
    })
})

