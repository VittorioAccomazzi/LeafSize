
import { useEffect, useRef, useState } from "react";
import ImageProcessing, {Leaf} from '../../workers/foreground/ImageProcessor'
import useMouseOver from "../../common/useLib/useMouseOver";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, Button } from "@mui/material";
import AreaInfo from "./AreaInfo";
import css from './Process.module.css'

export interface ProcessResultProp {
    name : string,
    imageProcessor : ImageProcessing,
    onDelete : (name:string)=>void,
    onResult : (name:string, areas: number[] ) =>void,
    allowDelete : boolean
}
export default function ProcessResult ( { name, imageProcessor, onDelete, onResult, allowDelete } : ProcessResultProp) {
    const canvas = useRef<HTMLCanvasElement | null>(null)   
    const root = useRef<HTMLDivElement | null>(null)   
    const [ready, setReady] = useState<boolean>(false);
    const [hide, setHide]   = useState<boolean>(false);
    const [areas, setAreas] = useState<number[]>([])
    const mouseOver = useMouseOver(root)

    useEffect(()=>{
        imageProcessor.getImage(name)
            .then(( leaf : Leaf | null ) => {
                if( leaf && canvas.current ){
                    const { imageData, areas } = leaf;
                    canvas.current.width = imageData.width;
                    canvas.current.height= imageData.height;
                    const ctx = canvas.current.getContext('2d');
                    ctx!.putImageData(imageData, 0, 0)
                    setAreas(areas);
                    setReady(true);
                    onResult(name, areas);
                }
            })
    },[imageProcessor])

    const onClick = ()=>{
        onDelete(name);
        setHide(true);
    }
    const overlayDisplay= ready && mouseOver;
    return (
        <Box className={css.resultMainBox}>
            <div className={css.resultInnerDiv} hidden={hide} ref={root} >
                <canvas ref={canvas} hidden={!ready}/>
                <div className={css.resultInfoArea} hidden={!overlayDisplay}>
                    <AreaInfo areas={areas}/>
                </div>
                <Button  className={( overlayDisplay && allowDelete )? css.resultDeleteIconShow : css.hidden} onClick={onClick} >
                    <DeleteForeverIcon color='error' fontSize="large" />
                </Button> 
            </div>
        </Box>
    );
}