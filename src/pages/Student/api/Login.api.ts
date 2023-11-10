import axios from "axios";
import { CONFIG } from "../../../config";

export async function loginAPI(username:string, password:string, device_id:string):Promise<any>{
    const reqUrl = CONFIG.LOGIN.POST.URL;
    const data = { username, password, device_id };
    return await axios.post(reqUrl, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    }).then((response)=>{
        console.log('result =',response)
        return response.data.data;
    }).catch((reject) => {
        console.log('reject =',JSON.stringify(reject))
    })
}

export async function forcedLoginAPI(username:string, password:string, device_id:string):Promise<any>{
    const reqUrl = CONFIG.LOGIN.POST.FORCE_URL;
    const data = {username, password, device_id};
    return await axios.post(reqUrl, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        console.log('result =',response.data.data)
        return response.data.data;
    }).catch((reject)=>{
        console.log('reject =',reject)
    })
}

export async function logoutAPI(username:string, device_id: string):Promise<any>{
    const reqUrl = 'http://demo.ella.school:5012/logout/writing';
    const data = {'user_code': username, 'last_location_url': device_id};
    return await axios.post(reqUrl, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        // console.log('result =',response)
        return response.data.data;
    }).catch((reject)=>{
        const rsp:TProofReadingCountUpdateReject = reject.response.data;
        console.log('reject =',rsp)
    })
}

export async function memberWithDraw(username:string, password:string, usercode:string): Promise<{
    is_withdrawed_successfully:boolean;
    is_server_error:boolean;
    isDuplicateLogin:boolean;
}>{
    const reqUrl = CONFIG.LOGIN.POST.WITHDRAW;
    const data = {
        "username": username, "password": password, "user_code": usercode
    };
    return await axios.post(reqUrl, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    }).then((response)=>{
        console.log('result =',response.data)
        const is_withdrawed_successfully = response.data.data.is_withdrawed_successfully;
        return {
            is_withdrawed_successfully,
            is_server_error:false,
            isDuplicateLogin: false,
        };
    }).catch((reject) => {
        console.log('reject =',JSON.stringify(reject))
        const rsp:TProofReadingCountUpdateReject = reject.response.data;
        if (rsp.statusCode===401 && rsp.message === "Unauthorized" ) {
            return {
                is_withdrawed_successfully:false,
                is_server_error:true,
                isDuplicateLogin: true,
            }
        } else {
            return {
                is_withdrawed_successfully:false,
                is_server_error:true,
                isDuplicateLogin: false,
            }
        }
    })
}

export async function checkDuplicateLogin(
    accessToken:string
):Promise<{
    isDuplicateLogin:boolean,
}> {
    const reqUrl=CONFIG.LOGIN.DUPLICATE_CHECK;
    return await axios.get(reqUrl, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
    }).then((response)=>{
        const result:TProofReadingCountUpdateResponse = response.data;
        return {
            isDuplicateLogin:false
        }
    }).catch((reject) => {
        const rsp:TProofReadingCountUpdateReject = reject.response.data;
        if (rsp.statusCode===401) {
            return {
                isDuplicateLogin:true
            }
        } else {
            return {
                isDuplicateLogin:false
            }
        }
    })
}