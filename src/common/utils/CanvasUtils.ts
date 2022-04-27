import {Canvas} from 'canvas'
import ColourModels from '../imgLib/ColourModels';
import { ImageUint8 } from '../imgLib/ImageBase';
import { isCanvas } from './TestUtils';

export default class CanvasUtils {
    private constructor() {} // singleton

    static GetImageData ( inCanvas : Canvas | HTMLCanvasElement ) : ImageData {
        const width = inCanvas.width;
        const height= inCanvas.height;
        let data : ImageData;
        if( isCanvas( inCanvas ) ){ // this if is necessary becaue the functon below are NOT equivalent for type script.
            const ctx = inCanvas.getContext('2d');
            data = ctx.getImageData(0,0, width, height);
        } else {
            const ctx = inCanvas.getContext('2d');
            data = ctx!.getImageData(0,0, width, height); 
        }
        return data
    }

    static PutImageData ( inCanvas : Canvas | HTMLCanvasElement, data : ImageData  ) : void {
        inCanvas.width = data.width;
        inCanvas.height= data.height;
        if( isCanvas( inCanvas ) ){ // this if is necessary becaue the functon below are NOT equivalent for type script.
            const ctx = inCanvas.getContext('2d');
            ctx.putImageData(data,0,0)
        } else {
            const ctx = inCanvas.getContext('2d');
            ctx!.putImageData(data,0,0)
        }
    }
    
    /**
     * converts an HTML canvas object to a  node canvas object
     * @param image 
     * @returns 
     */
    static fromHTML( image : HTMLCanvasElement ) : Canvas {
        const width = image.width;
        const height= image.height;
        const canvas= new Canvas(width, height);
        const data  = this.GetImageData(image);
        this.PutImageData(canvas, data);
        return canvas;
    }
    
    /**
     * converts a node canvas object to a HTML canvas object
     * @param image 
     * @returns 
     */
    static toHTML( image : Canvas ) : HTMLCanvasElement {
        const width = image.width;
        const height= image.height;
        const htmImg= document.createElement('canvas');
        htmImg.width = width;
        htmImg.height= height;
        const data   = this.GetImageData(image);
        this.PutImageData(htmImg, data); 
        return htmImg; 
    }

    /**
     * converts a gray scale 8 bit image to a canvas object
     * @param img8 
     * @returns 
     */
    static toCanvas( img8 : ImageUint8 ) : Canvas {
        const canvas = new Canvas(img8.width, img8.height);
        const imgData= ColourModels.fromRGB(img8, img8, img8);
        this.PutImageData(canvas, imgData);
        return canvas;
    }
}