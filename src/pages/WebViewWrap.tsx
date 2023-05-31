import React from 'react'
import * as common from '../util/RN/commonPostMessage'
import useRNPostMessageStore from '../store/useRNPostMessageStore'

const WebViewWrap = (props:any) => {
    
    const {req_data, res_data, setReqData, setResData} = useRNPostMessageStore();
    // page state
    const [rnData, setRnData] = React.useState('0');
    const [logData, setLogData] = React.useState('');
    const [isMobiles, setIsMobiles] = React.useState(false);
    React.useEffect(()=>{
        // RN -> web msg evt
        const RN2WebMessage = (event:any) => {
            const data = common.RN.webview.getRNData(event.data);
            
            setLogData(data['number'])
            setRnData(data['number']);
            setResData(data['number']);
        }
        // check mobiles
        const isMobile = () => {
            const user = navigator.userAgent;
            let isCheck = false;
            if (user.indexOf('iPhone') > -1 || user.indexOf('Android') > -1) {
                isCheck = true;
            }
            return isCheck;
        }

        setIsMobiles(isMobile());

        console.log('is Mobile?? ===',isMobiles)
        setResData('0')
        common.RN.webview.initDidMountRNEffect(RN2WebMessage);
        return () => {
            common.RN.webview.unmountENEffect(RN2WebMessage);
        }
    },[setIsMobiles, setResData, isMobiles])

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