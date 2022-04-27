import { Box, Typography } from "@mui/material";
import  './Result.css'
import PreviousPage from "../../common/components/NavButtons";
import { processingPath as processPath } from "../../app/const";

export default function Result() {
    return (
        <Box className="fullPage" >
            <PreviousPage page={processPath}/>
            <Typography variant="h5" component="div">
                🖐 You have reached the <b>Result</b> Page !
            </Typography>
        </Box>
    )
}