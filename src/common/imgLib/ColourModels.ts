import { ImageFactory, ImageFloat32, ImageUint8 } from "./ImageBase";
import { ImageDataAllocator, imageDataAllocator } from "./Types";



export default class ColourModels {
    static allocator = imageDataAllocator;

    private constructor () { }  // singleton

    /**
     * Set the allocator for this class. Use for testing.
     * @param imageDataAllocator functon which instiate the canvas's imagedata
     */
    static SetImageDataAllocator( imageDataAllocator  : ImageDataAllocator  ) : void {
        ColourModels.allocator=imageDataAllocator
    }

    /**
     * Generate a canvas from HSV components
     * @param hImg hue image. Float image, with values from 0 to 360
     * @param sImg saturation image. Float image with values from 0 to 1
     * @param vImg value image. Float image with values from 0 to 1
     */
    static fromHSV( hImg : ImageFloat32, sImg : ImageFloat32, vImg : ImageFloat32) : ImageData {
        let width = hImg.width
        let height= hImg.height
        let data = new Uint8ClampedArray( width * height * 4 );
        let hPixels = hImg.imagePixels
        let sPixels = sImg.imagePixels
        let vPixels = vImg.imagePixels
        let ptr =0;
        for( let p=0; p<width*height; p++){
            let h = hPixels[p]
            let s = sPixels[p]
            let v = vPixels[p]
            let rgb = this.Hsv2Rgb(h,s,v)
            data[ptr++] = rgb.r * 255
            data[ptr++] = rgb.g * 255
            data[ptr++] = rgb.b * 255
            data[ptr++] = 255; // alpha 
        }
        return ColourModels.allocator(data, width, height);
    }

    /**
     *  decompose the current canvas in hue, saturation and value. 
     * @param image inpout canvas
     * @returns hue : from 0 to 360, sat from 0 to 1, val from 0 to 1
     */
    static toHSV( image : ImageData ) : { hue : ImageFloat32, sat: ImageFloat32, val : ImageFloat32 } {
        let width = image.width
        let height= image.height
        let hImg= ImageFactory.Float32(width,height)
        let sImg= ImageFactory.Float32(width,height) 
        let vImg= ImageFactory.Float32(width,height) 
        let hPixels= hImg.imagePixels
        let sPixels= sImg.imagePixels
        let vPixels= vImg.imagePixels
        let data= image.data
        let ptr =0
        for(let p=0; p<width*height;p++ ){
            let r=data[ptr++];
            let g=data[ptr++];
            let b=data[ptr++];
            let a=data[ptr++]; 
            let hsv = this.Rgb2Hsv(r/255, g/255, b/255);
            hPixels[p]=hsv.h;
            sPixels[p]=hsv.s;
            vPixels[p]=hsv.v;
        }
        return { hue: hImg, sat : sImg, val : vImg }    
    }
    

    /**
     * convert the values in HSV coordinates
     * @param r red value in   [0,1.0]
     * @param g green value in [0,1.0]
     * @param b blue value in [0,1.0]
     * @returns h in [0,360], s in [0,1] and v in [0,1]
     */
     static Rgb2Hsv( r: number, g : number, b: number  ) : { h: number, s: number, v: number } {
        // talen from https://stackoverflow.com/questions/3018313/algorithm-to-convert-rgb-to-hsv-and-hsv-to-rgb-in-range-0-255-for-both
        let out = { h: 0, v:0, s: 0}
        let min = Math.min(r,g,b)
        let max = Math.max(r,g,b)
        let delta = max-min
        out.v = max;
        if ( delta < 0.00001) {
            out.h =0
            out.s =0
        } else {
            out.s = delta/max
            if( r === max ) out.h = 0 + (g-b)/delta
            if( g === max ) out.h = 2 + (b-r)/delta
            if( b === max ) out.h = 4 + (r-g)/delta
        }

        out.h *= 60 // in degrees
        if( out.h < 0 ) out.h += 360

        return out
    }

    /**
     * 
     * @param h [0,360]
     * @param s [0,1]
     * @param v [0,1]
     * @returns r [0,255] g [0,255] and b [0,255]
     */
    static Hsv2Rgb(h:number, s:number, v:number) : {r:number, g:number, b:number} {
        // from https://stackoverflow.com/questions/3018313/algorithm-to-convert-rgb-to-hsv-and-hsv-to-rgb-in-range-0-255-for-both
        let out = { r:v, g:v, b:v}
        if( s > 0 ){
            let hh = h / 60
            let region = Math.floor(hh)
            let reminder = hh - region
            let p = v * ( 1- s )
            let q = v * ( 1- (s * reminder))
            let t = v * ( 1- (s * (1 - reminder)))
            switch( region ){
                case 0: 
                    out.r = v
                    out.g = t
                    out.b = p
                    break;
                case 1:
                    out.r = q
                    out.g = v
                    out.b = p
                    break;
                case 2:
                    out.r = p
                    out.g = v
                    out.b = t
                    break
                case 3:
                    out.r = p
                    out.g = q
                    out.b = v
                    break
                case 4:
                    out.r = t
                    out.g = p
                    out.b = v
                    break
                default:
                    out.r = v
                    out.g = p
                    out.b = q
            }
        }

        return out
    }

