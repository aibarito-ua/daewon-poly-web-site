// RN webview에서 사용할 공통 사용 함수
export const RN = {
    webview: {
        // useEffect 안에서 사용.
        // WebView Page Loading시 didmount에서 필수
        initDidMountRNEffect: (getPostMessage:(event:any)=>void) => {
            // store
            const isUIWebView = () => {
                return navigator.userAgent.toLowerCase().match(/\(ip.*applewebkit(?!.*(version|crios))/);
            };
            const receiver = isUIWebView() ? window: document;
            receiver.addEventListener('message',getPostMessage)
        },
        // useEffect did unmount remove listener
        // WebView Page Did unmount에서 필수
        unmountENEffect: (getPostMessage:(event:any)=>void)=> {
            const isUIWebView = () => {
                return navigator.userAgent.toLowerCase().match(/\(ip.*applewebkit(?!.*(version|crios))/);
            };
            const receiver = isUIWebView() ? window: document;
            receiver.removeEventListener('message',getPostMessage)
        },
        // web to RN data
        web2RNMessage: async (type:string, data:any) => {
            await window.ReactNativeWebView.postMessage(JSON.stringify(
                {type, data}
            ))
        },
        // when get RN response postMessage data
        getRNData: (rn_data:any)=> {
            const {data} = JSON.parse(rn_data);
            return data;
        }
    },
    // React Native
    RNWebView: {
        checkAdroid: (userAgent:string) => {
            return userAgent.indexOf('android') > -1;
        },
        checkiOS: (userAgent:string) => {
            return userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1 || userAgent.indexOf('ipod') > -1;
        },
        checkMobiles: (userAgent:string) => {
            return userAgent.indexOf('android') > -1 || userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1 || userAgent.indexOf('ipod') > -1;
        }
    }
}