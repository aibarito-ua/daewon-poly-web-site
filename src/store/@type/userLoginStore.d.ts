interface IUserInfo {
    name: string;
    email: string;
    companyName: string;
    role: TRole;
    isOpen: boolean;
    setIsOpen: any;
    setUserInfo: any;
}

type TRole = "student" | "teacher" | "admin" | "logout";