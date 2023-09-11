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
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        console.log('result =',response.data.data)
        return response.data.data;
    }).catch((reject)=>{
        console.log('reject =',reject)
    })
}