
import css from './Process.module.css'
import { LeafArea } from './ProcessSlice';

interface AreaInfoProp {
    areas : LeafArea []
}
export default function AreaInfo({areas}:AreaInfoProp) {
    const val1 = areas.length > 0 ? areas[0].leaf : null;
    const pat1 = areas.length > 0 ? areas[0].path : null;
    const val2 = areas.length > 1 ? areas[1].leaf : null;
    const pat2 = areas.length > 1 ? areas[1].path : null;
    return (
        <div className={css.areaInfoMain}> 
            {
                val1 ?
                <span style={{color:'red'}}> {val1} { pat1 && pat1 > 0 ? `(${pat1})` : ''} pixels<sup>2</sup>  </span> 
                : <></>
            }
            {
                val2 ?
                <span style={{color:'yellow'}}> {val2} { pat2 && pat2 > 0 ? `(${pat2})` : ''}  pixels<sup>2</sup> </span> 
                : <></>  
            }
            {
                !val1 && !val2 ?
                <span style={{color:'blue'}}><i>noting detected</i></span>
                : <></> 
            }
        </div>
    )
}