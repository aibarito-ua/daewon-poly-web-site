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

    const [semesters, setSemesters ] = React.useState<TDropdownSelectBoxDataTypes[]>([]);
    const [ levels, setLevels] = React.useState<TDropdownSelectBoxDataTypes[]>([]);
    // const [reportSelectFinder, setReportSelectedFinder] = React.useState<TDropdownSelectBoxDataTypes>({label:'', level:'', semester:0, year:0});

    const {role, userInfo} = useLoginStore();
    const {
        setCommonStandbyScreen,
        // api data
        reportAPIData, setReportAPIData,
        setSelectReportData,

        // selectFinder
        reportSelectFinder, setReportSelectedFinder,
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
            const getAPIs = await getReportsAPI(student_code);
            if (getAPIs) getReportAll = getAPIs;
        }
        if (getReportAll) {
            for (let i = 0; i < getReportAll.periods.length; i++) {
                // find year and semesters
                const currentReportAll = getReportAll.periods[i];
                const currentYearData = currentReportAll.year;
                const currentSemester = currentReportAll.semester===1? '1st': '2nd';
                const pushSemesterString = `${currentYearData} - ${currentSemester} Semester`;
                const pushSemesterData = {label: pushSemesterString, year:currentYearData, semester: currentReportAll.semester, level:''};
                semesters.push(pushSemesterData);
                for ( let j = 0; j < currentReportAll.levels.length; j++) {
                    // find levels
                    const level = currentReportAll.levels[j].level_name;
                    const pushLevelsData = {label: level, year: currentYearData, semester:currentReportAll.semester, level:level}
                    levels.push(pushLevelsData);
                };
            };
            console.log('get report all =', getReportAll)

            let dumyFinderData = {label:'', level:'', semester:0, year:0};
            dumyFinderData.level = userInfo.courseName;
            setReportSelectedFinder(dumyFinderData);
            setReportAPIData(getReportAll);
            setCommonStandbyScreen({openFlag: false})
        }
    }
    useComponentWillMount(async()=>{
        await beforeRenderedFn();
        
        
    })
    React.useEffect(()=>{
    },[])
    
    const handleChange = (data:TDropdownSelectBoxDataTypes, isLevel:boolean, isInit?:boolean) => {
        if (isInit) {
            let dumyData = reportSelectFinder;
            dumyData.label='';
            dumyData.semester=0;
            dumyData.year=0;
            dumyData.level=reportSelectFinder.level;
            setReportSelectedFinder(dumyData);
            setIsNoData(true);
        } else {

            if (isLevel) {
                // level change
                let dumyData = reportSelectFinder;
                dumyData.level = data.level;
                setReportSelectedFinder(dumyData);
            } else {
                // year & semester change
                let dumyData = reportSelectFinder;
                dumyData.year= data.year;
                dumyData.semester = data.semester;
                if (dumyData.year !==0 && dumyData.level!=='' && dumyData.semester!==0) {
                    console.log('selected all')
                    setSelectReportData(reportAPIData, dumyData.year, dumyData.semester, dumyData.level)
                    setReportSelectUnit(1)
                    setIsNoData(false);
                }
                setReportSelectedFinder(dumyData)
            }
        }
    }
    
    return (
        <section className="section-common-layout use-nav-aside min-w-[1060px]" >
            <SmallHead mainTitle='Report'/>
            <div className='flex flex-1 flex-col w-full h-full px-[25px] pb-[25px]'>
            
                {/* page titles */}
                <div className='flex flex-row font-bold w-full justify-start pt-[30px] text-black h-[90px] pb-[15px]'>
                    <div className='writing-activity-page-title-div'>
                        <div className='writing-activity-page-title-icon'>
                            <commonIconSvgs.SparkWritingTitleBookIcon/>
                        </div>
                        <span className='writing-activity-page-title-text' >{reportSelectBookName}</span>
                    </div>
                    <div className='flex flex-1 h-[45px] items-center justify-end'>
                        <ReportSelectButton data={semesters} disabledFlag={false} useDefaultEmptyValueFlag={false} selectDataFn={handleChange} isLevel={false}/>
                        <ReportSelectButton data={levels} disabledFlag={true} useDefaultEmptyValueFlag={true} selectDataFn={handleChange} isLevel={true}/>
                    </div>
                </div>
                {/* Tab */}
                <CustomizedReportTabs isNoData={isNoData}/>
            </div>
        </section>
    )
}

export default Report;