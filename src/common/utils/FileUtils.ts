const imageExtensions = ['.png', '.gif', '.jpeg', '.jpg'];

export default function isImage( name : string ) : boolean {
  const lower = name.toLowerCase();
  return imageExtensions.map( ext =>lower.endsWith(ext)).some((val)=>val)
}

// 🖐 Node modules are no longer polyfilled in webpack 5. To enable that I should eject the solution.
// since what I do here is very simple, I just implement it.
// see https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
export function noExtension( filename : string  ) : string {
  const index = filename.lastIndexOf(".");
  let res = filename;
  if( index > 0 ){ // on purpose we skip position 0
    res = filename.substring(0,index);
  }
  return res;
}

export const  wait = async ( ms : number ) => new Promise(res=>setTimeout(res, ms))