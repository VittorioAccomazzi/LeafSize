
/**
 * Simple class which centralize the access to the URL parameters for the application
 */
export default class URLParams {

    private static params = new URLSearchParams( typeof window === 'undefined' ? '' : window.location.search );
    private constructor() { } // singleton

    /**
     * for web web wrokers
     * @param params 
     */
    static SetSearchParam( urlParams: string ){
        URLParams.params = new URLSearchParams(urlParams); 
    }

    /**
     * return the pack mode for the pathogen segmentation
     */
    static get PackMode () : string  {
        return URLParams.params.get('PackMode') ?? "Lab";
    }

}