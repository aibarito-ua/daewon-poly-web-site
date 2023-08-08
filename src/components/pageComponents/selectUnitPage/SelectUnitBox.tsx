import React from 'react';
import useSparkWritingStore from '../../../store/useSparkWritingStore';
import {CircleIcon, NoEntryCircleIcon, SavedCircleIcon, CompleteCircleIcon, ReLearningCircleIcon} from '../../../util/svgs/heroIcons/CircleIcon'
interface ISelectUnitBoxProps {
    // items: TSelectBoxUnit[];
    completeTopicIndex:TProgressUnitInfo[];
}
const SelectUnitBox = (props:ISelectUnitBoxProps) => {
    // const {completeTopicIndex} = props;
    // const {selectBoxUnit} = useSparkWritingStore();
    // const draftIcons = (progress:number) => {
    //     if (progress === 0) {
    //         return <CircleIcon className='w-5 h-5' />
    //     } else if (progress === 1) {
    //         return <SavedCircleIcon className='w-5 h-5' />
    //     } else if (progress === 2) {
    //         return <INGCompleteCircleIcon className='w-5 h-5' />
    //     } else if (progress === 3) {
    //         return <ReLearningCircleIcon className='w-5 h-5' />
    //     } else if (progress === 4) {
    //         return <CompleteCircleIcon className='w-5 h-5' />
    //     } else {
    //         // -1
    //         return <NoEntryCircleIcon className='w-5 h-5' />
    //     }
    // }

    // return selectBoxUnit.map((item:TSelectBoxUnit, topicsIndex:number)=>{
                        
    //     // 각 회차별 
    //     // 1: 진입 가능, 2: 임시 저장, 3: 완료, 4: 재학습 필요, 5: 진입 불가
    //     // 1: 1st 시작, 2nd는 1st의 피드백이 있을때
    //     const checkProceeding = completeTopicIndex[item.topicIndex]
    //     const selectUnitIndex = (topicsIndex+1).toString();
    //     return <button key={topicsIndex} 
    //     className={`flex flex-row content-between md:pb-1 md:pt-6 md:px-1 select-writing-topic-item-button bg-gray-300 hover:ring-8 hover:ring-yellow-400 focus:ring-8 focus:ring-yellow-400 relative`}
    //     // disabled={checkProceeding.secondDraft === 2 ? true : false}
    //     onClick={async ()=>{
    //         console.log('button click =',checkProceeding)
    //         if ( !checkProceeding.firstFeedback && !checkProceeding.secondFeedback ) {
    //             // 1차 진입 가능
    //             if (checkProceeding.firstDraft === 1) {
    //                 // 1차 진행 -> 편집 가능
    //                 await selectWritingTopic(selectUnitIndex, item.title.sub, '1');
    //             } else if (checkProceeding.firstDraft === 2) {
    //                 // 1차 임시저장 -> 편집 가능
    //             } else if (checkProceeding.firstDraft === 3) {
    //                 // 1차 완료(submit) -> 편집 x, 뷰잉만
    //             } else if (checkProceeding.firstDraft === 4) {
    //                 // 1차 재학습 -> 편집 가능
    //             } else {
    //                 // 1차 완료 -> 2차 진입 가능
    //             }

    //         } else if (checkProceeding.firstDraft && !checkProceeding.secondFeedback) {
    //             // 2차 진입 가능
    //             if (checkProceeding.secondDraft === 1) {
    //                 // 2차 진행
    //             } else if (checkProceeding.secondDraft === 2) {
    //                 // 2차 임시저장 -> 편집 가능
    //             } else if (checkProceeding.secondDraft === 3) {
    //                 // 2차 완료(submit) -> 편집 x, 뷰잉만
    //             } else if (checkProceeding.secondDraft === 4) {
    //                 // 2차 재학습 -> 편집 가능
    //             } else {
    //                 // 1차 진행중
    //             }
    //         } else if (checkProceeding.firstDraft && checkProceeding.secondFeedback) {
    //             // 100% -> final feedback
    //         }
    //     }}
    //     ><div className='flex flex-1 flex-col h-full justify-stretch md:gap-4 md:py-4 max-md:py-1 max-md:gap-1 px-2'>
    //             <div className='flex flex-col h-fit'>
    //                 {item.title.main}
    //             </div>
    //             <div className='flex flex-1 justify-center'>{item.title.sub}</div>
            
    //             {(item.progress[0] !== 4 || item.progress[1] !== 4) && (
    //                 <div className='flex flex-initial md:flex-col max-md:flex-row max-md:justify-around max-md:py-1 h-fit bg-slate-400 rounded-lg'>
    //                         <div className='flex flex-row justify-center items-center'><span>{
    //                             draftIcons(item.progress[0])
    //                         }</span><span className='ordinal'>{'1st'}</span>{' Draft'}</div>
    //                         <div className='flex flex-row justify-center items-center'><span>{
    //                             draftIcons(item.progress[1])
    //                         }</span><span className='ordinal'>{'2nd'}</span>{' Draft'}</div>
    //                 </div>
    //             )}
    //             {(item.progress[0] === 4 && item.progress[1] === 4) && (
    //                 <div className='flex flex-initial md:flex-col max-md:flex-row max-md:justify-around max-md:py-1 h-fit bg-slate-400 rounded-lg'>
    //                     IMG
    //                 </div>
    //             )}
    //     </div>
    //     <span className='absolute top-0 right-0'>{(checkProceeding.firstDraft && checkProceeding.secondFeedback) ? SvgIconCheck: ''}</span></button>
        
    // })
}

export default SelectUnitBox;