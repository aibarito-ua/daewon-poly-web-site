import useLoginStore from "../../../../store/useLoginStore";
import { logoutAPI } from "../../api/Login.api"

export function logout() {
    const { userCode } = useLoginStore.getState().userInfo;
    const deviceId = useLoginStore.getState().device_id;
    const isMobile = useLoginStore.getState().isMobile;

    logoutAPI(userCode, deviceId)
    if(isMobile)
        window.ReactNativeWebView.postMessage(JSON.stringify('logout'))
    else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
        (window as any).api.toElectron.send('clear')
    }
    window.location.reload()
}