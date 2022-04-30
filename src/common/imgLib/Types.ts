
/**
 * definition of a colour. Each channel is considered an 8 bit integer.
 * the values are *not* pre multiplied by alpha. If alpha is not present 
 * it is considered 255, and so the colour is fully opaque.
 */
export interface Colour {
    r : number,
    g : number,
    b : number,
    a?: number
}

/**
 * 2D point. Defined here because DOMPoint requires many more parameters
 * which are not necessary for the imgLib purposes.
 */
export interface Point {
    x: number,
    y: number
}


/**
 * defines a bondung box.
 */
export interface Bbox {
    ulc : Point,
    size: {
        width : number,
        height: number
    }
}

/**
 * generic interface for an image/mask object. Something which can be displayed and/or overlayed on an image.
 */
export default interface IImage<T> {
    readonly width : number,
    readonly height: number,
    set : (x:number, y:number, v : T )=> void,
    get : (x:number, y:number) => T,
    foreachPixel : (func:(x:number, y:number, v:T)=>void)=>void
}

/* unfortunately this is necesary in order to deal with the jest dom, which doesn't support the
 * ImageData object and the browser dom.
 */

export type ImageDataAllocator = ( data : Uint8ClampedArray, width : number, height : number ) => ImageData;

export const imageDataAllocator = ( data : Uint8ClampedArray, width : number, height : number ) : ImageData =>{
    return new ImageData(data, width, height);
}