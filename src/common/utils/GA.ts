import GA4React  from 'ga-4-react';

const timeout = 30000 // millisecond.

export type Category = 'App' | 'User' | 'Data' | 'Performances' | 'Error';

export default class GA {
    private static appVersion : string ='';

    private constructor() {} // singleton.

    static async Initialize( version : string, ga4 : string ) : Promise<void>{
        if( version && version.trim().length > 0 ){
            // initialize only in production mode.
            try {
                const ga  = new GA4React(ga4, undefined, undefined, timeout);
                await ga.initialize();
                GA.appVersion = version;
                GA.event('App', 'Version', GA.appVersion );
            } catch ( ex ){
                console.error(`Unable to initialize Google Analytics because of ${ex}`)
            }
        }
    }

    private static get ga4()  {
        return GA4React.getGA4React();
    }

    static pageView( location : string ) {
        if( GA.ga4 )   GA.ga4.pageview(location);
    }

    static error( errorDetails : string ) {
        GA.event('Error', 'Crash', GA.appVersion+' '+errorDetails);
    }

    static event ( category : Category, action : string, label : string ){
        if(GA.ga4) GA.ga4.event(action, label, category, false);
    }

}