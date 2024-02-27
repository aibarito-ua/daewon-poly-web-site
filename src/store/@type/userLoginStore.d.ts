interface IUserInfo {
    name: string;
    email: string;
    companyName: string;
    class: string;
    subClass: string;
    tryLoginCount: number;
    role: TRole;
    isOpen: boolean;
    setIsOpen: any;
    device_id: string;
    isMobile: boolean;
    isDuplicateLogin:boolean;
    deviceSize: TRNSize;
    windowSize: TRNSize;
    platform: string;
    setPlatform: (v:string) => void;
    setSize: (deviceSize: TRNSize, windowSize: TRNSize) => void;
    setMobile: (v: boolean) => void;
    // setUserInfo: (userLoginInfomation: IUserLoginInfo)=>void;
    updateTryLoginCount: () => void;
    setDeviceId: (id: string) => void;
    userInfo: TUserInfoData;
    setUserInfo: (userLoginInformation: TSetUserInfoData) => void;
    setLogoutUser: ()=>void;

    // user info modal controll
    infoModalOpen: TUserInfoModalController;
    pageName: TUserInfoModalPageName;
    agree: boolean[];
    checkPW: string;
    setCheckPW: (input:string) => void;
    setAgree: (data:boolean[]) => void;
    setPageName: (pageName:TUserInfoModalPageName) => void;
    setInfoModal: (data:TUserInfoModalController) => void;

    // MAINTENANCE(점검 )
    maintenanceData: TMaintenanceData;
    setMaintenanceData: (data:TMaintenanceData) => void;
    closeMaintenanceModal: () => void;
    // Alert (Server Open/Close)
    
}
type TMaintenanceData = {
    alertTitle: string;
    type: string;
    open:boolean;
    data: TMaintenanceInfo;
}
type TMaintenanceInfo = {
    start_date: string;
    end_date: string;
    maintenance_description_en: string[];
    maintenance_description_kr: string[];
    time_description_en: string;
    time_description_kr: string;
    is_type_service_stopped: boolean;
    is_type_maintenance: boolean;
}
type TRNSize = {
    height: number;
    width: number;
}
type TUserInfoModalPageName = 'MyInfo'|'CancelAccount';
type TUserInfoModalController = {
    isOpen: boolean;
}
interface IUserLoginInfo {
    name: string;
    email: string;
    companyName: string;
    class:string;
    subClass: string;
    role:TRole;
    isDuplicateLogin:boolean;
}
type TUserInfoData = {
    accessToken: string;
    courseCode: string;
    courseName: string;
    memberNameEn: string;
    memberNameKr: string;
    userCode: string;
    webId: string;
    userImagePath:string;
    className: string;
    year: number;
    semester: number;
    campusName:string;
}
type TSetUserInfoData = {
    accessToken?: string;
    courseCode?: string;
    courseName?: string;
    memberNameEn?: string;
    memberNameKr?: string;
    userCode?: string;
    webId?: string;
    userImagePath?:string;
    className?: string;
    year?: number;
    semester?: number;
}

type TRole = "student" | "teacher" | "admin" | "logout";



// type TLoginResponse = {
//     "isPasswordCorrect": boolean,
//     "hasPermission": boolean,
//     "isUserLogged": boolean,
//     "isNeedPasswordUpdate": boolean,
//     "isCurrentlyEnrolled": boolean,
//     "isWithdrawn": boolean,
//     "isFiveTimesWrong": boolean,
//     "webId": string,
//     "year": number,
//     "semester": number,
//     "memberType": string,
//     "memberNameKr": string,
//     "memberNameEn": string,
//     "userCode": string,
//     "courseCode": string,
//     "courseName": string,
//     "grade": string,
//     "userImagePath": string,
//     "accessToken": string,
//     "last_location_url": string,
//     "className": string,
// }