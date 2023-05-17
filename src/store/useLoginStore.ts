import { create } from 'zustand';

const useLoginStore = create<IUserInfo>((set) => ({
    name: "",
    email: "",
    companyName: "",
    role: "logout",
    isOpen: false,
    setUserInfo: (userInfo:TRole) => {
        set(()=>({role:userInfo}))
    },
    setIsOpen: (boolean:boolean) => {
        set(()=>({isOpen:boolean}))
    }
}))

export default useLoginStore;  