import React from 'react';
import useNavStore from '../../store/useNavStore';
import { Button } from 'flowbite-react';
import { EssayWritingDatas } from '../../utils/EssayWriting/textData';
import useEssayWritingCenterDTStore from '../../store/useEssayWritingCenterDTStore'
import {CommonFunctions} from '../../util/common/commonFunctions'
import { useNavigate, useParams } from 'react-router-dom';
import useLoginStore from '../../store/useLoginStore';
import { SvgIconCheck } from '../../util/svgs/svgCheck';

const SelectUnit = () => {
    const navigate = useNavigate();
    const {role} = useLoginStore();
    const {setTopNavHiddenFlagged, setSubNavTitleString, setSubRightNavTitleString, setSelectUnitInfo} = useNavStore()
    const {setUseAI1, setUseAI2, setUseUser, proceedingTopicIndex, completeTopicIndex, setCompleteTopicIndex, setProceedingTopicIndex} = useEssayWritingCenterDTStore();
    React.useEffect(()=>{
        setTopNavHiddenFlagged(true);
        setSubNavTitleString('Spark Writing')
        setSubRightNavTitleString('');
        setCompleteTopicIndex(proceedingTopicIndex,1)
        return () => {
            setTopNavHiddenFlagged(false);
            setSubNavTitleString('');
        }
    },[setTopNavHiddenFlagged, setSubNavTitleString,setSubRightNavTitleString, proceedingTopicIndex, setCompleteTopicIndex])

    const selectWritingTopic = async (unitNum:string, unitTitle:string, draftNum: string ) => {
        
        // setSubRightNavTitleString(subNavRightTitle);
        setSelectUnitInfo(`Unit ${unitNum}`,unitTitle)
        setUseUser(unitTitle);
        const path = `WritingClinic/SparkWriting/${unitNum}/${draftNum}`
        console.log('Path =',path)
        CommonFunctions.goLink(path, navigate, role);
    }
    
    return (
        <section className='section-common-layout'>
            <div className="flex max-md:flex-col md:flex-row px-4 gap-4 w-screen justify-center text-center align-middle">
                {EssayWritingDatas.selectBoxTopics.map((item, topicsIndex)=>{
                    
                    // 각 회차별 
                    // 1: 진입 가능, 2: 임시 저장, 3: 완료, 4: 재학습 필요, 5: 진입 불가
                    // 1: 1st 시작, 2nd는 1st의 피드백이 있을때
                    const checkProceeding = completeTopicIndex[item.topicIndex]
                    const selectUnitIndex = (topicsIndex+1).toString();
                    return <button key={topicsIndex} 
                    className={`flex flex-row content-between py-4 select-writing-topic-item-button bg-gray-300 hover:ring-8 hover:ring-yellow-400 focus:ring-8 focus:ring-yellow-400 relative`}
                    // disabled={checkProceeding.secondDraft === 2 ? true : false}
                    onClick={async ()=>{
                        console.log('button click =',checkProceeding)
                        if ( !checkProceeding.firstFeedback && !checkProceeding.secondFeedback ) {
                            // 1차 진입 가능
                            if (checkProceeding.firstDraft === 1) {
                                // 1차 진행 -> 편집 가능
                                await selectWritingTopic(selectUnitIndex, item.title.sub, '1');
                            } else if (checkProceeding.firstDraft === 2) {
                                // 1차 임시저장 -> 편집 가능
                            } else if (checkProceeding.firstDraft === 3) {
                                // 1차 완료(submit) -> 편집 x, 뷰잉만
                            } else if (checkProceeding.firstDraft === 4) {
                                // 1차 재학습 -> 편집 가능
                            } else {
                                // 1차 완료 -> 2차 진입 가능
                            }

                        } else if (checkProceeding.firstDraft && !checkProceeding.secondFeedback) {
                            // 2차 진입 가능
                            if (checkProceeding.secondDraft === 1) {
                                // 2차 진행
                            } else if (checkProceeding.secondDraft === 2) {
                                // 2차 임시저장 -> 편집 가능
                            } else if (checkProceeding.secondDraft === 3) {
                                // 2차 완료(submit) -> 편집 x, 뷰잉만
                            } else if (checkProceeding.secondDraft === 4) {
                                // 2차 재학습 -> 편집 가능
                            } else {
                                // 1차 진행중
                            }
                        } else if (checkProceeding.firstDraft && checkProceeding.secondFeedback) {
                            // 100% -> final feedback
                        }
                            
                        
                    }}
                    ><div className='flex flex-1 flex-col h-full justify-stretch gap-2 py-2 px-2'>
                        
                            <div className='flex flex-col h-fit'>
                                {item.title.main}
                            </div>
                            <div className='flex flex-1 justify-center'>{item.title.sub}</div>
                        
                            <div className='flex flex-initial flex-col h-fit bg-slate-400 rounded-lg'>
                                <div className=''><span className='ordinal'>{'1st'}</span>{' Draft'}</div>
                                <div className=''><span className='ordinal'>{'2nd'}</span>{' Draft'}</div>
                            </div>
                        
                    </div>
                    <span className='absolute top-0 right-0'>{(checkProceeding.firstDraft && checkProceeding.secondFeedback) ? SvgIconCheck: ''}</span></button>
                            
                    
                })}
            </div>
        </section>
    )
}

export default SelectUnit;