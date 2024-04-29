import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PieChart from '../../chartComponents/dounutChat'
import BarChart from '../../chartComponents/barChart'
import ReportRubricModalComponent from '../../toggleModalComponents/ReportRubricModalComponent';
import useControlAlertStore from '../../../store/useControlAlertStore';
import ReportByUnitComponent from '../../chartComponents/reportByUnit/ReportByUnitComponent';
import PrintReportExportButton from '../../commonComponents/printComponent/report/PrintComponent';

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{
      style: { 
        display: 'none', width: 0, height: 0
      }
    }}
  />
))({
  height:'55px',
  '& .MuiTabs-flexContainer': {
    
  }
});

// interface StyledTabProps {
//   label: string;
// }

// const StyledTab = styled((props: StyledTabProps) => (
//   <Tab disableRipple {...props} />
// ))(({ theme }) => ({
//   backgroundColor: '#3e61aa',
//   paddingLeft: '27px',
//   paddingRight: '27px',
//   paddingTop: '23px',
//   paddingBottom: '18px',
//   color: '#fff',
//   position: 'relative',
//   '&.Mui-selected': {
//     color: '#192878',
//     height: '55.2px',
//     borderTopLeftRadius: '24px',
//     borderTopRightRadius: '24px',
//     borderBottomLeftRadius: '-24px',
// },
// }));
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    if (value === index) {
      return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          className={value === index ? 'flex flex-row w-full bg-white rounded-b-[24px]' : 'hidden w-0 h-0'}
          {...other}
        >
          {value === index && (
            <Box sx={{ 
              width: '100%',
              height: '424px',
              backgroundColor: '#fff',
                borderBottomRightRadius: '24px',
                borderBottomLeftRadius: '24px',
             }}>
              <Typography>{children}</Typography>
            </Box>
          )}
        </div>
      );

    } else {
      return null
    }
  }

