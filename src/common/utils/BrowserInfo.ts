import UAParser from "ua-parser-js";

const targetBrowser = 'Chrome';
const minVersion = 100;
const targetDevice = 'console';

//
// Note : this class should be a singleton. Howver it will make it *much* harder to test, and so we rely on the consumer
// (and so the component) to use memoization and avoid to re-create the class each time.
//

export default class BrowserInfo {
    private isValid : boolean;
    private suggestion : string | null;

    constructor() {
        const ua = new UAParser();
        const browser = ua.getBrowser();
        let device  = ua.getDevice().type;
        if( !device ) {
            // infer the device from OS
            const os = ua.getOS();
            if( os.name === 'Mac OS' || os.name === 'Windows' ) device = 'console';
        }
        const matches = browser.version?.match(/\d+/);
        const major = matches && matches.length ? parseInt(matches[0]) : 0; 
        const name = browser.name;
        
        this.suggestion = null;
        this.isValid = targetBrowser === name;
        if( !this.isValid ) this.suggestion = `The application is supported on ${targetBrowser} version ${minVersion} or greater on Desktop`;
        if( this.isValid ){
            this.isValid = device === targetDevice;
            if( !this.isValid ) this.suggestion = `The application is supported only on Desktop`;
        }
        if( this.isValid ){
            this.isValid = major >= minVersion;
            if( !this.isValid ) this.suggestion = `Please update ${targetBrowser}` 
        }
    
        // finally check if we need to force the rendering anyway
        if( !this.isValid ) this.isValid = window.location.search.indexOf('force') >=0;
    }

    get IsValid() : boolean {
        return this.isValid;
    }

    get Suggestion() : string | null {
        return this.suggestion;
    }
}