
import {wait} from './FileUtils'

/**
 * this is a simple class to page a number of request and avoid to overwelm the consumer.
 */
export default class Pacer {
    private delay : number =100;
    private start : number =0;

    constructor( delay : number ){
        this.delay = delay;
    }

    async delayAction ( action : ()=>void ){
        const now = Date.now();
        this.start = now;
        await wait(this.delay);
        if( now === this.start ) action();
    }
}