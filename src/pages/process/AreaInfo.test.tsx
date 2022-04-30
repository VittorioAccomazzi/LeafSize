import AreaInfo from "./AreaInfo";
import { render } from '@testing-library/react';

describe('AreaInfo', ()=>{

    test('it shall display the area provied', ()=>{
        const val1 = 100;
        const val2 = 200;
        const areas =[val1,val2];
        const {getByText} = render( 
            <AreaInfo areas = {areas} />
        );

        expect(getByText(/100/i)).toBeInTheDocument();
        expect(getByText(/200/i)).toBeInTheDocument();
    })

    test('it shall display one area', ()=>{
        const val1 = 100;
        const areas =[val1];
        const {getByText} = render( 
            <AreaInfo areas = {areas} />
        );

        expect(getByText(/100/i)).toBeInTheDocument();
    })

    test('it shall display no areas', ()=>{
        const areas :number [] =[];
        const {getByText} = render( 
            <AreaInfo areas = {areas} />
        );

        expect(getByText(/noting detected/i)).toBeInTheDocument();
    })

})