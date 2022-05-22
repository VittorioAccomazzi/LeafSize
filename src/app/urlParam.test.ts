import URLParams from "./urlParams";

describe('URLParam',()=>{

    test('Shall Provide the Pack Mode',()=>{
        URLParams.SetSearchParam('?PackMode=RGB');
        expect(URLParams.PackMode).toBe("RGB");
    })

    test('Shall provide defaults',()=>{
        URLParams.SetSearchParam('');
        expect(URLParams.PackMode).toBe("Lab"); 
    })
})