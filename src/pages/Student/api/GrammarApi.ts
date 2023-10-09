import React from 'react';
import { CONFIG } from '../../../config';
import axios from 'axios';

export async function grammarCheck(grammarData:TSparkWritingDataOutline[], accessToken:string):Promise<TGrammarResponse>{
    const reqUrl = CONFIG.GRAMMAR.CHECK;
    const data = {
        data: grammarData
    }
    return await axios.post(reqUrl,data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
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
export async function proofReadingCountUpdate(student_code:string, unit_id: number, proofreading_count: number, accessToken:string):Promise<TProofReadingCountUpdateResponse|TProofReadingCountUpdateReject> {
    const reqUrl = CONFIG.GRAMMAR.PROOF_READING_COUNT_UPDATGE;
    const data = { student_code, unit_id, proofreading_count };
    return await axios.put(reqUrl, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
    }).then(( result ) => {
        const response:TProofReadingCountUpdateResponse = result.data;
        return response;
    }).catch((reject) => {
        const returnReject:TProofReadingCountUpdateReject = reject
        console.log('returnReject =',returnReject)
        return returnReject;
    })
}
export async function grammarReset(data:{student_code:string, unit_id:number, proofreading_count:number},accessToken:string):Promise<any> {
    const reqUrl = CONFIG.GRAMMAR.PROOF_READING_COUNT_UPDATGE;
    return await axios.put(reqUrl,data,{
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
    }).then(( result ) => {
        const response:TProofReadingCountUpdateResponse = result.data;
        return response;
    }).catch((reject) => {
        const returnReject:TProofReadingCountUpdateReject = reject
        console.log('returnReject =',returnReject)
        return returnReject;
    })
}

type TGrammarCompareResponse = {
    compare_text: (number|string)[][]
}
export async function grammarCompare(originText:string,changeText:string):Promise<any> {

}

export const previewTest = {
    
}