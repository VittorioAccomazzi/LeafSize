import AreaInfo from "./AreaInfo";
import { render } from '@testing-library/react';
import { LeafArea } from "./ProcessSlice";

describe('AreaInfo', ()=>{

    test('it shall display the area provied', ()=>{
        const val1 = 100;
        const pat1 = 20;
        const val2 = 200;
        const pat2 = 100;
        const areas =[{leaf:val1, path:pat1}, {leaf:val2, path:pat2}];
        const {getByText} = render( 
            <AreaInfo areas = {areas} />
        );

        expect(getByText(/100/i)).toBeInTheDocument();
        expect(getByText(/200/i)).toBeInTheDocument();
    })

    test('it shall display one area', ()=>{
        const val1 = 100;
        const areas =[{leaf:val1, path:0}];
        const {getByText} = render( 
            <AreaInfo areas = {areas} />
        );

        expect(getByText(/100/i)).toBeInTheDocument();
    })

    test('it shall display no areas', ()=>{
        const areas :LeafArea [] =[];
        const {getByText} = render( 
            <AreaInfo areas = {areas} />
        );

        expect(getByText(/noting detected/i)).toBeInTheDocument();
    })

})