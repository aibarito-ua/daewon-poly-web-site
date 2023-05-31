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
    completeTopicIndex: Array.from({length: 12}, (v, i)=>{
        if (i===0) return 0
        else return 2
    }),
    setProceedingTopicIndex: (proceedingTopicIndex:number)=>{
        set(()=>({proceedingTopicIndex}))
    },
    setCompleteTopicIndex: (proceedingTopicIndex:number) => {
        let currentStateCompleteTopicIndex = get().completeTopicIndex;
        currentStateCompleteTopicIndex = currentStateCompleteTopicIndex.map((value, index)=>{
            if (index === proceedingTopicIndex) {
                return 0
            } else if (index > proceedingTopicIndex) {
                return value
            } else {
                return 1
            }
        })
        set(()=>({completeTopicIndex: currentStateCompleteTopicIndex}))
    }
}))

export default useEssayWritingCenterDTStore;