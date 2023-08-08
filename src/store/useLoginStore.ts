import { create } from 'zustand';

const useLoginStore = create<IUserInfo>((set,get) => ({
    name: "",
    email: "",
    companyName: "",
    class: '',
    subClass: '',
    role: "logout",
    tryLoginCount: 0,
    // role: 'student',
    isOpen: false,
    updateTryLoginCount: () => {
        const setCount = get().tryLoginCount+1;
        set(()=>({
            tryLoginCount: setCount
        }))
    },
    // setUserInfo: (userInfo:IUserLoginInfo) => {

    //     set(()=>({
    //         name: userInfo.name,
    //         class: userInfo.class,
    //         subClass: userInfo.subClass,
    //         email: 'test@una.co.kr',
    //         role:userInfo.role
    //     }))
    // },
    setIsOpen: (boolean:boolean) => {
        set(()=>({isOpen:boolean}))
    },

    userInfo: {
        accessToken:'',
        courseCode: '',
        courseName: '',
        memberNameEn: '',
        memberNameKr: '',
        userCode: '',
        webId: '',
        userImagePath: '',
    },
    setUserInfo: (userInfo:TSetUserInfoData) => {
        const targetData = JSON.parse(JSON.stringify(userInfo));
        const data = get().userInfo;
        data.accessToken= targetData.accessToken? targetData.accessToken:data.accessToken;
        data.courseCode= targetData.courseCode? targetData.courseCode:data.courseCode;
        data.courseName= targetData.courseName? targetData.courseName:data.courseName;
        data.memberNameEn= targetData.memberNameEn? targetData.memberNameEn:data.memberNameEn;
        data.memberNameKr= targetData.memberNameKr? targetData.memberNameKr:data.memberNameKr;
        data.userCode= targetData.userCode? targetData.userCode:data.userCode;
        data.webId= targetData.webId? targetData.webId:data.webId;
        data.userImagePath= targetData.userImagePath? targetData.userImagePath:data.userImagePath;

        set(()=>({userInfo:data, role: 'student'}))
    },
    setLogoutUser: ()=>{
        const userInfo = {
            accessToken:'',
            courseCode: '',
            courseName: '',
            memberNameEn: '',
            memberNameKr: '',
            userCode: '',
            webId: '',
            userImagePath: '',
        }
        set(()=>({userInfo, role: 'logout'}))
    }

}))

export default useLoginStore;