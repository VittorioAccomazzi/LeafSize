import {noExtension} from '../../common/utils/FileUtils'

type Quadrant = 'Q0' | 'Q1' | 'Q2' | 'Q3' | 'All'

// this interfce is designed to facilitate the testing (inversion of dependencies )
export interface ImgLoaderFileHandle {
    name : string,
    getFile : ()=>Promise<ImgLoaderFile>
}


export interface ImgLoaderFile {
    arrayBuffer : () => Promise<ArrayBuffer>
}

interface ImageTile {
    file :  ImgLoaderFileHandle //FileSystemHandle,
    name : string,
    quadrant : Quadrant
}

export type ImageFileLoader =  ( handle : ImgLoaderFileHandle ) => Promise<ImageBitmap> 

/**
 * Image loader.
 * Load the images from file and split them up as necessary.
 */
export default class ImageLoader  {
    private tiles : ImageTile[] = []
    private cacheImage : ImageBitmap | null = null;
    private cacheFile  : ImgLoaderFileHandle | null = null;
    private getImageFromFile : ImageFileLoader
    private targetSize : number;

    /**
     * construct a ImageLoader object
     * @param files list of files to load
     * @param numDishes  number of dishes per image : 1 or 4
     * @param targetSize  target size for the image's diagonal.
     * @param imageFileLoader loader function (if required)
     */
    constructor ( files : ImgLoaderFileHandle[] | null , numDishes : number, targetSize : number, imageFileLoader : ImageFileLoader = getImageFromFile ){
        this.tiles = []
        this.getImageFromFile = imageFileLoader;
        this.targetSize = targetSize;
        if (numDishes !==1 && numDishes !== 4 ) throw new Error(`not supported num Dishes ${numDishes}`)

        if( files ){
            switch(numDishes){
                case 1: {
                    this.tiles = files.map(file => ({ file, quadrant : 'All', name : noExtension(file.name)}))
                    break;
                }
                case 4: {
                    files.forEach(file =>{
                        ['Q0','Q1','Q2','Q3'].forEach(quadrant=>{
                            this.tiles.push({
                                file,
                                name : noExtension(file.name)+'-'+quadrant,
                                quadrant : quadrant as Quadrant
                            })
                        })
                    })
                    break;
                }
            }
        }
    }

    /**
     * list of images generated
     */
    get List() : string [] {
        return this.tiles.map(f=>f.name);
    }

    /**
     * get file handle given the image name
     */
    FileHandle( name : string ) :ImgLoaderFileHandle | undefined {
        return this.tiles.find(v=>v.name===name)?.file;
    }

    /**
     * number of dishes for image
     */
    get NumDishes() : number {
        let qList = new Set(this.tiles.map(v=>v.quadrant));
        return qList.size;
    }

    /**
     * Extract an image from the file.
     * @param inCanvas canvas where the image will be copied to.
     * @param index index of the image to extract
     * @returns scale : downsample value of the original image in order to reach the diagonal size set in the constructor. imageData : image Data for the canvas object
     */
    async getImage( index : number ): Promise< { scale : number, imgData : ImageData|null }> {
        let scale = 0;
        let imgData = null;
        if( !this.tiles || !this.tiles.length ) return {scale, imgData }; // this can happen as transition
        if( index <0 || index >this.tiles.length) throw Error(`undexpected index : requested ${index} but got ${this.tiles.length}`)
        const tile = this.tiles[index];
        const img = await this.getImageFromCache( tile );
        const imgWidth = img.width;
        const imgHeight= img.height;
        let xTopLft = 0;
        let yTopLft = 0;
        let xBtmRgt = imgWidth;
        let yBtmRgt = imgHeight;
        const xMid = imgWidth/2 | 0;
        const yMid = imgHeight/2 | 0;
        switch( tile.quadrant ){
            case 'Q0' : {
                xTopLft = 0;
                yTopLft = 0;                
                xBtmRgt = xMid;
                yBtmRgt = yMid;
                break;
            }
            case 'Q1' : {
                xTopLft = xMid;
                yTopLft = 0;
                xBtmRgt = imgWidth;
                yBtmRgt = yMid;
                break;
            }
            case 'Q2' : {
                xTopLft = 0;
                yTopLft = yMid;                
                xBtmRgt = xMid;
                yBtmRgt = imgHeight;
                break;
            }
            case 'Q3' : {
                xTopLft = xMid;
                yTopLft = yMid;                
                xBtmRgt = imgWidth;
                yBtmRgt = imgHeight;
                break;
            }
        }
        const srcWidth = xBtmRgt-xTopLft;
        const srcHeight= yBtmRgt-yTopLft;
        const srcDiag = Math.sqrt(srcHeight*srcHeight+srcWidth*srcWidth);
        scale = Math.min( 1, this.targetSize/srcDiag);
        const dstWidth = srcWidth * scale;
        const dstHeight= srcHeight * scale;

        // we need to get to the pixel data, and so we need a canvas (unfortunately)
        // see https://github.com/whatwg/html/issues/4785
        // Note OffscreenCanvas is deprecated below because it is experimental 
        // see https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/OffscreenCanvas 
        // however since this will run in the workers I have no othre option.
        let canvas : HTMLCanvasElement | OffscreenCanvas;
        if( typeof document === 'undefined' ) {
            // worker
            canvas = new OffscreenCanvas(dstWidth, dstHeight);
        } else {
            // window
            canvas = document.createElement('canvas')
            canvas.width = dstWidth;
            canvas.height= dstHeight;
        }

        // Extract the pixel data which is needed for further processing.
        const ctx = canvas.getContext('2d');
        if( ctx ) { 
            ctx.drawImage( img, xTopLft, yTopLft, srcWidth, srcHeight, 0, 0, dstWidth, dstHeight);
            imgData = ctx.getImageData(0,0,dstWidth, dstHeight);
            // Debug only
            // ctx.font = '48px serif'; // debug only.
            // ctx.fillText(tile.name, 10, 60);
        }
        return { scale, imgData }
    }

    /**
     * This function perform some simple caching on the images because when the user is settings 4 dishes per image,
     * we can effectively load the same image for 4 different request.
     * @param tile tile which describes the images to extract.
     * @returns 
     */
    private async getImageFromCache( tile : ImageTile  ) : Promise<ImageBitmap> {
        if( this.cacheFile !== tile.file  ){
            if( this.cacheImage ) this.cacheImage.close(); // free resources.
            this.cacheImage = await this.getImageFromFile( tile.file );
            this.cacheFile  = tile.file;
        } 
        return this.cacheImage!;
    }
}

    /**
     * Load the image from file.
     * @param handle file to load
     * @returns 
     */
     async function getImageFromFile( handle : ImgLoaderFileHandle ) : Promise<ImageBitmap> {
        const file = await handle.getFile();
        const data = await file.arrayBuffer();
        const blob = new Blob([data]);
        return createImageBitmap(blob);
    }