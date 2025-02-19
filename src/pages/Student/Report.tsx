import React from 'react';
import useLoginStore from '../../store/useLoginStore';
import useControlAlertStore from '../../store/useControlAlertStore';
import { callUnitInfobyStudent, getReportsAPI } from './api/EssayWriting.api';
import { useComponentWillMount } from '../../hooks/useEffectOnce';
import SmallHead from '../../components/commonComponents/SmallHeadComponent/SmallHead';
import { commonIconSvgs } from '../../util/svgs/commonIconsSvg';
import ReportSelectButton from '../../components/pageComponents/report/ReportSelectButton';
import CustomizedReportTabs from '../../components/pageComponents/report/ReportTabComponent';
import useSparkWritingStore from '../../store/useSparkWritingStore';
import { logoutAPI } from './api/Login.api';
import { useNavigate } from 'react-router-dom';

const Report = () => {
    const navigate = useNavigate();
    // const [loading, setLoading] = React.useState<boolean>(false);

    const {userInfo, device_id,isMobile, setMaintenanceData} = useLoginStore();
    const {
        setCommonStandbyScreen,
        
        // api data
        reportAPIData, setReportAPIData,
        setSelectReportData,

        // selectFinder
        setReportSelectedFinder,
        reportSelectBoxDatas, setReportSelectBoxDatas,
        setReportSelectBoxValue,
        // select unit index
        setReportSelectUnit,
        reportSelectBookName,
        setForcedReadOnlyReportSelectBox,
        commonAlertOpen, commonAlertClose,
    } = useControlAlertStore();
    const {
        setSparkWritingDataFromAPI,
        sparkWritingBookName
    } = useSparkWritingStore();

    const logoutFn =async () => {
        logoutAPI(userInfo.userCode, device_id)
        if(isMobile)
            window.ReactNativeWebView.postMessage(JSON.stringify('logout'))
        else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
            (window as any).api.toElectron.send('clear')
        }
        window.location.reload()
    }
    
    

    const beforeRenderFn1 = async () => {
        console.log('=== beforeRenderFn1::check user ===')
        setCommonStandbyScreen({openFlag: true})
        return await callUnitInfobyStudent(userInfo.userCode, userInfo.courseName, userInfo.accessToken).then((response) => {
            if (response.is_server_error) {
                if (response.data) {
                    let maintenanceInfo:TMaintenanceInfo = response.data;
                    maintenanceInfo.start_date = response.data.start_date;
                    maintenanceInfo.end_date = response.data.end_date;
                    let dumyMaintenanceData:TMaintenanceData = {
                        alertTitle: '시스템 점검 안내',
                        data: maintenanceInfo,
                        open: false,
                        type: ''
                    }
                    setCommonStandbyScreen({openFlag:false})
                    setMaintenanceData(dumyMaintenanceData)
                    navigate('/')
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
                if (response.book_name!=='') {
                    // setLoading(true)
                }
                setSparkWritingDataFromAPI(response.units)
                
                return response;
            }
            
        });
    }

    const beforeRenderedFn = async () => {
        console.log('=== beforeRenderedFn ===')
        const student_code = userInfo.userCode;
        // setCommonStandbyScreen({openFlag: true})
        let getReportAll:TReportByStudentResponse = {periods:[]};
        if (reportAPIData.periods.length > 0) {
            getReportAll=reportAPIData;
        } else {
            const getAPIs = await getReportsAPI(student_code, userInfo.accessToken, userInfo.courseName).then((res) => {
                if (res.is_server_error) {
                    if (res.data) {
                        let maintenanceInfo:TMaintenanceInfo = res.data;
                        maintenanceInfo.start_date = res.data.start_date;
                        maintenanceInfo.end_date = res.data.end_date;
                        let dumyMaintenanceData:TMaintenanceData = {
                            alertTitle: '시스템 점검 안내',
                            data: maintenanceInfo,
                            open: false,
                            type: ''
                        }
                        console.log('login maintenanceInfo =',dumyMaintenanceData)
                        setCommonStandbyScreen({openFlag:false})
                        setMaintenanceData(dumyMaintenanceData)
                        navigate('/')
                    } else {
                        setCommonStandbyScreen({openFlag:false})
                        if (res.isDuplicateLogin) {
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
                    return res.result;
                }
                
            });
            if (getAPIs) getReportAll = getAPIs;
        }
        if (getReportAll) {
            let dumpReportSelectBoxDatas:TReportPageSelectBoxDatas[]=[];
            for (let i = 0; i < getReportAll.periods.length; i++) {
                
                // find year and semesters
                const currentReportAll = getReportAll.periods[i];
                // console.log('currentReportAll ==',currentReportAll)
                const currentYearData = currentReportAll.year;
                const currentSemester = currentReportAll.semester===1? '1st': '2nd';
                const pushSemesterString = `${currentYearData} - ${currentSemester} Semester`;
                let dumpBoxData:TReportPageSelectBoxDatas = {
                    label:pushSemesterString,
                    level:[],
                    semester:currentReportAll.semester,
                    year: currentYearData
                }
                for (let k = 0; k < currentReportAll.levels.length; k++) {
                    const levItem = {name: currentReportAll.levels[k].level_name}
                    dumpBoxData.level.push(levItem);
                }
                dumpBoxData.level = [
                    ...dumpBoxData.level.filter(d => d.name === userInfo.courseName),
                    ...dumpBoxData.level.filter(d => d.name !== userInfo.courseName)
                ]
                dumpReportSelectBoxDatas.push(dumpBoxData)
            };
            // console.log('dumpReportSelectBoxDatas1 ===',dumpReportSelectBoxDatas)
            // console.log('get report all =', getReportAll)
            let dumyFinderData = {label:'', level:'', semester:0, year:0};
            // console.log('userInfo ==',userInfo)

            // dropdown button default setting
            for await (const target of dumpReportSelectBoxDatas) {
                if ( target.year === userInfo.year && target.semester === userInfo.semester ) {
                    console.log('for await ::',target)
                    dumyFinderData.label = target.label;
                    dumyFinderData.year = target.year;
                    dumyFinderData.semester = target.semester;
                    dumyFinderData.level = userInfo.courseName;
                }
            }
            if (dumyFinderData.label !== '') {
                // console.log('dumyFinderData ===',dumyFinderData)
                // console.log('dumpReportSelectBoxDatas =',dumpReportSelectBoxDatas)
                // console.log('getReportAll =',getReportAll)
                setReportSelectBoxDatas(dumpReportSelectBoxDatas);
                setReportSelectedFinder(dumyFinderData);
                setReportAPIData(getReportAll);
                setReportSelectBoxValue({data: dumyFinderData, init:true, renderInit:true})
                setSelectReportData(getReportAll,dumyFinderData.year,dumyFinderData.semester,dumyFinderData.level)
            }
        }
    }
    useComponentWillMount(async()=>{
        // 화면 강제로 랜더링을 위한 사이클 중복 실행
        const set1 = await beforeRenderFn1().then(async ()=>{
            return await beforeRenderedFn().then(()=>{
                return true;
            })
        });
        if (set1) {
            setCommonStandbyScreen({openFlag: false})
        }
    })
    // dropdown button onChange Event
    const handleChange = React.useCallback((selectValue:string, data: TReportByStudentResponse, selectData:TDropdownSelectBoxDataTypes, isLevel:boolean , isInit?:boolean) => {
        console.log('=== handleChange ===')
        const setValue = (value:string, data:TDropdownSelectBoxDataTypes) => {
            if (value==='') {
                setReportSelectBoxValue({data, init:true})
              } else {
                if (isLevel) {
                  setReportSelectBoxValue({data,level:value})
                } else {
                  setReportSelectBoxValue({data,semester:value})
                }
              }
        }
        if (isInit) {
            console.log('init values')
            setValue(selectValue, selectData)
        } else {
            console.log('set values')
            for (let i = 0; i < reportAPIData.periods.length; i++) {
                const currentPeriod = reportAPIData.periods[i];
                if (currentPeriod.year === selectData.year && currentPeriod.semester === selectData.semester) {
                    for (let j = 0; j < currentPeriod.levels.length; j++) {
                        const currentLevelInPeriod = currentPeriod.levels[j];
                        if (currentLevelInPeriod.level_name === selectData.level) {
                            if (currentLevelInPeriod.overall_report.length > 0) {
                                const initializeUnitIndex = currentLevelInPeriod.overall_report[0].unit_index
                                setSelectReportData(data,selectData.year,selectData.semester,selectData.level)
                                setValue(selectValue, selectData)
                                console.log('1 === setReportSelectUnit')
                                setReportSelectUnit(initializeUnitIndex)
                            } else {
                                setSelectReportData(data,selectData.year,selectData.semester,selectData.level)
                                setValue(selectValue, selectData)
                                console.log('2 === setReportSelectUnit')
                                setReportSelectUnit(1)
                            }
                        }
                    }
                }
            }
        }
    },[reportAPIData, setReportSelectBoxValue, setReportSelectUnit, setSelectReportData])
    React.useEffect(()=>{
        if (reportSelectBoxDatas.length === 1) {
            console.log('reportSelectBoxDatas ===',reportSelectBoxDatas)
            handleChange(reportSelectBoxDatas[0].label, reportAPIData, {
                label: reportSelectBoxDatas[0].label,
                level: reportSelectBoxDatas[0].level[0].name,
                semester: reportSelectBoxDatas[0].semester,
                year: reportSelectBoxDatas[0].year
            }, false )
            setForcedReadOnlyReportSelectBox([true,true])
        } else if (reportSelectBoxDatas.length === 0) {
            setForcedReadOnlyReportSelectBox([true,true])
        }
    },[
        reportSelectBoxDatas, reportAPIData, setForcedReadOnlyReportSelectBox,
        handleChange,
    ])
    
    return (
        <section className="section-common-layout use-nav-aside min-w-[1060px] over" >
            <SmallHead mainTitle='Report'/>
            <div className='flex flex-1 flex-col w-full h-fit px-[25px] pb-[25px]'>
            
                {/* page titles */}
                <div className='flex flex-row font-bold w-full justify-start pt-[30px] text-black h-[90px] pb-[15px]'>
                    <div className='writing-activity-page-title-div'>
                        <div className='writing-activity-page-title-icon'>
                            <commonIconSvgs.SparkWritingTitleBookIcon/>
                        </div>
                        <span className='writing-activity-page-title-text' >{ reportSelectBookName==='' ? sparkWritingBookName: reportSelectBookName }</span>
                    </div>
                    <div className='flex flex-1 h-[45px] items-center justify-end select-none'>
                        <ReportSelectButton data={reportSelectBoxDatas} disabledFlag={false} useDefaultEmptyValueFlag={false} selectDataFn={handleChange} isLevel={false}/>
                        <ReportSelectButton data={reportSelectBoxDatas} disabledFlag={true} useDefaultEmptyValueFlag={true} selectDataFn={handleChange} isLevel={true}/>
                    </div>
                </div>
                {/* Tab */}
                <CustomizedReportTabs/>
            </div>
        </section>
    )
}

export default Report;