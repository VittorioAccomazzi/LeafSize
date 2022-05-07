import { Canvas } from "canvas";
import BoundingBox from "../../common/imgLib/BoundingBox";
import { Bbox } from "../../common/imgLib/Types";
import hash, { nodeCanvasImageDataAllocator } from "../../common/utils/TestUtils";
import LeafCrop from "./LeafCrop";

describe('LeafCrop', ()=>{

    BoundingBox.SetImageDataAllocator(nodeCanvasImageDataAllocator);

    test('shall crop the image',async ()=> {
        const width = 512;
        const height= 512;
        const canvas = new Canvas(width, height);
        const ctx = canvas.getContext('2d');
        const bbx : Bbox = {ulc: {x:50, y:82}, size:{width:339, height:280}}
        ctx.fillStyle="#FFFFFF";
        ctx.clearRect(0,0,width,height );
        ctx.beginPath();
        ctx.strokeStyle="#0000FF";
        ctx.rect(bbx.ulc.x,bbx.ulc.y, bbx.size.width, bbx.size.height);
        ctx.stroke();
        const imgData = ctx.getImageData(0,0,width,height);
        const res = LeafCrop.Process([10], [bbx], imgData, 1);
        const cnv = new Canvas(res.imgData.width, res.imgData.height );
        const cts = cnv.getContext('2d');
        cts.putImageData(res.imgData, 0,0)
        const hsh = await hash(cnv,"cropped 1 box")
        expect(hsh).toMatchSnapshot();
    })

    test('shall merge bounding boxes',async ()=>{
        const width = 512;
        const height= 512;
        const canvas = new Canvas(width, height);
        const ctx = canvas.getContext('2d');
        const bbx1 : Bbox = {ulc: {x:40, y:52}, size:{width:50, height:98}};
        const bbx2 : Bbox = {ulc: {x:382, y:403}, size:{width:8, height:5}};
        const bbxs = [bbx1, bbx2];
        ctx.fillStyle="#FFFFFF";
        ctx.clearRect(0,0,width,height );
        ctx.beginPath();
        ctx.strokeStyle="#FFFF00";
        bbxs.forEach(bbx => ctx.rect(bbx.ulc.x,bbx.ulc.y, bbx.size.width, bbx.size.height))
        ctx.stroke();
        const imgData = ctx.getImageData(0,0,width,height);
        const res = LeafCrop.Process([10], bbxs, imgData, 1);
        const cnv = new Canvas(res.imgData.width, res.imgData.height );
        const cts = cnv.getContext('2d');
        cts.putImageData(res.imgData, 0,0)
        const hsh = await hash(cnv,"cropped 2 box")
        expect(hsh).toMatchSnapshot();
    })

    test('with empty bounding box shall return the entire image', async ()=>{
        const width = 512;
        const height= 512;
        const canvas = new Canvas(width, height);
        const ctx = canvas.getContext('2d');
        const bbx1 : Bbox = {ulc: {x:40, y:52}, size:{width:250, height:298}};
        const bbx2 : Bbox = {ulc: {x:382, y:403}, size:{width:8, height:5}};
        const bbxs = [bbx1, bbx2];
        ctx.fillStyle="#FFFFFF";
        ctx.clearRect(0,0,width,height );
        ctx.beginPath();
        ctx.strokeStyle="#FF0000";
        bbxs.forEach(bbx => ctx.rect(bbx.ulc.x,bbx.ulc.y, bbx.size.width, bbx.size.height))
        ctx.stroke();
        const imgData = ctx.getImageData(0,0,width,height);
        const res = LeafCrop.Process([10], [], imgData, 1);
        const cnv = new Canvas(res.imgData.width, res.imgData.height );
        const cts = cnv.getContext('2d');
        cts.putImageData(res.imgData, 0,0)
        const hsh = await hash(cnv,"cropped NOT crop the image")
        expect(hsh).toMatchSnapshot();
    })
})