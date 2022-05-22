import { Box, Button, Stack } from "@mui/material";
import  css from './Result.module.css'
import PreviousPage from "../../common/components/NavButtons";
import { imageSize, processingPath as processPath } from "../../app/const";
import { useAppSelector, useAutomaticRedirect, useImagesToProcess } from "../../app/hooks";
import { useMemo } from "react";
import ImageLoader from "../../workers/foreground/ImageLoader";
import { ImageFinalized, LeafArea, selectFinalized } from "../process/ProcessSlice";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DownloadIcon from '@mui/icons-material/Download';
import { selectFiles, selectNumDishes, selectNumLeafs } from "../selection/selectionSlice";
import ResultValue from "./ResultValue";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import usePageTracking from "../../common/useLib/usePageTracking";
import GA from "../../common/utils/GA";

export default function Result() {
    const fileList = useAppSelector(selectFiles);
    const numDishes= useAppSelector(selectNumDishes);
    const numLeaf  = useAppSelector(selectNumLeafs);
    const imgFinalized = useAppSelector(selectFinalized);
    const imgLoader= useMemo<ImageLoader>(()=>new ImageLoader(fileList, numDishes, imageSize),[fileList, numDishes]);
    const imagesToProcess = useImagesToProcess(imgLoader.List); 
    
    // if nothing selected redirect on seletion page.
    useAutomaticRedirect(fileList);

    // track usage
    usePageTracking();

    const onDownload = () =>{
        const content = generateContent(imgFinalized, numLeaf);
        let text = 'data:text/plain;charset=utf-8,'  + encodeURIComponent(content);
        let link = document.createElement('a') 
        link.setAttribute('download', 'result.csv')
        link.setAttribute('href', text)
        link.click() 
        GA.event('User','Result', 'Finalized', imgFinalized.length);
        GA.event('User','Result', 'Rejected',  imagesToProcess.length);
    }
    const leafTableHeader = numLeaf > 1 ?'Leaf 1' : 'Leaf';
    const pathTableHeader = numLeaf > 1 ? 'Pathogen 1' : 'Pathogen'; 
    const tableContainer  = numLeaf > 1 ? css.tableContainer2 : css.tableContainer1; 
    return (
        <Box className={css.fullPage} >
            <Stack direction='row' alignItems='center' spacing={6} className={css.topFrame}>
                <PreviousPage page={processPath} disabled={imagesToProcess.length===0}/>
                <ResultValue Icon = {CheckBoxIcon} label ='Images Accepted' value = {imgFinalized.length} />
                <ResultValue Icon = {DeleteForeverIcon} label ='Images Rejected' value = {imagesToProcess.length} />
                <Button variant='outlined' onClick={onDownload}><DownloadIcon/>Download</Button>
            </Stack>
            <Box className={css.bottomFrame}>
                <TableContainer component={Paper} className={tableContainer} elevation={8}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight:'bold'}}>Image Name</TableCell>
                                <TableCell align='right' sx={{fontWeight:'bold'}}>{leafTableHeader} (pixels<sup>2</sup>)</TableCell>
                                <TableCell align='right' sx={{fontWeight:'bold'}}>{pathTableHeader} (pixels<sup>2</sup>)</TableCell>
                                { ( numLeaf > 1 ) && <TableCell align='right' sx={{fontWeight:'bold'}}>Leaf 2 (pixels<sup>2</sup>)</TableCell>}
                                { ( numLeaf > 1 ) && <TableCell align='right' sx={{fontWeight:'bold'}}>Pathogen 2 (pixels<sup>2</sup>)</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                imgFinalized.map(({name,areas})=>
                                    <TableRow key = {name}>
                                        <TableCell align='left'> {name}</TableCell>
                                        <TableCell align='right'>{areas.length > 0  ? areas[0].leaf : 0 }</TableCell>
                                        <TableCell align='right'>{areas.length > 0  ? areas[0].path : 0 }</TableCell>
                                        { ( numLeaf > 1 ) && <TableCell align='right'>{areas.length > 1  ? areas[1].leaf : 0 }</TableCell>}
                                        { ( numLeaf > 1 ) && <TableCell align='right'>{areas.length > 1  ? areas[1].path : 0 }</TableCell>}
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

function generateContent( results : ImageFinalized [], nLeafs : number ) : string {
    const value = (array : LeafArea[], index : number ) => array.length > index ? `${array[index].leaf},${array[index].path}` : `0,0`;
    let header = "Image Name," + ( nLeafs === 1 ? "Leaf, Pathogen" : "Leaf 1, Pathogen 1, Leaf 2, Pathogen 2") +"\n";
    let text ="";
    results.forEach(({name, areas})=>{
        text += name +","+ value(areas, 0)
        if( nLeafs >1 ) text += ","+value(areas,1)
        text += "\n";
    })
    return header + text;
}