import React from 'react';
import useLoginStore from '../store/useLoginStore';
import { CONFIG } from '../config';
import { svgIcons } from '../util/svgs/loginSvgs';
import { forcedLoginAPI, loginAPI } from './Student/api/Login.api';
import useControlAlertStore from '../store/useControlAlertStore';
import useNavStore from '../store/useNavStore';
import { detect } from 'detect-browser';
import { useNavigate } from 'react-router-dom';
import { UpdateLoadingScreen } from '../components/pageComponents/loginPageComponents/UpdateLoadingScreen';

export const Login = () => {
    const navigate = useNavigate();
    const { 
        setUserInfo, setDeviceId, setMobile, isMobile, device_id, setSize,setPlatform,
        setMaintenanceData
     } = useLoginStore();
    const {setSelectMenu} = useNavStore();
    const [passwordType, setPasswordType] = React.useState<boolean>(false);
    const [loginValues, setLoginValues] = React.useState<{username:string, password:string}>({username:'',password:''});
    const [errors, setErrors] = React.useState<{displayMessage:string}>({displayMessage:''})
    const [msgCheck, setMsgCheck] = React.useState<{beforeId: string, incorrectedCount: number}>({beforeId:'', incorrectedCount:0});
    const [saveId, setSaveId] = React.useState<boolean>(false)
    const [isLoginBtn, setIsLoginBtn] = React.useState<boolean>(false);
    const [version, setVersion] = React.useState<string>('');
    const [showUpdateScreen, setShowUpdateScreen] = React.useState<boolean>(true)

    const {
        commonAlertOpen, commonAlertClose
    } = useControlAlertStore();

    const validate=()=>{
        const errors = {
            displayMessage: '',
        }
        if (!loginValues.username) {
            errors.displayMessage = "ID를 입력하세요."
            return errors;
        }
        if (!loginValues.password) {
            errors.displayMessage = "비밀번호를 입력하세요."
            return errors;
        }
        return errors;
    }
    const goPasswordUpdatePage = () => {
        // 아이디/비밀번호 변경
        window.open(CONFIG.LOGIN.LINK.POLY.FIND_PW, "_blank", "noopener, noreferrer" )
    }
    const goPasswordChangePage = (token: string) => {
        // 6개월 경과 비밀번호 변경
        const url = CONFIG.LOGIN.LINK.POLY.CHANGE_PW+encodeURIComponent(token);
        
        console.log('test =',url)
        window.open(url, '_blank', 'noopener, norefferrer')
    }
    const forceLogin = async (loginvalues: {username: string, password: string}, deviceid: string, saveid: boolean) => {
        console.log('loggin in with', loginvalues)
        const response = await forcedLoginAPI(loginvalues?.username, loginvalues?.password, deviceid).then((res) => {
            console.log('response =',res)
            if (res.is_server_error===true) {
                if (res.data !== null) {
                    let maintenanceInfo:TMaintenanceInfo = res.data.maintenanceInfo;
                    maintenanceInfo.start_date = res.data.maintenanceInfo.start_date;
                    maintenanceInfo.end_date = res.data.maintenanceInfo.end_date;
                    let dumyMaintenanceData:TMaintenanceData = {
                        alertTitle: '시스템 점검 안내',
                        data: maintenanceInfo,
                        open: false,
                        type: ''
                    }
                    
                    setMaintenanceData(dumyMaintenanceData)
                    navigate('/')
                } else {
                    console.log('test2')
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
                    return false;
                }
            } else {
                return res
            }
        });
        if (response) {
            
            const rnData = {userInfo:response.data, loginValues: loginvalues, saveId: saveid, maintenance: response.data.maintenanceInfo}
    
            if (isMobile) {
                sendMessage(rnData);
            } else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
                (window as any).api.toElectron.send('saveUser', rnData)
            }
            console.log('===LOGIN::forceLogin===')
            setSelectMenu('WritingClinic')
            if (response.data.maintenanceInfo) {
                let maintenanceInfo:TMaintenanceInfo = response.data.maintenanceInfo;
                maintenanceInfo.start_date = response.data.maintenanceInfo.start_date;
                maintenanceInfo.end_date = response.data.maintenanceInfo.end_date;
                let dumyMaintenanceData:TMaintenanceData = {
                    alertTitle: '시스템 점검 안내',
                    data: maintenanceInfo,
                    open: false,
                    type: ''
                }
                console.log('login maintenanceInfo =',dumyMaintenanceData)
                setMaintenanceData(dumyMaintenanceData)
                navigate('/')
            }
            setUserInfo(response.data);
        } 
    }
    const forceLoginRN = async (loginvalues: {username: string, password: string}, deviceid: string, saveid: boolean) => {
        console.log('loggin in with', loginvalues)
        const response = await forcedLoginAPI(loginvalues?.username, loginvalues?.password, deviceid).then((res) => {
            console.log('response =',res)
            if (res.is_server_error===true) {
                if (res.data !== null) {
                    let maintenanceInfo:TMaintenanceInfo = res.data.maintenanceInfo;
                    maintenanceInfo.start_date = res.data.maintenanceInfo.start_date;
                    maintenanceInfo.end_date = res.data.maintenanceInfo.end_date;
                    let dumyMaintenanceData:TMaintenanceData = {
                        alertTitle: '시스템 점검 안내',
                        data: maintenanceInfo,
                        open: false,
                        type: ''
                    }
                    setMaintenanceData(dumyMaintenanceData)
                    navigate('/')
                } else {
                    return false;
                }
            } else {
                return res
            }
        });
        if (response) {
            const rnData = {userInfo:response.data, loginValues: loginvalues, saveId: saveid}
    
            if (isMobile) {
                sendMessage(rnData);
            } else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
                (window as any).api.toElectron.send('saveUser', rnData)
            }
            console.log('===LOGIN::forceLoginRN===')
            setSelectMenu('WritingClinic')
            setUserInfo(response.data);
        } 
    }
    // const confirmUpdateNewVersion = () => {
    //     if (isUnderMaintenance) {
    //         confirmUnderMaintenanceAlert();
    //     } else {
    //         if (isShouldChangeVersion) {
    //             commonAlertOpen({
    //                 useOneButton:true,
    //                 alertType: 'warningContinue',
    //                 yesButtonLabel: 'OK',
    //                 messageFontFamily: 'NotoSansCJKKR',
    //                 messages: [
    //                     "새로운 버전으로 업데이트를 진행해주세요."
    //                 ],
    //                 yesEvent: () => {
    //                     commonAlertClose();
                        
    //                 }
    //             })
    //         }
    //     }
    // }
    // const confirmUnderMaintenanceAlert = () => {
    //     commonAlertOpen({
    //         useOneButton:true,
    //         alertType: 'warningContinue',
    //         yesButtonLabel: 'OK',
    //         messageFontFamily: 'NotoSansCJKKR',
    //         messages: [
    //             "서비스 안정화를 위한 점검중이에요."
    //         ],
    //         yesEvent: () => {
    //             commonAlertClose();
                
    //         }
    //     })
    // }
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(isMobile || window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
            
        } else {
            await fetchIpAddress();
        }
        // alert(deviceId)
        const errors = validate()
        setErrors(errors);
        if (Object.values(errors).some(v => v)) {
            return;
        } else {
            // alert(JSON.stringify(loginValues, null, 2))
            console.log('handle submit!!!!')
            const rsp = await loginAPI(loginValues.username, loginValues.password, device_id).then((response)=>{
                if (response.is_server_error===true) {
                    console.log('response.is_server_error true= ',response.is_server_error)
                    if (response.data !== null) {
                        console.log(
                            'response.data !== null'
                        )
                        let maintenanceInfo:TMaintenanceInfo = response.data.maintenanceInfo;
                        maintenanceInfo.start_date = response.data.maintenanceInfo.start_date;
                        maintenanceInfo.end_date = response.data.maintenanceInfo.end_date;
                        let dumyMaintenanceData:TMaintenanceData = {
                            alertTitle: '시스템 점검 안내',
                            data: maintenanceInfo,
                            open: false,
                            type: ''
                        }
                        setMaintenanceData(dumyMaintenanceData)
                        navigate('/')
                    } else {
                        console.log('test1')
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
                        return false;
                    }
                } else {
                    return response
                }
            });
            if (rsp) {
                // alert(response)
                // 231031 최우선 체크 : 탈퇴 회원
                const response = rsp.data;
                if (response.isWithdrawn) {
                    commonAlertOpen({
                        alertType: 'warning',
                        messageFontFamily: 'NotoSansCJKKR',
                        messages: [
                            '탈퇴한 계정의 ID입니다.',
                            '관련 문의 있을 시, 소속 캠퍼스로 연락해주세요.'
                        ],
                        useOneButton: true,
                        yesButtonLabel: 'OK',
                        yesEvent: () => commonAlertClose()
                    })
                } else {
                    // 1 비밀번호 체크 
                    // count 0 -> 아이디 또는 비밀번호를 다시 확인하세요
                    // count 1~4 -> 비밀번호를 잘못 입력하셨습니다. (2/5)
                    // count 5 -> alert -> 비밀번호 변경 페이지 연결
                    // response.isPasswordCorrect
                    if (!response.isPasswordCorrect) {
                        const count = response.failedTries;
                        console.log('count =',count)
                        if (msgCheck.beforeId !== loginValues.username) {
                            // const count = 1
                            if (count > 1 &&count<4) {
                                const msg = `비밀번호를 잘못 입력하셨습니다. (${count}/5)`;
                                setMsgCheck({beforeId:loginValues.username, incorrectedCount:count})
                                setErrors({displayMessage: msg})
                            } else if (count === 1) {
                                setMsgCheck({beforeId:loginValues.username, incorrectedCount:count})
                                setErrors({displayMessage: '아이디 또는 비밀번호를 다시 확인하세요.'})
                            } else if (count===5) {
                                //count 5
                                commonAlertOpen({
                                    alertType: 'warning',
                                    messageFontFamily: 'NotoSansCJKKR',
                                    messages: ['비밀번호 입력 5회 오류로 로그인이 제한되었습니다.','POLY 홈페이지에서 비밀번호를 새로 등록해주세요.'],
                                    useOneButton: true,
                                    yesButtonLabel: 'OK',
                                    yesEvent: goPasswordUpdatePage
                                })
                            }
                        } else {
                            // console.log('count =',msgCheck.incorrectedCount)
                            // if (msgCheck.incorrectedCount>0&&msgCheck.incorrectedCount<4) {
                            if (count> 1 &&count<4) {
                                // console.log('set count =',count)
                                const msg = `비밀번호를 잘못 입력하셨습니다. (${count}/5)`;
                                setMsgCheck({beforeId:loginValues.username, incorrectedCount:count})
                                setErrors({displayMessage: msg})
                            } else if (count === 5) {
                                commonAlertOpen({
                                    alertType: 'warning',
                                    messageFontFamily: 'NotoSansCJKKR',
                                    messages: ['비밀번호 입력 5회 오류로 로그인이 제한되었습니다.','POLY 홈페이지에서 비밀번호를 새로 등록해주세요.'],
                                    useOneButton: true,
                                    yesButtonLabel: 'OK',
                                    yesEvent: goPasswordUpdatePage
                                })
                            } else if (count === 1) {
                                setMsgCheck({beforeId:loginValues.username, incorrectedCount:count})
                                setErrors({displayMessage: '아이디 또는 비밀번호를 다시 확인하세요.'})
                            }
                        }
                        // setLoginValues({...loginValues, ['password']: ''})
                        setLoginValues({username:loginValues.username, password:''})
                        document.getElementById('password')?.focus();
                    } else {
                        // 2 사용대상이 아닌 경우-> Writing Hub 사용 권한이 없는 계정입니다. 
                        // response.hasPermission
                        if (!response.hasPermission) {
                            setMsgCheck({beforeId:loginValues.username, incorrectedCount:0})
                            setErrors({displayMessage: 'Writing Hub 사용 권한이 없는 계정입니다.'})
                        } else {
                            // 3 동일 비밀번호 6개월 경과
                            // response.isNeedPasswordUpdate
                            if (response.isNeedPasswordUpdate) {
                                commonAlertOpen({
                                    alertType: 'warning',
                                    messageFontFamily: 'NotoSansCJKKR',
                                    messages: ['비밀번호 변경 후 6개월이 경과했습니다.','POLY 홈페이지에서 비밀번호를 변경해주세요.'],
                                    useOneButton: true,
                                    yesButtonLabel: 'OK',
                                    yesEvent: ()=>goPasswordChangePage(response.polyToken)
                                })
                            } else {
                                // 4
                                // response.isUserLogged
                                if (response.isUserLogged) {
                                    // confirm
                                    commonAlertOpen({
                                        alertType: 'warning',
                                        messageFontFamily: 'NotoSansCJKKR',
                                        messages: ['동일한 ID로 다른 기기에 로그인 되어 있습니다.','이 기기에서 로그인할까요?'],
                                        yesButtonLabel: 'Yes',
                                        yesEvent: () => {
                                            forceLogin(loginValues, device_id, saveId)
                                            commonAlertClose()
                                        },
                                        closeEvent: () => commonAlertClose(),
                                        noButtonLabel: 'No',
                                        
                                    })
                                } else {
                                    //  5 비밀번호 5회 틀린경우
                                    if (response.isFiveTimesWrong) {
                                        commonAlertOpen({
                                            alertType: 'warning',
                                            messageFontFamily: 'NotoSansCJKKR',
                                            messages: ['비밀번호 입력 5회 오류로 로그인이 제한되었습니다.','POLY 홈페이지에서 비밀번호를 새로 등록해주세요.'],
                                            useOneButton: true,
                                            yesButtonLabel: 'OK',
                                            yesEvent: goPasswordUpdatePage
                                        })
                                    } else {
                                        // 정상 로그인
                                        forceLogin(loginValues, device_id, saveId)
                                    }
                                }
                            } // end password 6month check
                        } // end target check
                    } // end password check
                }// end cancel member check

            }
        }
    }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        let errorDump = JSON.parse(JSON.stringify(errors));
        let check = false;
        if (e.target.name === 'username') {
            errorDump.displayMessage='';
            check=true;
        } else if (e.target.name === 'password') {
            errorDump.displayMessage = ''
            check=true;
        }
        if (check) { setErrors(errorDump) };
        setLoginValues({
            ...loginValues,
            [e.target.name]: e.target.value
        })
    }

    // Webview Connect code
    const sendMessage = (data:any) => {
        console.log('Send message data =',data)
        const messageData = JSON.stringify(data);
        window.ReactNativeWebView.postMessage(messageData);
    };
    const receiveMessage = async (event:any) => {
        console.log('Receive message data =',event.data);
        if(typeof event.data !== 'string')
            return

        const data = JSON.parse(event.data)
        if (loginValues.username===''&&loginValues.password==='') {
            const rnData = JSON.parse(JSON.stringify(data));
            // auto login
            const autoLoginValue = rnData['loginValues']
            if (autoLoginValue) {
                setLoginValues(autoLoginValue);
            }
            const deviceIdCheck = rnData['deviceId']
            if (deviceIdCheck && deviceIdCheck!=='') {
                setDeviceId(deviceIdCheck)
            }
            if(rnData['saveId']) {
                setSaveId(rnData['saveId'])
            }
            if(rnData['userInfo']) {
                setUserInfo(rnData['userInfo'])
            }
            if(rnData['version']) {
                setVersion(rnData['version'])
            }
            if (rnData['deviceSize'] && rnData['windowSize']) {
                setSize(rnData['deviceSize'], rnData['windowSize'])
            }
            if (rnData['platform']) {
                setPlatform(rnData['platform'])
            }

            // we use rnData, because react state is updated in the next render cycle
            await forceLoginRN(rnData['loginValues'], rnData['deviceId'], rnData['saveId'])
        }
    };

    // electron js
    const receiveElectronData = async (data: any) => {
        const autoLoginValue = data['loginValues']
        if(autoLoginValue) {
            setLoginValues(autoLoginValue)
        }
        const deviceIdCheck = data['deviceId']
        if (deviceIdCheck && deviceIdCheck!=='') {
            setDeviceId(deviceIdCheck)
        }
        if(data['saveId']) {
            setSaveId(data['saveId'])
        }
        if(data['userInfo']) {
            setUserInfo(data['userInfo'])
        }
        if(data['version']) {
            setVersion(data['version'])
        }
        await forceLoginRN(data['loginValues'], data['deviceId'], data['saveId'])
    }

    // is not mobile id
    const fetchIpAddress = async () => {
        const response = await fetch('https://api64.ipify.org?format=json').then((res) => {return res}).catch((rej) => {return ''});
        if (typeof(response)!=='string') {
            const data = await response.json();
            setDeviceId(data.ip);
            // alert(data.ip)
        } else {
            setDeviceId('');
        }
    }

    React.useEffect(()=>{
        const sendData = "AutoLogin"
        // alert(window.navigator.userAgent)
        const browser = detect()
        // alert(JSON.stringify(browser))
        if (browser?.name === 'chromium-webview') {
            // mobile
            // alert('mobile')
            // setCheckDevice('Android')
            setMobile(true)
            window.addEventListener('message', receiveMessage, true);
            sendMessage(sendData)
        } else if (browser?.name==='ios-webview') {
            // setCheckDevice('iOS')
            setMobile(true)
            window.addEventListener('message', receiveMessage, true);
            sendMessage(sendData)
        } else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
            // setCheckDevice('Electron')
            const electronData = (window as any).api.toElectron.sendSync('autologin')
            console.log('electron data:', electronData)
            receiveElectronData(electronData)
        } else {
            fetchIpAddress();
        }

        return () => {
            console.log('=== LOGIN:: did unmount ::===')
            setSelectMenu('WritingClinic')
            if (isMobile) {
                document.removeEventListener('message', receiveMessage, true);
                window.removeEventListener('message', receiveMessage, true)
            }
        }
    },[])

    React.useEffect(()=>{
        const checkName = loginValues.username.replace(/\s{1,}/gmi,'')==='';
        const checkPW = loginValues.password.replace(/\s{1,}/gmi,'')==='';
        if (checkName || checkPW) {
            setIsLoginBtn(false);
        } else {
            setIsLoginBtn(true);
        }
    }, [loginValues])

    React.useEffect(()=> {
        const currentTime = new Date();
        const targetTime = new Date(Date.UTC(2024, 7, 27, 15, 0, 0)); // Target time: 00:00 August 29, 2024
        console.log(currentTime, targetTime)

        if (currentTime < targetTime || window.navigator.userAgent.toLowerCase().indexOf('electron') === -1) {
            setShowUpdateScreen(false);
        }
    }, [])

    // React.useEffect(()=>{
    //     const isMaintenanceCheck = IS_MAINTENANCE;
    //     // console.log('isMain =',isMaintenanceCheck)
    //     // if (isMaintenanceCheck==='YES') {
    //     //     setIsUnderMaintenance(true);
    //     //     commonAlertOpen({
    //     //         useOneButton:true,
    //     //         alertType: 'warningContinue',
    //     //         yesButtonLabel: 'OK',
    //     //         messages: [
    //     //             "서비스 안정화를 위한 점검중이에요."
    //     //         ],
    //     //         yesEvent: () => {
    //     //             commonAlertClose();
                    
    //     //         }
    //     //     })
    //     // } else {
    //         setIsUnderMaintenance(false)
    //         // in ENV should update 
    //         // REACT_APP_ANDROID_VERSION=1.0.5
    //         // REACT_APP_IOS_VERSION=1.0.3
    //         // REACT_APP_ELECTRON_VERSION=1.0.0
    //         if (checkDevice === 'Android') {
    //             if (version !== ANDROID_VERSION) {
    //                 setIsShouldChangeVersion(true);
    //             } else {
    //                 setIsShouldChangeVersion(false);
    //             }
    //         } else if (checkDevice === 'iOS') {
    //             if (version !== IOS_VERSION) {
    //                 setIsShouldChangeVersion(true);
    //             } else {
    //                 setIsShouldChangeVersion(false);
    //             }
    //         } else if (checkDevice === 'Electron') {
    //             if (version !== ELECTRON_VERSION) {
    //                 setIsShouldChangeVersion(true);
    //             } else {
    //                 setIsShouldChangeVersion(false);
    //             }
    //         } else {
    //             // version check 무시
    //             console.log('version =',version)
    //             if (version !== '') {
    //                 setIsShouldChangeVersion(true);
    //             } else {
    //                 setIsShouldChangeVersion(false);
    //             }
    //         }
    //     // }
    // }, [version])

    // React.useEffect(()=>{
        // if (isShouldChangeVersion) {
        //     commonAlertOpen({
        //         useOneButton:true,
        //         alertType: 'warningContinue',
        //         yesButtonLabel: 'OK',
        //         messages: [
        //             "새로운 버전으로 업데이트를 진행해주세요."
        //         ],
        //         yesEvent: () => {
        //             commonAlertClose();
        //         }
        //     })
        // } else {
        // }
    // }, [isShouldChangeVersion])
            

    return (
        <section className='flex w-full h-full bg-no-repeat bg-right bg-cover justify-center items-center bg-login-img relative'>
            {showUpdateScreen && !isMobile && <UpdateLoadingScreen 
                onCloseButtonClicked={() => {
                    setShowUpdateScreen(false)
                }}
            />}
            {/* close button */}
            <div className={`${isMobile && 'hidden'} absolute right-[24px] top-[24px] w-[65px] h-[65px] bg-app-close-button-svg bg-no-repeat bg-contain hover:cursor-pointer`} 
                onClick={()=>{
                    if (showUpdateScreen && !isMobile) {
                        setShowUpdateScreen(false)
                    } else {
                        // exit application event is here.
                        if(isMobile)
                            window.ReactNativeWebView.postMessage(JSON.stringify('quit'))
                        else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
                            (window as any).api.toElectron.send('quit')
                        }
                    }
                }}
            />
            {/* content */}
            {(!showUpdateScreen || isMobile) && (
                <div className="block w-[450px] h-[588px] bg-white rounded-[30px] shadow-[0_34px_140px_0_rgba(30,13,44,0.3)]">
                    {/* <form onSubmit={isShouldChangeVersion ? confirmUpdateNewVersion : handleSubmit}> */}
                    <form onSubmit={handleSubmit}>
                        <div className='flex flex-1 flex-col ml-[75px]'>
                            {/* Logo - writing hub logo오면 tailwind config에 등록 후 사용할 것. */}
                            <div className='mt-[58px] ml-[96px] w-[115.7px] h-[118.9px] bg-writing-hub-logo bg-no-repeat bg-center bg-contain select-none'></div>
                            
                            <div className='flex flex-row mt-[30px]'>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none select-none">
                                        <svgIcons.Icons.IdIcon className='w-4 h-4'/>
                                    </div>
                                    <input type="text"
                                        id='username'
                                        name="username"
                                        className="bg-[#f4f4f4] border-none border-gray-300 text-gray-900 text-sm rounded-[15px] block w-[300px] h-[45px] pl-10 p-2.5 placeholder:text-[#D6D6D6] placeholder:select-none" 
                                        placeholder="User Name"
                                        value={loginValues.username}
                                        onChange={(evt)=>{handleChange(evt)}}/>
                                </div>
                            </div>
                            <div className='flex flex-row mt-[15px]'>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                        <svgIcons.Icons.PwIcon className='w-4 h-4' />
                                    </div>
                                    <input type={passwordType ? 'text':'password'}
                                        id='password'
                                        name="password"
                                        autoComplete='on'
                                        className="bg-[#f4f4f4] border-none border-gray-300 text-gray-900 text-sm rounded-[15px] block w-[300px] h-[45px] pl-10 p-2.5 placeholder:text-[#D6D6D6] placeholder:select-none" 
                                        placeholder="Password"
                                        value={loginValues.password}
                                        onChange={(evt) => {handleChange(evt)}}/>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3.5"
                                        onClick={()=>setPasswordType(!passwordType)}
                                    >
                                        {passwordType 
                                        ? <svgIcons.Icons.EyeOnIcon className='w-4 h-4'/>
                                        : <svgIcons.Icons.EyeOffIcon className='w-4 h-4' />
                                        }
                                    </div>
                                    
                                </div>
                            </div>
                            <div className='flex flex-row mt-[5.3px] h-fit items-center select-none'>
                                    <input id="login-save-id-checkbox" type='checkbox' 
                                        className='flex rounded-[5px] w-[20px] h-[20px] text-[#42278F] border-[#dddddd] focus:ring-transparent focus:ring-0 checked:bg-[#42278F]'
                                        onChange={(value)=>{
                                            setSaveId(!saveId)
                                        }}
                                        checked={saveId}
                                    />
                                    <label htmlFor="login-save-id-checkbox" className='ml-[8px] font-normal text-[14px] select-none hover:cursor-pointer'>{'아이디 저장'}</label>
                            </div>
                            <div className='flex flex-row mt-[12.7px] font-[12px] h-[24px] text-[#ff3841]'>
                                <span>{errors.displayMessage}</span>
                            </div>
                            <div className='flex flex-row mt-[8.5px]'>
                                <button className={isLoginBtn ? 'bg-[#42278F] w-[300px] h-[45px] rounded-[15px] shadow-[0px_4px_0px_#aaafcd]'
                                : 'bg-[#42278F] w-[300px] h-[45px] rounded-[15px] shadow-[0px_4px_0px_#aaafcd] hover:cursor-no-drop'}
                                disabled={!isLoginBtn}
                                    type='submit'
                                >
                                    <span className='uppercase text-[#ffffff] font-notoSansCJKKR select-none'>login</span>
                                </button>
                            </div>
                            {/* <div className='flex flex-row'>
                                <span>{errors.id}</span>
                                <span>{errors.password}</span>
                            </div> */}
                            <div className='flex flex-row text-[12px] mt-[20px] justify-center w-[300px]'>
                                <div className='select-none hover:cursor-pointer' onClick={()=>{ window.open(CONFIG.LOGIN.LINK.POLY.JOIN) }}>{'회원가입'}</div>
                                <div className='flex mx-[11.5px] items-center select-none'>
                                    <span className='flex border-r-[1px] border-[#bbbbbb] h-[8px]'/>
                                </div>
                                <div className='select-none hover:cursor-pointer' onClick={()=>{ window.open(CONFIG.LOGIN.LINK.POLY.FIND_ID)}}>{'아이디 찾기'}</div>
                                <div className='flex mx-[11.5px] items-center select-none'>
                                    <span className='flex border-r-[1px] border-[#bbbbbb] h-[8px]'/>
                                </div>
                                <div className='select-none hover:cursor-pointer' onClick={()=>{ window.open(CONFIG.LOGIN.LINK.POLY.FIND_PW)}}>{'비밀번호 찾기'}</div>
                            </div>
                            

                        </div>
                        <div className='flex flex-col w-full justify-center items-center'>
                        <div className='flex flex-row mt-[35px] justify-center w-[308px] text-[#777777] text-[12px] font-normal font-notoSansCJKKR select-none' 
                                style={{

                            }}>
                                <div onClick={()=>{ window.open(CONFIG.LOGIN.LINK.POLY.SERVICE)}}>이용약관</div>
                                <div className='flex mx-[11.5px] items-center select-none'>
                                    <span className='flex border-r-[1px] border-[#bbbbbb] h-[8px]'/>
                                </div>
                                <div onClick={()=>{ window.open(CONFIG.LOGIN.LINK.POLY.PRIVACY)}}>개인정보취급방침</div>
                            </div>
                            <div className='flex flex-col mt-[15px] text-[11px] w-fit text-[#444444] font-notoSansCJKKR select-none' 
                                style={{

                            }}>
                                <div className='flex flex-row w-fit text-[#444444] font-notoSansCJKKR break-normal' style={{
                                    fontSize: '11px',
                                    fontWeight: 'normal',
                                    fontStretch: 'normal',
                                    fontStyle: 'normal',
                                    lineHeight: 'normal',
                                    letterSpacing: 'normal',
                                    textAlign: 'center'
                                }}>{'COPY RIGHT© 2023 Poly Inspiration. ALL RIGHTS RESERVED.'}</div>
                                {(isMobile || window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) && <p>{`Version ${version}`}</p>}
                                { (!isMobile && window.navigator.userAgent.toLowerCase().indexOf('electron') <= -1) && <p>{'Version 0.1.1'}</p>}
                            </div>
                        </div>
                    </form>
                </div>

            )}
        </section>
    )
    
}
