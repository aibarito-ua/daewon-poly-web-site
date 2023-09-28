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
import ReportItemComponents from '../../chartComponents/reportByUnit/ItemComponents/ReportItemComponents';
import PrintReportExportButton from '../../commonComponents/printComponent/report/PrintComponent';

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    
    // TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7',
  },
});

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  backgroundColor: '#3e61aa',
  paddingLeft: '27px',
  paddingRight: '27px',
  paddingTop: '23px',
  paddingBottom: '18px',
  color: '#fff',
  position: 'relative',
  '&.Mui-selected': {
    color: '#192878',
    height: '55.2px',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    borderBottomLeftRadius: '-24px',
},
}));
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        className='flex flex-row w-full bg-white rounded-b-[24px]'
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
  }

export default function CustomizedReportTabsActivity(
    props: {
        isNoData: boolean;
    }
) {
    const {
        isNoData
    } = props;
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
  } = useControlAlertStore();
  
  React.useEffect(()=>{
    if (unitReportsData.length > 0) {
        let currentUnit = 0;
        let nextUnits = [];
        let prevUnits = [];
        for (let j = 0; j < unitReportsData.length; j++) {
            if (unitReportsData[j].unit_index === reportSelectUnit) {
                currentUnit = reportSelectUnit;
            } else if (unitReportsData[j].unit_index > reportSelectUnit) {
                nextUnits.push(unitReportsData[j].unit_index)
            } else {
                prevUnits.push(unitReportsData[j].unit_index)
            }
        };
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
    
  },[unitReportsData, reportSelectUnit, reportSelectFinder])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const noDataJSX = () => {
    return <div className='flex flex-col justify-center items-center h-[424px]'>
        <div className=''>
            <div className='bg-tab-no-data-img-svg bg-no-repeat w-[280px] h-[197px]' />
            <div className='report-no-data-font'>{'No data to show'}</div>
        </div>
    </div>
  }
  const handlePrev = (currentIndex:number) => {

    if (isPrev && currentIndex!==1) {
        const prevIndex = currentIndex-1;
        setReportSelectUnit(prevIndex);
    }
}
const handleNext = (currentIndex:number) => {
    if (isNext && currentIndex!==5) {
        const nextIndex = currentIndex+1;
        setReportSelectUnit(nextIndex)
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
            height: '68px',
            paddingTop: '13px',
            paddingLeft: '50px',
            backgroundColor: '#3e61aa',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          }}
        >
          <Tab  sx={{
            paddingLeft: '27px',
            paddingRight: '27px',
            paddingTop: '23px',
            paddingBottom: '18px',
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
          className={value===0? 'bg-no-repeat w-[240px] h-[55.2px] bg-tab-title-active-bg-svg':'h-[55.2px]'}
          label="Overall Report" />
          <Tab sx={{
            paddingLeft: '27px',
            paddingRight: '27px',
            paddingTop: '23px',
            paddingBottom: '18px',
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
            '&.Mui-selected': {
                color: '#192878',
            }
          }} 
          className={value===1? 'bg-no-repeat w-[240px] h-[55.2px] bg-tab-title-active-bg-svg':'h-[55.2px]'} 
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
                <PrintReportExportButton />
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
                        <div className='bg-tab-overall-pie-legend-img-svg bg-no-repeat w-[413px] h-[60px]' />
                    </div>
                    {/* right bar chart */}
                    <div className='flex flex-col items-center justify-center gap-[20px]'>
                        <BarChart />
                        <div className='bg-tab-overall-bar-legend-img-svg bg-no-repeat w-[393px] h-[15px]' />
                    </div>
                </div>
            )} 
        </CustomTabPanel>
        {/* report by unit tab panel */}
        <CustomTabPanel value={value} index={1}>
            {isNoData && noDataJSX()}
            {!isNoData && (
                <div className='w-[1010px] h-[424px] flex flex-col justify-center items-center pt-[30px] px-[70px]'>
                    {/* title */}
                    <div className='flex flex-row report-by-unit-page-title-font pb-[15px]'>
                        {reportByUnitMainTitle}
                    </div>
                    {/* unit report */}
                    <ReportByUnitComponent reportByUnitAPIData={unitReportData} />
                    <ReportItemComponents.ReportCompletionDateDiv reportByUnitAPIData={unitReportData}/>

                    <div className={!isPrev
                        ? 'absolute top-[215px] -left-[25px] bg-tab-prev-btn-disabled w-[55px] h-[55px] bg-no-repeat hover:cursor-not-allowed'
                        : 'absolute top-[215px] -left-[25px] bg-tab-report-prev w-[55px] h-[55px] bg-no-repeat hover:cursor-pointer'}
                        onClick={()=>handlePrev(reportSelectUnit)}
                    />
                    <div className={!isNext
                        ? 'absolute top-[215px] -right-[25px] bg-tab-next-btn-disabled w-[55px] h-[55px] bg-no-repeat hover:cursor-not-allowed'
                        : 'absolute top-[215px] -right-[25px] bg-tab-report-next w-[55px] h-[55px] bg-no-repeat hover:cursor-pointer'
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