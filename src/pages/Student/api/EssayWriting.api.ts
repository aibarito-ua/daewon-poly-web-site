import React from 'react';
import { CONFIG } from '../../../config';
import axios from 'axios';
import { url } from 'inspector';

export async function callDialogAPI(ai_name:string, user_name:string, history: string[][], accessToken:string):Promise<{
    text:string[][],
    usages: {
        completion_tokens:number,
        total_tokens:number,
        prompt_tokens:number
    },
    error?: {
        text:string,
        status:any,
        statusText:any
    },
    isDuplicateLogin?:boolean,
}> {
    return await axios.post(
        CONFIG.CHATBOT.URL, {
            ai_name, user_name, history
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        }
    ).then((res)=>{
        console.log('axios result =',res.data.data)
        const cmd = res.data.data.cmd;
        if (cmd===201) {
            const usage = res.data.data.usage
            const useStartToken:number = usage.prompt_tokens;
            const createdToken:number = usage.completion_tokens;
            const totalUseToken:number = usage.total_tokens;
            // console.log(`생성에 사용한 토큰:${usage.prompt_tokens}\n생성한 토큰: ${usage.completion_tokens}\n총 사용 토큰: ${usage.total_tokens}`)
            const textData:string[][] = res.data.data.text;
            return {
                text:textData,
                usages: {
                    completion_tokens: createdToken,
                    total_tokens: totalUseToken,
                    prompt_tokens: useStartToken
                },
                error: undefined
            };
        } else {
            return {
                text:[],
                usages: {
                    completion_tokens:0,
                    total_tokens:0,
                    prompt_tokens: 0
                },
                error: undefined,
            };
        }
    }).catch((rej)=>{
        const status = rej.response.status;
        const statusText = rej.response.statusText;
        const statusCode = rej.response.data.statusCode;
        const message = rej.response.data.message;
        if (statusCode===401 && message === "Unauthorized" ) {
            return {
                text:[],
                usages: {
                    completion_tokens:0,
                    total_tokens:0,
                    prompt_tokens: 0
                },
                error: {text: '잠시 후 다시 시도해주세요.', status:statusCode, statusText:message},
                isDuplicateLogin:true,
            }
        } else {
            return {
                text:[],
                usages: {
                    completion_tokens:0,
                    total_tokens:0,
                    prompt_tokens: 0
                },
                error: {text: '잠시 후 다시 시도해주세요.', status, statusText},
                isDuplicateLogin:false,
            }
        }
    });
}

export async function callUnitInfobyStudent (
    studentCode: string,
    courseName: string,
    accessToken: string,
):Promise<{
    book_name: string,
    units: TSparkWritingDatas,
    isDuplicateLogin?: boolean,
}> {
    // {STUDENT_CODE}/{COURSE_NAME}
    const replaceUrl = CONFIG.DRAFT.GET.UNIT_INFO.replace(/{STUDENT_CODE}/gmi, studentCode).replace(/{COURSE_NAME}/gmi, courseName);
    return await axios.get(
        replaceUrl,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        }
    ).then((response) => {
        const res = response.data.data;
        console.log('in api res =',res)
        return {
            book_name: res.book_name,
            units: res.units
        };
    }).catch((reject) => {
        console.log('Server Rejected: ',reject)
        const statusCode = reject.response.data.statusCode;
        const message = reject.response.data.message;
        if (statusCode===401 && message === "Unauthorized" ) {
            return {
                book_name: '',
                units: [],
                isDuplicateLogin: true
            }
        } else {
            return {
                book_name: '',
                units: [],
                isDuplicateLogin:false
            }
        }
    })
}

