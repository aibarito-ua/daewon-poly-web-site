import { CONFIG } from '../../../config';
import axios from 'axios';

export async function grammarCheck(grammarData:TSparkWritingDataOutline[], accessToken:string, student_name_en:string):Promise<{
    result:TGrammarResponse;
    isDuplicateLogin:boolean;
    is_server_error:boolean;
    is_retry:boolean;
    data?: TMaintenanceInfo;
}>{
    const reqUrl = CONFIG.GRAMMAR.CHECK;
    const data = {
        student_name_en,
        data: grammarData
    }
    console.log('grammar request data =',data)
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
            result : {
                origin_data: responseData.origin_data,
                result_body: responseData.result_body,
                result_title: responseData.result_title
            },
            isDuplicateLogin:false,
            is_server_error:false,
            is_retry:true,
        };
    }).catch((reject)=>{
        // throw new Error("API Server Error: ",reject)
        console.log('reject ==',reject.response.data)
        const rsp:TProofReadingCountUpdateReject = reject.response.data;
        if (rsp.statusCode===401) {
            return {
                result: {
                    origin_data:[],
                    result_body:[],
                    result_title:[]
                },
                isDuplicateLogin: true,
                is_server_error:true,
                is_retry:true
            };
        } else if (rsp.statusCode===500) {
            return {
                result: {
                    origin_data:[],
                    result_body:[],
                    result_title:[]
                },
                isDuplicateLogin: false,
                is_server_error:true,
                is_retry:false
            };
        } else if (rsp.statusCode===555) {
            return {
                result: {
                    origin_data:[],
                    result_body:[],
                    result_title:[]
                },
                isDuplicateLogin: false,
                is_server_error:true,
                is_retry:false,
                data: rsp.data.maintenanceInfo
            };
        } else {
            return {
                result: {
                    origin_data:[],
                    result_body:[],
                    result_title:[]
                },
                isDuplicateLogin: false,
                is_server_error:true,
                is_retry:true
            }
            // throw new Error("API Server Error: ",reject)
        }
    })
    
}
export async function proofReadingCountUpdate(student_code:string, unit_id: number, proofreading_count: number, accessToken:string):Promise<{
    result: TProofReadingCountUpdateResponse|TProofReadingCountUpdateReject;
    isDuplicateLogin: boolean;
    is_server_error:boolean;
    is_retry:boolean;
}> {
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
        return {
            result:response,
            isDuplicateLogin: false,
            is_server_error:false,
            is_retry:true,
        };
    }).catch((reject) => {
        const returnReject:TProofReadingCountUpdateReject = reject
        console.log('returnReject =',returnReject)
        if (returnReject.statusCode===401 && returnReject.message === "Unauthorized" ) {
            return {
                result: returnReject,
                isDuplicateLogin: true,
                is_server_error:true,
                is_retry:true
            };
        } else if (returnReject.statusCode===500) {
            return {
                result: returnReject,
                isDuplicateLogin: false,
                is_server_error:true,
                is_retry:false
            };
        } else {
            return {
                result: returnReject,
                isDuplicateLogin: false,
                is_server_error:true,
                is_retry:true
            };
        }
    })
}
export async function grammarReset(data:{student_code:string, unit_id:number, proofreading_count:number},accessToken:string):Promise<{
    result: any;
    isDuplicateLogin: boolean;
    is_server_error:boolean;
    is_retry:boolean;
    data?:TMaintenanceInfo
}> {
    const reqUrl = CONFIG.GRAMMAR.PROOF_READING_COUNT_UPDATGE;
    return await axios.put(reqUrl,data,{
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
    }).then(( result ) => {
        const response:TProofReadingCountUpdateResponse = result.data;
        return {
            result:response,
            isDuplicateLogin:false,
            is_server_error:false,
            is_retry:true
        };
    }).catch((reject) => {
        const returnReject:TProofReadingCountUpdateReject = reject
        console.log('returnReject =',returnReject)
        if (returnReject.statusCode===401 && returnReject.message === "Unauthorized" ) {
            return {
                result: returnReject,
                isDuplicateLogin: true,
                is_server_error:true,
                is_retry:true
            };
        } else if (returnReject.statusCode===500) {
            return {
                result: returnReject,
                isDuplicateLogin: false,
                is_server_error:true,
                is_retry:false
            };
        } else if (returnReject.statusCode===555) {
            return {
                result: returnReject,
                isDuplicateLogin: false,
                is_server_error:true,
                is_retry:false,
                data: returnReject.data.maintenanceInfo
            };
        } else {
            return {
                result: returnReject,
                isDuplicateLogin: false,
                is_server_error:true,
                is_retry:true
            };
        }
    })
}

// type TGrammarCompareResponse = {
//     compare_text: (number|string)[][]
// }
// export async function grammarCompare(originText:string,changeText:string):Promise<any> {

// }

// export const previewTest = {
    
// }