import { useState, useEffect } from "react"

export default function useMouseOver( targetRef :  React.MutableRefObject<HTMLElement | null> ) {
    const [isHover, setIsOver] = useState<boolean>(false)

    useEffect(()=>{

        const mouseOver = ()=> setIsOver(true);
        const mouseOut  = ()=> setIsOver(false);

        if( targetRef.current != null ){
            let htmlEl = targetRef.current
            htmlEl.addEventListener('mouseover', mouseOver);
            htmlEl.addEventListener('mouseout',mouseOut);
            return ()=>{
                htmlEl.removeEventListener('mouseover', mouseOver);
                htmlEl.removeEventListener('mouseout',mouseOut);
            }
        }
    },[targetRef])

    return isHover 
}

