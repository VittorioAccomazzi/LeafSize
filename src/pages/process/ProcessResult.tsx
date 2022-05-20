
import { useEffect, useRef, useState } from "react";
import ImageProcessing from '../../workers/foreground/ImageProcessor'
import useMouseOver from "../../common/useLib/useMouseOver";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, Button } from "@mui/material";
import AreaInfo from "./AreaInfo";
import css from './Process.module.css'
import { Result } from "../../workers/foreground/LeafSegProxy";
import { LeafArea } from "./ProcessSlice";

export interface ProcessResultProp {
    name : string,
    imageProcessor : ImageProcessing,
    onDelete : (name:string)=>void,
    onResult : (name:string, areas: LeafArea[] ) =>void,
    allowDelete : boolean
}
export default function ProcessResult ( { name, imageProcessor, onDelete, onResult, allowDelete } : ProcessResultProp) {
    const canvas = useRef<HTMLCanvasElement | null>(null)   
    const root = useRef<HTMLDivElement | null>(null)   
    const [ready, setReady] = useState<boolean>(false);
    const [hide, setHide]   = useState<boolean>(false);
    const [areas, setAreas] = useState<LeafArea[]>([])
    const mouseOver = useMouseOver(root)

    useEffect(()=>{
        imageProcessor.getImage(name)
            .then(( leaf : Result | null ) => {
                if( leaf && canvas.current ){
                    const { imgData, areas } = leaf;
                    canvas.current.width = imgData.width;
                    canvas.current.height= imgData.height;
                    const ctx = canvas.current.getContext('2d');
                    ctx!.putImageData(imgData, 0, 0)
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