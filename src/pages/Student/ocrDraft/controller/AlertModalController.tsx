import useControlAlertStore from "../../../../store/useControlAlertStore";

export function showConfirmPopup(params: { messages: string[]; btnNames: string[]; yesIdx: number; alertType?: TAlertType; yesCb: Function, noCb?: Function}) {
    const { messages, btnNames, yesIdx, alertType, yesCb, noCb } = params;
    useControlAlertStore.getState().commonAlertOpen({
        messageFontFamily: "Roboto",
        messages,
        alertType: alertType ?? "",
        yesButtonLabel: btnNames.length > 0 ? btnNames[0] : "Yes",
        noButtonLabel: btnNames.length > 1 ? btnNames[1] : "No",
        /** yesButtonLabel 이벤트 */
        yesEvent: () => {
            useControlAlertStore.getState().commonAlertClose();
            if (yesIdx === 0) yesCb();
            if (yesIdx === 1) noCb && noCb();
        },
        /** noButtonLabel 이벤트 */
        closeEvent: () => {
            useControlAlertStore.getState().commonAlertClose();
            if (yesIdx === 1) yesCb();
            if (yesIdx === 0) noCb && noCb();
        },
    });
}

export function showAlertPopup(messages: string[]) {
    useControlAlertStore.getState().commonAlertOpen({
        messageFontFamily: "Roboto",
        messages,
        useOneButton: true,
        yesButtonLabel: "OK",
        yesEvent: () => useControlAlertStore.getState().commonAlertClose(),
    });
}