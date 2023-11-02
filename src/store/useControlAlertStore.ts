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
    initializeUnitReportModal: {
        open: false,
        unitTitle: '',
        report: {
            is_completed:false,
            word_counts:[],
            grammar_correction: {
                grammar:{
                    sentences:[],
                    sentences_count:0
                },
                punctuation:{
                    sentences:[],
                    sentences_count:0
                },
                spelling:{
                    sentences:[],
                    sentences_count:0
                }
            },
            teacher_comments: [],
            rubric: {
                overall_score:0,
                categories: []
            },
            completion_date: [],
            portfolio: []
        },
        overallData: {
            units: []
        }
    },
    unitReportModal: {
        open: false,
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
              name: "ideas",
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
                categories: [
                    {
                        category: 'ideas',
                        score: 0,
                        description: ''
                    }, {
                        category: 'organization',
                        score: 0,
                        description: ''
                    }, {
                        category: 'voice',
                        score: 0,
                        description: ''
                    }, {
                        category: 'word choice',
                        score: 0,
                        description: ''
                    }, {
                        category: 'sentence fluency',
                        score: 0,
                        description: ''
                    }, {
                        category: 'conventions',
                        score: 0,
                        description: ''
                    },
                ]
            }, {
                unit_index:2,
                categories: [
                    {
                        category: 'ideas',
                        score: 0,
                        description: ''
                    }, {
                        category: 'organization',
                        score: 0,
                        description: ''
                    }, {
                        category: 'voice',
                        score: 0,
                        description: ''
                    }, {
                        category: 'word choice',
                        score: 0,
                        description: ''
                    }, {
                        category: 'sentence fluency',
                        score: 0,
                        description: ''
                    }, {
                        category: 'conventions',
                        score: 0,
                        description: ''
                    },
                ]
            }, {
                unit_index:3,
                categories: [
                    {
                        category: 'ideas',
                        score: 0,
                        description: ''
                    }, {
                        category: 'organization',
                        score: 0,
                        description: ''
                    }, {
                        category: 'voice',
                        score: 0,
                        description: ''
                    }, {
                        category: 'word choice',
                        score: 0,
                        description: ''
                    }, {
                        category: 'sentence fluency',
                        score: 0,
                        description: ''
                    }, {
                        category: 'conventions',
                        score: 0,
                        description: ''
                    },
                ]
            }, {
                unit_index:4,
                categories: [
                    {
                        category: 'ideas',
                        score: 0,
                        description: ''
                    }, {
                        category: 'organization',
                        score: 0,
                        description: ''
                    }, {
                        category: 'voice',
                        score: 0,
                        description: ''
                    }, {
                        category: 'word choice',
                        score: 0,
                        description: ''
                    }, {
                        category: 'sentence fluency',
                        score: 0,
                        description: ''
                    }, {
                        category: 'conventions',
                        score: 0,
                        description: ''
                    },
                ]
            }, {
                unit_index:5,
                categories: [
                    {
                        category: 'ideas',
                        score: 0,
                        description: ''
                    }, {
                        category: 'organization',
                        score: 0,
                        description: ''
                    }, {
                        category: 'voice',
                        score: 0,
                        description: ''
                    }, {
                        category: 'word choice',
                        score: 0,
                        description: ''
                    }, {
                        category: 'sentence fluency',
                        score: 0,
                        description: ''
                    }, {
                        category: 'conventions',
                        score: 0,
                        description: ''
                    },
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
                        },
                        circleBaseLineColor: '#fcddc8'
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
                        },
                        circleBaseLineColor: '#E5D1F1'
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
                        },
                        circleBaseLineColor: '#F4CBCB'
        
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
                        },
                        circleBaseLineColor: '#E2E1FD'
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
                        },
                        circleBaseLineColor: '#DCF4EC'
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
                        },
                        circleBaseLineColor: '#C5DBFC'
                    }
                ],
                addWidth: 10,
                fitText: 14,
                toolLineColor: '#1f61c8'
            },
        ]
    },
    setUnitRubricScoresData: (data, unit_idx) => {
        console.log('=== setUnitRubricScoresData ===')
        const originData = data.units
        // total unit count: default 5
        const unitCount = originData.length;
        // each rubric max score
        const maxScore = 10*unitCount;
        const rubricNames = ['ideas','organization','voice','word choice','sentence fluency','conventions']
        let rubric_total_scores = Array.from({length:6}, () => 0);
        const updateTargetData = get().unitRubricScoresData;
        console.log('updateTargetData =',updateTargetData)
        for (let i =0; i < unitCount; i++) {
            const rubricScoresDataByUnit = originData[i].categories;
            // hexagonChartData by Unit
            if (i+1 === unit_idx) {
                updateTargetData.reportByUnit.selectUnitInfo.unit_index = unit_idx;
                for (let z = 0; z < rubricScoresDataByUnit.length; z++) {
                    const currentRubricName = rubricScoresDataByUnit[z].category;
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
                if (currentRubricData.category===rubricNames[j]) {
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
        }));
    },
    reportAPIData: {
        periods: []
    },
    setReportAPIData: (data) => {
        set(()=>({reportAPIData:data}))
    },
    
    reportSelectedOverallBarChart: [
        {
          name: "ideas",
          target: "ideas",
          unit1: 0,
          unit2: 0,
          unit3: 0,
          unit4: 0,
          unit5: 0,
          amt: 10
        },
        {
          name: "organization",
          target: "organization",
          unit1: 0,
          unit2: 0,
          unit3: 0,
          unit4: 0,
          unit5: 0,
          amt: 10
        },
        {
          name: "voice",
          target: "voice",
          unit1: 0,
          unit2: 0,
          unit3: 0,
          unit4: 0,
          unit5: 0,
          amt: 10
        },
        {
          name: "word",
          target: "word choice",
          unit1: 0,
          unit2: 0,
          unit3: 0,
          unit4: 0,
          unit5: 0,
          amt: 10
        },
        {
          name: "sentence",
          target: "sentence fluency",
          unit1: 0,
          unit2: 0,
          unit3: 0,
          unit4: 0,
          unit5: 0,
          amt: 10
        },
        {
          name: "conventions",
          target: "conventions",
          unit1: 0,
          unit2: 0,
          unit3: 0,
          unit4: 0,
          unit5: 0,
          amt: 10
        },
    ],
    reportSelectedOverallPieChart: [
        {
            target: 'conventions',
            data: [
                {
                    name: 'conventions',
                    value: 0,
                    selectName: '',
                    fillColor: '#db5757',
                    fillBorderColor: '#be1f1f'
                }
            ],
            addWidth: 40,
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
                    fillBorderColor: '#433fa7'
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
                    fillBorderColor: '#12986f'
                }
            ],
            addWidth: 40,
            fitText: 40,
            toolLineColor: '#12986f'
        },
        {
            target: 'voice',
            data: [
                {
                    name: 'voice',
                    value: 0,
                    selectName: '',
                    fillColor: '#aa6bd4',
                    fillBorderColor: '#863fb5'
                }
            ],
            addWidth: 10,
            fitText: 14,
            toolLineColor: '#863fb5'
        },
        {
            target: 'organization',
            data: [
                {
                    name: 'organization',
                    value: 0,
                    selectName: '',
                    fillColor: '#f6914d',
                    fillBorderColor: '#ee711e'
                }
            ],
            addWidth: 40,
            fitText: 40,
            toolLineColor: '#ee711e'
        },
        {
            target: 'ideas',
            data: [
                {
                    name: 'ideas',
                    value: 0,
                    selectName: '',
                    fillColor: '#588ee1',
                    fillBorderColor: '#1f61c8'
                }
            ],
            addWidth: 10,
            fitText: 14,
            toolLineColor: '#1f61c8'
        },
    ],
    reportSelectData: {
        book_name:'', level_name:'', rubric_info:[], overall_report:[], unit_reports: [], class_name:''
    },
    setSelectReportData: (data, year, semester, level) => {
        console.log('===setSelectReportData==727')
        // find data
        let dumyData:TReportByStudentPeriodLevel= {
            book_name:'', level_name:'', rubric_info:[], overall_report:[], unit_reports: [], class_name:''
        }

        let rubricScoreDataStates:TUnitScoreData = JSON.parse(JSON.stringify(get().unitRubricScoresData));
        let dumyUnitReportsData:TUnitReportsData[] = JSON.parse(JSON.stringify(get().unitReportsData));
        let dumySelectReportRubricAllData: TRubricInfo[] = JSON.parse(JSON.stringify(get().reportModalRubricData));
        let dumyOverallBar:TOverallBarChartDataItem[] = JSON.parse(JSON.stringify(get().reportSelectedOverallBarChart));
        let dumyOverallPie:TAllDoughnutDatas = JSON.parse(JSON.stringify(get().reportSelectedOverallPieChart));

        // dumyOverallPie data check
        dumyOverallPie = dumyOverallPie.map((item)=>{
            const checkValue = item.data[0].value;
            if (checkValue!== 0) {
                item.data[0].value = 0
            }
            return item;
        })

        for (let i = 0; i < data.periods.length; i++) {
            const currentPeriod = data.periods[i];
            console.log('currentPeriod ==',currentPeriod)
            // find year & semester
            if (currentPeriod.year === year && currentPeriod.semester === semester) {
                for (let j = 0; j < currentPeriod.levels.length; j++) {
                    // find level
                    const currentData = currentPeriod.levels[j];
                    if (currentData.level_name === level) {
                        dumyData = currentData;
                        
                        dumySelectReportRubricAllData = currentData.rubric_info;
                        dumyUnitReportsData = currentData.unit_reports;
                        break;
                    }
                }
            }
        }

        const scoreStringName = ['Excellent', 'Very Good', 'Good', 'fair','poor'];
        const categoryNames = ['ideas', 'organization', 'voice','word choice','sentence fluency', 'conventions'];
        let sumData = [
            {name:'conventions', sum: 0},
            {name:'sentence fluency', sum: 0},
            {name:'word choice', sum: 0},
            {name:'voice', sum: 0},
            {name:'organization', sum: 0},
            {name:'ideas', sum: 0},
        ]
        let unitCount = dumyData.overall_report.length;
        let reportCompletedUnitIndexArray:number[] = [];
        for (let z = 0; z < unitCount; z++) {
            const targetOverall = dumyData.overall_report[z];
            const targetUnitIdx = targetOverall.unit_index;
            const targetCate = targetOverall.categories;
            
            reportCompletedUnitIndexArray.push(targetUnitIdx);
            for (let k = 0; k < targetCate.length; k++) {
                const targetCateName = targetCate[k].category;
                const targetScore = targetCate[k].score;

                for (let s = 0; s < sumData.length; s++) {
                    if (sumData[s].name === targetCateName) {
                        console.log('targetCateName =',targetCateName)
                        console.log('sumData[',s,'].name =',sumData[s].name)
                        console.log('targetScore =',targetScore)
                        sumData[s].sum += targetScore;
                        break;
                    }
                }
                // set bar data
                for (let b = 0; b < dumyOverallBar.length; b++) {
                    const currentBarName = dumyOverallBar[b].target;
                    if (currentBarName === targetCateName) {
                        
                        if (targetUnitIdx === 1) {
                            dumyOverallBar[b].unit1 = targetScore;
                            break;
                        } else if (targetUnitIdx === 2) {
                            dumyOverallBar[b].unit2 = targetScore;
                            break;
                        } else if (targetUnitIdx === 3) {
                            dumyOverallBar[b].unit3 = targetScore;
                            break;
                        } else if (targetUnitIdx === 4) {
                            dumyOverallBar[b].unit4 = targetScore;
                            break;
                        } else if (targetUnitIdx === 5) {
                            dumyOverallBar[b].unit5 = targetScore;
                            break;
                        }
                    }
                } // end category bar data

            }
        }
        console.log('dumyOverallBar===',dumyOverallBar)
        console.log('sumData ==',sumData)
        console.log('unit count =',unitCount)
        // set pie data
        for (let p = 0; p < dumyOverallPie.length; p++) {
            const currentPie = dumyOverallPie[p];
            console.log('currentPie [',p,'] :',currentPie)
            for (let s = 0; s < sumData.length; s++) {
                if (sumData[s].name === currentPie.target) {
                    const maxScore = unitCount*10;
                    const percent = sumData[s].sum / maxScore * 100;
                    console.log('percent ==',percent)
                    dumyOverallPie[p].data[0].value = percent;
                }
            }
        }
        if (reportCompletedUnitIndexArray.length > 0) {
            reportCompletedUnitIndexArray.sort((a,b) => {return a-b});
        }
        set(()=>({
            reportSelectedOverallBarChart: dumyOverallBar,
            reportSelectedOverallPieChart: dumyOverallPie,
            reportModalRubricData: dumySelectReportRubricAllData,
            unitReportsData: dumyUnitReportsData,
            unitRubricScoresData: rubricScoreDataStates,
            reportSelectBookName: dumyData.book_name,
            reportSelectData:dumyData,
            reportCompletedUnitIndexArray,
        }))
    },
    reportSelectFinder: {
        label: '', level: '', semester: 0, year: 0
    },
    reportSelectBoxDatas: [],
    reportLevel:'',
    reportSemester:'',
    setReportSelectBoxValue: (data) => {
        const boxData = get().reportSelectBoxDatas;
        let dumpReportSelectFinder:TDropdownSelectBoxDataTypes = get().reportSelectFinder;
        console.log('=== setReportSelectBoxValue ====', data) 
        if (data.init) {
            dumpReportSelectFinder.label='';
            dumpReportSelectFinder.semester=0;
            dumpReportSelectFinder.level='';
            dumpReportSelectFinder.year=0;
            console.log('init ==',dumpReportSelectFinder)
            set(()=>({
                reportSelectFinder: dumpReportSelectFinder,
                reportSemester: '',
                reportLevel: '',
            }))
        } else {
            if (data.level) {
                let semester = '';
                if(get().reportSemester==='') {
                    if (data.level==='') {
                        semester='';
                        dumpReportSelectFinder={label:'',semester:0,level:'',year:0};
                    } else {
                        semester=dumpReportSelectFinder.label;
                        dumpReportSelectFinder.level=data.level;
                    }
                } else {
                    semester = get().reportSemester;
                }
                console.log('level!!===',semester, '\ndumpReportSelectFinder==',dumpReportSelectFinder)
                set(()=>({reportLevel: data.level, reportSemester: semester, reportSelectFinder:dumpReportSelectFinder}))
            } else if (data.semester) {
                let level = '';
                if (get().reportLevel === '') {
                    if (data.semester === '') {
                        level='';
                    } else {

                        for (let i = 0; i < boxData.length; i++) {
                            if (boxData[i].label === data.semester) {
                                level = boxData[i].level[0].name;
                                dumpReportSelectFinder.label=boxData[i].label;
                                dumpReportSelectFinder.semester=boxData[i].semester;
                                dumpReportSelectFinder.level=boxData[i].level[0].name;
                                dumpReportSelectFinder.year=boxData[i].year;
                                break;
                            }
                        }
                    }
                } else {
                    level = get().reportLevel;
                }
                console.log('semester ==',data, '\nlevel ==',level, '\ndumpReportSelectFinder==',dumpReportSelectFinder)
                set(()=>({reportSemester: data.semester, reportLevel: level, reportSelectFinder:dumpReportSelectFinder}))
            }
        }
    },
    setReportSelectBoxDatas: (data) => {
        set(()=>({reportSelectBoxDatas:data}))
    },
    reportCompletedUnitIndexArray: [],
    setReportSelectedFinder: (data) => {
        set(() => ({reportSelectFinder:data}))
    },
    reportByUnitMainTitle: '',
    reportSelectUnit: 1,
    setReportSelectUnit: (unit_index) => {
    console.log('setReportSelectUnit====962')
        const reportAPIData = get().reportAPIData;
        let dumpUnitReportData:TReportByStudent = JSON.parse(JSON.stringify(get().unitReportData));
        let rubricScoreDataStates:TUnitScoreData = JSON.parse(JSON.stringify(get().unitRubricScoresData));
        // console.log('=== setReportSelectUnit ====', reportAPIData)
        // console.log('dumpUnitReportData =',dumpUnitReportData)
        // console.log('rubricScoreDataStates =',rubricScoreDataStates)
        let updateCompleteDumpUnitReportData= 0;
        let updateCompleteRubricScoreDataStates=0;
        const modalRubric = get().reportModalRubricData;
        let title = '';
        for (let m = 0; m < modalRubric.length; m++) {
            if (modalRubric[m].unit_index === unit_index) {
                // const findTopic = modalRubric[m].rubric.name.split('_');
                const findTopic = modalRubric[m].rubric.name
                const topic = findTopic;
                title = `Unit ${unit_index}. ${topic}`;
            }
        }

        const findRubricDescription = (unit_index: number, category:string, score:number) => {
            const scoreName = ['Excellent', 'Very Good', 'Good', 'Fair','Poor']
            for (let m = 0; m < modalRubric.length; m++) {
                if (modalRubric[m].unit_index === unit_index) {
                    for (let n =0; n < modalRubric[m].rubric.rubric_description.length; n++) {
                        if (modalRubric[m].rubric.rubric_description[n].category === category) {
                            // console.log('Find Unit Rubric =',modalRubric[m].rubric.rubric_description[n])
                            if (score===10) {
                                return {
                                    title: scoreName[0],
                                    desc: modalRubric[m].rubric.rubric_description[n].excellent
                                }
                            } else if (score===8) {
                                return {
                                    title: scoreName[1],
                                    desc: modalRubric[m].rubric.rubric_description[n].very_good
                                }
                            } else if (score===6) {
                                return {
                                    title: scoreName[2],
                                    desc: modalRubric[m].rubric.rubric_description[n].good
                                }
                            } else if (score===4) {
                                return {
                                    title: scoreName[3],
                                    desc: modalRubric[m].rubric.rubric_description[n].fair
                                }
                            } else if (score===2) {
                                return {
                                    title: scoreName[4],
                                    desc: modalRubric[m].rubric.rubric_description[n].poor
                                }
                            }
                        }
                    }
                }
            }
        }

        
        const getUnitReports = get().unitReportsData;
        // console.log('getUnitReports =',getUnitReports)
        for (let i = 0; i < getUnitReports.length; i++) {
            const targetUnit = getUnitReports[i].unit_index;
            if (targetUnit === unit_index) {
                const targetUnitReport = getUnitReports[i].report;
                dumpUnitReportData=getUnitReports[i].report;
                updateCompleteDumpUnitReportData+=1;
                const rubricCategories = targetUnitReport.rubric.categories;
                for (let j = 0; j < rubricCategories.length; j++) {
                    const currentScore = rubricCategories[j].score * 10;

                    rubricScoreDataStates.barChartData = rubricScoreDataStates.barChartData.map((barItem) => {
                        if (rubricCategories[j].category === barItem.name) {
                            barItem.score = currentScore;
                        }
                        return barItem;
                    })
                    for (let k = 0; k < rubricScoreDataStates.hexagonChartData.length; k++) {
                        const hexaColumn = rubricScoreDataStates.hexagonChartData[k];
                        if (rubricCategories[j].category === hexaColumn.target) {
                            rubricScoreDataStates.hexagonChartData[k].data[0].value = currentScore;
                            const findDesc = findRubricDescription(unit_index, hexaColumn.target, rubricCategories[j].score);
                            if (findDesc) {
                                rubricScoreDataStates.hexagonChartData[k].data[0].tooltip.title = findDesc.title;
                                rubricScoreDataStates.hexagonChartData[k].data[0].tooltip.content = findDesc.desc;
                                updateCompleteRubricScoreDataStates+=1;
                            }
                            break;
                        }
                    }
                }; // set score percent
                break;
            }
        }
        
        set(()=>({
            reportSelectUnit: unit_index,
            unitRubricScoresData: rubricScoreDataStates,
            reportByUnitMainTitle: title,
            unitReportData: dumpUnitReportData,
        }))
        
    },
    reportModalRubricData: [],
    unitReportsData:[],
    unitReportData: {
        is_completed: false, word_counts: [], 
        grammar_correction: { 
            grammar: {sentences:[],sentences_count:0, corrections_count:0},
            punctuation: {sentences:[],sentences_count:0, corrections_count:0},
            spelling: {sentences:[],sentences_count:0, corrections_count:0}
        },
        teacher_comments: [],
        rubric: {
            overall_score: 0,
            categories: [],
        },
        completion_date: []
    },
    setUnitReportData: (data) => {
        console.log('setUnitReportData====1031')
        let rubricScoreDataStates:TUnitScoreData = JSON.parse(JSON.stringify(get().unitRubricScoresData));
        const allScoreData = data.rubric.categories;
        
        for (let i = 0; i < allScoreData.length; i++) {
            const currentScoreData = allScoreData[i];
            for (let j = 0; j < rubricScoreDataStates.barChartData.length; j++) {
                const rubricColumn = rubricScoreDataStates.barChartData[j];
                if (currentScoreData.category === rubricColumn.name) {
                    // rubricScoreDataStates.barChartData[j].score = currentScoreData.score*10;
                    break;
                }
            }
            for (let z = 0; z < rubricScoreDataStates.hexagonChartData.length; z++) {
                const hexaColumn = rubricScoreDataStates.hexagonChartData[z];
                if (currentScoreData.category === hexaColumn.target) {
                    // rubricScoreDataStates.hexagonChartData[z].data[0].value = currentScoreData.score*10;
                }
            }
        }
        set(()=>({unitReportData: data, unitRubricScoresData: rubricScoreDataStates}))
    },
    reportSelectBookName:'',
    forcedReadOnlyReportSelectBox: [false, false],
    setForcedReadOnlyReportSelectBox: (flags) => {
        set(()=>({forcedReadOnlyReportSelectBox:flags}))
    },
    // progress select box
    
    progressAllLevelsValue: [],
    progressLevelBoxValue: '',
    setProgressAllLevelBoxValues: (data) => {
        set(()=>({progressAllLevelsValue:data}))
    },
    setProgressLevelBoxValue: (level) => {
        set(()=>({progressLevelBoxValue:level}))
        
    },
}))

export default useControlAlertStore;