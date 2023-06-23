import React from 'react';
import useNavStore from '../../store/useNavStore';
import useEssayWritingCenterDTStore from '../../store/useEssayWritingCenterDTStore'
import useSparkWritingStore from '../../store/useSparkWritingStore';
import {CommonFunctions} from '../../util/common/commonFunctions'
import { useNavigate } from 'react-router-dom';
import useLoginStore from '../../store/useLoginStore';
import { SvgIconCheck } from '../../util/svgs/svgCheck';
import { CircleIcon, NoEntryCircleIcon, SavedCircleIcon, CompleteCircleIcon, INGCompleteCircleIcon, ReLearningCircleIcon } from '../../util/svgs/heroIcons/CircleIcon';
import SelectUnitBox from '../../components/pageComponents/selectUnitPage/SelectUnitBox';
import ReportModalComponent from '../../components/toggleModalComponents/ReportModalComponent';

export default function SelectUnit () {
    const navigate = useNavigate();
    const {role} = useLoginStore();
    const {setTopNavHiddenFlagged, setSubNavTitleString, setSubRightNavTitleString, setSelectUnitInfo, secondGenerationOpen} = useNavStore()
    const { proceedingTopicIndex, completeTopicIndex, setCompleteTopicIndex, setInitCompleteTopicIndex} = useEssayWritingCenterDTStore();
    const {selectBoxUnit} = useSparkWritingStore();

    React.useEffect(()=>{
        setSubNavTitleString('Spark Writing')
        setSubRightNavTitleString('');
        setCompleteTopicIndex(proceedingTopicIndex,1)
        for (const idx in selectBoxUnit) {
            const unitValues = selectBoxUnit[idx];
            const numberIdx = parseInt(idx);
            console.log('Effect: ',unitValues)
            setInitCompleteTopicIndex(unitValues, numberIdx);
        }
        return () => {
            setSubNavTitleString('');
        }
    },[
        setTopNavHiddenFlagged,
        setSubNavTitleString,
        setSubRightNavTitleString,
        proceedingTopicIndex,
        setCompleteTopicIndex,
        selectBoxUnit
    ])

    
    
    const SelectBoxUnitMapLoop = (props: {items:TSelectBoxUnit}) => {
        const selectWritingTopic = async (unitNum:string, unitTitle:string, draftNum: string ) => {
            setSelectUnitInfo(`Unit ${unitNum}`,unitTitle)
            const path = `WritingClinic/SparkWriting/${unitNum}/${draftNum}`
            CommonFunctions.goLink(path, navigate, role);
        }
        const draftIcons = (progress:number) => {
            if (progress === 0) {
                return <CircleIcon className='w-5 h-5' />
            } else if (progress === 1) {
                return <SavedCircleIcon className='w-5 h-5' />
            } else if (progress === 2) {
                return <INGCompleteCircleIcon className='w-5 h-5' />
            } else if (progress === 3) {
                return <ReLearningCircleIcon className='w-5 h-5' />
            } else if (progress === 4) {
                return <CompleteCircleIcon className='w-5 h-5' />
            } else {
                // -1
                return <NoEntryCircleIcon className='w-5 h-5' />
            }
        }
        
        return (
            <div className="flex max-md:flex-col md:flex-row px-12 max-md:mt-[10vhd] md:pt-4 gap-8 w-full justify-center text-center align-middle">

                {props.items.map((item:TSelectBoxUnitValue, topicsIndex:number)=>{
                                
                    // 각 회차별 
                    // 0: 진입 가능, 1: 임시 저장, 2: 완료, 3: 재학습 필요, -1: 진입 불가
                    // 1: 1st 시작, 2nd는 1st의 피드백이 있을때
                    // const checkProceeding = completeTopicIndex[item.topicIndex]
                    const selectUnitIndex = (topicsIndex+1).toString();
                    // console.log('checkProceeding ==',checkProceeding)
                    // console.log('selectUnitIndex ===',selectUnitIndex)
                    
                    const firstDraft = item.progress[0]
                    const secondDraft = item.progress[1]
                    const firstFeedback = firstDraft===3 ? true : false;
                    const secondFeedback = secondDraft===3 ? true : false;
                    return (<div key={topicsIndex} 
                    className={`flex flex-row content-between md:pb-1 md:pt-6 md:px-1 select-writing-topic-item-button bg-gray-300 hover:ring-8 hover:ring-yellow-400 focus:ring-8 focus:ring-yellow-400 relative`}
                    // disabled={checkProceeding.secondDraft === 2 ? true : false}
                    onClick={async ()=>{
                        
                        if ( !firstFeedback && !secondFeedback ) {
                            // 1차 진입 가능
                            if (firstDraft === 0) {
                                
                                // 1차 진행 -> 편집 가능
                                await selectWritingTopic(selectUnitIndex, item.title.sub, '1');
                            } else if (firstDraft === 1) {
                                // 1차 임시저장 -> 편집 가능
                            } else if (firstDraft === 2) {
                                // 1차 완료(submit) -> 편집 x, 뷰잉만
                            } else if (firstDraft === 3) {
                                // 1차 재학습 -> 편집 가능
                            } else {
                                // 1차 완료 -> 2차 진입 가능
                            }
    
                        } else if (firstDraft && !secondFeedback) {
                            // 2차 진입 가능
                            if (secondDraft === 0) {
                                // 2차 진행
                            } else if (secondDraft === 1) {
                                // 2차 임시저장 -> 편집 가능
                            } else if (secondDraft === 2) {
                                // 2차 완료(submit) -> 편집 x, 뷰잉만
                            } else if (secondDraft === 3) {
                                // 2차 재학습 -> 편집 가능
                            } else {
                                // 1차 진행중
                            }
                        } else if (firstDraft && secondFeedback) {
                            // 100% -> final feedback
                        }
                    }}
                    ><div className='flex flex-1 flex-col h-full justify-stretch md:gap-4 md:py-4 max-md:py-1 max-md:gap-1 px-2'>
                            <div className='flex flex-col h-fit'>
                                {item.title.main}
                            </div>
                            <div className='flex flex-1 justify-center'>{item.title.sub}</div>
                        
                            {(item.progress[0] !== 4 || item.progress[1] !== 4) && (
                                <div className='flex flex-initial md:flex-col max-md:flex-row max-md:justify-around max-md:py-1 h-12 bg-slate-400 rounded-lg'>
                                        <div className='flex flex-row justify-center items-center'><span>{
                                            draftIcons(item.progress[0])
                                        }</span><span className='ordinal'>{'1st'}</span>{' Draft'}</div>
                                        <div className='flex flex-row justify-center items-center'><span>{
                                            draftIcons(item.progress[1])
                                        }</span><span className='ordinal'>{'2nd'}</span>{' Draft'}</div>
                                </div>
                            )}
                            {(item.progress[0] === 4 && item.progress[1] === 4) && (
                                <div className='flex flex-initial md:flex-col max-md:flex-row max-md:justify-around max-md:py-1 h-12 bg-slate-400 rounded-lg'>
                                    <ReportModalComponent />
                                </div>
                            )}
                    </div>
                    <span className='absolute top-0 right-0'>{(firstDraft && secondFeedback) ? SvgIconCheck: ''}</span></div>)
                    
                })}
            </div>
        )
    }
    
    return (
        <section className='section-common-layout use-nav-aside'>
            <div className='flex flex-1 flex-col w-full h-full'>
            <div className='flex-none flex-row justify-center content-center'>
                <p className='text-3xl font-bold text-black pb-4'>{'Writing Clinic'}</p>
            </div>
                {/* page inline header */}
                <div className='flex flex-row font-bold w-full justify-stretch items-center px-8 text-black border-b-4 border-b-[#d9e2f3]'>
                    <div className='flex flex-1 pt-4 justify-start'>
                        <p>{`Spark Writing`}</p>
                    </div>
                    <div className='flex flex-1 flex-row-reverse pl-4 py-4'>
                        <button className={`bg-gray-300 px-4 rounded-lg shadow-[5px_10px_10px_rgba(0,0,0,0.25)] ${secondGenerationOpen? '':'hidden'}`}>{'Free Writing'}</button>
                    </div>
                </div>
                {/* page titles */}
                <div className='flex flex-col font-bold w-full justify-start px-8 pt-4 text-black h-1/5'>
                    <p className='flex flex-1 pl-4'>SPARK Writing B-1</p>
                    <p className='flex flex-1 pl-8'>* Please select one unit.</p>
                </div>
                {/* buttons */}
                {/* <div className="flex max-md:flex-col md:flex-row px-12 max-md:mt-[10vhd] md:pt-4 gap-8 w-full justify-center text-center align-middle"> */}
                    <SelectBoxUnitMapLoop items={selectBoxUnit} />
                {/* </div> */}
            </div>
        </section>
    )
}
