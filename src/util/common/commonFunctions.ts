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
export const CommonEmoji={
    remove: (text:string) => {
        const emojis = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/gmi;
        const returnText = text.replace(emojis, '');
        const isRemove = returnText === text;
        return {
            text: text.replace(emojis, ''),
            isRemove
        }
    },
    // emojis_uni_code: "(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])";
}
export const CommonReplace={
    specialCharactors: (text:string) => {
        const specialCharactorsRegexp = /[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/gmi;
        return text.replace(specialCharactorsRegexp, '');
    },
    removeErrorCharactor: (text:string) => {
        // &# 연속 사용
        // {, }, \, `(백탭), 특수문자 연속사용
        // const specialCharactorsRegexp = /[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/gmi;
        const removeOneSP = text.replace(/[{}`\\]|(&#)/gmi,'');
        const removeContinue = removeOneSP.replace(/[\{\}\[\]\/?,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]{2,}/gmi, '');
        return removeContinue;
    },
}
/**
 * regular expressions value
 */
const ALL_REG_EXP_ITEMS = {
    checkNotSC: /[\{\}|\\`]{1,}/gmi,
    checkOneSC: /[\[\]\/;:*\-_+<>@\#$%&\\\=\'\"]{2,}/gmi,
    checkSCemptySC: /([\[\]\/;:*\-_+<>@\#$%&\\\=]+\s+[\[\]\/;:*\-_+<>@\#$%&\\\=]+)/gmi,
    checkAPemptyAP: /([\`]+\s+[\`]+)/gmi,
    checkNotKR: /[ㄱ-ㅎㅏ-ㅣ가-힣]/gmi,
    checkContinuousSpace: /\s{10,}/gmi,
    checkChangeRow: /\n{3,}/gmi
}
export const CommonInputValidate = {
    chat: (text: string) => {
        const removeEmoji = CommonEmoji.remove(text);
        const removeSpecialCharacters = CommonReplace.removeErrorCharactor(removeEmoji.text);
        return removeSpecialCharacters;
    },
    // 입력 제한
    /**
     * 
     * @param targetText string
     * @returns boolean -> true: 사용 가능 / false: 사용 불가
     */
    writingInput: (text: string) => {
        const removeEmoji = CommonEmoji.remove(text);
        
    },
    // 입력 제한
    /**
     * 
     * @param targetText string
     * @returns boolean -> true: 사용 가능 / false: 사용 불가
     */
    writingEssayInputTitle: (targetText: string) => {
        const checkNotSC = targetText.match(ALL_REG_EXP_ITEMS.checkNotSC)
        const checkOneSC = targetText.match(ALL_REG_EXP_ITEMS.checkOneSC)
        const checkSCemptySC = targetText.match(ALL_REG_EXP_ITEMS.checkSCemptySC)
        const checkAemptyA = targetText.match(ALL_REG_EXP_ITEMS.checkAPemptyAP)
        const checkNotKR = targetText.match(ALL_REG_EXP_ITEMS.checkNotKR)
        const checkDoubleSpace = targetText.match(ALL_REG_EXP_ITEMS.checkContinuousSpace)
        const checkChangeRow = targetText.match(ALL_REG_EXP_ITEMS.checkChangeRow)
        if (checkNotSC!==null) {
            console.log('불가 문자 입력')
            return false;
        } else if (checkOneSC!==null) {
            console.log('2개 이상 금지')
            return false;
        } else if (checkAemptyA !== null) {
            console.log('\` \' \" 2개 연속 사용 금지')
            return false;
        } else if (checkSCemptySC !==null) {
            console.log('특문 사이 공백 : \'\"는 제외')
            return false;
        } else if (checkNotKR!==null) {
            console.log('한국어')
            return false;
        } else if (checkDoubleSpace) {
            console.log('space 2개까지만 허용')
            return false;
        } else if (checkChangeRow) {
            console.log('줄바꿈 2개까지만')
            return false;
        } else {
            return true;
        }
    },
    writingEssayInputBody: (targetText: string) => {
        const checkNotSC = targetText.match(ALL_REG_EXP_ITEMS.checkNotSC)
        const checkOneSC = targetText.match(ALL_REG_EXP_ITEMS.checkOneSC)
        const checkSCemptySC = targetText.match(ALL_REG_EXP_ITEMS.checkSCemptySC)
        const checkAemptyA = targetText.match(ALL_REG_EXP_ITEMS.checkAPemptyAP)
        const checkNotKR = targetText.match(ALL_REG_EXP_ITEMS.checkNotKR)
        const checkDoubleSpace = targetText.match(ALL_REG_EXP_ITEMS.checkContinuousSpace)
        const checkChangeRow = targetText.match(ALL_REG_EXP_ITEMS.checkChangeRow)
        if (checkNotSC!==null) {
            console.log('불가 문자 입력')
            return false;
        } else if (checkOneSC!==null) {
            console.log('2개 이상 금지')
            return false;
        } else if (checkAemptyA !== null) {
            console.log('\` \' \" 2개 연속 사용 금지')
            return false;
        } else if (checkSCemptySC !==null) {
            console.log('특문 사이 공백 : \'\"는 제외')
            return false;
        } else if (checkNotKR!==null) {
            console.log('한국어')
            return false;
        } else if (checkDoubleSpace) {
            console.log('space 2개까지만 허용')
            return false;
        } else if (checkChangeRow) {
            console.log('줄바꿈 2개까지만')
            return false;
        } else {
            return true;
        }
    }
}