import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { setNumDishes, setNumLeafs, setFolder, setFiles }  from './selectionSlice';
import { selectNumDishes, selectNumLeafs, selectFolder, selectFiles } from "./selectionSlice";
import { NextPage } from "../../common/components/NavButtons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import dish4Leaf1  from '../../assets/dish-4-leaf-1.svg';
import dish1Leaf1  from '../../assets/dish-1-leaf-1.svg';
import dish1Leaf2  from '../../assets/dish-1-leaf-2.svg';
import OptionsList from "../../common/components/OptionList";
import isImage from "../../common/utils/FileUtils";


export default function Selection() {
    const folder = useAppSelector(selectFolder);
    const files  = useAppSelector(selectFiles);
    const numDishes = useAppSelector(selectNumDishes);
    const numLeafs  = useAppSelector(selectNumLeafs);
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch  = useAppDispatch();

    const setImgFolder = async () =>{
        const dirHandle = await showDirectoryPicker();
        const files : FileSystemFileHandle[] = []
        setLoading(true);
        for await (const entry of dirHandle.values()) {
          if( entry.kind === 'file' && isImage( entry.name) ) files.push(entry)
        }
        dispatch(setFolder(dirHandle));
        dispatch(setFiles(files));
        setLoading(false);
    }
    return (
        <>
            <Typography color="text.primary" variant="h2" marginBottom="1em">Select folder and images layout</Typography>
            <Box marginBottom="1em" alignItems='center' display='flex' flexDirection='column'>
                <Stack spacing={4} >
                    <Stack spacing={2} direction="row" alignItems="baseline">
                        <Button variant="outlined" onClick={setImgFolder} disabled={loading}> Select Folder</Button> 
                        <Typography minWidth="12em">{folder ? folder.name : null }</Typography>
                        <Typography color="text.secondary" minWidth="12em">{files ? `(${files.length} files selected)` : ''} </Typography>
                    </Stack>
                    <OptionsList
                        imgSrc1={dish1Leaf1}
                        imgSrc2={dish4Leaf1}
                        label1="One Dish"
                        label2="Four Dishes"
                        selected1 = {numDishes===1}
                        selected2 = {numDishes===4}
                        click1={()=>dispatch(setNumDishes(1))}
                        click2={()=>dispatch(setNumDishes(4))}
                        title="Select Image Layout"
                    />
                    <OptionsList
                        imgSrc1={dish1Leaf1}
                        imgSrc2={dish1Leaf2}
                        label1="One leaf per dish"
                        label2="Two leafs per dish"
                        selected1={numLeafs===1}
                        selected2={numLeafs===2}
                        click1={()=>dispatch(setNumLeafs(1))}
                        click2={()=>dispatch(setNumLeafs(2))}
                        title="Select Number of leafs per dish" />
                </Stack>   
            </Box>
            <NextPage page="/settings" disabled={loading || files==null || files.length===0}/>
        </>
    )
}
