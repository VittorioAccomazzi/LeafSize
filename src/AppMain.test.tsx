import AppMain from "./AppMain";
import { render } from '@testing-library/react';

describe('AppMain', ()=>{

    let userAgentGetter : jest.SpyInstance<string, []>;

    beforeEach(function() {
        userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get')
    })
  
    afterEach(function() {
      jest.clearAllMocks()
    });

    it('Should redirect on error page for invalid browsers', ()=>{

        userAgentGetter.mockReturnValue('Firefox: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:96.0) Gecko/20100101 Firefox/96.0')        
        const { getByText } = render(
            <AppMain>
                <div> This is a valid Page !</div>
            </AppMain>
          );
        
        expect(getByText(/The application can not run on this device/i)).toBeInTheDocument();

    })

    it('Should display child page for valid browsers', ()=>{

        userAgentGetter.mockReturnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36')        
        const { getByText } = render(
            <AppMain>
                <div> This is a valid Page !</div>
            </AppMain>
          );
        
        expect(getByText(/This is a valid Page/i)).toBeInTheDocument();

    })


})