import { dilation, minHeight, minWidth } from "../../app/const";
import BoundingBox from "../../common/imgLib/BoundingBox";
import { Bbox } from "../../common/imgLib/Types";



/**
 * simple class to crop the image based on the bounding box
 */
export class LeafCrop {
    private constructor() {} // singleton

    static Process( areas : number[], bboxs : Bbox[], imgData : ImageData, scale : number ) {
        const box = BoundingBox.Merge(bboxs);
        let leafData  : ImageData = imgData;
        let leafAreas : number [] = [];
        if( !BoundingBox.IsEmpty(box) ){
            let wDilation = dilation;
            let hDilation = dilation;
            if( box.size.width < minWidth ) wDilation = Math.max(wDilation, ( minWidth-box.size.width)/2|0);
            if( box.size.height< minHeight) hDilation = Math.max(hDilation, ( minHeight-box.size.height)/2|0);
            const dBox = BoundingBox.Dilate(box, wDilation, hDilation);
            leafData = BoundingBox.CropImage(dBox, imgData)!;
            leafAreas= areas.map(v=>(v/(scale*scale)|0));
        }
        return {
            imgData : leafData,
            areas : leafAreas
        };
    }
}