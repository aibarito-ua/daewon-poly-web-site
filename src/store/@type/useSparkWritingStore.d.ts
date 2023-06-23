interface ISparkWritingStore {
    selectBoxUnit : TSelectBoxUnit;
    setSelectBoxUnit: (unitIndex:number, count: number)=>void;
    

    outlineItems: TOutlineItem[];
    setOutlineInputText: (inputText: string, unitIndex:string, draftIndex:string, inputKey:string, inputIndex:number, mainIndex:number, subIndex?:number)=>void;

    // check writing value(strings)
    checkWritingValues:any;
}

type TSelectBoxUnit = {
    title: {
        main: string;
        sub: string;
    };
    topic: string;
    topicIndex: number;
    progress: TProgressNum[];
    countofUseAIProofreading: number;
}[]

type TSelectBoxUnitValue = {
    title: {
        main: string;
        sub: string;
    };
    topic: string;
    topicIndex: number;
    progress: TProgressNum[];
    countofUseAIProofreading: number;
}

type TProgressNum = -1|0|1|2|3|4;

// outline data form
type TOutlineItem = {
    name: string;
    class: string[];
    semester: string;
    topic: string;
    format_type: string;
    CheckWriting: string;

    [key:string]: undefined|string|TFormatValue;
};
type TFormatValue = TDepsOne|TDepsDouble;
type TDepsOne = (string | TOutlineValues)[];
type TDepsDouble = (string | (string | TOutlineValues)[])[];


// outline multi value form
type TOutlineValues = {
    id: string;
    text: string;
    inputIndex: number;
    placeholder: string;
}

// check writing value(string)
type TCheckWritingValue = {
    [key:string]: any;
}
