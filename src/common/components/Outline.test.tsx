import { Box, Button, Stack } from '@mui/material';
import { render } from '@testing-library/react';
import Outline from './Outline';


describe('Outline',()=>{
    test('shall display the content',()=>{
        const wrapper = render( 
            <Outline label={'this is a test'}>
                <Box>Inner</Box>
            </Outline>
        );

        expect(wrapper.getByText(/Inner/)).toBeInTheDocument();
    } )
})