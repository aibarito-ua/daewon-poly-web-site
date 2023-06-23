import React from 'react';
import { CONFIG } from '../../../config';
import axios from 'axios';
type TGrammarCheckResponse = {
    origin_text_array: string[];
    change_text_array: string[];
}
export async function grammarCheck(targetText:string):Promise<any>{
    const reqUrl = CONFIG.GRAMMAR.CHECK;
    const data = {
        text: targetText
    }
    return await axios.post(reqUrl,data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    }).then((result)=>{
        console.log('result: ',result)
        let resultDump = result;
        if (resultDump.data.change_text_array[0] === "There is no error in this sentence.") {
            resultDump.data.change_text_array = resultDump.data.origin_text_array
        }
        return resultDump.data;
    }).catch((reject)=>{
        throw new Error("API Server Error: ",reject)
    })
    
}

type TGrammarCompareResponse = {
    compare_text: (number|string)[][]
}
export async function grammarCompare(originText:string,changeText:string):Promise<any> {

}

export const previewTest = {
    
}