import { dilation, minHeight, minWidth } from "../../app/const";
import BoundingBox from "../../common/imgLib/BoundingBox";
import { Bbox } from "../../common/imgLib/Types";
import { LeafArea } from "../../pages/process/ProcessSlice";

/**
 * simple class to crop the image based on the bounding box
 */
export default class LeafCrop {
    private constructor() {} // singleton

    static Process( areas : LeafArea [], bboxs : Bbox[], imgData : ImageData, scale : number ) {
        const box = BoundingBox.Merge(bboxs);
        let leafData  : ImageData = imgData;
        let leafAreas : LeafArea [] = [];
        const rescale = 1/(scale*scale);
        if( !BoundingBox.IsEmpty(box) ){
            let wDilation = dilation;
            let hDilation = dilation;
            if( box.size.width < minWidth ) wDilation = Math.max(wDilation, ( minWidth-box.size.width)/2|0);
            if( box.size.height< minHeight) hDilation = Math.max(hDilation, ( minHeight-box.size.height)/2|0);
            const dBox = BoundingBox.Dilate(box, wDilation, hDilation);
            leafData = BoundingBox.CropImage(dBox, imgData)!;
            leafAreas= areas.map(aInfo=> ({
                leaf:aInfo.leaf*rescale|0, 
                path:aInfo.path*rescale|0
            }) );
        }
        return {
            imgData : leafData,
            areas : leafAreas
        };
    }
}