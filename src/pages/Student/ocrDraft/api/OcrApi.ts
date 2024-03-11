import axios from 'axios';

const OCR_API = {
    URL: "https://pen-to-print-handwriting-ocr.p.rapidapi.com/recognize/",
    KEY: "222a70063emsh7c011963fc5957bp1d0157jsn46fcedee61c2",
    HOST: "pen-to-print-handwriting-ocr.p.rapidapi.com"
}

const AXIOS_NETWORK_ERROR_CODE = "ERR_NETWORK";

export async function recognizeOpticalCharacter(croppedFile:File):Promise<{
    result:string;
    isDuplicateLogin:boolean;
    is_server_error:boolean;
    is_retry:boolean;
}>{
    const data = new FormData();
    data.append("srcImg", croppedFile);
    data.append("Session", "string");

    try {
        const res = await axios.post(OCR_API.URL, data, {
            headers: {
                "X-RapidAPI-Key": OCR_API.KEY,
                "X-RapidAPI-Host": OCR_API.HOST,
            }
        });
        if (res.data.error || res.data.value.length === 0) {
            return {
                result : "",
                isDuplicateLogin: false,
                is_server_error: true,
                is_retry: false,
            };    
        }

        return {
            result : res.data.value,
            isDuplicateLogin:false,
            is_server_error:false,
            is_retry:true,
        };
    } catch (error) {
        console.log('reject ==', error);
        if (axios.isAxiosError(error)) {
            if (error.code === AXIOS_NETWORK_ERROR_CODE) {
                return { result: "Please check your internet connection and try again.",
                isDuplicateLogin: false,
                is_server_error: true,
                is_retry: false };
            }

            if (error.response?.status === 401) {
                return {
                    result: "",
                    isDuplicateLogin: true,
                    is_server_error: true,
                    is_retry: true
                };
            } else if (error.response?.status === 500) {
                return {
                    result: "",
                    isDuplicateLogin: false,
                    is_server_error: true,
                    is_retry: false
                };
            } else if (error.response?.status === 555) {
                return {
                    result: "",
                    isDuplicateLogin: false,
                    is_server_error: true,
                    is_retry: false,
                };
            } else {
                return {
                    result: "",
                    isDuplicateLogin: false,
                    is_server_error: true,
                    is_retry: true
                }
                // throw new Error("API Server Error: ",reject)
            }
        }

        return {
            result: "",
            isDuplicateLogin: false,
            is_server_error: true,
            is_retry: false
        };
    }
}