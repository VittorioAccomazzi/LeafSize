
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
 * generic interface for an image/mask object. Something which can be displayed and/or overlayed on an image.
 */
export default interface IImage<T> {
    readonly width : number,
    readonly height: number,
    set : (x:number, y:number, v : T )=> void,
    get : (x:number, y:number) => T,
    foreachPixel : (func:(x:number, y:number, v:T)=>void)=>void
}