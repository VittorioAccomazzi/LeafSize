import { Box, Typography } from "@mui/material";
import  './Result.css'
import PreviousPage from "../../common/components/NavButtons";

export default function Result() {
    return (
        <Box className="fullPage" >
            <PreviousPage page="/process"/>
            <Typography variant="h5" component="div">
                🖐 You have reached the <b>Result</b> Page !
            </Typography>
        </Box>
    )
}