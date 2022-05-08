import AppError from "./AppError";
import { render } from '@testing-library/react';

describe('AppError',()=>{

    test('Shall report the error', ()=>{
        const errmsg= 'this is an error';
        const error = new Error(errmsg);
        const resetErrorBoundary = ()=>{};
        const {getByText} = render(<AppError error={error} resetErrorBoundary={resetErrorBoundary}/> )
        expect(getByText(errmsg)).toBeInTheDocument();
    })
})