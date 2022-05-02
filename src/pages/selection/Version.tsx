import { Box, FormLabel } from '@mui/material';
import gitVersion from '../../tools/gitInfo.json'

type gitInfoProps = { label : string, baseURL? : string, forkme : Boolean }

export default function Version  ({label, baseURL, forkme}:gitInfoProps) {
    const handleClick = () => {
        if( baseURL && gitVersion.long !== "" )  window.location.href = baseURL+'/tree/'+gitVersion.long;
    }
    return ( 
        <>
        {forkme && baseURL && (
            <Box  sx={{position:'fixed', top:'0px', right:'0px'}}> 
                <a href={baseURL}>
                    <img width="100" height="100" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_red_aa0000.png?resize=100%2C100" alt="Fork me on GitHub"/>
                </a>
            </Box>
        ) }
        <Box sx={{position:'fixed', bottom:'10px', left:'10px'}} onClick={handleClick}>
            <FormLabel><small>{label + gitVersion.version}</small></FormLabel>
        </Box>
        </>
    )
}

