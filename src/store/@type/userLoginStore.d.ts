interface IUserInfo {
    name: string;
    email: string;
    companyName: string;
    class: string;
    subClass: string;
    role: TRole;
    isOpen: boolean;
    setIsOpen: any;
    setUserInfo: (userLoginInfomation: IUserLoginInfo)=>void;
}
interface IUserLoginInfo {
    name: string;
    email: string;
    companyName: string;
    class:string;
    subClass: string;
    role:TRole;
}

type TRole = "student" | "teacher" | "admin" | "logout";