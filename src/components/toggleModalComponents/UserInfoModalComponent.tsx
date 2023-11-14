import * as React from 'react';

import { 
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    styled 
} from '@mui/material';

import useLoginStore from '../../store/useLoginStore';
import CustomizedCheckbox from '../commonComponents/checkbox/CustomizedCheckbox';
import { logoutAPI, memberWithDraw } from '../../pages/Student/api/Login.api';
import useControlAlertStore from '../../store/useControlAlertStore';

export default function UserInfoModalComponent() {
    const {
        userInfo,
        infoModalOpen,
        pageName,
        agree,
        checkPW,
        setCheckPW,
        setAgree,
        setPageName,
        setInfoModal,
        device_id, isMobile
    } = useLoginStore();
    const {
        setCommonStandbyScreen, commonAlertOpen, commonAlertClose,
    } = useControlAlertStore();
    const [checkAgree, setCheckAgree] = React.useState<boolean>(false);
    const inputElementRef = React.useRef<HTMLInputElement>(null);
    // const [agree, setAgree] = React.useState<boolean[]>([false, false]);
    

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
        if (infoModalOpen.isOpen) {

        } else {
            setCheckPW('');
            setPageName('MyInfo')
            setAgree([false,false])
        }
    }, [infoModalOpen])
    React.useEffect(()=>{
        console.log('agree =',agree)
    }, [agree])

    const closeModal = () => {
        setInfoModal({isOpen:false})
    }
    const openModal = () => {
        setInfoModal({isOpen:true})
    }
    const onClickCheckBox = (flag:boolean, index: number) => {
        let originData = agree;
        originData[index] = flag;
        setAgree(originData);
    }
   
  return (
    <div className='flex'>
      <Dialog
        open={infoModalOpen.isOpen}
        onClose={closeModal}
        fullWidth={true}
        sx={{
            '.MuiPaper-root': {
                width: 'fit-content',
                height: 'fit-content',
                minWidth: 'fit-content',
                minHeight: 'fit-content'
            },
            '.MuiDialog-paper':{
                display: 'flex',
                position: 'relative',
                padding: '0 32.5px 0 32.5px',
                backgroundColor: 'rgba(0,0,0,0.0)',
                boxShadow: 'none',
                margin: 0,
            }
        }}
      >
        <DialogTitle sx={{
            minWidth: '640px',
            width: '100%',
            height: '95px',
            padding: '25px 0 0 0'
        }}>

            <div className='flex flex-row w-full h-[70px] justify-center items-center rounded-t-[20px] bg-[#7861bb]'>
                {pageName==='CancelAccount' && 
                    <button style={{
                        zIndex: 1301
                    }}><div className='w-[32px] h-[32px] bg-user-info-modal-back-btn bg-no-repeat bg-contain absolute top-[45px] left-[54px]'
                        onClick={()=>{setPageName('MyInfo')}}
                    /></button>
                }
                <div className='user-info-modal-title'>{pageName==='MyInfo' ? 'My Info.': '회원 탈퇴'}</div>
                <button 
                    style={{
                        width: '65px',
                        height: '65px',
                        padding: 0,
                        position: 'absolute',
                        right:'0px',
                        top: '0px',
                        zIndex: 1301
                    }}
                >
                    <div className='w-[65px] h-[65px] m-0 p-0 bg-modal-close-button-svg bg-contain bg-no-repeat'
                    onClick={closeModal}/>
                </button>
            </div>
        </DialogTitle>
        <DialogContent
        className='flex flex-col'
        sx={{
            
            backgroundColor: 'white',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            width: '640px',
            padding: pageName==='MyInfo' ? '34px': '26px',
            height: pageName==='MyInfo' ? '353px' : '470px'
        }}>
            {pageName==='MyInfo' && 
                <div className='flex flex-col w-full h-full pt-[34px]'>
                    <div className='flex flex-row'>
                        <div className='flex flex-1 user-info-modal-info-label'>{'Name'}</div>
                        <div className='flex flex-1 justify-end'>
                            <span className='user-info-modal-info-value-kr'>{userInfo.memberNameKr}</span>
                            <span className='user-info-modal-info-value'>{`(${userInfo.memberNameEn})`}</span>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='flex flex-1 user-info-modal-info-label'>{'Student ID'}</div>
                        <div className='flex flex-1 justify-end user-info-modal-info-value'>{`${userInfo.userCode}`}</div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='flex flex-1 user-info-modal-info-label'>{'Campus Name'}</div>
                        <div className='flex flex-1 justify-end user-info-modal-info-value-kr'>{`${userInfo.campusName}`}</div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='flex flex-1 user-info-modal-info-label'>{'Poly Level'}</div>
                        <div className='flex flex-1 justify-end user-info-modal-info-value'>{`${userInfo.courseName}`}</div>
                    </div>
                    <div className='flex flex-row mt-[35px] justify-center'>
                        <div className='user-info-modal-info-button bg-[#42278f]'
                            onClick={()=>{
                                setPageName('CancelAccount')
                            }}
                        >{'Cancel my account'}</div>
                    </div>

                </div>
            }
            {pageName==='CancelAccount' && 
                <div className='flex flex-col w-full h-full pt-[36px]'>
                    <div className='flex flex-row user-info-modal-info-cancel-value-title'>
                        {'회원 탈퇴를 신청하기 전에 아래 안내 사항을 꼭 확인해주세요.'}
                    </div>
                    <div className='user-info-modal-info-cancel-value-agree-text mt-[20px]'>
                        <span>{'1. 사용하고 계신 아이디는 탈퇴할 경우 재사용 및 복구가 불가능합니다.'}</span>
                        <span>{'2. 탈퇴한 아이디는 본인과 타인 모두 재사용 및 복구가 불가하오니 신중하게 선택하시기 바랍니다.'}</span>
                    </div>
                    <div className='flex flex-row w-full justify-end mt-[6px]'>
                        <CustomizedCheckbox value={agree[0]} setValue={onClickCheckBox} index={0}/>
                    </div>
                    <div className='user-info-modal-info-cancel-value-agree-text mt-[9px]'>
                        <span>{'1. 탈퇴 후 회원정보 및 이용기록은 모두 삭제됩니다.'}</span>
                        <span>{'2. 회원정보 및 서비스 이용기록은 모두 삭제되며, 삭제된 데이터는 복구되지 않습니다.'}</span>
                    </div>
                    <div className='flex flex-row w-full justify-end mt-[6px]'>
                        <CustomizedCheckbox value={agree[1]} setValue={onClickCheckBox} index={1}/>
                    </div>
                    <div className='flex flex-row user-info-modal-info-cancel-value-title mt-[9px]'>
                        {'본인 확인을 위해 현재 사용 중이신 비밀번호를 입력해주세요.'}
                    </div>
                    <div className='flex flex-row mt-[12px]'>
                        <input type='password'
                            id='with-draw-password'
                            ref={inputElementRef}
                            placeholder=''
                            value={checkPW}
                            onChange={(evt => {setCheckPW(evt.currentTarget.value)})}
                            className="bg-[#c8c8c8] border-none border-gray-300 text-[#222] focus:ring-0 rounded-[10px] block w-full h-[40px]"
                        />
                    </div>
                    <div className='flex flex-row mt-[19px] justify-center'>
                        <div className={
                            (agree[0] && agree[1] && checkPW!=='') 
                            ? 'user-info-modal-info-button bg-[#42278f]'
                            : 'user-info-modal-info-button bg-[#cebff4]'
                        }
                            onClick={async()=>{
                                commonAlertOpen({
                                    messageFontFamily: 'NotoSansCJKKR',
                                    alertType: 'warningContinue',
                                    messages: ['회원 탈퇴를 하시겠습니까?'],
                                    yesButtonLabel: 'No',
                                    noButtonLabel: 'Yes',
                                    yesEvent: () => {
                                        // 'No'
                                        commonAlertClose();
                                    },
                                    closeEvent: async () => {
                                        setCommonStandbyScreen({openFlag:true})
                                        const rsp = await memberWithDraw(userInfo.webId, checkPW, userInfo.userCode).then((response) => {
                                            if (response.is_server_error) {
                                                setCommonStandbyScreen({openFlag:false})
                                                if (response.isDuplicateLogin) {
                                                    commonAlertOpen({
                                                        messages: ['중복 로그인으로 자동 로그아웃 처리 되었습니다.'],
                                                        priorityLevel: 2,
                                                        messageFontFamily:'NotoSansCJKKR',
                                                        useOneButton: true,
                                                        yesButtonLabel:'OK',
                                                        yesEvent: async() => {
                                                            await logoutFn()
                                                        }
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
                                                return false;
                                            } else {
                                                return response;
                                                
                                            }
                                        });
                                        console.log('rsp ===',rsp)
                                        if (rsp) {
                                            setCommonStandbyScreen({openFlag:false})
                                            if (rsp.is_server_error) {
                                                console.log('is not SERVER Connection !!')
                                            } else {
                                                if (rsp.is_withdrawed_successfully) {
                                                    window.location.reload();
                                                } else {
                                                    commonAlertOpen({
                                                        messageFontFamily: 'NotoSansCJKKR',
                                                        alertType: 'warning',
                                                        useOneButton: true,
                                                        yesButtonLabel: 'OK',
                                                        messages: ['비밀번호를 확인해 주세요.'],
                                                        yesEvent: () => {
                                                            commonAlertClose()
                                                            setCheckPW('');
                                                        }
                                                    })
                                                }
                                            }
                                        } else {
        
                                        }
                                    }
                                })
                            }}
                        >{'회원 탈퇴'}</div>
                    </div>
                </div>
            }
           
            
        </DialogContent>
        </Dialog>
        
    </div>
  );
}

