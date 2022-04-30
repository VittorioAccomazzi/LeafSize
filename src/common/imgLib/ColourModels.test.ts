import ColourModels  from "./ColourModels";
import CanvasUtils from "../utils/CanvasUtils";
import {Canvas} from 'canvas'
import hash, { loadCanvas, testImage, nodeCanvasImageDataAllocator } from "../utils/TestUtils";

describe('ColourModels', ()=>{

    ColourModels.SetImageDataAllocator(nodeCanvasImageDataAllocator);

    test('shall decompose RGB colour in HSV', ()=>{
        let width = 16
        let height= 16
        let canvas = new Canvas (width,height)
        let ctx = canvas.getContext('2d')
        ctx.fillStyle="#FFA0B0"
        ctx.fillRect(0,0,width/2,height/2)
        ctx.fillStyle="#00A0B0"
        ctx.fillRect(width/2,height/2,width/2,height/2)
        ctx.fillStyle="#A000B0"
        ctx.fillRect(0,height/2,width/2,height/2)
        ctx.fillStyle="#A0FF00"
        ctx.fillRect(width/2,0,width/2,height/2)

        const imgData = CanvasUtils.GetImageData(canvas);

        const { hue :hImg, sat : sImg, val : vImg} = ColourModels.toHSV(imgData)
    
        // using https://www.rapidtables.com/convert/color/rgb-to-hsv.html
    
        let x = 4
        let y = 4
        expect(hImg.get(x,y)).toBeCloseTo(350,0)
        expect(sImg.get(x,y)).toBeCloseTo(0.373,2)
        expect(vImg.get(x,y)).toBeCloseTo(1,2)
    
        x = 12
        y = 12
        expect(hImg.get(x,y)).toBeCloseTo(185,0)
        expect(sImg.get(x,y)).toBeCloseTo(1,2)
        expect(vImg.get(x,y)).toBeCloseTo(0.69,2)
    
        x = 4
        y = 12
        expect(hImg.get(x,y)).toBeCloseTo(295,0)
        expect(sImg.get(x,y)).toBeCloseTo(1,2)
        expect(vImg.get(x,y)).toBeCloseTo(0.69,2)
    
        x = 12
        y = 4
        expect(hImg.get(x,y)).toBeCloseTo(82,0)
        expect(sImg.get(x,y)).toBeCloseTo(1,2)
        expect(vImg.get(x,y)).toBeCloseTo(1,2)
    
    })

    test('shall decompose the image in HSV', async ()=>{

        const canvas = await loadCanvas(testImage,8);
        const imgData= CanvasUtils.GetImageData(canvas);
        const {hue, sat, val} = ColourModels.toHSV(imgData);

        [hue, sat, val].forEach( (v)=>{
            expect(v.width).toBe(canvas.width);
            expect(v.height).toBe(canvas.height);
        })

        const recData = ColourModels.fromHSV(hue, sat, val );
        // the difference shall be minimal
        const maxError = 2;
        recData.data.forEach((v,i)=>Math.abs(v-imgData.data[i])<maxError);

        // generate hash of the hue, sat and val images for reference and inspection
        const h8bit = CanvasUtils.toCanvas(hue.convertTo8Uint( 254/360,0));
        const s8bit = CanvasUtils.toCanvas(sat.convertTo8Uint( 254, 0));
        const v8bit = CanvasUtils.toCanvas(val.convertTo8Uint( 254, 0) );

        const hHash = await hash(h8bit,'hue');
        const sHash = await hash(s8bit,'sat');
        const vHash = await hash(v8bit,'val');

        expect (hHash).toMatchSnapshot();
        expect (sHash).toMatchSnapshot();
        expect (vHash).toMatchSnapshot();

    })

    test('shall decompose in LAB',()=>{
        let width = 16
        let height= 16
        let canvas = new Canvas (width,height)
        let ctx = canvas.getContext('2d')
        ctx.fillStyle="#FFA0B0"
        ctx.fillRect(0,0,width/2,height/2)
        ctx.fillStyle="#00A0B0"
        ctx.fillRect(width/2,height/2,width/2,height/2)
        ctx.fillStyle="#A000B0"
        ctx.fillRect(0,height/2,width/2,height/2)
        ctx.fillStyle="#A0FF00"
        ctx.fillRect(width/2,0,width/2,height/2)
        const imgData = CanvasUtils.GetImageData(canvas);
        const {l : lImg, a : aImg, b : bImg} = ColourModels.toLab(imgData)
    
        // using http://colormine.org/convert/rgb-to-lab
    
        let x = 4
        let y = 4
        expect(lImg.get(x,y)).toBeCloseTo(75.78,1)
        expect(aImg.get(x,y)).toBeCloseTo(37.18,1)
        expect(bImg.get(x,y)).toBeCloseTo(6.68,1)
    
        x = 12
        y = 12
        expect(lImg.get(x,y)).toBeCloseTo(60.13,1)
        expect(aImg.get(x,y)).toBeCloseTo(-28.77,1)
        expect(bImg.get(x,y)).toBeCloseTo(-18.20,1)
    
        x = 4
        y = 12
        expect(lImg.get(x,y)).toBeCloseTo(38.91,1)
        expect(aImg.get(x,y)).toBeCloseTo(71.84,1)
        expect(bImg.get(x,y)).toBeCloseTo(-50.84,1)
    
        x = 12
        y = 4
        expect(lImg.get(x,y)).toBeCloseTo(91.23,1)
        expect(aImg.get(x,y)).toBeCloseTo(-57.88,1)
        expect(bImg.get(x,y)).toBeCloseTo(87.42,1)
    
    })

    test('shall decompose the image in LAB', async ()=>{
        const canvas = await loadCanvas(testImage,8);
        const imgData= CanvasUtils.GetImageData(canvas);
        const {l, a, b} = ColourModels.toLab(imgData);

        [l, a, b].forEach( (v)=>{
            expect(v.width).toBe(canvas.width);
            expect(v.height).toBe(canvas.height);
        })

        const recData = ColourModels.fromLab(l, a, b );
        // the difference shall be minimal
        const maxError = 2;
        recData.data.forEach((v,i)=>Math.abs(v-imgData.data[i])<maxError);

        // generate hash of the hue, sat and val images for reference and inspection
        const h8bit = CanvasUtils.toCanvas(l.convertTo8Uint( 254/100,0));
        const s8bit = CanvasUtils.toCanvas(a.convertTo8Uint( 254/256, 128*254/256));
        const v8bit = CanvasUtils.toCanvas(b.convertTo8Uint( 254/256, 128*254/256));

        const hHash = await hash(h8bit,'l');
        const sHash = await hash(s8bit,'a');
        const vHash = await hash(v8bit,'b');

        expect (hHash).toMatchSnapshot();
        expect (sHash).toMatchSnapshot();
        expect (vHash).toMatchSnapshot();

    })

})