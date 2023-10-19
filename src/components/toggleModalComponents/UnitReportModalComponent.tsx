import * as React from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled } from '@mui/material';
import useControlAlertStore from '../../store/useControlAlertStore';
// import {ReactComponent as ReportClose} from './img/reportCloaseButtonIMG.svg';

import ReportByUnitComponent from '../chartComponents/reportByUnit/ReportByUnitComponent';
import ReportItemComponents from '../chartComponents/reportByUnit/ItemComponents/ReportItemComponents';

import PieChart from '../chartComponents/dounutChat';
import BarChart from '../chartComponents/barChart'
import ReportRubricModalComponent from './ReportRubricModalComponent';
import PrintReportExportButton from '../commonComponents/printComponent/report/PrintComponent';


export default function UnitReportModalComponent() {
    const {
        unitReportModal,
        initializeUnitReportModal,
        unitReportData,
        setUnitReportModal,
        reportByUnitMainTitle,

        reportSelectUnit, setReportSelectUnit,
        unitReportsData,
        reportSelectFinder,
        reportCompletedUnitIndexArray
    } = useControlAlertStore();
    const [menuControll, setMenuControl] = React.useState<number>(0);
    const [isPrev, setIsPrev] = React.useState<boolean>(false);
    const [isNext, setIsNext] = React.useState<boolean>(false);
    React.useEffect(()=>{
        if ( unitReportModal.open) {
            console.log()
        } else {
            setMenuControl(1);
        }
    }, [unitReportModal])
    React.useEffect(()=>{
        if (unitReportsData.length > 0) {
            let currentUnit = 0;
            let nextUnits = [];
            let prevUnits = [];
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
        
    },[unitReportsData, reportCompletedUnitIndexArray, reportSelectUnit, reportSelectFinder])
    const handlePrev = (currentIndex:number) => {
        if (isPrev && currentIndex!==1) {
            for (let i = 0; i < reportCompletedUnitIndexArray.length; i++) {
                if (reportCompletedUnitIndexArray[i]===currentIndex) {
                    const prevValue = reportCompletedUnitIndexArray[i-1];
                    if (prevValue) {
                        const prevIndex = prevValue;
                        setReportSelectUnit(prevIndex);
                    }
                }
            }
            
        }
    }
    const handleNext = (currentIndex:number) => {
        if (isNext && currentIndex!==5) {
            for (let i = 0; i < reportCompletedUnitIndexArray.length; i++) {
                if (reportCompletedUnitIndexArray[i]===currentIndex) {
                    const nextValue = reportCompletedUnitIndexArray[i+1];
                    if (nextValue) {
                        const nextIndex = nextValue;
                        setReportSelectUnit(nextIndex)
                    }
                }
            }
            
        }
    }
  
  return (
    <div className='flex'>
        
      <Dialog
        open={unitReportModal.open}
        onClose={()=>setUnitReportModal(initializeUnitReportModal) }
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
                
                <button 
                    style={{
                        width: '50px',
                        height: '50px',
                        padding: 0,
                        position: 'absolute',
                        right:'0px',
                        top: '7px',
                        zIndex: 1301
                    }}
                >
                    <div className='w-[50px] h-[50px] m-0 p-0 bg-modal-close-button-svg bg-contain bg-no-repeat'
                    onClick={()=>setUnitReportModal(initializeUnitReportModal)}/>
                </button>
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
                <div className='absolute top-[55px] right-[30px]'>
                    {menuControll===0 && (
                      <ReportRubricModalComponent 
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        isNext={isNext}
                        isPrev={isPrev}
                        setIsNext={setIsNext}
                        setIsPrev={setIsPrev}
                        isActivityPage={true}
                        isNoData={false}
                    />  
                        
                    )}
                    {menuControll===1 && (
                        <div className='absolute top-[0px] right-[25px]'>
                            <PrintReportExportButton isActivityPage={false}/>
                        </div>
                    )}
                </div>
            </div>
            {/* Overall Report */}
            {menuControll===0 && (
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
            {/* Report By Unit */}
            {menuControll===1 && (
                <div className='w-[964px] h-[424px] flex flex-col justify-center items-center pt-[30px] px-[50px]'>
                {/* title */}
                <div className='flex flex-row report-by-unit-page-title-font pb-[15px]'>
                    {reportByUnitMainTitle}
                </div>
                {/* unit report */}
                <ReportByUnitComponent reportByUnitAPIData={unitReportData} />
                <ReportItemComponents.ReportCompletionDateDiv reportByUnitAPIData={unitReportData} isActivityPage={true}/>

                <div className={!isPrev
                    ? 'absolute top-[240px] left-[0px] bg-tab-prev-btn-disabled bg-contain w-[55px] h-[55px] bg-no-repeat hover:cursor-not-allowed'
                    : 'absolute top-[240px] left-[0px] bg-tab-rubric-modal-left bg-contain w-[55px] h-[55px] bg-no-repeat hover:cursor-pointer'}
                    onClick={()=>handlePrev(reportSelectUnit)}
                />
                <div className={!isNext
                    ? 'absolute top-[240px] right-[0px] bg-tab-next-btn-disabled bg-contain w-[55px] h-[55px] bg-no-repeat hover:cursor-not-allowed'
                    : 'absolute top-[240px] right-[0px] bg-tab-rubric-modal-right bg-contain w-[55px] h-[55px] bg-no-repeat hover:cursor-pointer'
                }
                    onClick={()=>handleNext(reportSelectUnit)}
                />

            </div>
            )}
            
        </DialogContent>
        </Dialog>
        
    </div>
  );
}

