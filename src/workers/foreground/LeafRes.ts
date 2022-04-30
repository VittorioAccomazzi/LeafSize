

export default class LeafRes {

    private imageURL : string;
    private area1 : number | null;
    private area2 : number | null;
    private name  : string;
    private deleted : boolean = false;

    constructor( name : string, imageURL : string, area1 : number | null , area2: number | null ){
        this.name = name;
        this.imageURL = imageURL;
        this.area1 = area1;
        this.area2 = area2;
    }

    get leafName() : string {
        return this.name;
    }

    get leafArea1() : number | null {
        return this.area1;
    }

    get leafArea2() : number | null {
        return this.area2;
    }

    get leafURL() : string {
        return this.imageURL;
    }

    get isDeleted() : boolean {
        return this.deleted;
    }

    set isDeleted(val:boolean) {
        this.deleted=val;
    }
}