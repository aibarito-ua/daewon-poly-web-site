interface ISparkWritingStore {
    selectBoxUnit : TSelectBoxUnit;
    setSelectBoxUnit: (unitIndex:number, count: number)=>void;
    

    outlineItems: TOutlineItem[];
    setOutlineInputText: (inputText: string, unitId:number, unitIndex:number, orderIndex:number,draft:number)=>void;

    // check writing value(strings)
    checkWritingValues:any;

    sparkWritingBookName: string;
    sparkWritingData: TSparkWritingDatas;
    setSparkWritingDataFromAPI: (data:TSparkWritingDatas,bookName?:string)=>void;

    // save draft temporary data form
    sparkWritingTemporarySaveData: TSparkWritingTemporarySaveData;
    setSparkWritingTemporarySaveData: (data: TSparkWritingTemporarySaveData) => void;
}
type TSparkWritingDatas = TSparkWritingData[]
type TSparkWritingData = {
    unit_id: number;
    unit_index: number;
    topic: string;
    proofreading_count:number;
    draft_1_status: TDraftStatus;
    draft_2_status: TDraftStatus;
    draft_1_outline: TSparkWritingDataOutline[];
    draft_2_outline: TSparkWritingDataOutline[];
}
type TDraftStatus = {
    status: number;
    reason: string;
    submit_date: string|null;
    temp_save_date: string|null;
    review_reject_date: string|null;
    review_complete_date: string|null;
}
type TSparkWritingDataOutline = {
    heading_content: string;
    input_content:string;
    name: string;
    order_index: number;
}

// save draft temporary 
// draft 1
type TSparkWritingTemporarySaveData = {
    student_code: string;
    student_name_en: string;
    student_name_kr: string;
    unit_id: number;
    draft_index: number;
    proofreading_count: number;
    contents: TSparkWritingSaveTemporaryContent[];
}
type TSparkWritingSaveTemporaryContent = {
    input_content: string;
    heading_name: string;
    order_index: number;
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
