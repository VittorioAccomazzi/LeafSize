import { Box, Typography } from "@mui/material";
import React, { useMemo } from "react";
import BrowserInfo from "./common/utils/BrowserInfo";
import  './App.css'

export interface AppMainProp {
    children : React.ReactNode
}

export default function AppMain({children} : AppMainProp ) {
    const bInfo = useMemo<BrowserInfo>( ()=> new BrowserInfo(), [] );
    return (
        <>
         { bInfo.IsValid ?
            <div>{children}</div>:
            <Box>
                <Typography variant="h5" component="div">
                        🖐 The application can not run on this device !
                </Typography>
                {
                    bInfo.Suggestion ?
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {bInfo.Suggestion}
                    </Typography>
                    : <></>
                }
            </Box>
        }
        </>
    )
}
