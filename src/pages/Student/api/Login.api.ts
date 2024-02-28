import axios from "axios";
import { CONFIG } from "../../../config";

export async function loginAPI(username:string, password:string, device_id:string):Promise<{
    data:any;
    is_server_error:boolean;
    is_retry:boolean;
}>{
    const reqUrl = CONFIG.LOGIN.POST.URL;
    // const reqUrl = 'http://demo.ella.school:22111/nest/login/writing'
    const data = { username, password, device_id };
    return await axios.post(reqUrl, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    }).then((response)=>{
        console.log('result =',response)
        return {
            data:response.data.data,
            is_server_error:false,
            is_retry: true,
        };
    }).catch((reject) => {
        const rsp:TProofReadingCountUpdateReject = reject.response.data;
        console.log('reject =',rsp)
        if (rsp.statusCode===500) {
            return {
                data:null,
                is_server_error:true,
                is_retry:false,
            };
        } else if (rsp.statusCode===555) {
            return {
                data: rsp.data,
                is_server_error: true,
                is_retry: true
            }
        } else {
            return {
                data:null,
                is_server_error:true,
                is_retry:true
            };
        }
    })
}

export async function forcedLoginAPI(username:string, password:string, device_id:string):Promise<{
    data:any;
    is_server_error:boolean;
    is_retry:boolean;
}>{
    const reqUrl = CONFIG.LOGIN.POST.FORCE_URL;
    const data = {username, password, device_id};
    return await axios.post(reqUrl, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        console.log('result =',response.data.data)
        return {
            data:response.data.data,
            is_server_error:false,
            is_retry:true,
        };
    }).catch((reject) => {
        const rsp:TProofReadingCountUpdateReject = reject.response.data;
        console.log('reject =',rsp)
        if (rsp.statusCode===500) {
            return {
                data:null,
                is_server_error:true,
                is_retry:false
            };
        } else if (rsp.statusCode===555) {
            return {
                data: rsp.data,
                is_server_error: true,
                is_retry: true
            }
        } else {
            return {
                data:null,
                is_server_error:true,
                is_retry:true
            };
        }
    })
}

export async function logoutAPI(username:string, device_id: string):Promise<{
    data:any;
    is_server_error:boolean;
    is_retry:boolean;
}>{
    const reqUrl = 'http://demo.ella.school:5012/logout/writing';
    const data = {'user_code': username, 'last_location_url': device_id};
    return await axios.post(reqUrl, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        // console.log('result =',response)
        return {
            data:response.data.data,
            is_server_error:false,
            is_retry:true,
        };
    }).catch((reject)=>{
        const rsp:TProofReadingCountUpdateReject = reject.response.data;
        console.log('reject =',rsp)
        if (rsp.statusCode===500) {
            return {
                data:null,
                is_server_error:true,
                is_retry:false
            };
        } else if (rsp.statusCode===555) {
            return {
                data: rsp.data,
                is_server_error: true,
                is_retry: true
            }
        } else {
            return {
                data:null,
                is_server_error:true,
                is_retry:true
            };
        }
    })
}

export async function memberWithDraw(username:string, password:string, usercode:string, accessToken: string): Promise<{
    is_withdrawed_successfully:boolean;
    is_server_error:boolean;
    isDuplicateLogin:boolean;
    is_retry:boolean;
    data?:TMaintenanceInfo;
}>{
    const reqUrl = CONFIG.LOGIN.POST.WITHDRAW;
    const data = {
        "username": username, "password": password, "user_code": usercode
    };
    return await axios.post(reqUrl, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${accessToken}`
        },
    }).then((response)=>{
        console.log('result =',response.data)
        const is_withdrawed_successfully = response.data.data.is_withdrawed_successfully;
        return {
            is_withdrawed_successfully,
            is_server_error:false,
            isDuplicateLogin: false,
            is_retry:true
        };
    }).catch((reject) => {
        console.log('reject =',reject)
        const rsp:TProofReadingCountUpdateReject = reject.response.data;
        if (rsp.statusCode===401 && rsp.message === "Unauthorized" ) {
            return {
                is_withdrawed_successfully:false,
                is_server_error:true,
                isDuplicateLogin: true,
                is_retry:true
            }
        } else if (rsp.statusCode===500) {
            return {
                is_withdrawed_successfully:false,
                is_server_error:true,
                isDuplicateLogin: false,
                is_retry: false,
            }
        } else if (rsp.statusCode===555) {
            return {
                data: rsp.data.maintenanceInfo,
                is_withdrawed_successfully:false,
                is_server_error:true,
                isDuplicateLogin: false,
                is_retry: true,
            }
        } else {
            return {
                is_withdrawed_successfully:false,
                is_server_error:true,
                isDuplicateLogin: false,
                is_retry: true
            }
        }
    })
}

export async function checkDuplicateLogin(
    accessToken:string
):Promise<{
    isDuplicateLogin:boolean;
    is_server_error:boolean;
    is_retry:boolean;
    data?:TMaintenanceInfo;
}> {
    const reqUrl=CONFIG.LOGIN.DUPLICATE_CHECK;
    console.log('duplicate =',reqUrl)
    return await axios.get(reqUrl, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
    }).then((response)=>{
        const result:TProofReadingCountUpdateResponse = response.data;
        console.log('result =',result)
        return {
            isDuplicateLogin:false,
            is_server_error:false,
            is_retry:true
        }
    }).catch((reject) => {
        const rsp:TProofReadingCountUpdateReject = reject.response.data;
        console.log('rsp =',rsp)
        if (rsp.statusCode===401) {
            return {
                isDuplicateLogin:true,
                is_server_error:true,
                is_retry:true
            }
        } else if (rsp.statusCode===500) {
            return {
                isDuplicateLogin:false,
                is_server_error:true,
                is_retry:false
            }
        } else if (rsp.statusCode===555) {
            return {
                data: rsp.data.maintenanceInfo,
                isDuplicateLogin:false,
                is_server_error:true,
                is_retry:false
            }
        } else {
            return {
                isDuplicateLogin:false,
                is_server_error:true,
                is_retry: true,
            }
        }
    })
}