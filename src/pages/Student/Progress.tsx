import React from 'react';
import SmallHead from '../../components/commonComponents/SmallHeadComponent/SmallHead';
import { callUnitInfobyStudent, getReportsAPI } from './api/EssayWriting.api';
import useLoginStore from '../../store/useLoginStore';
import useNavStore from '../../store/useNavStore';
import { useComponentWillMount } from '../../hooks/useEffectOnce';
import useSparkWritingStore from '../../store/useSparkWritingStore';
import useProgressPageStore from '../../store/useProgressPageStore';
import { commonIconSvgs } from '../../util/svgs/commonIconsSvg';
import UnitReportModalComponent from '../../components/toggleModalComponents/UnitReportModalComponent';
import useControlAlertStore from '../../store/useControlAlertStore';
import { progressIcons } from '../../util/svgs/commonProgressIcons';
import ProgressTable from '../../components/pageComponents/progress/ProgressTables';
import SelectLabels from '../../components/pageComponents/progress/ProgressSelectButton';
import { logoutAPI } from './api/Login.api';

const Progress = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const {role, userInfo, device_id, isMobile, setMaintenanceData} = useLoginStore();
    const {secondGenerationOpen} = useNavStore();
    const {
        setCommonStandbyScreen,
        reportAPIData,
        setReportSelectBoxDatas,
        setReportSelectedFinder,
        setReportAPIData,
        setReportSelectBoxValue,
        setProgressAllLevelBoxValues,
        setProgressLevelBoxValue,
        progressLevelBoxValue,
        commonAlertOpen,
        commonAlertClose
    } = useControlAlertStore();
    const {
        setSparkWritingDataFromAPI, 
        sparkWritingBookName,
        sparkWritingData,
    } = useSparkWritingStore();
    const {
        // progressTabActiveIndex,
    } = useProgressPageStore();

    const logoutFn =async () => {
        logoutAPI(userInfo.userCode, device_id)
        if(isMobile)
            window.ReactNativeWebView.postMessage(JSON.stringify('logout'))
        else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
            (window as any).api.toElectron.send('clear')
        }
        window.location.reload()
    }

    const getReportsData = async () => {
        const student_code = userInfo.userCode;
        
        let getReportAll:TReportByStudentResponse = {periods:[]};
        if (reportAPIData.periods.length > 0) {
            getReportAll=reportAPIData;
        } else {
            const getAPIs = await getReportsAPI(student_code, userInfo.accessToken, userInfo.courseName).then((response) => {
                if (response.is_server_error) {
                    if (response.data) {
                        let maintenanceInfo:TMaintenanceInfo = response.data.maintenanceInfo;
                        maintenanceInfo.start_date = response.data.maintenanceInfo.start_date;
                        maintenanceInfo.end_date = response.data.maintenanceInfo.end_date;
                        let dumyMaintenanceData:TMaintenanceData = {
                            alertTitle: '시스템 점검 안내',
                            data: maintenanceInfo,
                            open: false,
                            type: ''
                        }
                        console.log('login maintenanceInfo =',dumyMaintenanceData)
                        setMaintenanceData(dumyMaintenanceData)
                    } else {
                        setCommonStandbyScreen({openFlag:false})
                        if (response.isDuplicateLogin) {
                            commonAlertOpen({
                                messages: ['중복 로그인으로 자동 로그아웃 처리 되었습니다.'],
                                priorityLevel: 2,
                                messageFontFamily:'NotoSansCJKKR',
                                useOneButton: true,
                                yesButtonLabel:'OK',
                                yesEvent: async() => {
                                    await logoutFn()
                                }
                            })
                        } else {
                            commonAlertOpen({
                                messages: [
                                    'Cannot connect to the server.',
                                    'Please try again later.'
                                ],
                                priorityLevel: 2,
                                useOneButton: true,
                                yesButtonLabel:'OK',
                                yesEvent: () => {
                                    commonAlertClose();
                                }
                            })
                        }
                    }
                    return false;
                } else {
                    return response.result;
                }
                
            });
            if (getAPIs) getReportAll = getAPIs;
        }
        
        if (getReportAll) {
            let dumpReportSelectBoxDatas:TReportPageSelectBoxDatas[]=getReportAll.periods.map((periodItem) => {
                
                const currentYearData = periodItem.year;
                const currentSemester = periodItem.semester===1? '1st': '2nd';
                const pushSemesterString = `${currentYearData} - ${currentSemester} Semester`;
                let dumpReportSelectBoxDataItem:TReportPageSelectBoxDatas = {
                    label: pushSemesterString, level: [], semester: periodItem.semester, year: currentYearData
                }
                dumpReportSelectBoxDataItem.level = periodItem.levels.map((item)=>{
                    return {name: item.level_name}
                })
                dumpReportSelectBoxDataItem.level = [
                    ...dumpReportSelectBoxDataItem.level.filter(d => d.name === userInfo.courseName),
                    ...dumpReportSelectBoxDataItem.level.filter(d => d.name !== userInfo.courseName)
                ]
                return dumpReportSelectBoxDataItem;
            });
            console.log('dumpReportSelectBoxDatas== ',dumpReportSelectBoxDatas)
            console.log('get report all =', getReportAll)
// 1
            let allLevels:string[] = [];
            
            for (let i = 0; getReportAll.periods.length; i++) {
                if (getReportAll.periods[i].year === userInfo.year && getReportAll.periods[i].semester === userInfo.semester) {
                    const target = getReportAll.periods[i].levels;
                    for (let j = 0; j < target.length; j++) {
                        allLevels.push(target[j].level_name);
                    };
                    break;
                };
            };
            allLevels = [
                ...allLevels.filter(d => d === userInfo.courseName),
                ...allLevels.filter(d => d !== userInfo.courseName)
            ]
            if (allLevels.length!==0) {
                setProgressLevelBoxValue(allLevels[0],userInfo, true)
            } else {
                setProgressLevelBoxValue('',userInfo, true);
            }
            setProgressAllLevelBoxValues(allLevels);
// 2


            let dumyFinderData = {label:'', level:'', semester:0, year:0};
            dumyFinderData.level = userInfo.courseName;
            setReportSelectBoxDatas(dumpReportSelectBoxDatas);
            setReportSelectedFinder(dumyFinderData);
            setReportAPIData(getReportAll);
            // setReportSelectBoxValue({data: {label:'', level:'', semester:0, year:0}, init:true})
            setCommonStandbyScreen({openFlag: false})
        }
    }
    
    const beforeRenderedFn = async () => {
        setCommonStandbyScreen({openFlag: true})
        return await callUnitInfobyStudent(userInfo.userCode, userInfo.courseName, userInfo.accessToken).then((response) => {
            if (response.data) {
                let maintenanceInfo:TMaintenanceInfo = response.data.maintenanceInfo;
                maintenanceInfo.start_date = response.data.maintenanceInfo.start_date;
                maintenanceInfo.end_date = response.data.maintenanceInfo.end_date;
                let dumyMaintenanceData:TMaintenanceData = {
                    alertTitle: '시스템 점검 안내',
                    data: maintenanceInfo,
                    open: false,
                    type: ''
                }
                setMaintenanceData(dumyMaintenanceData)
            } else {
                console.log('callUnitInfobyStudent ===',response)
                if (response.book_name!=='') {
                    setLoading(true)
                }
                setSparkWritingDataFromAPI(response.units, response.book_name)
                
                return response;
            }
        });
    }
    const findCallUnitInfobyStudent = async (studentCode: string,
        courseName: string,
        accessToken: string
    ) => {
        return await callUnitInfobyStudent(studentCode, courseName, accessToken).then((response) => {
            if (response.data) {
                let maintenanceInfo:TMaintenanceInfo = response.data.maintenanceInfo;
                maintenanceInfo.start_date = response.data.maintenanceInfo.start_date;
                maintenanceInfo.end_date = response.data.maintenanceInfo.end_date;
                let dumyMaintenanceData:TMaintenanceData = {
                    alertTitle: '시스템 점검 안내',
                    data: maintenanceInfo,
                    open: false,
                    type: ''
                }
                setMaintenanceData(dumyMaintenanceData)
            } else {
                console.log('callUnitInfobyStudent ===',response)
                if (response.book_name!=='') {
                    setLoading(true)
                }
                setSparkWritingDataFromAPI(response.units)
                
                return response;
            }
        });
    }
    useComponentWillMount(async()=>{
        
        await beforeRenderedFn();
        await getReportsData();
        
    })
    React.useEffect(()=>{
    },[])
    return (
        <section className="section-common-layout use-nav-aside" >
            <SmallHead mainTitle='Progress'/>
            <div className='flex flex-1 flex-col w-full h-fit px-[25px] pb-[25px]'>
            
                {/* page titles */}
                <div className='flex flex-row font-bold w-full justify-start mt-[128px] text-black h-[45px] mb-[15px]'>
                    <div className='writing-activity-page-title-div'>
                        <div className='writing-activity-page-title-icon'>
                            <commonIconSvgs.SparkWritingTitleBookIcon/>
                        </div>
                        <span className='writing-activity-page-title-text' >{sparkWritingBookName}</span>
                    </div>
                    <div className='flex flex-1 items-center justify-end'>
                        <SelectLabels/>
                    </div>
                </div>
                
                {/* progress view box */}
                    {/* <button onClick={()=>{
                        const unit_idx = 5
                        let unitTitle = '';
                        for (let i = 0; i < sparkWritingData.length;i++) {
                            const targetUnitIdx = sparkWritingData[i];
                            if (unit_idx === targetUnitIdx.unit_index) {
                                unitTitle = `Unit ${targetUnitIdx.unit_index}. ${targetUnitIdx.topic}`
                            }
                        }
                        setUnitRubricScoresData(dumyUnitRubricData, unit_idx);

                        setUnitReportModal({open:true, unitTitle})
                        
                    }}>test button</button> */}
                <div className={window.navigator.userAgent.toLowerCase().indexOf('electron') > -1 
                    ? 'progress-page-view-box-wrap-electron' 
                    :'progress-page-view-box-wrap'
                }>
                    {/* 2차 개발할 경우 사용 */}
                    {/* <div className='progress-page-view-box-header justify-end h-[45px] px-[20px] pt-[20px] pb-[5px]'>
                        <div className='row-div items-center pb-[5px] gap-[4px]'>
                            <progressIcons.CheckGreenCircleIcon className='flex w-[18px]'/>
                            <progressIcons.CheckBlueRectIcon className='flex w-[18px]'/>
                            <span style={{
                                width: 'fit-content',
                                height: '19px',
                                flexGrow: 0,
                                fontFamily: 'Roboto',
                                fontWeight: 400,
                                fontStretch: 'normal',
                                fontStyle: 'normal',
                                lineHeight: 'normal',
                                letterSpacing: 'normal',
                                textAlign: 'left',
                                color: '#888',
                            }} 
                            // className='roboto-regular text-[16px] text-[#888] text-left'
                            >{'터치 시, 완료 학습 및 Feedback을 확인할 수 있습니다.'}</span>
                        </div>
                    </div>
                    <div className='progress-page-view-box-content'>
                        <ProgressTable data={sparkWritingData}/>
                    </div> */}
                    {/* 1차 개발로 대체 사용 */}
                    <div className='progress-page-view-box-content rounded-t-[24px] border-t-[5px]'>
                        <ProgressTable data={sparkWritingData}/>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Progress;