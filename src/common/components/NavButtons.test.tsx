import { render } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PreviousPage from './NavButtons'
import {NextPage} from './NavButtons'


test('Previous Page', ()=>{
    const wrapper = render( 
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <PreviousPage page="/process"/>  } />
            </Routes>
        </BrowserRouter>  
    );
    expect(wrapper).toMatchSnapshot();
})

test('Next Page',()=>{
    const wrapper = render( 
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <NextPage page="/process"/> } />
            </Routes>
        </BrowserRouter>
    );
    expect(wrapper).toMatchSnapshot(); 
})