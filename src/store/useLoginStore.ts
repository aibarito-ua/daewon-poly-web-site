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
    device_id: "",
    isMobile: false,
    isDuplicateLogin: false,
    updateTryLoginCount: () => {
        const setCount = get().tryLoginCount+1;
        set(()=>({
            tryLoginCount: setCount
        }))
    },
    setMobile: (v) => {
        set(()=>({isMobile:v}))
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
    setDeviceId: (id: string) => {
        set(()=>({device_id:id}))
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
        className:'',
        semester:0,
        year:0,
        campusName: ''
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
        data.className = targetData.className? targetData.className:data.className;
        data.semester = targetData.semester? targetData.semester:data.semester;
        data.year = targetData.year ? targetData.year: data.year;
        data.campusName =targetData.campusName ? targetData.campusName : data.campusName;

        set(()=>({userInfo:data, role: 'student'}))
    },
    setLogoutUser: ()=>{
        const userInfo:TUserInfoData = {
            accessToken:'',
            courseCode: '',
            courseName: '',
            memberNameEn: '',
            memberNameKr: '',
            userCode: '',
            webId: '',
            userImagePath: '',
            className:'',
            semester:0,
            year:0,
            campusName: ''
        }
        set(()=>({userInfo, role: 'logout'}))
    },

    // user info modal controller
    infoModalOpen: { 
        isOpen: false,
        cancelMember: {
            agree1:false,
            agree2:false,
        }
    },
    pageName: 'MyInfo',
    setPageName: (pageName) => {
        set(()=>({pageName}))
    },
    agree: [false,false],
    setAgree: (data) => {
        set(()=>({agree:data}))
    },
    setInfoModal: (data) => {
        set(()=>({infoModalOpen: data}))
    },
    checkPW:'',
    setCheckPW: (input) => {
        set(()=>({checkPW:input}))
    },
    deviceSize: {
        height: 0, width: 0
    },
    windowSize: {
        height:0, width:0
    },
    platform: '',
    setPlatform: (platform) => set(()=>({platform})),
    setSize: (deviceSize, windowSize) => {
        set(()=>({
            deviceSize, windowSize
        }))
    }

}))

export default useLoginStore;