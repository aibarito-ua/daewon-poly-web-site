import { NavigateFunction } from "react-router-dom";
import useLoginStore from "../../../../store/useLoginStore";
import useControlAlertStore from "../../../../store/useControlAlertStore";
import Message from "../Message";
import { logout } from "./Logout";

export function handleExceptionServerErr(params: { is_server_error: boolean; is_retry: boolean; isDuplicateLogin: boolean; data?: TMaintenanceInfo }, navigate: NavigateFunction) {
    const { is_server_error, is_retry, isDuplicateLogin, data } = params;
    if (!is_server_error) return;

    if (data) {
        setMaintenanceData(data);
        navigate('/');
        return;
    }

    if (isDuplicateLogin) {
        useControlAlertStore.getState().commonAlertOpen({
            messageFontFamily: "NotoSansCJKKR",
            priorityLevel: 2,
            useOneButton: true,
            yesButtonLabel: "OK",
            messages: Message.Popups.LOGIN_DUPLICATED,
            yesEvent: () => {
                useControlAlertStore.getState().commonAlertClose();
                logout()
            }
        });
        return;
    }

    // 재시도는 메시지가 기능마다 다르므로 공통 처리하지 않음
    if (is_retry) return;

    useControlAlertStore.getState().commonAlertOpen({
        priorityLevel: 2,
        useOneButton: true,
        yesButtonLabel: "OK",
        messages: Message.Popups.SERVER_NOT_CONNECTED,
        yesEvent: () => useControlAlertStore.getState().commonAlertClose()
    });
}

/** 시스템 점검 안내 정보 설정 */
export function setMaintenanceData(data: TMaintenanceInfo) {
    useLoginStore.getState().setMaintenanceData({
        alertTitle: '시스템 점검 안내',
        data,
        open: false,
        type: ''
    });
}