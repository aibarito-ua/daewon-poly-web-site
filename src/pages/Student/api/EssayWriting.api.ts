import React from 'react';
import { CONFIG } from '../../../config';
import axios from 'axios';
import { url } from 'inspector';

export async function callDialogAPI(ai_name:string, user_name:string, history: string[][]):Promise<string[][]> {
    return await axios.post(
        CONFIG.CHATBOT.URL, {
            ai_name, user_name, history
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    ).then((res)=>{
        console.log('axios result =',res)
        const cmd = res.data.cmd;
        if (cmd===201) {
            const usage = res.data.usage
            console.log(`생성에 사용한 토큰:${usage.prompt_tokens}\n생성한 토큰: ${usage.completion_tokens}\n총 사용 토큰: ${usage.total_tokens}`)
            return res.data.text;
        }
    }).catch((rej)=>{
        const status = rej.response.status;
        const statusText = rej.response.statusText;
        return {text: '잠시 후 다시 시도해주세요.', status, statusText};
    });
}

export async function callUnitInfobyStudent (
    studentCode: string,
    courseName: string,
):Promise<{
    book_name: string,
    units: TSparkWritingDatas,
}> {
    // {STUDENT_CODE}/{COURSE_NAME}
    const replaceUrl = CONFIG.DRAFT.GET.UNIT_INFO.replace(/{STUDENT_CODE}/gmi, studentCode).replace(/{COURSE_NAME}/gmi, courseName);
    return await axios.get(
        replaceUrl,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
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
        return {
            book_name: '',
            units: []
        }
    })
}

export async function draftSaveTemporary(
    data:TSparkWritingTemporarySaveData,
):Promise<boolean> {
    return await axios.post(
        CONFIG.DRAFT.POST.SAVE_TEMPORARY,
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    ).then((response) => {
        return response.data.data;
    }).catch((reject) => {
        console.log('Server Rejected: ',reject)
        return false;
    })
}