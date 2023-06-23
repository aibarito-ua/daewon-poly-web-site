import { create } from 'zustand';

const useLoginStore = create<IUserInfo>((set) => ({
    name: "",
    email: "",
    companyName: "",
    class: '',
    subClass: '',
    role: "logout",
    isOpen: false,
    setUserInfo: (userInfo:IUserLoginInfo) => {

        set(()=>({
            name: userInfo.name,
            class: userInfo.class,
            subClass: userInfo.subClass,
            email: 'test@una.co.kr',
            role:userInfo.role
        }))
    },
    setIsOpen: (boolean:boolean) => {
        set(()=>({isOpen:boolean}))
    }
}))

export default useLoginStore;  