import axios from "axios";
type TEssayWritingAPI = {
    text: string,
    status: number,
    statusText: string
}
export async function EssayWritingSelectTopicAPI(input:string):Promise<TEssayWritingAPI> {
    
    const data = {text: input}
    return await axios.post('https://demo.ella.school:22111/nest/nlp_tool/v1/essayOutline',data, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    } ).then((res)=>{
        console.log('axios result =',res)
        const txt = res.data.data.text;
        return {text: txt, status: res.status, statusText: res.statusText}
    }).catch((rej)=>{
        const status = rej.response.status;
        const statusText = rej.response.statusText;
        return {text: '잠시 후 다시 시도해주세요.', status, statusText};
    })
}

export async function EssayWritingSelectTopicfor2ndAPI(input:string):Promise<TEssayWritingAPI> {
    const data = {text: input}
    return await axios.post('https://demo.ella.school:22111/nest/nlp_tool/v1/essayOutlinefor2nd',data, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    } ).then((res)=>{
        console.log('axios result =',res)
        const txt = res.data.data.text;
        return {text: txt, status: res.status, statusText: res.statusText}
    }).catch((rej)=>{
        const status = rej.response.status;
        const statusText = rej.response.statusText;
        return {text: '잠시 후 다시 시도해주세요.', status, statusText};
    })
}
