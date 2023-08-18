import React from 'react';
import SmallHead from '../../components/commonComponents/SmallHeadComponent/SmallHead';
import { callUnitInfobyStudent } from './api/EssayWriting.api';
import useLoginStore from '../../store/useLoginStore';
import useNavStore from '../../store/useNavStore';
import { useComponentWillMount } from '../../hooks/useEffectOnce';
import useSparkWritingStore from '../../store/useSparkWritingStore';
import useProgressPageStore from '../../store/useProgressPageStore';
import { commonIconSvgs } from '../../util/svgs/commonIconsSvg';
import UnitReportModalComponent from '../../components/toggleModalComponents/UnitReportModalComponent';
import useControlAlertStore from '../../store/useControlAlertStore';
import { progressIcons } from '../../util/svgs/commonProgressIcons';
import ProgressTable from '../../components/pageComponents/progress/ProgressTables';
import SelectLabels from '../../components/pageComponents/progress/ProgressSelectButton';
const dumyUnitRubricData:TUnitRubricScore[]=[
    {
        unit_index:1,
        rubric_scores: [
            {
                name: 'ideas',
                score: 4
            }, {
                name: 'organization',
                score: 4
            }, {
                name: 'voice',
                score: 6
            }, {
                name: 'word choice',
                score: 8
            }, {
                name: 'sentence fluency',
                score: 10
            }, {
                name: 'conventions',
                score: 6
            }
            
        ]
    }, {
        unit_index:2,
        rubric_scores: [
            {
                name: 'ideas',
                score: 4
            }, {
                name: 'organization',
                score: 6
            }, {
                name: 'voice',
                score: 8
            }, {
                name: 'word choice',
                score: 10
            }, {
                name: 'sentence fluency',
                score: 8
            }, {
                name: 'conventions',
                score: 6
            }
            
        ]
    }, {
        unit_index:3,
        rubric_scores: [
            {
                name: 'ideas',
                score: 6
            }, {
                name: 'organization',
                score: 8
            }, {
                name: 'voice',
                score: 10
            }, {
                name: 'word choice',
                score: 8
            }, {
                name: 'sentence fluency',
                score: 6
            }, {
                name: 'conventions',
                score: 4
            }
            
        ]
    }, {
        unit_index:4,
        rubric_scores: [
            {
                name: 'ideas',
                score: 8
            }, {
                name: 'organization',
                score: 10
            }, {
                name: 'voice',
                score: 10
            }, {
                name: 'word choice',
                score: 10
            }, {
                name: 'sentence fluency',
                score: 8
            }, {
                name: 'conventions',
                score: 8
            }
            
        ]
    }, {
        unit_index:5,
        rubric_scores: [
            {
                name: 'ideas',
                score: 2
            }, {
                name: 'organization',
                score: 2
            }, {
                name: 'voice',
                score: 2
            }, {
                name: 'word choice',
                score: 8
            }, {
                name: 'sentence fluency',
                score: 6
            }, {
                name: 'conventions',
                score: 10
            }
            
        ]
    }
]
const Progress = () => {
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
    return (
        <section className="section-common-layout use-nav-aside" >
            <SmallHead mainTitle='Progress'/>
            <div className='flex flex-1 flex-col w-full h-full px-[25px] pb-[25px]'>
            
                {/* page titles */}
                <div className='flex flex-row font-bold w-full justify-start pt-[93.4px] text-black h-1/5 pb-[15px]'>
                    <div className='writing-activity-page-title-div'>
                        <div className='writing-activity-page-title-icon'>
                            <commonIconSvgs.SparkWritingTitleBookIcon/>
                        </div>
                        <span className='writing-activity-page-title-text' >{sparkWritingBookName}</span>
                    </div>
                    <div className='flex flex-1 items-center justify-end'>
                        <SelectLabels/>
                    </div>
                </div>
                
                {/* progress view box */}
                    {/* <button onClick={()=>{
                        const unit_idx = 5
                        let unitTitle = '';
                        for (let i = 0; i < sparkWritingData.length;i++) {
                            const targetUnitIdx = sparkWritingData[i];
                            if (unit_idx === targetUnitIdx.unit_index) {
                                unitTitle = `Unit ${targetUnitIdx.unit_index}. ${targetUnitIdx.topic}`
                            }
                        }
                        setUnitRubricScoresData(dumyUnitRubricData, unit_idx);

                        setUnitReportModal({open:true, unitTitle})
                        
                    }}>test button</button> */}
                <div className='progress-page-view-box-wrap'>
                    <div className='progress-page-view-box-header justify-end h-[45px] px-[20px] pt-[20px] pb-[5px]'>
                        <div className='row-div items-center pb-[5px] gap-[4px]'>
                            <progressIcons.CheckGreenCircleIcon className='flex w-[18px]'/>
                            <progressIcons.CheckBlueRectIcon className='flex w-[18px]'/>
                            <span style={{
                                width: '359px',
                                height: '19px',
                                flexGrow: 0,
                                fontFamily: 'Roboto',
                                fontWeight: 400,
                                fontStretch: 'normal',
                                fontStyle: 'normal',
                                lineHeight: 'normal',
                                letterSpacing: 'normal',
                                textAlign: 'left',
                                color: '#888',
                            }} 
                            // className='roboto-regular text-[16px] text-[#888] text-left'
                            >{'터치 시, 완료 학습 및 Feedback을 확인할 수 있습니다.'}</span>
                        </div>
                    </div>
                    <div className='progress-page-view-box-content'>
                        <ProgressTable data={sparkWritingData}/>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Progress;