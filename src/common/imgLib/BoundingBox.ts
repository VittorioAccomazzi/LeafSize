import { Bbox, Point } from "./Types";
import { ImageDataAllocator, imageDataAllocator } from "./Types";

/**
 * simple class to manipulate bounding boxes.
 */
export default class BoundingBox  {

    static allocator = imageDataAllocator;

    private constructor () { }  // singleton

    /**
     * Set the allocator for this class. Use for testing.
     * @param imageDataAllocator functon which instiate the canvas's imagedata
     */
    static SetImageDataAllocator( imageDataAllocator  : ImageDataAllocator  ) : void {
        BoundingBox.allocator=imageDataAllocator
    }

    static FromPoints( pt1 : Point, pt2 : Point ){
        return BoundingBox.FromValues(pt1.x, pt1.y, pt2.x, pt2.y);
    }

    static FromValues( x1 : number, y1 : number, x2 : number, y2 : number ) : Bbox {
        const xmin = Math.min(x1, x2);
        const xmax = Math.max(x1, x2);
        const ymin = Math.min(y1, y2);
        const ymax = Math.max(y1, y2);
        return {
            ulc : {
                x: xmin,
                y: ymin
            },
            size : {
                width : xmax-xmin,
                height: ymax-ymin
            }
        }
    }

    static FromImage(imageData : ImageData) : Bbox {
        return {
            ulc : { x:0, y:0 },
            size: { width:imageData.width, height:imageData.height}
        }
    }
    
    static get Empty() : Bbox {
        return {
            ulc : {x:0, y:0},
            size: {width:0, height:0}
        }
    }

    static IsEmpty(bbox:Bbox) : boolean {
        return bbox.size.width <=0 || bbox.size.height <= 0;
    }

    static Merge( boxes : Bbox[] ) : Bbox {
        let box =  BoundingBox.Empty;
        if( boxes.length > 0 ){
            let xmin = boxes[0].ulc.x;
            let ymin = boxes[0].ulc.y;
            let xmax = xmin;
            let ymax = ymin;
            boxes.forEach(b=>{
                xmin = Math.min(b.ulc.x, xmin);
                ymin = Math.min(b.ulc.y, ymin);
                xmax = Math.max(b.ulc.x+b.size.width, xmax);
                ymax = Math.max(b.ulc.y+b.size.height, ymax);
            })
            box = BoundingBox.FromValues(xmin, ymin, xmax, ymax);
        }
        return box;
    }

    static Dilate(bbox:Bbox, dx : number, dy: number ): Bbox{
        return {
            ulc : { x: bbox.ulc.x-dx, y:bbox.ulc.y-dy},
            size: { width : bbox.size.width+2*dx, height : bbox.size.height+2*dy}
        }
    }

    static Intersect(boxes : Bbox[] ) : Bbox {
        let box =  BoundingBox.Empty;
        if( boxes.length > 0 ){
            let xmin = boxes[0].ulc.x;
            let ymin = boxes[0].ulc.y;
            let xmax = xmin+boxes[0].size.width;
            let ymax = ymin+boxes[0].size.height;
            boxes.forEach(b=>{
                xmin = Math.max(b.ulc.x, xmin);
                ymin = Math.max(b.ulc.y, ymin);
                xmax = Math.min(b.ulc.x+b.size.width, xmax);
                ymax = Math.min(b.ulc.y+b.size.height, ymax);
            })
            box = {
                ulc: {x:xmin, y:ymin},
                size:{width:xmax-xmin, height:ymax-ymin}
            }
        }
        return box;
    }

    static CropImage(bbox : Bbox, imageData : ImageData ) : ImageData | null {
        const imageBox = BoundingBox.FromImage(imageData)
        
        const int = BoundingBox.Intersect([bbox, imageBox]);
        let res : ImageData | null = null;

        if( !BoundingBox.IsEmpty(int) ){
            const width = int.size.width;
            const height= int.size.height;
            const dst = new Uint8ClampedArray(width*height*4);
            const src = imageData.data;
            let dstPt = 0;

            for( let y=int.ulc.y; y<int.ulc.y+height; y++){
                let srcPt= ( y* imageData.width+ bbox.ulc.x ) * 4;
                for( let x=0; x<width; x++ ){
                    dst[dstPt++] = src[srcPt++];
                    dst[dstPt++] = src[srcPt++];
                    dst[dstPt++] = src[srcPt++];
                    dst[dstPt++] = src[srcPt++];
                }
            }

            res = BoundingBox.allocator(dst, width, height);
        }

        return res;
    }

}