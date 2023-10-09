import React from 'react';
import useNavStore from '../../store/useNavStore';
import useEssayWritingCenterDTStore from '../../store/useEssayWritingCenterDTStore'
import useSparkWritingStore from '../../store/useSparkWritingStore';
import {CommonFunctions} from '../../util/common/commonFunctions'
import { useNavigate } from 'react-router-dom';
import useLoginStore from '../../store/useLoginStore';
import { SvgIconCheck } from '../../util/svgs/svgCheck';
import { CircleIcon, NoEntryCircleIcon, SavedCircleIcon, CompleteCircleIcon, ReLearningCircleIcon } from '../../util/svgs/heroIcons/CircleIcon';
import SmallHead from '../../components/commonComponents/SmallHeadComponent/SmallHead';
import { commonIconSvgs } from '../../util/svgs/commonIconsSvg';
import { callUnitInfobyStudent, getReportsAPI } from './api/EssayWriting.api';
import useControlAlertStore from '../../store/useControlAlertStore';
import { useComponentWillMount } from '../../hooks/useEffectOnce';
import UnitReportModalComponent from '../../components/toggleModalComponents/UnitReportModalComponent';

export default function SelectUnit () {
    const navigate = useNavigate();
    const {role, userInfo} = useLoginStore();
    const {setTopNavHiddenFlagged, setSubNavTitleString, setSubRightNavTitleString, setSelectUnitInfo, secondGenerationOpen} = useNavStore()
    const { proceedingTopicIndex, completeTopicIndex, setCompleteTopicIndex, setInitCompleteTopicIndex} = useEssayWritingCenterDTStore();
    const {sparkWritingData, sparkWritingBookName,setSparkWritingDataFromAPI} = useSparkWritingStore();
    const {
        setCommonStandbyScreen,
        // report modal
        reportAPIData, setReportAPIData,
        setSelectReportData,
        reportSelectFinder, setReportSelectedFinder,
        reportSelectUnit, setReportSelectUnit,
        reportSelectBookName,

        setUnitReportModal,
        // test
        unitReportsData, unitReportData, unitRubricScoresData, reportModalRubricData
        ,reportSelectedOverallBarChart, reportSelectedOverallPieChart
    } = useControlAlertStore();

    React.useEffect(()=>{
        setSubNavTitleString('Spark Writing')
        setSubRightNavTitleString('');
        setCompleteTopicIndex(proceedingTopicIndex,1)
        return () => {
            setSubNavTitleString('');
        }
    },[
        setTopNavHiddenFlagged,
        setSubNavTitleString,
        setSubRightNavTitleString,
        proceedingTopicIndex,
        setCompleteTopicIndex,
        sparkWritingData
    ])
    const beforeRenderedFn = async () => {
        setCommonStandbyScreen({openFlag:true})
        const allUnitsDataFromAPI = await callUnitInfobyStudent(userInfo.userCode, userInfo.courseName, userInfo.accessToken).then((response) => {
            
            
            
            return response;
        });

        // report
        const student_code = userInfo.userCode;
        
        const getReportAll = await getReportsAPI(student_code, userInfo.accessToken);
        if (getReportAll && allUnitsDataFromAPI) {
            console.log('getReportAll ==',getReportAll)
            let dumyFinderData = {label:'init', level:userInfo.courseName, semester:userInfo.semester, year:userInfo.year};
            dumyFinderData.level = userInfo.courseName;
            setReportSelectedFinder(dumyFinderData);
            setReportAPIData(getReportAll);
            setSparkWritingDataFromAPI(allUnitsDataFromAPI.units, allUnitsDataFromAPI.book_name)
            console.log('userInfo ==',userInfo)
            setSelectReportData(getReportAll,userInfo.year,userInfo.semester,userInfo.courseName);
            test(getReportAll,userInfo.year,userInfo.semester,userInfo.courseName);
            // setReportSelectUnit(1)
        }
    }
    useComponentWillMount(async ()=>{
        await beforeRenderedFn().then(()=>{
            
            setCommonStandbyScreen({openFlag:false})
        });
    })
    

    const reportOpen = async (data:TSparkWritingData) => {
        const student_code = userInfo.userCode;
        const getAllReport = await getReportsAPI(student_code,userInfo.accessToken);
        if (getAllReport) {
            const reportByYears = getAllReport.periods;
            for (let i = 0; i < reportByYears.length; i++) {
                
            }
        }
    }
    const test = (data:TReportByStudentResponse,
        year:number,
        semester:number,
        level:string ) => {
        let dumyData:TReportByStudentPeriodLevel= {
            book_name:'', level_name:'', rubric_info:[], overall_report:[], unit_reports: []
        }

        let rubricScoreDataStates:TUnitScoreData = JSON.parse(JSON.stringify(unitRubricScoresData));
        let dumyUnitReportsData:TUnitReportsData[] = JSON.parse(JSON.stringify(unitReportsData));
        let dumySelectReportRubricAllData: TRubricInfo[] = JSON.parse(JSON.stringify(reportModalRubricData));
        let dumyOverallBar:TOverallBarChartDataItem[] = JSON.parse(JSON.stringify(reportSelectedOverallBarChart));
        let dumyOverallPie:TAllDoughnutDatas = JSON.parse(JSON.stringify(reportSelectedOverallPieChart));

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

        
        const categoryNames = ['ideas', 'organization', 'voice','word choice','sentence fluency', 'conventions'];
        let sumData = [
            {name:'conventions', sum: 0},
            {name:'sentence fluency', sum: 0},
            {name:'word choice', sum: 0},
            {name:'voice', sum: 0},
            {name:'organization', sum: 0},
            {name:'ideas', sum: 0},
        ]
        for (let z = 0; z < dumyData.overall_report.length; z++) {
            const targetOverall = dumyData.overall_report[z];
            const targetUnitIdx = targetOverall.unit_index;
            const targetCate = targetOverall.categories;

            for (let k = 0; k < targetCate.length; k++) {
                const targetCateName = targetCate[k].category;
                const targetScore = targetCate[k].score;
                for (let j = 0; j < rubricScoreDataStates.hexagonChartData.length; j++) {
                    if (rubricScoreDataStates.hexagonChartData[j].target === targetCateName) {
                        rubricScoreDataStates.hexagonChartData[j].data[0].tooltip.content = targetCate[k].description
                    }
                }
                for (let s = 0; s < sumData.length; s++) {
                    if (sumData[s].name === targetCateName) {
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
        
        console.log('dumyData =',dumyData)
        const completeUnitCount = dumyData.overall_report.length;
        console.log('unit count ==',completeUnitCount)
        // set pie data
        for (let p = 0; p < dumyOverallPie.length; p++) {
            const currentPie = dumyOverallPie[p];
            for (let s = 0; s < sumData.length; s++) {
                if (sumData[s].name === currentPie.target) {
                    const maxScore = completeUnitCount*10;
                    const percent = sumData[s].sum / maxScore * 100;
                    console.log('percent ==',percent)
                    dumyOverallPie[p].data[0].value = percent;
                }
            }
        }
        console.log('dumyOverallPie ==',dumyOverallPie)
    }

    const SelectBoxUnitMapLoop = (props: {items:TSparkWritingDatas}) => {

        const selectWritingTopic = async (unitNum:string, unitTitle:string, draftNum: string ) => {
            console.log('unitNum: ',unitTitle)
            setSelectUnitInfo(`Unit ${unitNum}.`,unitTitle)
            const path = `WritingClinic/SparkWriting/${unitNum}/${draftNum}`
            CommonFunctions.goLink(path, navigate, role);
        }
        const selectTemporaryPreview = async (unitNum:string, draftNum: string) => {
            const path = `WritingClinic/SparkWriting/${unitNum}/${draftNum}/Preview`
            CommonFunctions.goLink(path, navigate, role)
        }
        const selectPreview = async (unitNum:string, draftNum: string) => {
            const path = `WritingClinic/SparkWriting/${unitNum}/${draftNum}/Preview/submit`
            CommonFunctions.goLink(path, navigate, role)
        }
        const draftIcons = (firstProgress:number, secondProgress:number, currentStep:number) => {
            const currentlyInProgress = currentStep===1 ? (
                secondProgress===0 ? (
                    firstProgress!==4 ? true : false
                ):false
            ):(
                firstProgress===4 ? (
                    secondProgress===4 ? false:true
                ): false
            )
            const progress = currentStep===1? firstProgress: (
                firstProgress===4 ? secondProgress : -1
            )

            if (progress === 0) {
                return  <CircleIcon className={currentlyInProgress ? 'draft-icon-in-progress' : 'draft-icon-not-progress'} />
            } else if (progress === 1) {
                return <SavedCircleIcon className={currentlyInProgress ? 'draft-icon-in-progress' : 'draft-icon-not-progress'} />
            } else if (progress >1 && progress < 5) {
                //  2, 3, 4
                return <CompleteCircleIcon className={currentlyInProgress ? 'draft-icon-in-progress' : 'draft-icon-not-progress'} />
            } else if (progress === 5) {
                return <ReLearningCircleIcon className={currentlyInProgress ? 'draft-icon-in-progress' : 'draft-icon-not-progress'} />
            } else {
                // -1
                return <NoEntryCircleIcon className={currentlyInProgress ? 'draft-icon-in-progress' : 'draft-icon-not-progress'} />
            }
        }
        
        return (
            <div className="flex flex-col bg-[#fff] h-[445px] max-w-[1010px] px-[25px] pb-[35px] pt-[23px] rounded-[24px]">
                <div className='select-a-unit-to-begin select-none'>{'* Select a unit to begin.'}</div>
                <div className='select-unit-div'>
                {props.items.map((item:TSparkWritingData, topicsIndex:number)=>{
                                
                    // 각 회차별 
                    // 0: 진입 가능&진입불가, 
                    // 1: 임시 저장, 
                    // 2: 완료(admin draft 입수/진행중)
                    // 3: 완료(admin draft 진행중/임시저장)
                    // 4: 완료(admin feedback 완료)
                    // 5: 재학습 필요
                    // 1: 1st 시작, 2nd는 1st의 피드백이 있을때
                    const selectUnitIndex = item.unit_index.toString();
                    const selectUnitMainTitle = `Unit ${item.unit_index}`
                    const selectUnitSubTitle = item.topic;
                    
                    const firstDraft = item.draft_1_status.status
                    const secondDraft = item.draft_2_status.status
                    const firstFeedback = firstDraft===4 ? true : false;
                    const secondFeedback = secondDraft===4 ? true : false;
                    
                    return (
                        
                    <div key={topicsIndex} 
                    className={`select-none select-writing-topic-item-button group/unit`}
                    onClick={async ()=>{
                        
                        if ( !firstFeedback && !secondFeedback ) {
                            // 1차 진입 가능
                            if (firstDraft === 0) {
                                // 1차 진행 -> 편집 가능
                                await selectWritingTopic(selectUnitIndex, selectUnitSubTitle, '1');
                            } else if (firstDraft === 1) {
                                // 1차 임시저장 -> 편집 가능
                                await selectTemporaryPreview(selectUnitIndex, '1');
                            } else if (firstDraft === 2|| firstDraft === 3) {
                                // 1차 완료(submit) -> 편집 x, 뷰잉만
                                await selectPreview(selectUnitIndex, '1')
                            } else if (firstDraft === 5) {
                                // 1차 재학습 -> 편집 가능
                                await selectWritingTopic(selectUnitIndex, selectUnitSubTitle, '1');
                            } else if (firstDraft === 4) {
                                // 2차 진입 가능
                            }
    
                        } else if (firstFeedback && !secondFeedback) {
                            // 2차 진입 가능
                            if (secondDraft === 0) {
                                // 2차 진행 -> 편집 가능
                                await selectWritingTopic(selectUnitIndex, selectUnitSubTitle, '2');
                            } else if (secondDraft === 1) {
                                // 2차 임시저장 -> 편집 가능
                                await selectWritingTopic(selectUnitIndex, selectUnitSubTitle, '2');
                            } else if (secondDraft === 2 || secondDraft === 3) {
                                // 2차 완료(submit) -> 편집 x, 뷰잉만
                            } else if (secondDraft === 5) {
                                // 2차 재학습 -> 편집 가능
                                await selectWritingTopic(selectUnitIndex, selectUnitSubTitle, '2');
                            } else if (secondDraft === 4) {
                                // -> final
                            }
                        } else if (firstFeedback && secondFeedback) {
                            // 100% -> final feedback
                            // open modal
                            setReportSelectUnit(item.unit_index)
                            setUnitReportModal({open:true})
                        }
                    }}
                    >
                        <div className='unit-select-button-item'>
                            <div className='unit-select-button-item-unit group-hover/unit:bg-[#21c39a]'>
                                {selectUnitMainTitle}
                            </div>
                            <div className='unit-select-button-item-title group-hover/unit:text-[#21c39a]'>{selectUnitSubTitle}</div>
                        
                            {(firstDraft !== 4 || secondDraft !== 4) && (
                                <div className='unit-select-button-item-drafts z-0 mt-[36px]'>
                                    <div className='flex unit-select-button-item-dotted z-0'></div>
                                    <div className='flex flex-row z-10 relative items-center'><span>{
                                        draftIcons(firstDraft, secondDraft, 1)
                                    }</span><span className='ordinal pl-[6px]'>{'1st'}</span>{' Draft'}</div>
                                    <div className='flex flex-row z-10 relative mt-[22px] items-center'><span>{
                                        draftIcons(firstDraft, secondDraft, 2)
                                    }</span><span className='ordinal pl-[6px]'>{'2nd'}</span>{' Draft'}</div>
                                </div>
                            )}
                            {(firstDraft === 4 && secondDraft === 4) && (
                                <div className='unit-select-button-item-drafts z-0 mt-[36px] relative'>
                                    <div className='flex unit-select-button-item-dotted z-0'></div>
                                    <div className='flex flex-row z-10 relative items-center'><span>{
                                        draftIcons(firstDraft, secondDraft, 1)
                                    }</span><span className='ordinal pl-[6px]'>{'1st'}</span>{' Draft'}</div>
                                    <div className='flex flex-row z-10 relative mt-[22px] items-center'><span>{
                                        draftIcons(firstDraft, secondDraft, 2)
                                    }</span><span className='ordinal pl-[6px]'>{'2nd'}</span>{' Draft'}</div>
                                    <div className='absolute w-[150px] h-[140px] top-0 left-0 rounded-[22px] bg-[#000] opacity-[0.7] z-20'>
                                    </div>
                                    <div className='unit-complete-report-icon'></div>
                                </div>
                            )}
                        {(firstDraft === 4 && secondDraft === 4) && (
                            <div className='unit-complete-flower-icon'></div>
                        )}
                        </div>
                        {/* <span className='absolute top-0 right-0'>{(firstDraft && secondFeedback) ? SvgIconCheck: ''}</span> */}
                    </div>
                    )
                    
                })}
                </div>
            </div>
        )
    }
    
    return (
        <section className='section-common-layout use-nav-aside'>
            {/* page inline header */}
            <SmallHead mainTitle='Writing Activity' subTitle='Spark Writing'/>
            <div className='flex flex-1 flex-col w-full h-full px-[25px] pb-[25px]'>
            
                {/* page titles */}
                <div className='flex flex-col font-bold w-full justify-start pt-[93.4px] text-black h-1/5'>
                    <div className='writing-activity-page-title-div'>
                        <div className='writing-activity-page-title-icon'>
                            <commonIconSvgs.SparkWritingTitleBookIcon/>
                        </div>
                        <span className='writing-activity-page-title-text select-none' >{sparkWritingBookName}</span>
                    </div>
                </div>
                {/* buttons */}
                {/* <div className="flex max-md:flex-col md:flex-row px-12 max-md:mt-[10vhd] md:pt-4 gap-8 w-full justify-center text-center align-middle"> */}
                    <SelectBoxUnitMapLoop items={sparkWritingData} />
                {/* </div> */}
            </div>
            <UnitReportModalComponent />
        </section>
    )
}
