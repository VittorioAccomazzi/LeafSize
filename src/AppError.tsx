import { Box, Link, Typography } from "@mui/material";
import gitVersion from './tools/gitInfo.json'
import {FallbackProps} from 'react-error-boundary'


export default function AppError( prop:FallbackProps) {

    const error = prop.error.message;
    const stack = prop.error.stack ?  prop.error.stack: "Stack not available";
    return(
        <Box>
            <Typography variant="h5" component="div">
                    ❌ An unexpected error occurred : <span style={{color:'blue'}}> <b><code>{error}</code></b></span> <br/>
                    Please  &nbsp;                 
                    <Link underline='hover' color="textSecondary"
                        href= { "mailto:vittorio.accomazzi+LeafSize@gmail.com?subject=Report report on version "+gitVersion.long
                                 + "&body=Encounterd Error "+error+".%0D%0A%0D%0AStack: %0D%0A"
                                 + stack.replaceAll("\n","%0D%0A ") + 
                                 + "%0D%0A Please describe the step to reproduce the error"} 
                                 target="_blank">
                        report the error
                    </Link>
                    &nbsp; and  &nbsp;
                    <Link underline='hover' color="textSecondary" onClick={()=>window.location.reload()}>
                        reload the page.
                    </Link>
            </Typography>

        </Box>
    )
}