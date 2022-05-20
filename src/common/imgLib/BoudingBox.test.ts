import Masks  from './Mask'
import BoundingBox from "./BoundingBox";


describe('Bounding Box', ()=>{

    test('it shall generate bounding box from points', ()=>{
        let pt1 = {x:2, y:3};
        let pt2 = {x:1, y:5};
        let bbx = BoundingBox.FromPoints(pt1,pt2);
        expect(bbx).toStrictEqual({
            ulc : {x :1, y: 3},
            size: {width:1, height:2}
        })
    })

    test('it shall generate bounding box from values', ()=>{
        let xmin = 5;
        let xmax = 8;
        let ymin = 2;
        let ymax = 4;
        let bbx = BoundingBox.FromValues(xmax, ymin, xmin, ymax);
        expect(bbx).toStrictEqual({
            ulc : {x:5, y:2},
            size: {width: 3, height:2}
        })
    })

    test('it shall merge bouding boxes', ()=>{
        const bbx1 = {
            ulc : {x:5, y:2},
            size: {width: 3, height:2}        
        }
        const bbx2 = {
            ulc : {x:1, y:3},
            size: {width:1, height:2}
        }
        const mrg = BoundingBox.Merge([bbx1, bbx2]);
        expect(mrg).toStrictEqual({
            ulc : {x: 1, y:2},
            size: {width: 7, height: 3}
        })
    })

    test('shall dilate the bounding box', ()=>{
        const bbx1 = {
            ulc : {x:5, y:2},
            size: {width: 3, height:2}        
        }
        let bbx = BoundingBox.Dilate(bbx1, 2, 3);
        expect(bbx).toStrictEqual({
            ulc : {x:3, y:-1},
            size: {width:7, height:8}
        })      
    })

    test('shall intersect bounding boxes',()=>{
        const bbx1 = {
            ulc : {x:5, y:2},
            size: {width: 3, height:2}        
        }
        const bbx2 = {
            ulc : {x:1, y:3},
            size: {width:1, height:2}
        }
        const bbx3 = {
            ulc : {x:1, y:3},
            size: {width:5, height:2}
        }
        const mrg1 = BoundingBox.Intersect([bbx1, bbx2]);
        expect(mrg1).toStrictEqual({
            ulc : {x: 5, y:3},
            size: {width: -3, height: 1}
        })
        const mrg2 = BoundingBox.Intersect([bbx1, bbx3]);
        expect(mrg2).toStrictEqual({
            ulc : {x: 5, y:3},
            size: {width: 1, height: 1}
        })
    })

    test('shall check if the bounding box is empty',()=>{
        const box1 = {
            ulc : {x: 5, y:3},
            size: {width: -3, height: 1}
        }
        const box2 = {
            ulc : {x: 5, y:3},
            size: {width: 2, height: 1}
        }
        expect(BoundingBox.IsEmpty(box1)).toBeTruthy();
        expect(BoundingBox.IsEmpty(box2)).toBeFalsy();
    })

    test('Shall crop Mask', ()=>{
        const rndPixel = ()=>Math.random() < 0.5;
        const width = 123;
        const height= 182;
        const lrgMask = new Masks(width, height);
        const lrgPixels = lrgMask.imagePixels;
        lrgPixels.forEach((v,i)=>lrgPixels[i]=rndPixel()); // random mask
        const bbox = BoundingBox.FromValues(13, 8, 121, 99);
        const smlMask = BoundingBox.CropMask(bbox, lrgMask);
        expect(smlMask.area).toBeLessThanOrEqual(lrgMask.area);
        smlMask.foreachPixel((x,y,v)=>{
            const xLrg = x + bbox.ulc.x;
            const yLrg = y + bbox.ulc.y;
            expect(lrgMask.get(xLrg,yLrg)).toBe(v)
        })
    })

    test('shall crop mask and handle case in which the mask is outside', ()=>{
        const lrgMask = new Masks( 21, 81);
        lrgMask.set(10,50, true);
        expect( lrgMask.area).toBe(1);
        const bbox = BoundingBox.FromValues(9,49, 200, 500);
        const smlMask = BoundingBox.CropMask(bbox, lrgMask);
        expect(smlMask.width).toBeLessThan(bbox.size.width);
        expect(smlMask.height).toBeLessThan(bbox.size.height);
        expect(smlMask.area).toBe(1);
        expect(smlMask.get(1,1)).toBe(true);
    })
})