export async function draftSaveTemporary(
    data:TSparkWritingTemporarySaveData,
    accessToken: string,
):Promise<{result:boolean, isDuplicateLogin:boolean}> {
    return await axios.post(
        CONFIG.DRAFT.POST.SAVE_TEMPORARY,
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        }
    ).then((response) => {
        return {
            result: response.data.data,
            isDuplicateLogin:false,
        };
    }).catch((reject) => {
        console.log('Server Rejected: ',reject.response.data)
        const statusCode = reject.response.data.statusCode;
        const message = reject.response.data.message;
        if (statusCode===401 && message === "Unauthorized" ) {
            return {
                result: false,
                isDuplicateLogin:true,
            };
        } else {
            return {
                result: false,
                isDuplicateLogin:false,
            };
        }
    })
}

export async function draft1stSubmit (data:TSubmit1stDraftRequestData, accessToken: string,):Promise<{result:boolean, isDuplicateLogin:boolean}>{
    const reqUrl = CONFIG.DRAFT.POST.SUBMIT;
    return await axios.post(reqUrl, data, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    }).then((response)=>{
        const rsp:TProofReadingCountUpdateResponse = response.data;
        return {
            result: rsp.data,
            isDuplicateLogin: false,
        };
    }).catch((reject) => {
        const rsp:TProofReadingCountUpdateReject = reject.response.data;
        if (rsp.statusCode===401 && rsp.message === "Unauthorized" ) {
            return {
                result: false,
                isDuplicateLogin: true,
            };
        } else {
            return {
                result: false,
                isDuplicateLogin: false,
            };
        }
    })
}
export async function draft2ndSubmit (data:TSubmit2ndDraftRequestData, accessToken: string):Promise<{result:boolean, isDuplicateLogin:boolean}> {
    const reqUrl = CONFIG.DRAFT.POST.SUBMIT;
    return await axios.post(reqUrl, data, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    }).then((response)=>{
        const rsp:TProofReadingCountUpdateResponse = response.data;
        return {
            result: rsp.data,
            isDuplicateLogin: false,
        };
    }).catch((reject) => {
        const rsp:TProofReadingCountUpdateReject = reject.response.data;
        if (rsp.statusCode===401 && rsp.message === "Unauthorized" ) {
            return {
                result: false,
                isDuplicateLogin: true,
            };
        } else {
            return {
                result: false,
                isDuplicateLogin: false,
            };
        }
    })
}

export async function getReportsAPI(student_code: string, accessToken: string, levelName:string): Promise<{
    result:TReportByStudentResponse|null,
    isDuplicateLogin:boolean
}> {
    console.log(student_code)
    const reqUrl = CONFIG.REPORT.GET.SPARK_GET_REPORT_OVERALL_BY_STUDENT.replace(/{student_code}/gmi, student_code).replace(/{level_name}/gmi, levelName);
    return await axios.get(reqUrl, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    }).then((response) => {
        const rsp:TReportByStudentResponse = response.data.data;
        return {
            result: rsp,
            isDuplicateLogin:false,
        }
    }).catch((reject) => {
        console.log('reject report api =',reject.response.data);
        const rsp:TProofReadingCountUpdateReject = reject.response.data;
        if (rsp.statusCode===401 && rsp.message === "Unauthorized" ) {
            return {
                result: null,
                isDuplicateLogin: true,
            };
        } else {
            return {
                result: null,
                isDuplicateLogin: false,
            };
        }
    })
}
export async function getPortfoliosAPI (student_code:string, accessToken: string) : Promise<{
    result: TPortfolioAPIData|null,
    isDuplicateLogin:boolean
}> {
    const reqUrl = CONFIG.REPORT.GET.PORTFOLIO_BY_STUDENT.replace(/{student_code}/gmi, student_code);
    return await axios.get(reqUrl, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    }).then((response) => {
        const rsp:TPortfolioAPIData = response.data.data;
        return {
            result: rsp,
            isDuplicateLogin:false,
        }
    }).catch((reject) => {
        console.log('reject ==',reject.response.data)
        const rsp:TProofReadingCountUpdateReject = reject.response.data;
        if (rsp.statusCode===401 && rsp.message === "Unauthorized" ) {
            return {
                result: null,
                isDuplicateLogin: true,
            };
        } else {
            return {
                result: null,
                isDuplicateLogin: false,
            };
        }
    })
}

