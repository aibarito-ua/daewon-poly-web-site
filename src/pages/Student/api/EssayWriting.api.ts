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