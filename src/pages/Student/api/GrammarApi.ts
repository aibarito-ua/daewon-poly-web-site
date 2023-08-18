import React from 'react';
import { CONFIG } from '../../../config';
import axios from 'axios';

export async function grammarCheck(grammarData:TSparkWritingDataOutline[]):Promise<TGrammarResponse>{
    const reqUrl = CONFIG.GRAMMAR.CHECK;
    const data = {
        data: grammarData
    }
    return await axios.post(reqUrl,data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    }).then((result)=>{
        console.log('result: ',result.data.data)
        const responseData = result.data.data;
        return {
            origin_data: responseData.origin_data,
            result_body: responseData.result_body,
            result_title: responseData.result_title
        };
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