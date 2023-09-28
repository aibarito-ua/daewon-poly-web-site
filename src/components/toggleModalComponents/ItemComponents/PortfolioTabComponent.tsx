import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import ReportModalComponent from '../ReportModalComponent';
import { useComponentWillMount } from '../../../hooks/useEffectOnce';
import useLoginStore from '../../../store/useLoginStore';
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
      className='bg-white flex flex-row w-full'
      {...other}
      style={{
        borderRadius: '30px',
      }}
    >
      {value === index && (
        <Box sx={{ 
            borderRadius: '30px'
         }}>
          <Typography >{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    
  };
}
interface StyledTabProps {
    label: string;
  }
const StyledTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} />
  ))(({ theme }) => ({
    backgroundColor: '#0fa9cb',
    color: '#fff',
    borderTopLeftRadius:'15px',
    borderTopRightRadius: '15px',
    height:'60px',
    fontFamily: 'NotoSansCJKKR',
    fontSize: '16px',
    fontWeight: 700,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    textAlign: 'center',
    paddingLeft: '50px',
    paddingRight: '55px',
    textTransform: 'capitalize',
    userSelect: 'none',
    '&.Mui-selected': {
      color: '#0fa9cb',
      backgroundColor: '#fff',
    },
    '&.Mui-focusVisible': {
    //   backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  }));

export default function PortfolioTabComponent(props: {
    
}) {
    const {
      
    } = props;
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const {
      userInfo
    } = useLoginStore();

    const selectDate = (data:TLMSparkWritingStudentUnitDraft1StatusItemInClass,isDraft:boolean):string => {
        const {status} = data;
        if (isDraft) {
            if (status===2) {
                if (data.submit_date) {
                    return data.submit_date;
                } else return ''
            } else if (status===3) {
                if (data.review_temp_save_date) {
                    return data.review_temp_save_date;
                } else return ''
            } else if (status===4) {
                if (data.review_complete_date) {
                    return data.review_complete_date;
                } else return ''
            } else if (status===5) {
                if (data.review_reject_date) {
                    return data.review_reject_date
                } else return ''
            } else {
                return ''
            }
        } else return ''
    }
    const formatDate = (inputDate: string, split?:string): string => {
        const date = new Date(inputDate);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        // formattedData = 월/일/년도
        // Replace '/' with '.'
        const replaceDate = formattedDate.split('/');
    
        // change locate
        const splitStr = split ? split : '.'
        return `${replaceDate[2]}${splitStr}${replaceDate[0]}${splitStr}${replaceDate[1]}`
    }

    
  return (
    <Box sx={{ width: '1260px', paddingTop: '20px' }}>
      <Box sx={{ paddingLeft: '72px' }}>
        <Tabs sx={{
            '.MuiTabs-indicator': {
                backgroundColor: '#fff'
            }
        }} value={value} onChange={handleChange} aria-label="basic tabs example">
          <StyledTab sx={{
            marginRight: '10px'
          }} label="Portfolio" {...a11yProps(0)}/>
          {/* <StyledTab label="print component" {...a11yProps(1)} /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0} >
        <div className='flex flex-col w-[1260px] h-full'>
            <div className='flex flex-row'>
                {/* head 케로셀 & 버튼 */}
                <div className='flex flex-row relative justify-center items-center gap-[20px] w-full mt-[30px] px-[30px]'>
                    {/* <div className={`bg-no-repeat w-[36px] h-[36px] ${isLeftAvailable ? 'bg-svg-bt-left hover:bg-svg-bt-left-over': 'bg-svg-bt-left-disabled'}`}
                        onClick={async () => await onClickStepperLeft()}
                    ></div>
                    <div className='report-by-unit-title-label'>{`Unit ${reportByUnitData.currentUnitInfo.unit_index}. ${reportByUnitData.currentUnitInfo.unit_topic}`}</div>
                    <div className={`bg-no-repeat w-[36px] h-[36px] ${isRightAvailable ? 'bg-svg-bt-right hover:bg-svg-bt-right-over': 'bg-svg-bt-right-disabled'}`}
                        onClick={async()=>await onClickStepperRight()}
                    ></div> */}
                    
                    <div className='absolute right-[30px] '>
                        {/* {from && from==='LM-Report' && <div className='bt-go-report-in-modal hover:cursor-pointer' onClick={()=>{
                            console.log("test1")
                            if (modalClose) {
                                modalClose();
                            }
                        }}></div>}
                        {!from &&
                            <ReportModalComponent feedbackStates={feedbackDataInStudent} 
                                initSettingData={async()=>await initSettingData()}
                                from={'portfolioModalLRM'}
                                studend_code={student_code?student_code:feedbackDataInStudent.defautInfo.student_code}
                            />
                        } */}
                    </div>
                </div>
            </div>
            {/* content */}
            <div className='flex flex-col w-[1200px] h-[531px] mt-[32px] ml-[30px] overflow-y-auto relative'>
                {/* <div className='flex flex-col w-[1200px] min-h-[531px] pt-[50px] border-[1px] bg-[#f9f9f9] border-[#dddddd] rounded-[20px]'>
                    {displayPortfolio(reportByUnitAPIData)}
                </div>
                {isCrown && <div className='absolute right-[40px] bg-svg-ic-crown w-[60px] h-[50px] ' />} */}
                
            </div>
            {/* footer */}
            <div className='flex flex-row w-full h-[70px] border-t-[1px] border-t-[#e2e3e6] relative pl-[30px] items-center'>
                {/* <PrintPortfolioExportButton feedbackDataInStudent={feedbackDataInStudent} reportByUnitAPIData={reportByUnitAPIData} isCrown={isCrown}/>
                
                <div className='absolute bottom-[25px] right-[30px] flex flex-row capitalize items-center gap-[5px]'>
                    <div className='report-by-unit-completion-date-title'>completion date: </div>
                    <div className='report-by-unit-completion-date-content'>{`[1st draft] ${reportByUnitData.completionDate.draft1st}`}</div>
                    <div className='w-[1px] h-[8px] bg-[#aaa]' />
                    <div className='report-by-unit-completion-date-content'>{`[2nd draft] ${reportByUnitData.completionDate.draft2nd}`}</div>
                </div> */}
            </div>

        </div>
      </CustomTabPanel>
    </Box>
  );
}