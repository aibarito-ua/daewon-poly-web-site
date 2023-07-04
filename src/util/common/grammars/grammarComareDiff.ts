import {diff_match_patch, Diff} from 'diff-match-patch'

export class CompareDiff {
    constructor(){}
    // compareDiff(text1:string, text2: string){
    //     let dmp = new diff_match_patch();
    //     dmp.Diff_Timeout =0;
    //     const {chars1, chars2, lineArray} = this.diff_wordMode(text1, text2);
    //     const d = dmp.diff_main(text1, text2, false);
    //     return {"test": d}
    // }

    static diff_lineMode(text1: string, text2:string) {
        let dmp = new diff_match_patch();
        const {chars1, chars2, lineArray} = this.diff_wordMode(text1, text2);
        const jsonDatas = {chars1,chars2,lineArray}
        const consoleJson = JSON.stringify(jsonDatas)
        // console.log('test=',consoleJson)
        const diffs = dmp.diff_main(chars1,chars2, false);
        this.override_diff_charsToLines_(diffs, lineArray);
        return diffs;
    }
    

    static override_diff_charsToLines_(diffs:Diff[], lineArray:string[]) {
        for (var i = 0; i < diffs.length; i++) {
            var chars = diffs[i][1];
            var text = [];
            for (var j = 0; j < chars.length; j++) {
              text[j] = lineArray[chars.charCodeAt(j)];
            }
            diffs[i][1] = text.join('');
        }
    }

    // tokenize re function
    static tokenize_new(text:string, callback: (word:string)=>void): void {
        
        let wordStart = 0;
        let wordEnd = -1;
        while (wordEnd < text.length - 1) {
            wordEnd = this.indexOfWordBoundary(text, wordStart);
            if (wordEnd !== -1) {
            if (wordStart !== wordEnd) {
                const word = text.substring(wordStart, wordEnd);
                callback(word);
            }
            const punct = text[wordEnd];
            callback(punct);
            wordStart = wordEnd + 1;
            } else {
            const word = text.substring(wordStart, text.length);
            callback(word);
            wordEnd = text.length;
            break;
            }
        }
    }
    static indexOfWordBoundary(target: string, startIndex:number): number {
        const n = target.length;
        const WORDBOUNDARYPATTERN = /\W/;
        for ( let i =  startIndex; i < n; i +=1) {
            if (WORDBOUNDARYPATTERN.test(target[i])) {
                return i;
            }
        }
        return -1;
    }
    static diff_wordMode (text1:string, text2: string){
        const wordArray: string[] = [];
        const wordHash: {[x:string]: number} = {};
        wordArray[0] = '';
        const diff_linesWordsMurge_ = (text:string) => {
            let chars = '';
            let wordArrayLength = wordArray.length;
            this.tokenize_new(text, (word)=>{
                if (wordHash.hasOwnProperty ? wordHash.hasOwnProperty(word) : (wordHash[word] !== undefined)) {
                    chars += String.fromCharCode(wordHash[word]);
                } else {
                    chars += String.fromCharCode(wordArrayLength);
                    wordHash[word] = wordArrayLength;
                    wordArray[wordArrayLength++] = word;
                }
            });
            return chars;
        }
        const chars1 = diff_linesWordsMurge_(text1);
        const chars2 = diff_linesWordsMurge_(text2);
        return {chars1, chars2, lineArray: wordArray};
    }
}