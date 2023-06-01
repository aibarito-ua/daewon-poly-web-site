interface IEssayWritingCenterDT {
    essayWritingDatasStore: TUseItem[];
    setUseAI1: (topic: string, text: string)=>void;
    setUseAI2: (topic: string, text: string)=>void;
    setUseUser: (topic: string, text?: string)=>void;
    proceedingTopicIndex: number;
    completeTopicIndex: TProgressUnitInfo[];
    setProceedingTopicIndex: (proceedingTopicIndex:number) => void;
    setCompleteTopicIndex: (proceedingTopicIndex: number, roundDraft: number, feedback?: boolean) => void;
}

type TUnitTitleItem = {
    main: string,
    sub: string
}

type TUseItem = {
    topic: string,
    text: string
}

type TProgressUnitInfo = {
    firstDraft: number,
    secondDraft: number,
    firstFeedback: boolean,
    secondFeedback: boolean
}