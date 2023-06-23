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
    setOutlineInputText: (inputText: string, unitIndex:string, draftIndex:string, inputKey:string, inputIndex:number, mainIndex:number, subIndex?:number)=>{
        console.log('setOutlineInputText ====\n===input text =',inputText,'\nunit index: ',unitIndex, '\ninputKey: ', inputKey, '\nmainIndex: ',mainIndex, '\nsubIndex:',subIndex)
        const UnitIndex = parseInt(unitIndex);
        // const DraftIndex = parseInt(draftIndex);
        let dumyOutlineItems = get().outlineItems;
        let dumyKeyItems = dumyOutlineItems[UnitIndex-1];
        if (dumyKeyItems !== undefined) {
            let dumyTextinOutlineItems = dumyKeyItems[`${inputKey}`];
            if (typeof(dumyTextinOutlineItems) !== 'string' && dumyTextinOutlineItems !== undefined) {
                let dumyTextinOutlineItem = dumyTextinOutlineItems[mainIndex];
                let max_input_length = parseInt(dumyOutlineItems[UnitIndex-1].CheckWriting);
                
                let dumyKeyName = `Unit_${unitIndex}_${draftIndex}`;
                let dumyCheckWritingValues = get().checkWritingValues;
                let dumyCheckWritingValue = dumyCheckWritingValues[dumyKeyName];
                if (dumyCheckWritingValue === undefined) {
                    dumyCheckWritingValues[dumyKeyName] = Array.from({length:max_input_length}, ()=>'');
                }
                if (subIndex !== undefined) {
                    
                    if (Array.isArray(dumyTextinOutlineItem)) {
                        // 하위 text 입력
                        let dumySubTextinOutlineItem = dumyTextinOutlineItem[subIndex];
                        if (typeof(dumySubTextinOutlineItem) !== 'string') {
                            dumySubTextinOutlineItem.text = inputText;

                            dumyCheckWritingValues[dumyKeyName][inputIndex] = inputText;
                            set(()=>({
                                outlineItems: dumyOutlineItems,
                                checkWritingValues: dumyCheckWritingValues
                            }))
                        }

                    }
                } else {
                    if ( !Array.isArray(dumyTextinOutlineItem) && typeof(dumyTextinOutlineItem) !== 'string') {
                        // input text
                        dumyTextinOutlineItem.text=inputText;
                        dumyCheckWritingValues[dumyKeyName][inputIndex] = inputText;
                        set(()=>({
                            outlineItems: dumyOutlineItems,
                            checkWritingValues: dumyCheckWritingValues
                        }))
                    }
                }
            }
        }
    },
    setSelectBoxUnit: (unitIndex:number, count: number) => {
        let dumySelectBox = get().selectBoxUnit;
        dumySelectBox[unitIndex].countofUseAIProofreading = count
        set(()=>({selectBoxUnit: dumySelectBox}))
    }

}))

export default useSparkWritingStore;