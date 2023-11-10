interface ISparkWritingStore {

    // unit select box event value
    lastUnitIndex: number;
    setLastUnitIndex: (unit_index:number) => void;

    setIsOpenFold: (unitIndex:number, title:string) => void;

    selectBoxUnit : TSelectBoxUnit;
    setSelectBoxUnit: (unitIndex:number, count: number)=>void;
    

    outlineItems: TOutlineItem[];
    setOutlineInputText: (inputText: string, unitId:number, unitIndex:number, orderIndex:number,draft:number)=>void;

    // check writing value(strings)
    checkWritingValues:any;

    sparkWritingBookName: string;
    sparkWritingData: TSparkWritingDatas;
    setSparkWritingDataFromAPI: (data:TSparkWritingDatas,bookName?:string)=>void;
    // 비교 데이터
    sparkWritingDataDumy: TSparkWritingDatas;
    
    // save draft temporary data form
    sparkWritingTemporarySaveData: TSparkWritingTemporarySaveData;
    setSparkWritingTemporarySaveData: (data: TSparkWritingTemporarySaveData) => void;

    // proof reading count update => boolean
    setProofreadingCount: (unitId: number) => boolean;
    setProofreadingCountReset: (unitId:number) => boolean;

    // draft select student display steps
    feedbackDataInStudent: TFeedbackStates;
    setFeedbackDataInStudent: (data:TFeedbackStates) => void;

    // 2nd draft Fresh Page or Revise 1st Draft flag
    draft2ndPageSet:TDraft2ndPageSet,
    setDraft2ndPageSet: (draft2ndPageSet:TDraft2ndPageSet) => void;

    // control modal
    commentFocusId: string;
    setCommentFocusId: (setCommentFocusId:string) => void;

    // 모달과 페이지 분리
    commentFocusIdInModal: string;
    setCommentFocusIdInModal: (commentFocusIdInModal:string) => void;

    // progress select box
    progressLevelBoxValue: string;
    progressAllLevelsValue: string[];
    setProgressAllLevelBoxValues: (data: string[]) => void;
    setProgressLevelBoxValue: (level:string) => void;

    // preview페이지 강제 이동 -> history data delete
    historyDataDelete: (unitIndex:number, draftIndex:number) => void;

    // preview 페이지 이동처리
    // "UPDATE_WRITE" -> 내용 수정 후
    // "PREVIEW" -> 프리뷰 뷰잉
    // "ETC" -> 그 외
    previewPageInitFlag: TPreviewPageInitFlag;
    setPreviewPageInitFlag: (flag: TPreviewPageInitFlag) => void;

    
}
type TPreviewPageInitFlag = "UPDATE_WRITE"|"PREVIEW"|"ETC"|"";
type TDraft2ndPageSet = 'fresh'|'revise'|'';
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
    draft_1_comment: TCommentDataList;
    draft_2_comment: TCommentDataList;
    draft_2_init_page_flag: TDraft2ndPageSet;
}
type TDraftStatus = {
    status: number;
    reason: string;
    submit_date: string|null;
    temp_save_date: string|null;
    review_reject_date: string|null;
    review_complete_date: string|null;
    overall_comment: string;
    return_reason: string;
    return_teacher_comment: string;
}
type TSparkWritingDataOutline = {
    name: string;
    order_index: number;
    heading_content: string;
    input_content:string;
    grammar_correction_content_student: string;
    screen_data: TScreenData[];
    is_input_open: boolean;
}
type TScreenData = {
    type: number;
    text:string;
    comment_index: number
}

// save draft temporary 
// draft 1
type TSparkWritingTemporarySaveData = {
    student_code: string;
    student_name_en: string;
    student_name_kr: string;
    class_name: string;
    unit_id: number;
    draft_index: number;
    proofreading_count: number;
    draft_2_init_page_flag?: string;
    contents: TSparkWritingSaveTemporaryContent[];
}
type TSparkWritingSaveTemporaryContent = {
    input_content: string;
    heading_name: string;
    grammar_correction_content_student: string;
    order_index: number;
    is_input_open: boolean;
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


// submit api types
type TSubmit1stDraftRequestData = {
    student_code: string;
    student_name_en: string;
    student_name_kr: string;
    class_name: string;
    unit_id: number;
    draft_index: number;
    contents: TSubmit1stDraftReqDataContent[];
    proofreading_count: number;
}
type TSubmit1stDraftReqDataContent = {
    input_content:string;
    grammar_correction_content_student:string;
    heading_name: string;
    order_index: number;
}
type TSubmit2ndDraftReqDataContent = {
    input_content:string;
    heading_name: string;
    order_index: number;
}
type TSubmit2ndDraftRequestData = {
    student_code: string;
    student_name_en: string;
    student_name_kr: string;
    class_name:string;
    unit_id: number;
    draft_index: number;
    draft_2_init_page_flag: string;
    contents: TSubmit2ndDraftReqDataContent[];
}
// Draft feedback type
type TFeedbackStates = {
    defautInfo: TFeedbackDefaultInfomations;
    draft_data: TFindDraftInfoByDraftIdResponse;
    comment: [];
    overall_comment: string;
    status: TLMSparkWritingStudentUnitDraft1StatusItemInClass|null
}
type TFeedbackDefaultInfomations = {
    campus: TFeedbackfilteredDatas;
    level: TFeedbackfilteredDatas;
    class: TFeedbackfilteredDatas;
    student_code: string;
    student_name: TNamesetData;
    divison: string;
    book_name: string;
    unit_index: number;
    unit_topic: string;
    step_label: string; // "1st or 2nd draft"
    submit_date: string;
    select_draft_id: string;
}
type TFeedbackfilteredDatas = {
    code: string;
    name: string;
}
type TNamesetData = {
    student_name_kr:string;
    student_name_en:string
}
// find draft by draft id
type TFindDraftInfoByDraftIdResponse = {
    comment: TCommentDataList
    draft_index: number;
    draft_outline: TFindDraftInfoByDraftIdDraftOutline[];
    overall_comment: string;
    return_reason:string;
    return_teacher_comment:string;
}
type TFindDraftInfoByDraftIdDraftOutline = {
    grammar_correction_content_teacher: string;
    input_content: string;
    name: string;
    order_index:number;
    screen_data: TParagraphScreenData[]
}
// "comment"
type TCommentDataList = TCommentData[];
type TCommentData = {
    comment: string;
    comment_className: string;
    comment_index: number;
    start_index: number;
    end_index: number;
    paragraph_name: string;
    target_text: string;
}
type TParagraphScreenData = {
    type:-1|0|1|number;
    text: string;
    comment_index: number;
}

type TLMSparkWritingStudentUnitDraft1StatusItemInClass = {
    draft_id: number;
    reason: string;
    status: number;
    review_complete_date:string|null;
    review_reject_date:string|null;
    review_temp_save_date:string|null;
    submit_date:string|null;
    temp_save_date:string|null;
}
type TLMSparkWritingStudentUnitDraft2StatusItemInClass = {
    draft_id: number;
    reason: string;
    status: number;
    review_complete_date:string|null;
    review_reject_date:string|null;
    review_temp_save_date:string|null;
    submit_date:string|null;
    temp_save_date:string|null;
}

type TCircleLegendItems = {
    circleColor: string;
    circleLabel: string;
    eventValue: number;
    innerRadius: number;
    key: string;  
}