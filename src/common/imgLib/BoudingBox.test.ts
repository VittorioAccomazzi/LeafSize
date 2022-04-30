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
})