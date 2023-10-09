import React from 'react';
import useLoginStore from '../../store/useLoginStore';
import useControlAlertStore from '../../store/useControlAlertStore';
import { getReportsAPI } from './api/EssayWriting.api';
import { useComponentWillMount } from '../../hooks/useEffectOnce';
import SmallHead from '../../components/commonComponents/SmallHeadComponent/SmallHead';
import { commonIconSvgs } from '../../util/svgs/commonIconsSvg';
import ReportSelectButton from '../../components/pageComponents/report/ReportSelectButton';
import CustomizedReportTabs from '../../components/pageComponents/report/ReportTabComponent';


const Report = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isNoData, setIsNoData] = React.useState<boolean>(true);

    // const [semesters, setSemesters ] = React.useState<TDropdownSelectBoxDataTypes[]>([]);
    // const [ levels, setLevels] = React.useState<TDropdownSelectBoxDataTypes[]>([]);

    const {role, userInfo} = useLoginStore();
    const {
        setCommonStandbyScreen,
        // api data
        reportAPIData, setReportAPIData,
        setSelectReportData,

        // selectFinder
        reportSelectFinder, setReportSelectedFinder,
        reportSelectBoxDatas, setReportSelectBoxDatas,
        setReportSelectBoxValue,
        // select unit index
        reportSelectUnit, setReportSelectUnit,
        reportSelectBookName
    } = useControlAlertStore();

    const beforeRenderedFn = async () => {
        const student_code = userInfo.userCode;
        setCommonStandbyScreen({openFlag: true})
        let getReportAll:TReportByStudentResponse = {periods:[]};
        if (reportAPIData.periods.length > 0) {
            getReportAll=reportAPIData;
        } else {
            const getAPIs = await getReportsAPI(student_code, userInfo.accessToken);
            if (getAPIs) getReportAll = getAPIs;
        }
        if (getReportAll) {
            let dumpReportSelectBoxDatas=[];
            for (let i = 0; i < getReportAll.periods.length; i++) {
                // find year and semesters
                const currentReportAll = getReportAll.periods[i];
                
                const currentYearData = currentReportAll.year;
                const currentSemester = currentReportAll.semester===1? '1st': '2nd';
                const pushSemesterString = `${currentYearData} - ${currentSemester} Semester`;
                // const pushSemesterData = {label: pushSemesterString, year:currentYearData, semester: currentReportAll.semester, level:''};
                // dumpReportSelectBoxDatas.push(pushSemesterData);
                for ( let j = 0; j < currentReportAll.levels.length; j++) {
                    // find levels
                    const level = currentReportAll.levels[j].level_name;
                    const pushLevelsData = {label: pushSemesterString, year: currentYearData, semester:currentReportAll.semester, level:level}
                    dumpReportSelectBoxDatas.push(pushLevelsData);
                };
            };
            console.log('get report all =', getReportAll)

            let dumyFinderData = {label:'', level:'', semester:0, year:0};
            dumyFinderData.level = userInfo.courseName;
            setReportSelectBoxDatas(dumpReportSelectBoxDatas);
            setReportSelectedFinder(dumyFinderData);
            setReportAPIData(getReportAll);
            setReportSelectBoxValue({data: {label:'', level:'', semester:0, year:0}, init:true})
            setCommonStandbyScreen({openFlag: false})
        }
    }
    useComponentWillMount(async()=>{
        await beforeRenderedFn();
    })
    React.useEffect(()=>{
    },[])
    
    const handleChange = (selectValue:string, data: TReportByStudentResponse, selectData:TDropdownSelectBoxDataTypes, isLevel:boolean , isInit?:boolean) => {
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
            setIsNoData(true);
        } else {
            console.log('set values')
            for (let i = 0; i < reportAPIData.periods.length; i++) {
                const currentPeriod = reportAPIData.periods[i];
                if (currentPeriod.year === selectData.year && currentPeriod.semester === selectData.semester) {
                    for (let j = 0; j < currentPeriod.levels.length; j++) {
                        const currentLevelInPeriod = currentPeriod.levels[j];
                        if (currentLevelInPeriod.overall_report.length > 0) {
                            setSelectReportData(data,selectData.year,selectData.semester,selectData.level)
                            setValue(selectValue, selectData)
                            setReportSelectUnit(1)
                            setIsNoData(false);
                        } else {
                            setSelectReportData(data,selectData.year,selectData.semester,selectData.level)
                            setValue(selectValue, selectData)
                            setReportSelectUnit(1)
                            setIsNoData(true);
                        }
                    }
                }
            }
            
        }
    }
    
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
                        <span className='writing-activity-page-title-text' >{!isNoData ? reportSelectBookName:''}</span>
                    </div>
                    <div className='flex flex-1 h-[45px] items-center justify-end'>
                        <ReportSelectButton data={reportSelectBoxDatas} disabledFlag={false} useDefaultEmptyValueFlag={false} selectDataFn={handleChange} isLevel={false}/>
                        <ReportSelectButton data={reportSelectBoxDatas} disabledFlag={true} useDefaultEmptyValueFlag={true} selectDataFn={handleChange} isLevel={true}/>
                    </div>
                </div>
                {/* Tab */}
                <CustomizedReportTabs isNoData={isNoData}/>
            </div>
        </section>
    )
}

export default Report;