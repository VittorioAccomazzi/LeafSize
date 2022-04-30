
import css from './Process.module.css'

interface AreaInfoProp {
    areas : number []
}
export default function AreaInfo({areas}:AreaInfoProp) {
    const val1 = areas.length > 0 ? areas[0] : null;
    const val2 = areas.length > 1 ? areas[1] : null;
    return (
        <div className={css.areaInfoMain}> 
            {
                val1 ?
                <span style={{color:'red'}}> {val1} pixels<sup>2</sup>  </span> 
                : <></>
            }
            {
                val2 ?
                <span style={{color:'yellow'}}> {val2} pixels<sup>2</sup> </span> 
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