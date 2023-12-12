import React from 'react';
import {useLocation} from 'react-router-dom';
import useLoginStore from "../../../store/useLoginStore";
import useNavStore from "../../../store/useNavStore";
import { useNavigate } from "react-router-dom";
import { navItems } from "../Nav";
import { commonIconSvgs } from '../../../util/svgs/commonIconsSvg';
import { useComponentWillMount } from '../../../hooks/useEffectOnce';
import { checkDuplicateLogin, logoutAPI } from '../../../pages/Student/api/Login.api';
import useControlAlertStore from '../../../store/useControlAlertStore';

// export const logoutFn =async () => {
//     const {device_id, isMobile, userInfo} = useLoginStore()
//     logoutAPI(userInfo.userCode, device_id)
//     if(isMobile)
//         window.ReactNativeWebView.postMessage(JSON.stringify('logout'))
//     else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
//         (window as any).api.toElectron.send('clear')
//     }
//     window.location.reload()
// }

const NavAside = () => {
    const {setSelectMenu, selectedMenu, sidebarFlagged, setSidebarFlagged, topNavHiddenFlagged} = useNavStore();
    const { companyName, name, role, setIsOpen, setUserInfo, setLogoutUser, userInfo, device_id, isMobile, setMaintenanceData } = useLoginStore();
    const { commonAlertClose, commonAlertOpen} = useControlAlertStore()
    // const [menuLocateValue, setMenuLocateValue] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const handleMenuClick = async (role:TRole, menuTitle: string) => {
        if (selectedMenu === menuTitle) {
            // await setSelectMenu(null);
        } else {
            console.log('menuTitle =',menuTitle,', ',selectedMenu, ', sidebarFlagged=',sidebarFlagged,', role=',role)
            await setSelectMenu(menuTitle,);
            setSidebarFlagged(!sidebarFlagged);
            await goLink(role,menuTitle);
        }
    };
    useComponentWillMount(()=>{
        setSelectMenu('WritingClinic')
    })

    const goLink = async (role: TRole, link: string) => {
        // console.log("link :::", link);
        const rolePath = role==='logout'? '': (role==='admin'? 'admin': (role==='teacher'?'teacher':'student'))
        navigate(`/${rolePath}/${link}`);
    }

    const logoutFn =async () => {
        logoutAPI(userInfo.userCode, device_id)
        if(isMobile)
            window.ReactNativeWebView.postMessage(JSON.stringify('logout'))
        else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
            (window as any).api.toElectron.send('clear')
        }
        window.location.reload()
    }
    React.useEffect(()=>{
        console.log('test effect selectedMenu= ',selectedMenu,', sidebarFlagged=',sidebarFlagged)
        if (selectedMenu==='') {
            const menuTitle = navItems[role].selectedMenu[0].path;
            setSelectMenu(menuTitle)
            setSidebarFlagged(true);
        }
    },[selectedMenu])
    React.useEffect(()=>{
        const checkTargetPath = location.pathname.split('/')[2];
        const selectedTargetPath = navItems[role].selectedMenu[0].path;
        // console.log('navigate =',checkTargetPath)
        // console.log('nav =',navItems[role].selectedMenu[0].path)
        if (checkTargetPath!==selectedTargetPath) {
            setSelectMenu(checkTargetPath);
        }
    },[location])

    return (
        <nav id={'navAside'} className=''>
        <div className={`absolute left-0 top-0 z-50 w-[190px] h-full max-h-[800px] transition-transform ${
            // !sidebarFlagged ? '-translate-x-full':'translate-x-0'
            ''
            // 'translate-x-0'
        } ${
            topNavHiddenFlagged ? '-translate-x-full hidden': 'translate-x-0'
        }`}
        // aria-label="Sidebar"
        >
            <div className="h-full  pb-4 overflow-y-auto bg-[#3c2481]">
            <div className='mt-[30px] px-3 ml-[36px] w-[118.9px] h-[118.9px] bg-writing-hub-logo bg-no-repeat bg-center bg-contain' />
                <ul className="px-[9px] mt-[20px] space-y-2 font-medium">
                    {navItems[role].selectedMenu.map((v, i) => {
                        const key = `navItem-${role}-${i}`
                        // console.log('v.path =',v.path)
                        // console.log('selectedMenu =',selectedMenu)
                        return (
                            <li key={key} 
                            className={`div-to-button-hover-effect w-[172px] h-[74px] select-none ${
                                selectedMenu===v.path 
                                ? 'border-[3px] border-[#21c39a] rounded-[27px] bg-[#ffffff]'
                                : (
                                    i==0&&selectedMenu===undefined? 'border-[3px] border-[#21c39a] rounded-[27px] bg-[#ffffff]':''
                                )
                            }`}
                            onClick={()=>handleMenuClick(role, v.path)}>
                                <div className="flex flex-row items-center p-2 w-full h-full gap-[10px]">
                                <div className='w-[45px] h-[45px]'>
                                {selectedMenu===v.path ? v.onMenuIcon :(i==0&&selectedMenu===undefined?v.onMenuIcon:v.offMenuIcon) }
                                </div>
                                <span className={selectedMenu===v.path? 'nav-menu-on':(
                                    i==0&&selectedMenu===undefined ? 'nav-menu-on':'nav-menu-off'
                                )}>{v.label}</span>
                                </div>
                            </li>
                        )
                    })}
                    
                </ul>
                {role !== 'logout' && (
                    
                    <commonIconSvgs.ExitButton className='w-[140px] h-[40px] absolute left-[25px] bottom-[30px] hover:cursor-pointer' 
                    onClick={async ()=>{
                        const check = await checkDuplicateLogin(userInfo.accessToken);
                        if (check.is_server_error) { 
                            if (check.data) {
                                let maintenanceInfo:TMaintenanceInfo = check.data.maintenanceInfo;
                                maintenanceInfo.start_date = check.data.maintenanceInfo.start_date;
                                maintenanceInfo.end_date = check.data.maintenanceInfo.end_date;
                                let dumyMaintenanceData:TMaintenanceData = {
                                    alertTitle: '시스템 점검 안내',
                                    data: maintenanceInfo,
                                    open: false,
                                    type: ''
                                }
                                console.log('login maintenanceInfo =',dumyMaintenanceData)
                                setMaintenanceData(dumyMaintenanceData)
                                navigate('/')
                            } else {
                                if (check.isDuplicateLogin) {
                                    commonAlertOpen({
                                        messages: ['중복 로그인으로 자동 로그아웃 처리 되었습니다.'],
                                        priorityLevel: 2,
                                        messageFontFamily:'NotoSansCJKKR',
                                        useOneButton: true,
                                        yesButtonLabel:'OK',
                                        yesEvent: async() => await logoutFn()
                                    })
                                } else {
                                    commonAlertOpen({
                                        messages: [
                                            'Cannot connect to the server.',
                                            'Please try again later.'
                                        ],
                                        priorityLevel: 2,
                                        useOneButton: true,
                                        yesButtonLabel:'OK',
                                        yesEvent: () => {
                                            commonAlertClose();
                                        }
                                    })
                                }
                            }
                        } else {
                            commonAlertOpen({
                                messageFontFamily: 'Roboto',
                                alertType:'warning',
                                messages: ['Do you want to leave the Writing Hub?'],
                                yesButtonLabel: 'Yes',
                                noButtonLabel: 'No',
                                yesEvent: ()=>logoutFn(),
                            })

                        }
                        
                    }}/>
                    
                )}
            </div>
        </div>

        </nav>
    )
}

export default NavAside;