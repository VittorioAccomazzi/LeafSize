import BrowserInfo from "./BrowserInfo";

describe('BrowserInfo', ()=>{

    let userAgentGetter : jest.SpyInstance<string, []>;

    beforeEach(function() {
        userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get')
    })
  
    afterEach(function() {
      jest.clearAllMocks()
    });

    it('Should recognize Chrome 100 as valid', ()=>{
        userAgentGetter.mockReturnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36')
        const bi = new BrowserInfo();
        expect(bi.IsValid).toBeTruthy();
        expect(bi.Suggestion).toBeNull();
    })

    it('Should recognize Chrome 90 as invalid', ()=>{
        userAgentGetter.mockReturnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36')
        const bi = new BrowserInfo();
        expect(bi.IsValid).toBeFalsy();
        expect(bi.Suggestion).toBe('Please update Chrome')
    })

    it('Should reject FireFox Browser', ()=>{
        userAgentGetter.mockReturnValue('Firefox: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:96.0) Gecko/20100101 Firefox/96.0')
        const bi = new BrowserInfo();
        expect(bi.IsValid).toBeFalsy();
        expect(bi.Suggestion).toBe('The application is supported on Chrome version 100 or greater on Desktop')
    })

    it('Should reject Safari Browser', ()=>{
        userAgentGetter.mockReturnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15')
        const bi = new BrowserInfo();
        expect(bi.IsValid).toBeFalsy();
        expect(bi.Suggestion).toBe('The application is supported on Chrome version 100 or greater on Desktop')
    })

    it('Shall reject phone devices',()=>{
        userAgentGetter.mockReturnValue('Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/100.0.4896.75 Mobile Safari/537.36')
        const bi = new BrowserInfo();
        expect(bi.IsValid).toBeFalsy();
        expect(bi.Suggestion).toBe('The application is supported only on Desktop')
    })

})


