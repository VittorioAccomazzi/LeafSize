import BoundingBox from './BoundingBox';
import IImage, {Bbox, Colour, Point} from './Types'

export function isMask( obj : any ) : obj is Mask {
    return obj.constructor.name === "Mask"
}


/**
 * 2D binary mask
 */
export default class Mask implements IImage<boolean> {
    private pixels : boolean [];
    private w : number ;

    /**
     * Initialize an empty mask, with all values to false.
     * @param width  
     * @param height 
     */
    constructor( width : number, height : number ){
        this.w = width;
        this.pixels= new Array<boolean>(width*height).fill(false);
    }

    /**
     * clone the incoming mask
     * @param srcMask 
     */
    static Clone( srcMask : Mask ) : Mask {
        const mask  = new Mask(srcMask.width, srcMask.height);
        mask.pixels = [...srcMask.pixels];
        return mask;
    }

    /**
     * get the unidimensional pixel array, row major
     */
    get imagePixels() : boolean [] {
        return this.pixels;
    }

    /**
     * image width
     */
    get width() : number {
        return this.w;
    }

    /**
     * image height
     */
    get height():number {
        return this.pixels.length/this.w;
    }

    /**
     * area (number of pixels set to true)
     */
    get area() : number {
        return this.pixels.reduce((s,v)=>s+(v?1:0), 0)
    }

    /**
     * get a value in the mask
     * @param x 
     * @param y 
     * @returns 
     */
    get( x: number, y: number ){
        this.checkSize(x,y);
        return this.pixels[this.w*y+x];
    }

    /**
     * Set a value in the mask
     * @param x 
     * @param y 
     * @param v value
     */
    set( x: number, y:number, v: boolean ){
        this.checkSize(x,y);
        this.pixels[this.w*y+x]=v;
    }

    /*
    * overwrite toString in order to provide information when the image is printed
    */
    toString() : string {
        return `Mask ${this.width}x${this.height}`
        }

    /**
     * And the mask with the incoming mask in place.
     * @param srcMask 
     */
    And( srcMask : Mask ) {
        if( srcMask.pixels.length !== this.pixels.length ) throw new Error(`Wrong Mask sizes : ${srcMask.pixels.length} vs ${this.pixels.length}`);
        this.pixels = this.pixels.map((v,i)=>v&&srcMask.pixels[i]);
    }


    /**
     * Or the mask with the incoming mask in place
     * @param srcMask 
     */
    Or( srcMask : Mask ) {
        if( srcMask.pixels.length !== this.pixels.length ) throw new Error(`Wrong Mask sizes : ${srcMask.pixels.length} vs ${this.pixels.length}`);
        this.pixels = this.pixels.map((v,i)=>v||srcMask.pixels[i]);
    }

    /**
     * subtract the incoming mask, in place.
     * @param srcMask 
     */
    Minus( srcMask : Mask ) {
        if( srcMask.pixels.length !== this.pixels.length ) throw new Error(`Wrong Mask sizes : ${srcMask.pixels.length} vs ${this.pixels.length}`);
        srcMask.pixels.forEach((v,i)=> v ? this.pixels[i]=false : null); // in place, otherwise the fill function will take too long.
    }

    /**
     * Not the mask in place.
     */
    Not() {
        this.pixels = this.pixels.map((v)=>!v); 
    }

    /**
     * invoke for every pixel in the image the function provided.
     * @param func 
     */
    foreachPixel (func : (x:number, y:number, v: boolean )=> void) : void  {
        this.pixels.forEach((val, i)=>{
            const x = i % this.w;
            const y = i / this.w|0;
            func(x,y,val);
        })
    }

    /**
     * if the mask has dimension 0.
     */
    get IsEmpty() : boolean {
        return !this.w || !this.pixels.length;
    }

    /**
     * Fill operation : retun a mask with the connected compnent (9 neighbourd) to the seed point.
     * @param xSeed x coordinate seed point. It shall be inside the image
     * @param ySeed y coordinate seed point. It shall be inside the image.
     * @returns 
     */

    Fill(xSeed : number, ySeed : number ) : Mask {
        const width = this.width;
        const height= this.height;
        if( xSeed <0 || xSeed >= width || ySeed <0 || ySeed >=height  ) throw new Error(`invalid seed point ${xSeed},${ySeed}`);
        const inpPixels = this.pixels;
        const outMask   = new Mask(width,height);
        const outPixels = outMask.imagePixels;
        const NeigbourdPoints : Point [] = [ { x:-1, y:0 },
                                             { x:1, y:0 },
                                             { x:0, y:1 },
                                             { x:0, y:-1 },
                                             { x:1, y:1 },
                                             { x:-1, y:1 },
                                             { x:1, y:-1 },
                                             { x:-1, y:-1 }
        ]

        const stack : Point[] = [ {x:xSeed, y:ySeed}]
        outPixels[ySeed*width+xSeed] = true;

        while( stack.length > 0 ){

            const pt = stack.shift()!

            for( const p of NeigbourdPoints ){
                const x = pt.x + p.x;
                const y = pt.y + p.y;
                if( x>=0 && x<width && y>=0 && y<height ){
                    const offset = y*width+x;
                    if( inpPixels[offset] && !outPixels[offset] ){
                        outPixels[offset]= true;
                        stack.push({x,y})
                    }
                }
            }
        }

        return outMask;
    }

