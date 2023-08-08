import axios from "axios";
import { CONFIG } from "../../../config";

export async function loginAPI(username:string, password:string):Promise<any>{
    const reqUrl = CONFIG.LOGIN.POST.URL;
    const data = { username, password };
    return await axios.post(reqUrl, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    }).then((response)=>{
        console.log('result =',response)
        return response.data.data;
    }).catch((reject) => {
        console.log('reject =',reject)
    })
}

export async function forcedLoginAPI(username:string, password:string):Promise<any>{
    const reqUrl = CONFIG.LOGIN.POST.FORCE_URL;
    const data = {username, password};
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