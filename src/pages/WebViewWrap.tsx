import React, { useEffect, useState } from 'react'
import * as common from '../util/RN/commonPostMessage'
import useRNPostMessageStore from '../store/useRNPostMessageStore'

const WebViewWrap = (props:any) => {
    const {req_data, res_data, setReqData, setResData} = useRNPostMessageStore();
    // page state
    const [rnData, setRnData] = useState('0');
    const [logData, setLogData] = useState('');
    
    useEffect(()=>{
        setResData('0')
        common.RN.webview.initDidMountRNEffect(RN2WebMessage);
        return () => {
            common.RN.webview.unmountENEffect(RN2WebMessage);
        }
    },[])

    // web -> RN message event
    const web2RNMessage = async () => {
        // web -> RN
        setReqData(res_data)
        const data = {
            number: rnData
        }
        await common.RN.webview.web2RNMessage('plusNumber', data)
    }
    const web2RNMessageMinus = async () => {
        // web -> RN
        setReqData(res_data)
        const data = {
            number: rnData
        }
        await common.RN.webview.web2RNMessage('minusNumber', data);
    }
    const web2RNMessageReset = async () => {
        // web -> RN
        setReqData(res_data)
        const data = {
            number: rnData
        }
        await common.RN.webview.web2RNMessage('resetNumber', data);
    }

    // RN -> web msg evt
    const RN2WebMessage = (event:any) => {
        const data = common.RN.webview.getRNData(event.data);
        
        setLogData(data['number'])
        setRnData(data['number']);
        setResData(data['number']);
    }

    return (
        <div className='container mx-auto'>
            <div className='flex flex-row justify-center mt-2'>
                <button className='bg-blue-700 text-white p-2 rounded-lg' onClick={web2RNMessage}>{'Web to RN to Web +'}</button>
            </div>
            <div className='flex flex-row justify-center mt-2'>
                <button className='bg-blue-700 text-white p-2 rounded-lg' onClick={web2RNMessageMinus}>{'Web to RN to Web -'}</button>
            </div>
            <div className='flex flex-row justify-center mt-2'>
                <button className='bg-blue-700 text-white p-2 rounded-lg' onClick={web2RNMessageReset}>{'Reset to number'}</button>
            </div>
            <p>state in page : {rnData}</p>
            <p>Response Data in store : {res_data}</p>
            <p>Request Data in store : {req_data}</p>
            <p>logging: {logData}</p>
        </div>
    )
}

export default WebViewWrap;