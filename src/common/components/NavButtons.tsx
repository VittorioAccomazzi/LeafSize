import { useNavigate } from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { SvgIconProps } from "@mui/material/SvgIcon";
import { Stack } from "@mui/material";
import { Button } from "@mui/material";

interface NavProp {
    page : string,
    disabled? : boolean
}
export default function PreviousPage( {page, disabled=false} : NavProp  ) {
    return ( <Nav page={page} lRight="Previus" Icon={NavigateBeforeIcon} disabled={disabled}/>  )
}

export function NextPage( {page, disabled=false} : NavProp  ) {
    return (  <Nav page={page} lLeft="Next" Icon={NavigateNextIcon} disabled={disabled} /> )
}

interface Nprop {
    page : string,
    lLeft?: string,
    lRight?: string,
    disabled : boolean,
    Icon :  React.ComponentType<SvgIconProps>
}

const Nav = ({page, lLeft="", lRight="", Icon, disabled}:Nprop) =>{
    const navigate = useNavigate();
    const colour = disabled ? "gray" : "light blue";
    return (
        <Button variant="outlined" onClick={()=>navigate(page) } disabled={disabled} sx={{ width:"8em"}} >
            <Stack spacing={1} direction="row" alignItems="center" borderColor="ActiveBorder" >
                {lLeft}<Icon fontSize="small" sx={{color:`${colour}`}} /> {lRight}
            </Stack>
        </Button>

    ) 
}
