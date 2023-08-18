import React from 'react';
import useLoginStore from '../../store/useLoginStore';
import useNavStore from '../../store/useNavStore';
import useControlAlertStore from '../../store/useControlAlertStore';
import useSparkWritingStore from '../../store/useSparkWritingStore';
import useProgressPageStore from '../../store/useProgressPageStore';
import { callUnitInfobyStudent } from './api/EssayWriting.api';
import { useComponentWillMount } from '../../hooks/useEffectOnce';
import SmallHead from '../../components/commonComponents/SmallHeadComponent/SmallHead';
import { commonIconSvgs } from '../../util/svgs/commonIconsSvg';
import ReportSelectButton from '../../components/pageComponents/report/ReportSelectButton';

const Report = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const {role, userInfo} = useLoginStore();
    const {secondGenerationOpen} = useNavStore();
    const {
        unitReportModal, setUnitReportModal,
        setUnitRubricScoresData,
    } = useControlAlertStore();
    const {
        setSparkWritingDataFromAPI, 
        sparkWritingBookName,
        sparkWritingData
    } = useSparkWritingStore();
    const {
        progressTabActiveIndex,
    } = useProgressPageStore();

    const beforeRenderedFn = async () => {
        await callUnitInfobyStudent(userInfo.userCode, userInfo.courseName).then((response) => {
            
            if (response.book_name!=='') {
                setLoading(true)
            }
            setSparkWritingDataFromAPI(response.units)
            
            return response;
        });
    }
    useComponentWillMount(async()=>{
        await beforeRenderedFn();
    })
    console.log('test ==',userInfo)
    return (
        <section className="section-common-layout use-nav-aside" >
            <SmallHead mainTitle='Report'/>
            <div className='flex flex-1 flex-col w-full h-full px-[25px] pb-[25px]'>
            
                {/* page titles */}
                <div className='flex flex-row font-bold w-full justify-start pt-[30px] text-black h-[90px] pb-[15px]'>
                    <div className='writing-activity-page-title-div'>
                        <div className='writing-activity-page-title-icon'>
                            <commonIconSvgs.SparkWritingTitleBookIcon/>
                        </div>
                        <span className='writing-activity-page-title-text' >{sparkWritingBookName}</span>
                    </div>
                    <div className='flex flex-1 h-[45px] items-center justify-end'>
                        <ReportSelectButton data={[]} disabledFlag={false} useDefaultEmptyValueFlag={false}/>
                        <ReportSelectButton data={[userInfo.courseName]} disabledFlag={true} useDefaultEmptyValueFlag={true}/>
                    </div>
                </div>
                
                {/* progress view box */}
                
            </div>
        </section>
    )
}

export default Report;