export default function CustomizedReportTabs() {
  const [value, setValue] = React.useState(0);
  //check isPrev & isNext
  const [isPrev, setIsPrev] = React.useState<boolean>(false);
  const [isNext, setIsNext] = React.useState<boolean>(false);

  const {
    reportSelectUnit, setReportSelectUnit,
    unitReportsData,
    unitReportData,
    reportByUnitMainTitle,
    reportSelectFinder,
    // 
    reportCompletedUnitIndexArray,
    isNoData
  } = useControlAlertStore();

  React.useEffect(()=>{
    // console.log('isNoData ==',isNoData)
    console.log('=== Report Tab Component::Effect::check isNoData ===')
    if (isNoData) {
      setValue(0);
    }

  }, [isNoData])
  
  React.useEffect(()=>{
    console.log('=== Report Tab Component ===')
    if (!isNoData) {

      if (unitReportsData.length > 0) {
          let currentUnit = 0;
          let nextUnits = [];
          let prevUnits = [];
          // console.log('reportCompletedUnitIndexArray =',reportCompletedUnitIndexArray)
          // console.log('reportSelectUnit =',reportSelectUnit)
          for (let i = 0; i < reportCompletedUnitIndexArray.length; i++) {
            if (reportCompletedUnitIndexArray[i] === reportSelectUnit) {
                currentUnit = reportCompletedUnitIndexArray[i];
            } else if (reportCompletedUnitIndexArray[i] > reportSelectUnit) {
                nextUnits.push(reportCompletedUnitIndexArray[i]);
            } else if (reportCompletedUnitIndexArray[i] < reportSelectUnit) {
                prevUnits.push(reportCompletedUnitIndexArray[i])
            }
          }
          if (currentUnit === 1) {
              if (nextUnits.length > 0) {
                  setIsNext(true);
                  setIsPrev(false);
              } else {
                  setIsNext(false);
                  setIsPrev(false);
              }
          } else if (currentUnit === 5) {
              if (prevUnits.length > 0) {
                  setIsNext(false);
                  setIsPrev(true);
              } else {
                  setIsNext(false);
                  setIsPrev(false);
              }
          } else {
              if (prevUnits.length > 0) {
                  setIsPrev(true);
              } else {
                  setIsPrev(false);
              }
              if (nextUnits.length > 0) {
                  setIsNext(true);
              } else {
                  setIsNext(false);
              }
          }
      }
    }
  },[isNoData,unitReportsData, reportCompletedUnitIndexArray, reportSelectUnit, reportSelectFinder])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const noDataJSX = () => {
    return <div className='flex flex-col justify-center items-center h-[424px]'>
        <div className=''>
            <div className='bg-tab-no-data-img-svg bg-no-repeat w-[280px] h-[197px]' />
            <div className='report-no-data-font mt-[20px]'>{'No data to show'}</div>
        </div>
    </div>
  }
  const handlePrev = (currentIndex:number) => {
    // console.log('currentIndex =',currentIndex)
    if (isPrev && currentIndex!==1) {
      for (let i =0; i < reportCompletedUnitIndexArray.length; i++) {
        if (reportCompletedUnitIndexArray[i]===currentIndex) {
          const prevValue = reportCompletedUnitIndexArray[i-1];
          if (prevValue) {
            setReportSelectUnit(prevValue);
          }
        }
      }
    }
}
const handleNext = (currentIndex:number) => {
  // console.log('currentIndex =',currentIndex)
    if (isNext && currentIndex!==5) {
      for (let i = 0; i < reportCompletedUnitIndexArray.length; i++) {
        if (reportCompletedUnitIndexArray[i]===currentIndex) {
          const nextValue = reportCompletedUnitIndexArray[i+1];
          if (nextValue) {
            setReportSelectUnit(nextValue)
          }
        }
      }
    }
}
  

  return (
    <Box sx={{ width: '100%', minWidth: '1010px' }}>
      <Box sx={{ 
        width:'100%',
        position: 'relative'
    }}> 
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="styled tabs"
          
          sx={{
            width: '100%',
            height: '66px',
            paddingTop: '13px',
            paddingLeft: '50px',
            backgroundColor: '#3e61aa',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            borderWidth: '0px',
            borderBottom: 'none',
            '& .MuiTabs-indicator': {
              // display: 'none',
              // background: 'white'
              transition: 'none'
            },
          }}
        >
          <Tab disableRipple sx={{
            height: '55px',
            paddingLeft: '27px',
            paddingRight: '27px',
            color: '#fff',
            fontFamily: 'GothamRounded',
            fontSize: '20px',
            fontWeight: 700,
            fontStretch: 'normal',
            fontStyle: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            textTransform: 'capitalize',
            userSelect: 'none',
            '&.Mui-selected': {
                color: '#192878',
            },
          }} 
          className={value===0? 'bg-no-repeat w-[240px] bg-tab-title-active-bg-svg bg-cover':'opacity-[0.5]'}
          label="Overall Report" />
          <Tab disableRipple sx={{
            height: '55px',
            paddingLeft: '27px',
            paddingRight: '27px',
            color: '#fff',
            fontFamily: 'GothamRounded',
            fontSize: '20px',
            fontWeight: 700,
            fontStretch: 'normal',
            fontStyle: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            textTransform: 'inherit',
            userSelect: 'none',
            zIndex: 13333,
            '&.Mui-selected': {
                color: '#192878',
            }
          }} 
          className={value===1? 'bg-no-repeat w-[240px] bg-tab-title-active-bg-svg bg-cover':'opacity-[0.5]'} 
          label="Report by Unit" />
          
        </StyledTabs>
        {(value === 0 ) && (
            <Box sx={{
                position: 'absolute',
                right: '20px',
                top: '10px',
                width: '48px',
                height: '48px'
            }}>
                <ReportRubricModalComponent 
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    isNext={isNext}
                    isPrev={isPrev}
                    setIsNext={setIsNext}
                    setIsPrev={setIsPrev}
                    isNoData={isNoData}
                />
            </Box>
        )}
        {(value===1) && (
            <Box sx={{
                position: 'absolute',
                right: '20px',
                top: '10px',
                width: '100px',
                height: '48px'
            }}>
              {
                isNoData 
                ? <div className={
                  // isActivityPage 
                  // ? 'bg-btn-report-modal-print-ic-svg bg-no-repeat w-[100px] h-[48px]'
                  // : 
                  "bg-tab-print-btn-ic-svg bg-no-repeat w-[100px] h-[48px]"
                }></div>
                : <PrintReportExportButton />
              }
                {/* <TestModalComponent /> */}
            </Box>
        )}
        
        {/* overall report tab panel */}
        <CustomTabPanel value={value} index={0}>
            {isNoData && noDataJSX()}
            {!isNoData && (
                <div className='w-full h-full flex flex-row justify-center items-center px-[40px] pt-[40px]'>
                    {/* left pie chart */}
                    <div className='flex flex-col items-center justify-center'>
                        <PieChart />
                    </div>
                    {/* right bar chart */}
                    <div className='flex flex-col items-center justify-center gap-[20px] select-none'>
                        <BarChart />
                        <div className='bg-tab-overall-bar-legend-img-svg bg-no-repeat w-[393px] h-[15px]' />
                    </div>
                </div>
            )} 
        </CustomTabPanel>
        {/* report by unit tab panel */}
        <CustomTabPanel value={value} index={1} >
            {isNoData && noDataJSX()}
            {!isNoData && (
                <div className={
                  window.navigator.userAgent.toLowerCase().indexOf('electron') > -1
                  ? 'report-chart-pannel-report-by-unit-wrap-electron'
                  : 'report-chart-pannel-report-by-unit-wrap'
                }>
                    {/* title */}
                    <div className='flex flex-row report-by-unit-page-title-font pb-[15px] select-none'>
                        {reportByUnitMainTitle}
                    </div>
                    {/* unit report */}
                    <ReportByUnitComponent reportByUnitAPIData={unitReportData} />
                    {/* <ReportItemComponents.ReportCompletionDateDiv reportByUnitAPIData={unitReportData}/> */}

                    <div className={!isPrev
                        ? 'absolute top-[215px] -left-[25px] bg-tab-prev-btn-disabled bg-contain w-[55px] h-[55px] bg-no-repeat hover:cursor-not-allowed'
                        : 'absolute top-[215px] -left-[25px] bg-tab-report-prev bg-contain w-[55px] h-[55px] bg-no-repeat hover:cursor-pointer'}
                        onClick={()=>handlePrev(reportSelectUnit)}
                    />
                    <div className={!isNext
                        ? 'absolute top-[215px] -right-[25px] bg-tab-next-btn-disabled bg-contain w-[55px] h-[55px] bg-no-repeat hover:cursor-not-allowed'
                        : 'absolute top-[215px] -right-[25px] bg-tab-report-next bg-contain w-[55px] h-[55px] bg-no-repeat hover:cursor-pointer'
                    }
                        onClick={()=>handleNext(reportSelectUnit)}
                    />

                </div>
            )}
        </CustomTabPanel>
      </Box>
    </Box>
  );
}