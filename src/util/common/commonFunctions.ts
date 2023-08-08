import { NavigateFunction } from "react-router-dom";
import {Diff, diff_match_patch} from 'diff-match-patch'
import { CompareDiff } from './grammars/grammarComareDiff';
export const GrammarCF = {
    compareText: (origin_text:string, change_text:string) => {
        const rsp = CompareDiff.diff_lineMode(origin_text, change_text)
        // [[0,origin], [1, add text], [-1, delete text]]
        let dumpRsp:Diff[][] = [];
        for (const diff_index in rsp) {
            const value:Diff = rsp[diff_index]
            const flag_num = value[0]
            if (flag_num===0) {
                dumpRsp.push([value])
            } else if (flag_num === -1) {
                const index = parseInt(diff_index);
                const after_value:Diff = rsp[index+1] ? rsp[index+1] : [0, ''];
                if (after_value[0] === 0) {
                    dumpRsp.push([value])
                }
            } else if (flag_num === 1) {
                const index = parseInt(diff_index);
                const before_value:Diff = rsp[index-1] ? rsp[index-1] : [0,''];
                // console.log('before value in Add===', before_value)
                if (before_value[0]=== -1) {    
                    let dumpThisRsp = [ before_value, value];
                    dumpRsp.splice(index-1, 1, dumpThisRsp)
                } else {
                    // before is nothing or 0 (or 연속으로 추가된 단어)
                    dumpRsp.push([value])
                }
            }
        }
        return dumpRsp;
    }
}
export const CommonFunctions={
    goLink: async (linkPath: string, navigate:NavigateFunction, role?: TRole) => {
        if (role!==undefined) {
            const rolePath = role==='logout'? '': (role==='admin'? 'admin': (role==='teacher'?'teacher':'student'))
            navigate(`/${rolePath}/${linkPath}`);
        } else {

        }
    },
    outlineNameLists: (outlineOriginData: TSparkWritingDataOutline[]) => {
        const targetMaxLength = outlineOriginData.length;
        // title 정리
        let allNames:string[] = [];
        for (let multiIdx = 0; multiIdx < targetMaxLength; multiIdx++) {
            const multiTargetCheck = outlineOriginData[multiIdx].name.split('_');
            if (!allNames.includes(multiTargetCheck[0])) {
                allNames.push(multiTargetCheck[0]);
            }
        }
        return allNames
    },
    outlineDataFormRemake: (allNames:string[], outlineOriginData: TSparkWritingDataOutline[]) => {
        const targetMaxLength = outlineOriginData.length;
        return Array.from({length: allNames.length}, (v, k) => {
            let returns:TSparkWritingDataOutline[] = [];
            const title = allNames[k];
            for (let olIdx =0; olIdx < targetMaxLength; olIdx++) {
                const targetTitle = outlineOriginData[olIdx].name.split('_')[0];
                if (targetTitle === title) {
                    returns.push(outlineOriginData[olIdx])
                }
            }
            return returns;
        });
    }

}