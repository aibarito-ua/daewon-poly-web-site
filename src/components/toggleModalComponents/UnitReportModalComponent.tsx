import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';

import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled } from '@mui/material';
import useControlAlertStore from '../../store/useControlAlertStore';
import ReportChart from '../chartComponents/reportChart';
import {ReactComponent as ReportClose} from './img/reportCloaseButtonIMG.svg';
import ReportItemComponents from './ItemComponents/ReportItemComponents';
import { ReactComponent as ReportPrint } from './img/reportPrintButton.svg';
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import { useComponentWillMount } from '../../hooks/useEffectOnce';

import {ReactComponent as PrintWritingHubIcon} from './img/printReportMemoIcon.svg';
import PrintReportDoughnutChart from '../chartComponents/printReportDoughnutChart';
import PrintReportBarChart from '../chartComponents/printReportBarChart';


export default function UnitReportModalComponent() {
    const {
        unitReportModal,
        setUnitReportModal,
        unitReportModalData,
        setCommonStandbyScreen
    } = useControlAlertStore();
    const [menuControll, setMenuControl] = React.useState<number>();
    const [printPreviewer, setPrintPreviewer] = React.useState<boolean>(false);
    const printComponentRef = React.useRef<HTMLDivElement>(null);
   
    // modal close -> init states
    React.useEffect(()=>{
        if (unitReportModal.open===false) {
            setMenuControl(0)
            setPrintPreviewer(false)
        } else {
            
        }
    },[unitReportModal])
    // print handler
    const handlePrint = useReactToPrint({
        content: () => printComponentRef.current,
    })
    React.useEffect(()=>{
        if (printPreviewer) {
            // setTimeout(()=>{
            //     handlePrint();
            // },2000)
        } else {
        }
        
    })
    // The print function is automatically executed 2 seconds after the screen is opened.
    // click print event
    const onClickPrintEvent = () => {
        // button click event
        if (printPreviewer) {
            setPrintPreviewer(false)
        } else {
            setPrintPreviewer(true)
            // call print function
        }
    }
    
    const PrintUserInfoDiv = (props: {
        userInfo:{
            level: string;
            class: string;
            book: string;
            student_code: string;
            student_name_kr: string;
            student_name_en: string;
            unit_index: number;
            unit_topic: string;
            draft_1st: {
                date_complete: string;
            };
            draft_2nd: {
                date_complete: string;
            };
        }
    }) => {
        const {userInfo} = props
        return (
            <div className='report-print-user-info'>
                <div className='report-print-user-info-row'>
                    <div className='report-print-user-info-label-left'>level / class</div>
                    <div className='report-print-user-info-value-middle'>
                        <div className='col-div'>
                            <div>{`${userInfo.level}/`}</div>
                            <div>{userInfo.class}</div>
                        </div>
                    </div>
                    <div className='report-print-user-info-label-right'>student</div>
                    <div className='report-print-user-info-value-small'>
                        <div className='col-div'>
                            <div>{userInfo.student_code}</div>
                            <div>{`${userInfo.student_name_kr}(${userInfo.student_name_en})`}</div>
                        </div>
                    </div>
                </div>
                <div className='report-print-user-info-row'>
                    <div className='report-print-user-info-label-left'>book</div>
                    <div className='report-print-user-info-value-middle'>{`${userInfo.book}`}</div>
                    <div className='report-print-user-info-label-right'>unit</div>
                    <div className='report-print-user-info-value-small'>{`Unit ${userInfo.unit_index}. ${userInfo.unit_topic}`}</div>
                </div>
                <div className='report-print-user-info-row'>
                    <div className='report-print-user-info-label-left'>{'data completed'}</div>
                    <div className='report-print-user-info-value-middle'>
                        {`1st: ${userInfo.draft_1st.date_complete}`}
                        <span className='border-l-[1px] border-l-[#aaaaaa] h-[8px]'/>
                        {`2nd: ${userInfo.draft_2nd.date_complete}`}
                    </div>
                </div>
            </div>
        )
    }
    
  
  return (
    <div className='flex'>
        <Dialog open={printPreviewer}
            onClose={()=>setPrintPreviewer(false)}
            ref={printComponentRef}
            sx={{
                '.MuiPaper-root': {
                    width: 'fit-content',
                    height: 'fit-content',
                    minWidth: 'fit-content',
                    minHeight: 'fit-content'
                },
            }}
        >
            <DialogContent sx={{
                minWidth: '850px',
                maxWidth: '850px',
                width: '850px',
                maxHeight: '800px',
                padding: '20px',
            }}>
                <div id='print-report-modal-viewer' className='col-div overflow-y-auto w-full h-[1228px] bg-white' >
                    <div className='row-div'>
                        <div className='report-print-icon-div'>
                            <PrintWritingHubIcon className='w-[37px] h-[45.2px]' />
                            <div className='capitalize gothamrounded-medium text-[16px] leading-[19px]'>writing hub</div>
                            <div className='capitalize notoSansCJKKR-regular text-[12px] leading-[18px]'>spark writing</div>
                        </div>
                        <PrintUserInfoDiv userInfo={{
                            "level":"MAG3",
                            "class": "MAG3-Walnut",
                            "book": "Spark Writing B-1",
                            "student_code": "20111111",
                            "student_name_kr": "김테스터",
                            "student_name_en": "Tester Kim",
                            "unit_index": 4,
                            "unit_topic": "science fictions ...",
                            "draft_1st": {
                                "date_complete": "23-03-28"
                            },
                            "draft_2nd": {
                                "date_complete": "23-04-25"
                            }
                        }}/>
                    </div>
                    <div className='col-div mt-[15px] gap-[5px]'>
                        <div className='row-div capitalize gothamrounded-medium justify-center text-[16px] leading-[18px]'>evaluation gragh</div>
                        <div className='report-print-evalueation-gragh-box'>
                            <PrintReportDoughnutChart />
                            <PrintReportBarChart />
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
      <Dialog
        open={unitReportModal.open}
        onClose={()=>setUnitReportModal({open:false, unitTitle:''})}
        fullWidth={true}
        sx={{
            '.MuiPaper-root': {
                width: 'fit-content',
                height: 'fit-content',
                minWidth: 'fit-content',
                minHeight: 'fit-content'
            },
            '.MuiDialog-paper':{
                display: 'flex',
                position: 'relative',
                padding: '0 25px 0 25px',
                backgroundColor: 'rgba(0,0,0,0.0)',
                boxShadow: 'none',
                margin: 0,
            }
        }}
      >
        <DialogTitle sx={{
            minWidth: '1024px',
            width: '100%'
        }}>

            <div className='flex flex-row w-full'>
                
                <IconButton 
                    sx={{
                        width: '50px',
                        height: '50px',
                        padding: 0,
                        position: 'absolute',
                        right:'0px',
                        top: '7px',
                        zIndex: 1301
                    }}
                >
                    <ReportClose className='w-[50px] h-[50px] m-0 p-0'
                    onClick={()=>setUnitReportModal({open:false, unitTitle:''})}/>
                </IconButton>
            </div>
        </DialogTitle>
        <DialogContent
        className='flex flex-col'
        sx={{
            
            backgroundColor: 'white',
            border: 'solid 6px #7861bb',
            borderRadius: '30px',
            width: '1024px',
            height: '530px'
        }}>
            <div className='report-modal-menu-div'>
                <div className='report-modal-menu-buttons'>
                    <div className={`${menuControll===0 ? 'report-modal-menu-button-active': 'report-modal-menu-button'}`}
                    onClick={()=>setMenuControl(0)}
                    >overall report</div>
                    <div className={`${menuControll===1 ? 'report-modal-menu-button-active': 'report-modal-menu-button'}`}
                    onClick={()=>setMenuControl(1)}
                    >report by unit</div>
                </div>
                <div className='report-modal-menu-print'>
                    {menuControll===1 && (
                        // <ReactToPrint 
                        //     trigger={()=>}
                        // content={() => printComponentRef.current}
                        // />
                        <div className='report-modal-menu-print-button'
                            onClick={()=>onClickPrintEvent()}
                        >
                            <ReportPrint />
                            <span className='report-modal-menu-print-button-text'>print</span>
                        </div>
                        
                    )}
                </div>
            </div>
            {/* Overall Report */}
            {menuControll===0 && (
                <div className='flex flex-col'></div>
            )}
            {/* Report By Unit */}
            {menuControll===1 && (
                <div className='flex flex-col'>
                    <div className='flex flex-row justify-center items-center'>
                        <span className='report-chart-report-by-unit-title'>
                        {unitReportModal.unitTitle}
                        </span>
                    </div>
                    <div className='flex flex-row mt-[30px] gap-[40px] justify-center'>
                        <div className='flex'>
                            <ReportChart/>
                        </div>
                        <div className='report-chart-right-components-div'>
                            <ReportItemComponents.ReportWordCountSummaryComponent 
                                item={unitReportModalData.wordCountSummary}
                            />
                            <ReportItemComponents.ReportCorrectionSummaryComponent 
                                item={unitReportModalData.correctionSummary}
                            />
                            <div className='flex flex-col'>
                                <div className='flex flex-row'>Teacher Comment Develop</div>
                                <div className='flex flex-row'>
                                    <div>drafts</div>
                                    <div>drafts</div>
                                    <div>drafts</div>
                                    <div>drafts</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='absolute bottom-[10px] right-[50px] flex flex-row capitalize'>
                        <div>completion data: </div>
                        <div>{`[1st draft]`}</div>
                        <div>{`[2nd draft]`}</div>
                    </div>
                </div>
            )}
            
        </DialogContent>
        </Dialog>
        
    </div>
  );
}

