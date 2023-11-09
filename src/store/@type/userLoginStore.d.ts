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