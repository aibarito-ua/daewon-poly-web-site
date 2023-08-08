import {create} from 'zustand'
interface IUseControlAlertStore {
    commonAlertOpenFlag: boolean;
    commonAlertMessage: string[]|JSX.Element[];
    commonAlertControllerFlag : number;
    commonAlertHeadTitle:string;
    commonAlertYesLabel:string;
    commonAlertNoLabel:string;
    commonAlertYesFunctionEvent: Function|null;
    commonAlertCloseEvent:Function|null;
    commonAlertOneButton: boolean;
    commonAlertType: TAlertType;

    setCommonAlertMessage: (messages: string[]) => void;
    setCommonAlertHeadTitle: (title:string) =>void;
    commonAlertOpen: (option?: TCommonAlertOpenOptions ) => void;
    commonAlertClose: () => void;

    // standby screen
    commonStandbyScreen: TCommonStandbyScreen,
    setCommonStandbyScreen: (controlData:TCommonStandbyScreen) => void;
}
type TAlertType = ''|'warning'|'continue';
type TCommonAlertOpenOptions = {
    head?:string,
    yesButtonLabel?:string,
    noButtonLabel?:string,
    messages?:string[]|JSX.Element[],
    yesEvent?:Function,
    closeEvent?:Function,
    useOneButton?:boolean,
    alertType?: TAlertType,
}

type TCommonStandbyScreen = {
    openFlag: boolean
}

const useControlAlertStore = create<IUseControlAlertStore>((set, get) => ({
    commonAlertOpenFlag: false,
    commonAlertMessage: ['your learning data will not be saved','if you exit now.'],
    commonAlertControllerFlag : 0,
    commonAlertHeadTitle: '',
    commonAlertNoLabel:'No',
    commonAlertYesLabel: 'Yes',
    commonAlertYesFunctionEvent: null,
    commonAlertCloseEvent: null,
    commonAlertOneButton: false,
    commonAlertType: '',

    setCommonAlertMessage: (messages: string[]|JSX.Element[]) => {
        set(()=>({
            commonAlertMessage: messages
        }))
    },
    setCommonAlertHeadTitle: (title:string) => {
        set(()=>({
            commonAlertHeadTitle: title
        }))
    },
    commonAlertOpen: (option?:TCommonAlertOpenOptions) => {
        const commonAlertHeadTitle=option?.head ? option.head:'';
        const commonAlertYesLabel=option?.yesButtonLabel ? option.yesButtonLabel:'yes';
        const commonAlertNoLabel=option?.noButtonLabel ? option.noButtonLabel:'no';
        const commonAlertMessage=option?.messages ? option.messages:[];
        const commonAlertYesFunctionEvent=option?.yesEvent ? option.yesEvent:null;
        const commonAlertCloseEvent = option?.closeEvent ? option.closeEvent: null;
        const commonAlertOneButton=option?.useOneButton ? option.useOneButton:false;
        const commonAlertType=option?.alertType ? option.alertType:'';
        
        set(()=>({
            commonAlertHeadTitle,
            commonAlertYesLabel,
            commonAlertNoLabel,
            commonAlertMessage,
            commonAlertCloseEvent,
            commonAlertYesFunctionEvent,
            commonAlertOneButton,
            commonAlertOpenFlag:true,
            commonAlertType,
        }))
    },
    commonAlertClose: () => {
        set(()=>({
            commonAlertOpenFlag:false,
        }))
    },

    // back drop screen
    commonStandbyScreen: {
        openFlag: false,
    },
    setCommonStandbyScreen: (controlData) => {
        set(()=>({
            commonStandbyScreen:controlData
        }))
    }

}))

export default useControlAlertStore;