    /**
     * applies a dilation with a squared mask, 2*halfSize+1 x 2*halfSize+1
     * @param halfSize mask half size
     * @returns 
     */
    Dilate(halfSize:number ) : Mask {
        if ( this.IsEmpty ) return new Mask(0,0);
        const width = this.width;
        const height= this.height;
        const inpPixels = this.pixels;
        const outMask   = Mask.Clone(this);
        const outPixels = outMask.imagePixels;

        outMask.foreachPixel((x,y,v)=>{
            if( !v && x>=halfSize && x<width-halfSize && y>=halfSize && y<height-halfSize  ){
                let val = false;
                const len = 2*halfSize+1;
                for( let yk = y-halfSize; yk<=y+halfSize; yk++ ){
                    let offset  = yk * width+x-halfSize;
                    for( let off=offset; off<len+offset; off++) {
                        val ||= inpPixels[off];
                    }
                    if( val ) break;
                }
                outPixels[y*width+x]= val;
            }
        })

        return outMask;
    }

    /**
     * overlays the current mask on the image provided.
     * @param imgData 
     * @param color  
     */
    Overlay(imgData : ImageData, {r,g,b,a =255 } : Colour, offset? : Point) : void {
        if( !offset && ( this.width !== imgData.width || this.height !== imgData.height) ) throw new Error(`Invalid data : Mask size ${this.width}x${this.height} and image data ${imgData.width}x${imgData.height}`)
        if( offset ) {
            if( offset.x < 0 || offset.y < 0 ) throw new Error (`negative offset not supported : ${offset.x},${offset.y}`);
            if( offset.x+this.width > imgData.width || offset.y+this.height> imgData.height ) throw new Error(`Invalid offset : mask shall be completly inside the image ${offset.x+this.width}x${offset.y+this.height} and image ${imgData.width}x${imgData.height}`)
        }
        const xOffset = offset ? offset.x : 0;
        const yOffset = offset ? offset.y : 0;
        const data = imgData.data;
        let ptr = ( yOffset * imgData.width+xOffset) * 4;
        const alpha = a/255;
        r *= alpha;
        b *= alpha;
        g *= alpha;
        const weight = 1-alpha;
        const imgStride = imgData.width * 4;
        const maskLast  = ( xOffset + this.width ) * 4;
        const incr      = ( imgData.width - this.width ) * 4;

        this.pixels.forEach((v)=>{
            if( v ){
                let p = ptr;
                const red  = data[ptr++] * weight + r;
                const green= data[ptr++] * weight + g;
                const blue = data[ptr++] * weight + b;
                const alpha= data[ptr++] * weight + a;
                data[p++] = red;
                data[p++] = green;
                data[p++] = blue;
                data[p++] = alpha;
            } else {
                ptr += 4;
            } 
            if( ptr % imgStride === maskLast ) ptr += incr;
        })
    }

    /**
     * return the num largest component of the mask.
     * @param num number of components to return.
     * @returns list of connected component, sorted by size.
     */
    Components ( num : number ) : Mask [] {
        const list : {mask:Mask, area:number }[] = [];

        this.foreachPixel((x,y,v)=>{
            if( v ){
                const mask = this.Fill(x,y);
                const area = mask.area;
                list.push({mask,area});
                list.sort((a,b)=>b.area-a.area);
                list.length = Math.min(list.length,num); // trucate the list as necessary.
                this.Minus(mask);
            }
        })

        return list.map(v=>v.mask);
    }

    /**
     * dermine the boundaies of the bask
     */
    Boundaries() :  Bbox {
        let xMin = this.width;
        let yMin = this.height;
        let xMax = 0;
        let yMax  =0;

        this.foreachPixel((x,y,v)=>{
            if( v ){
                xMin = x < xMin ? x : xMin;
                yMin = y < yMin ? y : yMin;
                xMax = x > xMax ? x : xMax;
                yMax = y > yMax ? y : yMax;
            }
        })

        return BoundingBox.FromValues(xMin, yMin, xMax+1, yMax+1);
    }

    private checkSize( x : number, y: number ){
        if( x < 0 || x > this.w || y <0 || y > this.height ) throw new Error(`Wrong coordinate for mask (${x},${y}) and mask size ${this.w}x${this.height}`);
    }

}