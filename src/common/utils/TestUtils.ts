import {Canvas, loadImage} from 'canvas';
import CanvasUtils from './CanvasUtils';
import {imageHash} from 'image-hash';
import * as fs from 'fs';
import * as path from 'path'


export default async function hash( image : Canvas | HTMLCanvasElement, imageName : string ) : Promise<string> {
    const canvas = isCanvas(image) ? image : CanvasUtils.fromHTML(image) ;
    const buffer = canvas.toBuffer('image/png');
    const testName = expect.getState().currentTestName;
    const fileName = `${testName}-${imageName}.png`;
    dumpImage(fileName, buffer);
    return new Promise((res, rej)=>{
        imageHash({
            ext:'image/png',
            data: buffer,
            name: fileName,
        }, 128, true, ( error : Error, val : string )=>{
            if( error ) rej (error)
            res(val);
        })
    })
}

export const testImage = 'src/assets/SampleImage.jpg';

export function isCanvas( obj : any ) : obj is Canvas {
    return  obj.toBuffer != null && obj.getContext != null;
}

export function isHTMLCanvasElement( obj : any ) : obj is HTMLCanvasElement {
    return  obj.toBuffer == null && obj.getContext != null;
}

export async function loadCanvas( path : string, downsample : number = 1 ) : Promise<Canvas> {
    const image = await loadImage(path);
    const width = image.width/downsample;
    const height= image.height/downsample;
    const canvas= new Canvas(width, height);
    const ctx   = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height );
    return canvas;
}

const dumpFolder = 'src/testDump'

function dumpEnabled() {
    return process.env.DUMP?.toLocaleLowerCase().trim() === "true"
}

function dumpImage(name: string, buffer:Buffer) {
    const fullPath = path.join(dumpFolder, name);
    if( dumpEnabled() ){
        if( !fs.existsSync( dumpFolder ) ) fs.mkdirSync(dumpFolder); 
        fs.writeFileSync(fullPath, buffer);
    } else {
        if( fs.existsSync( dumpFolder )  && fs.existsSync( fullPath )){
            fs.unlinkSync( fullPath )
        }
    }

} 
