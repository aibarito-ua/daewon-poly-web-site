import axios from "axios";
type TEssayWritingAPI = {
    text: string,
    status: number,
    statusText: string
}
export async function EssayWritingSelectTopicAPI(input:string):Promise<{
    result:TEssayWritingAPI;
    isDuplicateLogin: boolean;
    is_server_error:boolean;
    is_retry:boolean;
}> {
    
    const data = {text: input}
    return await axios.post('https://demo.ella.school:22111/nest/nlp_tool/v1/essayOutline',data, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    } ).then((res)=>{
        console.log('axios result =',res)
        const txt = res.data.data.text;
        return {
            result: {text: txt, status: res.status, statusText: res.statusText},
            isDuplicateLogin:false,
            is_server_error:false,
            is_retry:true
        }
    }).catch((rej)=>{
        const rsp:TProofReadingCountUpdateReject = rej.response.data;
        if (rsp.statusCode===401 && rsp.message === "Unauthorized" ) {
            return {
                result: {text: '잠시 후 다시 시도해주세요.', status: rsp.statusCode, statusText: rsp.message},
                isDuplicateLogin:true,
                is_server_error:true,
                is_retry:true
            }
        } else if (rsp.statusCode===500) {
            const status = rej.response.status;
            const statusText = rej.response.statusText;
            return {
                result: {text: '잠시 후 다시 시도해주세요.', status, statusText},
                isDuplicateLogin:false,
                is_server_error:true,
                is_retry:false
            };
        } else {
            const status = rej.response.status;
            const statusText = rej.response.statusText;
            return {
                result: {text: '잠시 후 다시 시도해주세요.', status, statusText},
                isDuplicateLogin:false,
                is_server_error:true,
                is_retry:true
            };
        }
    })
}

export async function EssayWritingSelectTopicfor2ndAPI(input:string):Promise<{
    result:TEssayWritingAPI,
    isDuplicateLogin:boolean,
    is_server_error:boolean;
    is_retry:boolean;
}> {
    const data = {text: input}
    return await axios.post('https://demo.ella.school:22111/nest/nlp_tool/v1/essayOutlinefor2nd',data, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    } ).then((res)=>{
        console.log('axios result =',res)
        const txt = res.data.data.text;
        return {
            result: {text: txt, status: res.status, statusText: res.statusText},
            isDuplicateLogin:false,
            is_server_error:false,
            is_retry:true
        }
    }).catch((rej)=>{
        const rsp:TProofReadingCountUpdateReject = rej.response.data;
        let is_server_error_val=true;
        let is_retry_val = true;
        let isDuplicateLogin_val = false;
        if (rsp.statusCode===401 && rsp.message === "Unauthorized" ) {
            isDuplicateLogin_val=true;
        } else if (rsp.statusCode===500) {
            is_retry_val=false;
        }

        return {
            result: {text: '잠시 후 다시 시도해주세요.', status: rsp.statusCode, statusText: rsp.message},
            isDuplicateLogin: isDuplicateLogin_val,
            is_server_error:is_server_error_val,
            is_retry:is_retry_val
        }
    })
}
