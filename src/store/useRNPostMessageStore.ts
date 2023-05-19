import {create } from 'zustand';

const useRNPostMessageStore = create<IRNPostMessage>((set, get)=>({
    req_type: "",
    req_data: "",
    res_data: "",
    getPostMessage: (event:any)=>{
        const rn_data = JSON.parse(event.data);
        set(()=>({res_data:rn_data}))
    },
    setPostMessage: (reqType: TRNPostMessageReqType,data:TRNDataObjectType|string)=>{
        const postData = {
            type: reqType,
            data: data
        }
        window.ReactNativeWebView.postMessage(
            JSON.stringify(postData)
        )
    },
    setReqData: (req_data:any) => set(()=>({req_data})),
    setResData: (res_data: any) => set(()=>({res_data}))
}))
export default useRNPostMessageStore;