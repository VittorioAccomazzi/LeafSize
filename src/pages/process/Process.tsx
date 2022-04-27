import { Box, Typography } from "@mui/material";
import  './Process.css'
import PreviousPage from "../../common/components/NavButtons";
import { NextPage } from "../../common/components/NavButtons";

export default function Process() {
    return (
        <Box className="fullPage" >
            <PreviousPage page="/settings"/>
            <Typography variant="h5" component="div">
                🖐 You have reached the <b>Process</b> Page !
            </Typography>
            <NextPage page="/result"/>
        </Box>
    )
}