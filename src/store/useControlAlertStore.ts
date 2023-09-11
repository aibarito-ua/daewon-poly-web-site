import {create} from 'zustand'

const useControlAlertStore = create<IUseControlAlertStore>((set, get) => ({
    commonAlertOpenFlag: false,
    commonAlertMessage: ['your learning data will not be saved','if you exit now.'],
    commonAlertControllerFlag : 0,
    commonAlertHeadTitle: '',
    commonAlertNoLabel:'No',
    commonAlertYesLabel: 'Yes',
    commonAlertYesFunctionEvent: null,
    commonAlertCloseEvent: null,
    commonAlertOneButton: false,
    commonAlertType: '',

    setCommonAlertMessage: (messages: string[]|JSX.Element[]) => {
        set(()=>({
            commonAlertMessage: messages
        }))
    },
    setCommonAlertHeadTitle: (title:string) => {
        set(()=>({
            commonAlertHeadTitle: title
        }))
    },
    commonAlertOpen: (option?:TCommonAlertOpenOptions) => {
        const commonAlertHeadTitle=option?.head ? option.head:'';
        const commonAlertYesLabel=option?.yesButtonLabel ? option.yesButtonLabel:'yes';
        const commonAlertNoLabel=option?.noButtonLabel ? option.noButtonLabel:'no';
        const commonAlertMessage=option?.messages ? option.messages:[];
        const commonAlertYesFunctionEvent=option?.yesEvent ? option.yesEvent:null;
        const commonAlertCloseEvent = option?.closeEvent ? option.closeEvent: null;
        const commonAlertOneButton=option?.useOneButton ? option.useOneButton:false;
        const commonAlertType=option?.alertType ? option.alertType:'';
        
        set(()=>({
            commonAlertHeadTitle,
            commonAlertYesLabel,
            commonAlertNoLabel,
            commonAlertMessage,
            commonAlertCloseEvent,
            commonAlertYesFunctionEvent,
            commonAlertOneButton,
            commonAlertOpenFlag:true,
            commonAlertType,
        }))
    },
    commonAlertClose: () => {
        set(()=>({
            commonAlertOpenFlag:false,
        }))
    },

    // back drop screen
    commonStandbyScreen: {
        openFlag: false,
    },
    setCommonStandbyScreen: (controlData) => {
        set(()=>({
            commonStandbyScreen:controlData
        }))
    },

    // return 1st draft reason alert
    return1stDraftReasonAlert: {
        openFlag:false,
        returnReason: '',
        returnTeacherComment: '',
    },
    
    setReturn1stDraftReasonAlertOpen: (value) => {
        set(()=>({return1stDraftReasonAlert:value}))
    },


    // unit report modal controller 
    unitReportModalData : {
        wordCountSummary: {
            title:'word count summary',
            draft_1st:[
                {label: 'word', value: 174},
                {label: 'sentences', value: 174},
                {label: 'words per sentence', value: 66},
            ],
            draft_2nd:[
                {label: 'word', value: 174},
                {label: 'sentences', value: 174},
                {label: 'words per sentence', value: 66},
            ],
        },
        correctionSummary: {
            title: 'correction summary',
            correction: [
                {
                    reason: 'grammar',
                    list: [
                        [
                            [0,"test1 "],
                            [1, 'add test 1'],
                            [0, 'test middel '],
                            [-1, 'delete test 1'],
                            [1, 'chenge test 1'],
                            [0, 'test 1.']
                        ]
                    ]
                },
                {
                    reason: 'spelling',
                    list: [
                        [
                            [0,"spelling "],
                            [1, 'add test 1'],
                            [0, 'test middel '],
                            [-1, 'delete test 1'],
                            [1, 'chenge test 1'],
                            [0, 'test 1.']
                        ]
                    ]
                },
                {
                    reason: 'punctuation',
                    list: [
                        [
                            [0,"punctuation "],
                            [1, 'add test 1'],
                            [0, 'test middel '],
                            [-1, 'delete test 1'],
                            [1, 'chenge test 1'],
                            [0, 'test 1.']
                        ]
                    ]
                }
            ]
        }
    },
    
    unitReportModal: {
        open: false,
        unitTitle: ''
    },
    setUnitReportModal: (controlData) => {
        set(()=>({
            unitReportModal: controlData
        }))
    },
    // unit report score modal data
    unitRubricScoresData : {
        averageChartData: {
            dataPayload: {
                target: 'average',
                data: [
                    {
                        name: 'average',
                        value: 0,
                    }
                ],
                addWidth: 40,
                fitText: 40,
            }
        },
        barChartData: [
            {
              name: "idea",
              score: 0,
              colors: { start:'#c9defc', end: '#588ee1'},
              customY: 10,
            },
            {
              name: "organization",
              score: 0,
              colors: { start:'#ffd1b2', end: '#f6914d'},
              customY: 32,
            },
            {
              name: "voice",
              score: 0,
              colors: { start:'#efd6ff', end: '#aa6bd4'},
              customY: 54,
            },
            {
              name: "word choice",
              score: 0,
              colors: { start:'#c2f3e4', end: '#30c194'},
              customY: 76,
            },
            {
              name: "sentence fluency",
              score: 0,
              colors: { start:'#e0dfff', end: '#6865cc'},
              customY: 98,
            },
            {
              name: "conventions",
              score: 0,
              colors: { start:'#ffdcdc', end: '#db5757'},
              customY: 120
            }
        ],
        unitsData: [
            {
                unit_index:1,
                rubric_scores: [
                    {
                        name: 'ideas',
                        score: 2
                    }, {
                        name: 'organization',
                        score: 4
                    }, {
                        name: 'voice',
                        score: 6
                    }, {
                        name: 'word choice',
                        score: 8
                    }, {
                        name: 'sentence fluency',
                        score: 10
                    }, {
                        name: 'conventions',
                        score: 6
                    }
                    
                ]
            }, {
                unit_index:2,
                rubric_scores: [
                    {
                        name: 'ideas',
                        score: 4
                    }, {
                        name: 'organization',
                        score: 6
                    }, {
                        name: 'voice',
                        score: 8
                    }, {
                        name: 'word choice',
                        score: 10
                    }, {
                        name: 'sentence fluency',
                        score: 8
                    }, {
                        name: 'conventions',
                        score: 6
                    }
                    
                ]
            }, {
                unit_index:3,
                rubric_scores: [
                    {
                        name: 'ideas',
                        score: 6
                    }, {
                        name: 'organization',
                        score: 8
                    }, {
                        name: 'voice',
                        score: 10
                    }, {
                        name: 'word choice',
                        score: 8
                    }, {
                        name: 'sentence fluency',
                        score: 6
                    }, {
                        name: 'conventions',
                        score: 4
                    }
                    
                ]
            }, {
                unit_index:4,
                rubric_scores: [
                    {
                        name: 'ideas',
                        score: 8
                    }, {
                        name: 'organization',
                        score: 10
                    }, {
                        name: 'voice',
                        score: 10
                    }, {
                        name: 'word choice',
                        score: 10
                    }, {
                        name: 'sentence fluency',
                        score: 8
                    }, {
                        name: 'conventions',
                        score: 8
                    }
                    
                ]
            }, {
                unit_index:5,
                rubric_scores: [
                    {
                        name: 'ideas',
                        score: 2
                    }, {
                        name: 'organization',
                        score: 2
                    }, {
                        name: 'voice',
                        score: 2
                    }, {
                        name: 'word choice',
                        score: 8
                    }, {
                        name: 'sentence fluency',
                        score: 6
                    }, {
                        name: 'conventions',
                        score: 10
                    }
                    
                ]
            }
        ],
        reportByUnit: {
            selectUnitInfo: {
                unit_index: 0
            }
        },
        hexagonChartData: [
            {
                target: 'organization',
                data: [
                    {
                        name: 'organization',
                        value: 0,
                        selectName: '',
                        fillColor: '#f6914d',
                        fillBorderColor: '#ee711e',
                        tooltip: {
                            title: 'organization',
                            content: 'The narrative has a clear topic and purpose that is well- focused. All the details are well-developed, interesting, and important to the narrative.'
                        }
                    }
                ],
                addWidth: 40,
                fitText: 40,
                toolLineColor: '#ee711e'
            },
            {
                target: 'voice',
                data: [
                    {
                        name: 'voice',
                        value: 0,
                        selectName: '',
                        fillColor: '#aa6bd4',
                        fillBorderColor: '#863fb5',
                        tooltip: {
                            title: 'voice',
                            content: 'The narrative has a clear topic and purpose that is well- focused. All the details are well-developed, interesting, and important to the narrative.'
                        }
                    }
                ],
                addWidth: 10,
                fitText: 14,
                toolLineColor: '#863fb5'
            },
            {
                target: 'conventions',
                data: [
                    {
                        name: 'conventions',
                        value: 0,
                        selectName: '',
                        fillColor: '#db5757',
                        fillBorderColor: '#be1f1f',
                        tooltip: {
                            title: 'conventions',
                            content: 'The narrative has a clear topic and purpose that is well- focused. All the details are well-developed, interesting, and important to the narrative.'
                        }
        
                    }
                ],
                addWidth: 100,
                fitText: 40,
                toolLineColor: '#be1f1f',
            },
            {
                target: 'sentence fluency',
                data: [
                    {
                        name: 'sentence fluency',
                        value: 0,
                        selectName: '',
                        fillColor: '#6865cc',
                        fillBorderColor: '#433fa7',
                        tooltip: {
                            title: 'sentence fluency',
                            content: 'The narrative has a clear topic and purpose that is well- focused. All the details are well-developed, interesting, and important to the narrative.'
                        }
                    }
                ],
                addWidth: 55,
                fitText: 55,
                toolLineColor: '#433fa7'
            },
            {
                target: 'word choice',
                data: [
                    {
                        name: 'word choice',
                        value: 0,
                        selectName: '',
                        fillColor: '#30c194',
                        fillBorderColor: '#12986f',
                        tooltip: {
                            title: 'word choice',
                            content: 'The narrative has a clear topic and purpose that is well- focused. All the details are well-developed, interesting, and important to the narrative.'
                        }
                    }
                ],
                addWidth: 40,
                fitText: 40,
                toolLineColor: '#12986f'
            },
            {
                target: 'ideas',
                data: [
                    {
                        name: 'ideas',
                        value: 0,
                        selectName: '',
                        fillColor: '#588ee1',
                        fillBorderColor: '#1f61c8',
                        tooltip: {
                            title: 'ideas',
                            content: 'The narrative has a clear topic and purpose that is well- focused. All the details are well-developed, interesting, and important to the narrative.'
                        }
                    }
                ],
                addWidth: 10,
                fitText: 14,
                toolLineColor: '#1f61c8'
            },
        ]
    },
    setUnitRubricScoresData: (data, unit_idx) => {
        // total unit count: default 5
        const unitCount = data.length;
        // each rubric max score
        const maxScore = 10*unitCount;
        const rubricNames = ['ideas','organization','voice','word choice','sentence fluency','conventions']
        let rubric_total_scores = Array.from({length:6}, () => 0);
        const updateTargetData = get().unitRubricScoresData;
        
        for (let i =0; i < unitCount; i++) {
            const rubricScoresDataByUnit = data[i].rubric_scores;
            // hexagonChartData by Unit
            if (i+1 === unit_idx) {
                updateTargetData.reportByUnit.selectUnitInfo.unit_index = unit_idx;
                for (let z = 0; z < rubricScoresDataByUnit.length; z++) {
                    const currentRubricName = rubricScoresDataByUnit[z].name;
                    for (let hexaIdx = 0; hexaIdx < updateTargetData.hexagonChartData.length; hexaIdx++) {
                        const hexaRubricName = updateTargetData.hexagonChartData[hexaIdx].target;
                        if (currentRubricName === hexaRubricName) {
                            const targetValue = ((rubricScoresDataByUnit[z].score/10)*100).toFixed(1);
                            updateTargetData.hexagonChartData[hexaIdx].data[0].value = parseFloat(targetValue);
                        }
                    }
                }
            }
            
            // rubric for loop
            for (let j = 0; j < rubricScoresDataByUnit.length; j++) {
                const currentRubricData = rubricScoresDataByUnit[j];
                if (currentRubricData.name===rubricNames[j]) {
                    rubric_total_scores[j]+=currentRubricData.score;
                }
            }
        };
        rubric_total_scores=rubric_total_scores.map((originRubricScore, originRubricIndex ) => {
            console.log('score [',originRubricIndex,']=',originRubricScore/maxScore)
            const percentScore = ((originRubricScore/maxScore)*100).toFixed(1);
            console.log('round =',percentScore)
            const returnScore = parseFloat(percentScore);

            updateTargetData.barChartData[originRubricIndex].score = returnScore;
            return returnScore;
        });
        console.log('each rubric scores by percent =',rubric_total_scores)
        const total_score = rubric_total_scores.reduce((a,b) => (a+b));
        const average_totla = total_score/rubricNames.length;
        const average_score = parseFloat(average_totla.toFixed(1));
        console.log('total average score =',total_score,' aver =',average_score)
        updateTargetData.averageChartData.dataPayload.data[0].value = average_score;
        console.log('result ==',updateTargetData)

        set(()=>({
           unitRubricScoresData: updateTargetData 
        }))
    }

}))

export default useControlAlertStore;