interface IEssayWritingCenterDT {
    essayWritingInputItems: TUseItem[];
    proceedingTopicIndex: number;
    completeTopicIndex: TProgressUnitInfo[];
    setInitCompleteTopicIndex: (unitValue:TSelectBoxUnitValue, unitIndex: number) => void;
    setProceedingTopicIndex: (proceedingTopicIndex:number) => void;
    setCompleteTopicIndex: (proceedingTopicIndex: number, roundDraft: number, feedback?: boolean) => void;
}

type TUnitTitleItem = {
    main: string,
    sub: string
}

type TUseItem = {
    [key:string]: TOutlineItem
}

type TProgressUnitInfo = {
    firstDraft: number,
    secondDraft: number,
    firstFeedback: boolean,
    secondFeedback: boolean
}
