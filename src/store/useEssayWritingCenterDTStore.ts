import { create } from "zustand";
const useEssayWritingCenterDTStore = create<IEssayWritingCenterDT>((set, get)=>({
    // writing 
    essayWritingDatasStore: [
        {
            topic: '',
            text: ''
        },
        {
            topic: '',
            text: ''
        },
        {
            topic: '',
            text: 'I will make my own outliner.'
        },
    ],
    setUseAI1: (topic: string, text:string) => {
        const useAI1State = { topic, text };
        let essayWritingDatasStore = get().essayWritingDatasStore;
        essayWritingDatasStore[0] = useAI1State;
        set(()=>({essayWritingDatasStore}))
    },
    setUseAI2: (topic: string, text:string) => {
        const useAI1State = { topic, text };
        let essayWritingDatasStore = get().essayWritingDatasStore;
        essayWritingDatasStore[1] = useAI1State;
        set(()=>({essayWritingDatasStore}))
    },
    setUseUser: (topic: string, text?:string) => {
        const useAI1State = { topic, text: text ? text : get().essayWritingDatasStore[2].text };
        let essayWritingDatasStore = get().essayWritingDatasStore;
        essayWritingDatasStore[2] = useAI1State;
        set(()=>({essayWritingDatasStore}))
    },
    // topic check
    proceedingTopicIndex: 0,
    completeTopicIndex: Array.from({length: 5}, (v, i)=>{
        // if (i===0) return 0
        // else return 3
        return {firstDraft: 1, secondDraft: 5, firstFeedback: false, secondFeedback: false };
    }),
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