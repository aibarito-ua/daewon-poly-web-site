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


export const Portfolio = () => {

    const {userInfo} = useLoginStore();
    const {
        setCommonStandbyScreen,
    } = useControlAlertStore();
    const {
        // states
        semesters, setSemesters,
        levels, setLevels,
        selectSemester, setSelectSemester,
        selectLevel, setSelectLevel,

        // apis
        portfolioApiData,
        setPortfolioApiData,
        displayPortfolioData,
    } = usePortfolioStore();

    const beforeRenderedFn = async () => {
        const student_code = userInfo.userCode;
        setCommonStandbyScreen({openFlag:true});
        await getPortfoliosAPI(student_code).then((response) => {
            if (response) {
                setPortfolioApiData(response, userInfo);
                setCommonStandbyScreen({openFlag:false});
            }
        });
    }
    useComponentWillMount(async()=>{
        await beforeRenderedFn();
    })
    
    return (
        <section className="section-common-layout use-nav-aside min-w-[1060px]" >
            <SmallHead mainTitle='Portfolio'/>
            <div className='flex flex-1 flex-col w-full h-full px-[25px] pb-[25px]'>
            
                {/* page titles */}
                <div className='flex flex-row font-bold w-full justify-start pt-[30px] text-black h-[90px] pb-[15px]'>
                    <div className='writing-activity-page-title-div'>
                        <div className='writing-activity-page-title-icon'>
                            <commonIconSvgs.SparkWritingTitleBookIcon/>
                        </div>
                        <span className='writing-activity-page-title-text' >{displayPortfolioData.book_name}</span>
                    </div>
                    <div className='flex flex-1 h-[45px] items-center justify-end'>
                        <PortfolioSelectButton 
                            disabled={false} isUse='semester'
                        />
                        <PortfolioSelectButton
                            disabled={true} isUse='level'
                        />
                    </div>
                </div>
                {/* Contents */}
                <PortfolioContents />
            </div>
        </section>
    )
}