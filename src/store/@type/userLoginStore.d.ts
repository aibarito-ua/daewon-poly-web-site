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
    // setUserInfo: (userLoginInfomation: IUserLoginInfo)=>void;
    updateTryLoginCount: () => void;

    userInfo: TUserInfoData;
    setUserInfo: (userLoginInformation: TSetUserInfoData) => void;
    setLogoutUser: ()=>void;
}
interface IUserLoginInfo {
    name: string;
    email: string;
    companyName: string;
    class:string;
    subClass: string;
    role:TRole;
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
}

type TRole = "student" | "teacher" | "admin" | "logout";