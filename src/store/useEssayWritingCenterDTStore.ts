import { create } from "zustand";
const useEssayWritingCenterDTStore = create<IEssayWritingCenterDT>((set, get)=>({
    // writing input values
    essayWritingInputItems: [],
    // topic check
    proceedingTopicIndex: 0,
    completeTopicIndex: Array.from({length: 5}, (v, i)=>{
        // if (i===0) return 0
        // else return 3
        return {firstDraft: 1, secondDraft: 5, firstFeedback: false, secondFeedback: false };
    }),
    setInitCompleteTopicIndex: (unitValue: TSparkWritingData, unitIndex: number ) => {
        let currentCompleteTopicProcessAll:TProgressUnitInfo[] = JSON.parse(JSON.stringify(get().completeTopicIndex));
        let currentCompleteTopicProcess = currentCompleteTopicProcessAll[unitIndex];
        const draft1_progress = unitValue.draft_1_status.status;
        const draft2_progress = unitValue.draft_2_status.status;
        currentCompleteTopicProcess.firstDraft = draft1_progress;
        currentCompleteTopicProcess.secondDraft = draft2_progress;
        if (draft1_progress===4) {
            if (draft2_progress===4) {
                currentCompleteTopicProcess.secondFeedback = true;
            } else {
                currentCompleteTopicProcess.secondFeedback = false;
            }
            currentCompleteTopicProcess.firstFeedback = true;
        } else {
            currentCompleteTopicProcess.firstFeedback = false;
            currentCompleteTopicProcess.secondFeedback = false;
        }
        
        set(()=>({
            completeTopicIndex: currentCompleteTopicProcessAll
        }))

    },
    setProceedingTopicIndex: (proceedingTopicIndex:number,)=>{
        set(()=>({proceedingTopicIndex}))
    },
    setCompleteTopicIndex: (proceedingTopicIndex:number, roundDraft: number, feedback?: boolean ) => {
        const currentStateCompleteTopicIndex = get().completeTopicIndex;
        const SetCompleteTopicIndexValue:TProgressUnitInfo[] = currentStateCompleteTopicIndex.map((value:TProgressUnitInfo, index:number)=>{
            if (index === proceedingTopicIndex) {
                if (roundDraft === 1) {
                    const returnValue:TProgressUnitInfo = {
                        firstDraft: proceedingTopicIndex,
                        secondDraft: value.secondDraft,
                        firstFeedback: feedback? feedback:value.firstFeedback,
                        secondFeedback: value.secondFeedback}
                    return returnValue;
                } else {
                    const returnValue:TProgressUnitInfo = {
                        firstDraft: value.firstDraft,
                        secondDraft: proceedingTopicIndex,
                        firstFeedback: value.firstFeedback,
                        secondFeedback: feedback? feedback:value.secondFeedback
                    }
                    return returnValue;
                }
            } else {
                return value
            }
        })
        set(()=>({completeTopicIndex: SetCompleteTopicIndexValue}))
    }
}))

export default useEssayWritingCenterDTStore;