    /**
     * generate a canvas from a LAB image : components using Observer= 2°, Illuminant= D65
     * see https://en.wikipedia.org/wiki/CIELAB_color_space
     * @param lImg light image
     * @param aImg 
     * @param bImg 
     * @returns 
     */
    static fromLab( lImg : ImageFloat32, aImg : ImageFloat32, bImg : ImageFloat32) : ImageData {
        let width = lImg.width
        let height= lImg.height
        let data = new Uint8ClampedArray( width * height * 4 );
        let lPixels = lImg.imagePixels
        let aPixels = aImg.imagePixels
        let bPixels = bImg.imagePixels
        let ptr =0;
        for( let p=0; p<width*height; p++){
            let l = lPixels[p]
            let a = aPixels[p]
            let b = bPixels[p]
            let rgb = this.Lab2Rgb(l,a,b)
            data[ptr++] = rgb.r * 255;
            data[ptr++] = rgb.g * 255;
            data[ptr++] = rgb.b * 255;
            data[ptr++] = 255; // alpha
        }
        return ColourModels.allocator(data, width, height);
    }

     /**
     * convert the input canvas, assumed to be un RGB space, in to LAB
     * components using Observer= 2°, Illuminant= D65
     * @param image input image
     */
        static toLab(image : ImageData ) : { l : ImageFloat32, a : ImageFloat32, b :ImageFloat32 } {
        let width = image.width
        let height= image.height
        let lImg= ImageFactory.Float32(width,height)
        let aImg= ImageFactory.Float32(width,height) 
        let bImg= ImageFactory.Float32(width,height) 
        let lPixels= lImg.imagePixels
        let aPixels= aImg.imagePixels
        let bPixels= bImg.imagePixels
        let data= image.data
        let ptr =0
        for(let p=0; p<width*height;p++ ){
            let r=data[ptr++];
            let g=data[ptr++];
            let b=data[ptr++];
            let a=data[ptr++];
            let lab = this.Rgb2Lab(r/255, g/255, b/255);
            lPixels[p]=lab.l;
            aPixels[p]=lab.a;
            bPixels[p]=lab.b;
        }
        return { l: lImg, a: aImg, b: bImg}    
    }

    // Taken from https://github.com/antimatter15/rgb-lab/blob/master/color.js
    // which in turns is taken from the heavily referenced web site :
    // https://www.easyrgb.com/en/math.php
    static Rgb2Lab(r: number, g: number, b: number) : { l: number, a:number, b:number } {
  
        r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    
        let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
        let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
        let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    
        x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
        y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
        z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
    
        return { l : (116 * y) - 16, a: 500 * (x - y), b: 200 * (y - z) }
    }

    static Lab2Rgb(l: number, a: number, b: number) {
        let y = (l + 16) / 116
        let x = a / 500 + y
        let z = y - b / 200
  
        x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16/116) / 7.787);
        y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16/116) / 7.787);
        z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16/116) / 7.787);

        let rgb = {
            r : x *  3.2406 + y * -1.5372 + z * -0.4986,
            g : x * -0.9689 + y *  1.8758 + z *  0.0415,
            b : x *  0.0557 + y * -0.2040 + z *  1.0570
        }
    
        rgb.r = (rgb.r > 0.0031308) ? (1.055 * Math.pow(rgb.r, 1/2.4) - 0.055) : 12.92 * rgb.r;
        rgb.g = (rgb.g > 0.0031308) ? (1.055 * Math.pow(rgb.g, 1/2.4) - 0.055) : 12.92 * rgb.g;
        rgb.b = (rgb.b > 0.0031308) ? (1.055 * Math.pow(rgb.b, 1/2.4) - 0.055) : 12.92 * rgb.b;

        rgb.r = Math.max(0, Math.min(1,rgb.r))
        rgb.g = Math.max(0, Math.min(1,rgb.g))
        rgb.b = Math.max(0, Math.min(1,rgb.b))

        return rgb
    }

    /**
     *  Generate the canvas's channels (red, green, blue and alpha) in separate images.
     * @param canvas 
     */
        static toRGB( canvas : ImageData ) : { r : ImageUint8, g : ImageUint8, b : ImageUint8 } {
            let width = canvas.width;
            let height= canvas.height;
            let imgR= ImageFactory.Uint8(width,height);
            let imgG= ImageFactory.Uint8(width,height);
            let imgB= ImageFactory.Uint8(width,height);
            let nPixels = width*height;
            let i =0;
            let cPixels = canvas.data;
            let rPixels = imgR.imagePixels;
            let gPixels = imgG.imagePixels;
            let bPixels = imgB.imagePixels;
        
            for( let p=0; p<nPixels; p++){
                rPixels[p]=cPixels[i++];
                gPixels[p]=cPixels[i++];
                bPixels[p]=cPixels[i++];
                i++; // skip alpha
            }

            return { r: imgR, g: imgG, b :imgB }
        }
    
        /**
         * generate a ImageData object using the images provided as channels.
         * @param imgR 
         * @param imgG 
         * @param imgB 
         */
        static fromRGB( imgR : ImageUint8, imgG : ImageUint8, imgB : ImageUint8 ): ImageData {
            let width = imgR.width;
            let height= imgR.height;
            let nPixels = width*height;
            let i =0;
            let cPixels = new Uint8ClampedArray( width * height * 4 );
            let rPixels = imgR.imagePixels;
            let gPixels = imgG.imagePixels;
            let bPixels = imgB.imagePixels;
        
            for( let p=0; p<nPixels; p++){
                cPixels[i++] = rPixels[p];
                cPixels[i++] = gPixels[p];
                cPixels[i++] = bPixels[p];
                cPixels[i++] = 255;
            }
    
            return ColourModels.allocator(cPixels,width,height)
        }
}