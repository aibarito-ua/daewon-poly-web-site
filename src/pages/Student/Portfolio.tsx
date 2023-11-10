import React from 'react';
import SmallHead from '../../components/commonComponents/SmallHeadComponent/SmallHead';
import { commonIconSvgs } from '../../util/svgs/commonIconsSvg';
import useLoginStore from '../../store/useLoginStore';
import useControlAlertStore from '../../store/useControlAlertStore';
import { getPortfoliosAPI } from './api/EssayWriting.api';
import usePortfolioStore from '../../store/usePortfolioStore';
import { useComponentWillMount } from '../../hooks/useEffectOnce';
import PortfolioContents from '../../components/pageComponents/portfolio/PortfolioContents';
import PortfolioModalComponent from '../../components/toggleModalComponents/PortfolioModalComponent';
import PortfolioSelectButton from '../../components/pageComponents/portfolio/PortfolioSelectButton';
import useSparkWritingStore from '../../store/useSparkWritingStore';
import { logoutAPI } from './api/Login.api';

export const Portfolio = () => {

    const {userInfo, device_id, isMobile} = useLoginStore();
    const {
        setCommonStandbyScreen, commonAlertOpen
    } = useControlAlertStore();
    const {
        // states
        selectSemester, setSelectSemester,
        selectLevel, setSelectLevel,

        portfolioSelectBoxValue,
        portfolioSelectFinder,

        // apis
        portfolioApiData,
        setPortfolioApiData,
        displayPortfolioData,

        // force readonly
        forceReadOnlyPortfolioSelectBox,
        setForceReadOnlyPortfolioSelectBox,
    } = usePortfolioStore();
    const {
        sparkWritingBookName
    } = useSparkWritingStore();

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
        const student_code = userInfo.userCode;
        setCommonStandbyScreen({openFlag:true});
        await getPortfoliosAPI(student_code, userInfo.courseName, userInfo.accessToken).then((res) => {
            if (!res.isDuplicateLogin) {
                let response = res.result;
                if (response) {
                    for (let i = 0; i < response.periods.length;i++) {
                        response.periods[i].levels = [
                            ...response.periods[i].levels.filter(d => d.level_name === userInfo.courseName),
                            ...response.periods[i].levels.filter(d => d.level_name !== userInfo.courseName)
                        ]
                    }
                    setPortfolioApiData(response, userInfo);
                    setCommonStandbyScreen({openFlag:false});
                }
            } else {
                setCommonStandbyScreen({openFlag:false})
                commonAlertOpen({
                    messages: ['중복 로그인으로 자동 로그아웃 처리 되었습니다.'],
                    messageFontFamily:'NotoSansCJKKR',
                    useOneButton: true,
                    yesButtonLabel:'OK',
                    yesEvent: async() => {
                        await logoutFn()
                    }
                })
                return false;
            }
        });
    }
    useComponentWillMount(async()=>{
        await beforeRenderedFn();
    })
    
    return (
        <section className="section-common-layout use-nav-aside min-w-[1060px]" >
            <SmallHead mainTitle='Portfolio'/>
            <div className='flex flex-1 flex-col w-full h-fit px-[25px] pb-[25px]'>
            
                {/* page titles */}
                <div className='flex flex-row font-bold w-full justify-start pt-[30px] text-black h-[90px] pb-[15px]'>
                    <div className='writing-activity-page-title-div'>
                        <div className='writing-activity-page-title-icon'>
                            <commonIconSvgs.SparkWritingTitleBookIcon/>
                        </div>
                        <span className='writing-activity-page-title-text' >{displayPortfolioData.book_name==='' ? sparkWritingBookName : displayPortfolioData.book_name}</span>
                    </div>
                    <div className='flex flex-1 h-[45px] items-center justify-end'>
                        <PortfolioSelectButton 
                             isUse='semester'
                        />
                        <PortfolioSelectButton
                             isUse='level'
                        />
                    </div>
                </div>
                {/* Contents */}
                <PortfolioContents />
            </div>
        </section>
    )
}