interface IEssayWritingCenterDT {
    essayWritingDatasStore: TUseItem[];
    setUseAI1: (topic: string, text: string)=>void;
    setUseAI2: (topic: string, text: string)=>void;
    setUseUser: (topic: string, text?: string)=>void;
    proceedingTopicIndex: number;
    completeTopicIndex: number[];
    setProceedingTopicIndex: (proceedingTopicIndex:number) => void;
    setCompleteTopicIndex: (proceedingTopicIndex: number) => void;
}

type TUseItem = {
    topic: string,
    text: string
}