import {create} from 'zustand'
const useSparkWritingStore = create<ISparkWritingStore>((set,get)=>({
    selectBoxUnit: 
[
    {
        title: {main: 'Unit 1', sub: 'Descriptive Essays'}, 
        topic: 'How to write essays well.', topicIndex: 1, progress: [0,-1], 
        countofUseAIProofreading: 0
    },
    {
        title: {main: 'Unit 2', sub: 'Informative Essays'}, 
        topic: 'How to write essays well.', topicIndex: 1, progress: [0,-1],
        countofUseAIProofreading: 0
    },
    {
        title: {main: 'Unit 3', sub: 'Personal Narratives'}, 
        topic: 'How to write essays well.', topicIndex: 1, progress: [0,-1],
        countofUseAIProofreading: 0
    },
    {
        title: {main: 'Unit 4', sub: 'Science Fiction Short Stories'}, 
        topic: 'How to write essays well.', topicIndex: 1, progress: [0,-1],
        countofUseAIProofreading: 0
    },
    {
        title: {main: 'Unit 5', sub: 'Persuasive Essays'}, 
        topic: 'How to write essays well.', topicIndex: 1, progress: [0,-1],
        countofUseAIProofreading: 0
    },
],
    outlineItems: [
        {
            "name": "Unit_1_1",
            "class": ["GT4"],
            "semester": "2",
            "topic": "Descriptive Essays",
            "format_type": "OL01",
            "CheckWriting": "5",
            "Title": [
                "Write a title that matches the main idea of your essay.", {
                    "id": "Title_1",
                    "text": "",
                    "inputIndex": 0,
                    "placeholder": " Start typing in your title ..."
            }],
            "Introduction": [
                "Begin writing your introduction by explaining why the topic is special or by stating an interesting fact about the topic.",{
                    "id": "Introduction_1",
                    "text": "",
                    "inputIndex": 1,
                    "placeholder": " Start typing in the beginning ..."
                },
            ],
            "Body": [
                "",
                [
                    "Body Paragraph 1: Start the first paragraph with a sentence that introduces one detail of the special object. Add details that support the topic sentence.",{
                        "id": "Body_1",
                        "text": "",
                        "inputIndex": 2,
                        "placeholder": " Start typing in your first event ..."
                    }, "Body Paragraph 2: Start the second paragraph with a sentence that introduces another detail of the special object. Add details that support the topic sentence.",{
                        "id": "Body_2",
                        "text": "",
                        "inputIndex": 3,
                        "placeholder": " Start typing in your second event ..."
                    },
                ]
            ],
            "Conclusion": [
                "Begin the conclusion by restating why the object is special or by asking a question.",{
                    "id": "Conclusion_1",
                    "text": "",
                    "inputIndex": 4,
                    "placeholder": " Start typing in your ending ..."
                }
            ]
        },
        {
            "name": "Unit_2_1",
            "class": ["GT4"],
            "semester": "2",
            "topic": "Informative Essays",
            "format_type": "OL01",
            "CheckWriting": "5",
            "Title": [
                "Write a title that matches the main idea of your essay.",{
                    "id": "Title_1",
                    "text": "",
                    "inputIndex": 0,
                    "placeholder": " Start typing in your title ..."
            }],
            "Introduction": [
                "Begin the introduction with a question or with an interesting fact.",{
                    "id": "Introduction_1",
                    "text": "",
                    "inputIndex": 1,
                    "placeholder": " Start typing in the beginning ..."
                },
            ],
            "Body": [
                "",
                [
                    "Body Paragraph 1: Start with a topic sentence and then include details to support the topic.",{
                        "id": "Body_1",
                        "text": "",
                        "inputIndex": 2,
                        "placeholder": " Start typing in your first event ..."
                    }, "Body Paragraph 2: Start with a topic sentence and then include details to support the topic.",{
                        "id": "Body_2",
                        "text": "",
                        "inputIndex": 3,
                        "placeholder": " Start typing in your second event ..."
                    },
                ]
            ],
            "Conclusion": [
                "Begin the conclusion by restating the focus statement and adding a final thought or by restating the focus statement and summing up the essay.",{
                    "id": "Conclusion_1",
                    "text": "",
                    "inputIndex": 4,
                    "placeholder": " Start typing in your ending ..."
                }
            ]
        },
        {
            "name": "Unit_3_1",
            "class": ["GT4"],
            "semester": "2",
            "topic": "Personal Narratives",
            "format_type": "OL02",
            "CheckWriting": "6",
            "Title": ["Write a title that matches the main idea of your narrative.",{
                "id": "Title_1",
                "text": "",
                "inputIndex": 0,
                "placeholder": " Start typing in your title ..."
            }],
            "Beginning": [
                "Start writing the beginning of your personal narrative by putting yourself in the middle of the action or by asking a question and then stating the main idea.",{
                    "id": "Beginning_1",
                    "text": "",
                    "inputIndex": 1,
                    "placeholder": " Start typing in the beginning ..."
                },
            ],
            "Middle": [
                "",
                [
                    "Event 1: Write what happens first in your personal narrative.",{
                        "id": "Middle_1",
                        "text": "",
                        "inputIndex": 2,
                        "placeholder": " Start typing in your first event ..."
                    },
                        "Event 2: Write what happened next.",{
                            "id": "Middle_2",
                            "text": "",
                            "inputIndex": 3,
                            "placeholder": " Start typing in your second event ..."
                    },
                        "Event 3: Write what happens after that.",{
                            "id": "Middle_3",
                            "text": "",
                            "inputIndex": 4,
                            "placeholder": " Start typing in your second event ..."
                    },
                ]
            ],
            "End": [
                "Start writing the end of your personal narrative by explaining what you learned or by explaining how you feel now.",{
                    "id": "End_1",
                    "text": "",
                    "inputIndex": 5,
                    "placeholder": " Start typing in your ending ..."
                }
            ]
        },
        {
            "name": "Unit_4_1",
            "class": ["GT4"],
            "semester": "2",
            "topic": "Realistic Fiction",
            "format_type": "OL03",
            "CheckWriting": "7",
            "Title": [
                "Write a title that matches your realistic fiction story.",{
                    "id": "Title_1",
                    "text": "",
                    "inputIndex": 0,
                    "placeholder": " Start typing in your title ..."
                }],
            "Beginning": [
                "Start your story by beginning with dialogue or by providing some background information.",{
                    "id": "Beginning_1",
                    "text": "",
                    "inputIndex": 1,
                    "placeholder": " Start typing in the beginning ..."
                },
                "Setting/problem: Write where the story takes place and what problem the characters face.",{
                    "id": "Beginning_2",
                    "text": "",
                    "inputIndex": 2,
                    "placeholder": " Start typing in the beginning ..."
                },
            ],
            "Middle": [
                "",
                [
                    "Event 1: Write what the character(s) do first to try and solve the problem.",{
                        "id": "Middle_1",
                        "text": "",
                        "inputIndex": 3,
                        "placeholder": " Start typing in your first event ..."
                    },
                    "Event 2: Write what do they do next.",{
                        "id": "Middle_2",
                        "text": "",
                        "inputIndex": 4,
                        "placeholder": " Start typing in your second event ..."
                    },
                    "Event 3: Write what do they do last.",{
                        "id": "Middle_3",
                        "text": "",
                        "inputIndex": 5,
                        "placeholder": " Start typing in your second event ..."
                    },
                ]
            ],
            "End": [
                "How does the problem get solved? Explain how the main character feels after the problem is resolved.",{
                    "id": "End_1",
                    "text": "",
                    "inputIndex": 6,
                    "placeholder": " Start typing in your ending ..."
                }
            ]
        },
        {
            "name": "Unit_5_1",
            "class": ["GT4"],
            "semester": "2",
            "topic": "Persuasive Essays",
            "format_type": "OL04",
            "CheckWriting": "6",
            "Title": [
                "Write a title that matches the main idea of your essay.",{
                    "id": "Title_1",
                    "text": "",
                    "inputIndex": 0,
                    "placeholder": " Start typing in your title ..."
            }],
            "Introduction": [
                "Start the introduction by explaining how you became interested in the topic or by asking a question. Then write your opinion statement.",{
                    "id": "Introduction_1",
                    "text": "",
                    "inputIndex": 1,
                    "placeholder": " Start typing in the beginning ..."
                },
            ],
            "Body": [
                "",
                [
                    "Reason 1: State the first reason for your opinion. Then give strong details that support the reason.",{
                        "id": "Body_1",
                        "text": "",
                        "inputIndex": 2,
                        "placeholder": " Start typing in your first event ..."
                    }, "Reason 2: State the second reason for your opinion. Then give strong details that support the reason.",{
                        "id": "Body_2",
                        "text": "",
                        "inputIndex": 3,
                        "placeholder": " Start typing in your second event ..."
                    }, "Reason 3: State the third reason for your opinion. Then give strong details that support the reason.",{
                        "id": "Body_3",
                        "text": "",
                        "inputIndex": 4,
                        "placeholder": " Start typing in your second event ..."
                    },
                ]
            ],
            "Conclusion": [
                "Begin the conclusion by repeating the opinion statement and then ending with a call to action or by ending with a call to action and then repeating the opinion statement.",{
                    "id": "Conclusion_1",
                    "text": "",
                    "inputIndex": 5,
                    "placeholder": " Start typing in your ending ..."
                }
            ]
        },
    ],
    checkWritingValues: {

    },
    setOutlineInputText: (
        inputText: string,
        unitId:number,
        unitIndex:number,
        orderIndex:number,
        draft:number
    )=>{
        console.log('setOutlineInputText ====\n===input text =',inputText)
        
        let dumyUnitData = get().sparkWritingData.map((unitItem) => {
            if (unitItem.unit_id !== unitId) {
                return unitItem;
            } else {
                if (draft === 1) {
                    inputText = inputText.replace(/\s{2,}/g, ' ');
                    const outlineItem = unitItem.draft_1_outline.map((draftItem) => {
                        const targetOrderIdx = draftItem.order_index;
                        if (targetOrderIdx === orderIndex) {
                            draftItem.input_content = inputText;
                            return draftItem
                        } else {
                            return draftItem
                        }
                    })
                    unitItem.draft_1_outline=outlineItem;
                    return unitItem;
                } else {
                    // [^\S\n]{2,}
                    inputText = inputText.replace(/[^\S\n]{2,}/g, ' ');
                    const outlineItem = unitItem.draft_2_outline.map((draftItem) => {
                        const targetOrderIdx = draftItem.order_index;
                        if (targetOrderIdx === orderIndex) {
                            draftItem.input_content = inputText;
                            return draftItem
                        } else {
                            return draftItem
                        }
                    })
                    unitItem.draft_2_outline=outlineItem;
                    return unitItem;
                }
            }
        });
        console.log('title ===',dumyUnitData)
        if (orderIndex===0) {
            console.log('title ===',dumyUnitData)
        }
        set(()=>({
            sparkWritingData: dumyUnitData
        }))
        
    },
    setSelectBoxUnit: (unitIndex:number, count: number) => {
        let dumySelectBox = get().selectBoxUnit;
        dumySelectBox[unitIndex].countofUseAIProofreading = count
        set(()=>({selectBoxUnit: dumySelectBox}))
    },
    sparkWritingTemporarySaveData: {
        student_code:'', student_name_en:'',
        student_name_kr:'',
        unit_id: 0, proofreading_count:0,
        draft_index: 0, contents: []
    },
    setSparkWritingTemporarySaveData: (data) => {
        set(()=>({
            sparkWritingTemporarySaveData:data
        }))
    },
    sparkWritingBookName: '',
    setSparkWritingDataFromAPI: (data:TSparkWritingDatas, bookName?:string)=>{

        set(()=>({
            sparkWritingBookName:bookName? bookName:get().sparkWritingBookName,
            sparkWritingData:data
        }))
    },
    setProofreadingCount: (unitId:number) => {
        let isAvailable = true;
        const getCurrentData = get().sparkWritingData.map((item) => {
            if (item.unit_id === unitId) {
                const currentProofReadingCount = item.proofreading_count;
                if (currentProofReadingCount < 2) {
                    item.proofreading_count +=1
                } else {
                    isAvailable=false;
                }
            }
            return item;
        });
        if (isAvailable) {
            set(()=>({sparkWritingData:getCurrentData}))
        }
        return isAvailable;
    },
    setProofreadingCountReset: (unitId:number) => {
        let isAvailable = true;
        const getCurrentData = get().sparkWritingData.map((item) => {
            if (item.unit_id === unitId) {
                const currentProofReadingCount = item.proofreading_count;
                if (currentProofReadingCount < 2) {
                    item.proofreading_count =0;
                } else {
                    isAvailable=false;
                }
            }
            return item;
        });
        if (isAvailable) {
            set(()=>({sparkWritingData:getCurrentData}))
        }
        return isAvailable;
    },
    // {
    //     "status": 0,
    //   "reason": "not started",
    //     //진입 불가 / 진입 가능
    // },
    // {
    //     "status": 1,
    //   "reason": "writing in progress"
    //   //임시 저장
    // },
    // {
    //     "status": 2,
    //   "reason": "submitted, review not started"
    //    //(writing hub 완료) \ (Admin 학생 Drfaft 입수)
    // },
    // {
    //     "status": 3,
    //   "reason": "submitted, review in progress"
    //   //(writing hub 완료) \ (Admin Draft  Feedback 중 임시 저장)
    // },
    // {
    //     "status": 4,
    //   "reason": "submitted, review success"
    //   //(writing hub 완료) \ (Admin Draft Feedback 완료)
    // },
    // {
    //     "status": 5,
    //   "reason": "submitted, review return"
    //     //(writing hub 재학습 필요) \ (Admin Draft Feedback 거절)
    // }
//    temp_save_date > submit_date > review_reject_date > review_complete_date
    sparkWritingData: [],

    // student's feedback 
    feedbackDataInStudent: {
        defautInfo: {
            campus: {code:'',name:''},
            level: {code:'',name:''},
            class: {code:'',name:''},
            student_code: '',
            student_name: {student_name_en:'',student_name_kr:''},
            divison: '',
            book_name: '',
            unit_index: 0,
            unit_topic: '',
            step_label: '',
            submit_date:'',
            select_draft_id: ''
        },
        draft_data: {
            comment: [],
            draft_index: 0,
            draft_outline: [],
            overall_comment: '',
            return_reason: '',
            return_teacher_comment: ''
        },
        comment: [],
        overall_comment: '',
        status: null
    },
    setFeedbackDataInStudent: (data) => {
        set(()=>({feedbackDataInStudent: data}))
    },
    draft2ndPageSet:'',
    setDraft2ndPageSet:(draft2ndPageSet) => set(()=>({draft2ndPageSet})),
    commentFocusId: '',
    setCommentFocusId: (commentFocusId) => set(()=>({commentFocusId})),

    // progress select box
    progressAllLevelsValue: [],
    progressLevelBoxValue: '',
    setProgressAllLevelBoxValues: (data) => {
        set(()=>({progressAllLevelsValue:data}))
    },
    setProgressLevelBoxValue: (level) => {
        set(()=>({progressLevelBoxValue:level}))
    }
}))

export default useSparkWritingStore;