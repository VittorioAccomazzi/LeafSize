import GA from './GA'


describe('GA', ()=>{

    test('Shall no throw', async ()=>{

        await GA.Initialize('',"ABC");
        GA.pageView('test');
        GA.event('App','action','label', 42);
    })
})