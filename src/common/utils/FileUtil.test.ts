import isImage from "./FileUtils"
import {noExtension} from './FileUtils'
import {wait} from './FileUtils'

describe('isImage tests', ()=>{
    it('should detect path name of images',()=>{
        const file1 = "path/to/image.png";
        expect(isImage(file1)).toBeTruthy();

        const file2 = "path/to/image.PNG";
        expect(isImage(file2)).toBeTruthy();

        const file3 = "image.jpg";
        expect(isImage(file3)).toBeTruthy();

        const file4 = "image.jpeg";
        expect(isImage(file4)).toBeTruthy();
    });

    it('should detect path name of not images',()=>{
        const file1 = "path/to/file.txt";
        expect(isImage(file1)).toBeFalsy();

        const file2 = "path/to/filename";
        expect(isImage(file2)).toBeFalsy();

        const file3 = "file.exe";
        expect(isImage(file3)).toBeFalsy();

        const file4 = "path/jpg/image.txt";
        expect(isImage(file4)).toBeFalsy();
    })
})

describe('noExtension',()=>{
    const file1 = "my notes.txt";
    expect(noExtension(file1)).toBe("my notes");

    const file2 = "my image.good.jpg";
    expect(noExtension(file2)).toBe("my image.good");

    const file3 = "my image no extension";
    expect(noExtension(file3)).toBe(file3);

})

describe('wait test', ()=>{

    it( 'shall delay right ammount', async ()=>{
        const delay = 150;
        const start = Date.now();
        await wait( delay );
        const end = Date.now();
        expect(end-start).toBeGreaterThanOrEqual(delay)
    })
})