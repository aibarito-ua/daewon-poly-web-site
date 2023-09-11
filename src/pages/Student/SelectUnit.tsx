import React from 'react';
import useNavStore from '../../store/useNavStore';
import useEssayWritingCenterDTStore from '../../store/useEssayWritingCenterDTStore'
import useSparkWritingStore from '../../store/useSparkWritingStore';
import {CommonFunctions} from '../../util/common/commonFunctions'
import { useNavigate } from 'react-router-dom';
import useLoginStore from '../../store/useLoginStore';
import { SvgIconCheck } from '../../util/svgs/svgCheck';
import { CircleIcon, NoEntryCircleIcon, SavedCircleIcon, CompleteCircleIcon, ReLearningCircleIcon } from '../../util/svgs/heroIcons/CircleIcon';
import SelectUnitBox from '../../components/pageComponents/selectUnitPage/SelectUnitBox';
import ReportModalComponent from '../../components/toggleModalComponents/ReportModalComponent';
import SmallHead from '../../components/commonComponents/SmallHeadComponent/SmallHead';
import { commonIconSvgs } from '../../util/svgs/commonIconsSvg';
import { useComponentWillMount } from '../../hooks/useEffectOnce';
import { callUnitInfobyStudent } from './api/EssayWriting.api';

export default function SelectUnit () {
    const navigate = useNavigate();
    const {role} = useLoginStore();
    const {setTopNavHiddenFlagged, setSubNavTitleString, setSubRightNavTitleString, setSelectUnitInfo, secondGenerationOpen} = useNavStore()
    const { proceedingTopicIndex, completeTopicIndex, setCompleteTopicIndex, setInitCompleteTopicIndex} = useEssayWritingCenterDTStore();
    const {sparkWritingData, sparkWritingBookName} = useSparkWritingStore();

    React.useEffect(()=>{
        setSubNavTitleString('Spark Writing')
        setSubRightNavTitleString('');
        setCompleteTopicIndex(proceedingTopicIndex,1)
        return () => {
            setSubNavTitleString('');
        }
    },[
        setTopNavHiddenFlagged,
        setSubNavTitleString,
        setSubRightNavTitleString,
        proceedingTopicIndex,
        setCompleteTopicIndex,
        sparkWritingData
    ])

    
    
    const SelectBoxUnitMapLoop = (props: {items:TSparkWritingDatas}) => {

        const selectWritingTopic = async (unitNum:string, unitTitle:string, draftNum: string ) => {
            console.log('unitNum: ',unitTitle)
            setSelectUnitInfo(`Unit ${unitNum}.`,unitTitle)
            const path = `WritingClinic/SparkWriting/${unitNum}/${draftNum}`
            CommonFunctions.goLink(path, navigate, role);
        }
        const draftIcons = (firstProgress:number, secondProgress:number, currentStep:number) => {
            const currentlyInProgress = currentStep===1 ? (
                secondProgress===0 ? (
                    firstProgress!==4 ? true : false
                ):false
            ):(
                firstProgress===4 ? (
                    secondProgress===4 ? false:true
                ): false
            )
            const progress = currentStep===1? firstProgress: (
                firstProgress===4 ? secondProgress : -1
            )

            if (progress === 0) {
                return  <CircleIcon className={currentlyInProgress ? 'draft-icon-in-progress' : 'draft-icon-not-progress'} />
            } else if (progress === 1) {
                return <SavedCircleIcon className={currentlyInProgress ? 'draft-icon-in-progress' : 'draft-icon-not-progress'} />
            } else if (progress >1 && progress < 5) {
                //  2, 3, 4
                return <CompleteCircleIcon className={currentlyInProgress ? 'draft-icon-in-progress' : 'draft-icon-not-progress'} />
            } else if (progress === 5) {
                return <ReLearningCircleIcon className={currentlyInProgress ? 'draft-icon-in-progress' : 'draft-icon-not-progress'} />
            } else {
                // -1
                return <NoEntryCircleIcon className={currentlyInProgress ? 'draft-icon-in-progress' : 'draft-icon-not-progress'} />
            }
        }
        
        return (
            <div className="flex flex-col bg-[#fff] h-[445px] max-w-[1010px] px-[25px] pb-[35px] pt-[23px] rounded-[24px]">
                <div className='select-a-unit-to-begin select-none'>{'* Select a unit to begin.'}</div>
                <div className='select-unit-div'>
                {props.items.map((item:TSparkWritingData, topicsIndex:number)=>{
                                
                    // 각 회차별 
                    // 0: 진입 가능&진입불가, 
                    // 1: 임시 저장, 
                    // 2: 완료(admin draft 입수/진행중)
                    // 3: 완료(admin draft 진행중/임시저장)
                    // 4: 완료(admin feedback 완료)
                    // 5: 재학습 필요
                    // 1: 1st 시작, 2nd는 1st의 피드백이 있을때
                    const selectUnitIndex = item.unit_index.toString();
                    const selectUnitMainTitle = `Unit ${item.unit_index}`
                    const selectUnitSubTitle = item.topic;
                    
                    const firstDraft = item.draft_1_status.status
                    const secondDraft = item.draft_2_status.status
                    const firstFeedback = firstDraft===4 ? true : false;
                    const secondFeedback = secondDraft===4 ? true : false;
                    
                    return (
                        
                    <div key={topicsIndex} 
                    className={`select-none select-writing-topic-item-button group/unit`}
                    onClick={async ()=>{
                        
                        if ( !firstFeedback && !secondFeedback ) {
                            // 1차 진입 가능
                            if (firstDraft === 0) {
                                // 1차 진행 -> 편집 가능
                                await selectWritingTopic(selectUnitIndex, selectUnitSubTitle, '1');
                            } else if (firstDraft === 1) {
                                // 1차 임시저장 -> 편집 가능
                                await selectWritingTopic(selectUnitIndex, selectUnitSubTitle, '1');
                            } else if (firstDraft === 2|| firstDraft === 3) {
                                // 1차 완료(submit) -> 편집 x, 뷰잉만
                            } else if (firstDraft === 5) {
                                // 1차 재학습 -> 편집 가능
                                await selectWritingTopic(selectUnitIndex, selectUnitSubTitle, '1');
                            } else if (firstDraft === 4) {
                                // 2차 진입 가능
                            }
    
                        } else if (firstFeedback && !secondFeedback) {
                            // 2차 진입 가능
                            if (secondDraft === 0) {
                                // 2차 진행 -> 편집 가능
                                await selectWritingTopic(selectUnitIndex, selectUnitSubTitle, '2');
                            } else if (secondDraft === 1) {
                                // 2차 임시저장 -> 편집 가능
                            } else if (secondDraft === 2 || secondDraft === 3) {
                                // 2차 완료(submit) -> 편집 x, 뷰잉만
                            } else if (secondDraft === 5) {
                                // 2차 재학습 -> 편집 가능
                            } else if (secondDraft === 4) {
                                // -> final
                            }
                        } else if (firstFeedback && secondFeedback) {
                            // 100% -> final feedback
                        }
                    }}
                    >
                        <div className='unit-select-button-item'>
                            <div className='unit-select-button-item-unit group-hover/unit:bg-[#21c39a]'>
                                {selectUnitMainTitle}
                            </div>
                            <div className='unit-select-button-item-title group-hover/unit:text-[#21c39a]'>{selectUnitSubTitle}</div>
                        
                            {(firstDraft !== 4 || secondDraft !== 4) && (
                                <div className='unit-select-button-item-drafts z-0 mt-[36px]'>
                                    <div className='flex unit-select-button-item-dotted z-0'></div>
                                    <div className='flex flex-row z-10 relative items-center'><span>{
                                        draftIcons(firstDraft, secondDraft, 1)
                                    }</span><span className='ordinal pl-[6px]'>{'1st'}</span>{' Draft'}</div>
                                    <div className='flex flex-row z-10 relative mt-[22px] items-center'><span>{
                                        draftIcons(firstDraft, secondDraft, 2)
                                    }</span><span className='ordinal pl-[6px]'>{'2nd'}</span>{' Draft'}</div>
                                </div>
                            )}
                            {(firstDraft === 4 && secondDraft === 4) && (
                                <div className='unit-select-button-item-drafts z-0 mt-[36px] relative'>
                                    <div className='flex unit-select-button-item-dotted z-0'></div>
                                    <div className='flex flex-row z-10 relative items-center'><span>{
                                        draftIcons(firstDraft, secondDraft, 1)
                                    }</span><span className='ordinal pl-[6px]'>{'1st'}</span>{' Draft'}</div>
                                    <div className='flex flex-row z-10 relative mt-[22px] items-center'><span>{
                                        draftIcons(firstDraft, secondDraft, 2)
                                    }</span><span className='ordinal pl-[6px]'>{'2nd'}</span>{' Draft'}</div>
                                    <div className='absolute w-[150px] h-[140px] top-0 left-0 rounded-[22px] bg-[#000] opacity-[0.7] z-20'>
                                    </div>
                                    <div className='unit-complete-report-icon'></div>
                                </div>
                            )}
                        {(firstDraft === 4 && secondDraft === 4) && (
                            <div className='unit-complete-flower-icon'></div>
                        )}
                        </div>
                        <span className='absolute top-0 right-0'>{(firstDraft && secondFeedback) ? SvgIconCheck: ''}</span>
                    </div>
                    )
                    
                })}
                </div>
            </div>
        )
    }
    
    return (
        <section className='section-common-layout use-nav-aside'>
            {/* page inline header */}
            <SmallHead mainTitle='Writing Activity' subTitle='Spark Writing'/>
            <div className='flex flex-1 flex-col w-full h-full px-[25px] pb-[25px]'>
            
                {/* page titles */}
                <div className='flex flex-col font-bold w-full justify-start pt-[93.4px] text-black h-1/5'>
                    <div className='writing-activity-page-title-div'>
                        <div className='writing-activity-page-title-icon'>
                            <commonIconSvgs.SparkWritingTitleBookIcon/>
                        </div>
                        <span className='writing-activity-page-title-text select-none' >{sparkWritingBookName}</span>
                    </div>
                </div>
                {/* buttons */}
                {/* <div className="flex max-md:flex-col md:flex-row px-12 max-md:mt-[10vhd] md:pt-4 gap-8 w-full justify-center text-center align-middle"> */}
                    <SelectBoxUnitMapLoop items={sparkWritingData} />
                {/* </div> */}
            </div>

        </section>
    )
}
