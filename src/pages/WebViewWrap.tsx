import React, { useEffect, useState } from 'react'
// declare interface Window {
//     ReactNativeWebView: any;
// }
const WebViewWrap = (props:any) => {
    const [rnData, setRnData] = useState('0');
    const [rntoWebData, setRntoWebData] = useState(false);
    
    const isUIWebView = () => {
        return navigator.userAgent.toLowerCase().match(/\(ip.*applewebkit(?!.*(version|crios))/);
    };
    useEffect(()=>{
        const isUIWebView = () => {
            return navigator.userAgent.toLowerCase().match(/\(ip.*applewebkit(?!.*(version|crios))/);
        };
        const receiver = isUIWebView() ? window: document;
        receiver.addEventListener('message',RN2WebMessage);
        return () => {
            receiver.removeEventListener('message',RN2WebMessage)
        }
    },[])

    // RN->Web Flagged event
    useEffect(()=>{
        const receiver = isUIWebView() ? window: document;
        
        receiver.addEventListener('message',RN2WebMessage);
        setTimeout(()=>{
            receiver.removeEventListener('message',RN2WebMessage)
        }, 2000)
    }, [rntoWebData])
    // web -> RN message event
    const web2RNMessage = async () => {
        // web -> RN
        window.ReactNativeWebView.postMessage(JSON.stringify(
            {type: 1, data: rnData}
        ));
        // RN->Web flagged
        setRntoWebData(!rntoWebData)
    }

    // RN -> web msg evt
    const RN2WebMessage = (event:any) => {
        const {data} = JSON.parse(event.data);
        setRnData(data);
    }

    return (
        <div>
            <button onClick={web2RNMessage}>{'Web to RN to Web'}</button>
            <p>{rnData}</p>
        </div>
    )
}

export default WebViewWrap;