import React from 'react';
import { useNavigate } from "react-router-dom";
import useLoginStore from "../../store/useLoginStore";
import {Button} from 'flowbite-react'
import { CommonFunctions } from "../../util/common/commonFunctions";
import useNavStore from '../../store/useNavStore';
import { commonIconSvgs } from '../../util/svgs/commonIconsSvg';
import SmallHead from '../../components/commonComponents/SmallHeadComponent/SmallHead';
import { callUnitInfobyStudent } from './api/EssayWriting.api';
import useSparkWritingStore from '../../store/useSparkWritingStore';
import { useComponentWillMount } from '../../hooks/useEffectOnce';
import useControlAlertStore from '../../store/useControlAlertStore';
import { logoutAPI } from './api/Login.api';

const SelectWritingClinic = () => {
    const [buttonActive, setButtonActive] = React.useState<boolean>(false);
    const {role, userInfo, device_id, isMobile} = useLoginStore();
    const {secondGenerationOpen} = useNavStore();
    const {
        setCommonStandbyScreen, commonAlertOpen, commonAlertClose
    } = useControlAlertStore();
    const {
        setSparkWritingDataFromAPI,
        setLastUnitIndex, lastUnitIndex,
        sparkWritingBookName
    } = useSparkWritingStore()
    const navigate = useNavigate();
    const logoutFn =async () => {
        logoutAPI(userInfo.userCode, device_id)
        if(isMobile)
            window.ReactNativeWebView.postMessage(JSON.stringify('logout'))
        else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
            (window as any).api.toElectron.send('clear')
        }
        window.location.reload()
    }
    const beforeRenderedFn = async () => {
        setCommonStandbyScreen({openFlag:true})
        const response = await callUnitInfobyStudent(userInfo.userCode, userInfo.courseName, userInfo.accessToken).then((response) => {
            console.log('writing clinic response =',response)
            return response;
        });
        if (response.is_server_error) {
            setCommonStandbyScreen({openFlag:false})
            commonAlertOpen({
                messages: [
                    'Cannot connect to the server.',
                    'Please try again later.'
                ],
                useOneButton: true,
                yesButtonLabel:'OK',
                yesEvent: () => {
                    commonAlertClose();
                }
            })
        } else if (response.isDuplicateLogin) {
            setCommonStandbyScreen({openFlag:false})
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
            // alert(JSON.stringify(response))
            if (response) {
                setButtonActive(true)
            }
            setSparkWritingDataFromAPI(response.units, response.book_name)
            if (lastUnitIndex===0) {
                setLastUnitIndex(1);
            }
            setCommonStandbyScreen({openFlag:false})

        }
        
    }
    useComponentWillMount(()=>{
        beforeRenderedFn();
    })
    
    return (
        <section className="section-common-layout use-nav-aside" >
            <SmallHead mainTitle='Writing Activity'/>
            <div className='flex flex-1 flex-col justify-center w-full h-2/3 pt-[141px] px-[4vw]'>
                <div className="flex flex-1 pr-[2rem] gap-[5%] w-full justify-center">
                    <div className={buttonActive? 'select-writing-item-button bg-spark-writing-enter-img bg-no-repeat bg-cover w-[322px] h-[358px]': 'hidden'} onClick={()=>{
                        if (buttonActive) {
                            CommonFunctions.goLink( 'WritingClinic/SparkWriting', navigate, role)}
                        }
                    }
                    ></div>
                    <Button className={`select-writing-item-button ${secondGenerationOpen? '':'hidden'}`}><span className="text-xl">{'Free Writing'}</span></Button>
                </div>
            </div>
        </section>
    )
}
export default SelectWritingClinic;