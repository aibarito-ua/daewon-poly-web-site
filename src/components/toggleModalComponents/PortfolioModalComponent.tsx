import React from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import {ReactComponent as ReportClose} from './img/reportCloaseButtonIMG.svg';

import PrintReportExportButton from '../commonComponents/printComponent/portfolio/PrintComponent';
import usePortfolioStore from '../../store/usePortfolioStore';

export default function PortfolioModalComponent() {
    const {
        displayPortfolioData,
        portfolioApiData,
        setPortfolioApiData,
        portfolioModal,
        setPortfolioModal,
        setPortfolioModalClose,

    } = usePortfolioStore();
    
    // console.log('portfolioModal==',portfolioModal)
    const setMenuControl = (index:number) => {
        let data:TPortfolioModal = JSON.parse(JSON.stringify(portfolioModal));
        data.menuControll=index;
        setPortfolioModal(data);
    }
    const [printPreviewer, setPrintPreviewer] = React.useState<boolean>(false);
    const printComponentRef = React.useRef<HTMLDivElement>(null);
    
    const setIsPrevAndNext = (prev:boolean, next:boolean) => {
        let data:TPortfolioModal = JSON.parse(JSON.stringify(portfolioModal));
        data.isNext=next;
        data.isPrev=prev;
        setPortfolioModal(data);
    }
    const setUnitIndex = (unit_index:number) => {
        let data:TPortfolioModal = JSON.parse(JSON.stringify(portfolioModal));
        data.selectUnit=unit_index;
        setPortfolioModal(data);
    }
    
    const handlePrev = () => {

        
        if (portfolioModal.isPrev && portfolioModal.selectUnit !== 1) {
            let allUnits:number[] = [];
            const allPortfolioData = displayPortfolioData.unit_portfolios;
            for (let i = 0; i < allPortfolioData.length; i++) {
                allUnits.push(allPortfolioData[i].unit_index);
            }
            const findCurrentUnitIndex = allUnits.indexOf(portfolioModal.selectUnit);
            // console.log('findCurrentUnitIndex =',findCurrentUnitIndex)
            const beforeUnitIndex = allUnits[findCurrentUnitIndex-1];
            // console.log('beforeUnitIndex =',beforeUnitIndex)
            setUnitIndex(beforeUnitIndex);
        }
    }
    const handleNext = () => {
        // console.log('portfolioModal.isNext =',portfolioModal.isNext)
        // console.log('portfolioModal.selectUnit =',portfolioModal.selectUnit)
        if (portfolioModal.isNext && portfolioModal.selectUnit!==5) {
            
            let allUnits:number[] = [];
            const allPortfolioData = displayPortfolioData.unit_portfolios;
            // console.log('displayPortfolioData =',displayPortfolioData)
            for (let i = 0; i < allPortfolioData.length; i++) {
                allUnits.push(allPortfolioData[i].unit_index);
            }
            const findCurrentUnitIndex = allUnits.indexOf(portfolioModal.selectUnit);
            // console.log('findCurrentUnitIndex =',findCurrentUnitIndex)
            // console.log('allUnits =',allUnits)
            const afterUnitIndex = allUnits[findCurrentUnitIndex+1];
            // console.log('afterUnitIndex =',afterUnitIndex)
            setUnitIndex(afterUnitIndex);
        }
    }
    const ReportCompletionDateDiv = () => {
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
        const dates = portfolioModal.selectPortfolio.completion_date;
        let firstDate = '';
        let secondDate = '';
        for (let i = 0; i < dates.length; i++) {
            if (dates[i].draft_index===1) {
                const date = dates[i].date
                firstDate= `[1st Draft] ${formatDate(date,'-')}`
            } else if (dates[i].draft_index === 2) {
                const date = dates[i].date
                secondDate= `[2nd Draft] ${formatDate(date,'-')}`
            }
        }
        return <div className={ 'absolute bottom-[20px] right-[50px] flex flex-row items-center gap-[5px] h-[9px]'}>
            <div className='report-chart-right-complete-date-title font-bold '>{`Completion Date`}</div>
            <div className='report-chart-right-complete-date-title'>{':'}</div>
            <div className='report-chart-right-complete-date-title'>{firstDate}</div>
            <div className='w-[1px] h-[9px] bg-[#bbb]'/>
            <div className='report-chart-right-complete-date-title'>{secondDate}</div>
        </div>
    }

  
  return (
    <div className='flex'>
        
      <Dialog
        open={portfolioModal.open}
        onClose={()=>setPortfolioModalClose() }
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
                    onClick={()=>setPortfolioModalClose()}/>
                </button>
            </div>
        </DialogTitle>
        <DialogContent
        className='flex flex-col overflow-hidden'
        sx={{
            
            backgroundColor: 'white',
            border: 'solid 6px #7861bb',
            borderRadius: '30px',
            width: '1024px',
            height: '530px',
            overflow: 'hidden',
        }}>
            <div className='flex flex-row h-[50px]'>
                <div className='report-modal-menu-buttons'>
                    <div className={`${portfolioModal.menuControll===0 ? 'report-modal-menu-button-active': 'report-modal-menu-button'}`}
                    onClick={()=>setMenuControl(0)}
                    >Portfolio</div>
                </div>
                <div className='absolute top-[55px] right-[30px]'>
                    {portfolioModal.menuControll===0 && (
                        <div className='absolute top-[0px] right-[25px]'>
                            <PrintReportExportButton />
                        </div>
                    )}
                </div>
            </div>
            {/* Portfolio */}
            {portfolioModal.menuControll===0 && (
                <div className='w-[964px] h-[424px] flex flex-col justify-start items-center pt-[14px] px-[20px] gap-[25px]'>
                    {/* title */}
                    <div className='flex flex-row report-by-unit-page-title-font'>
                        {portfolioModal.displayTitle}
                    </div>
                    <div className={
                        portfolioModal.isCrown 
                        ? 'flex flex-col gap-[15px] w-[943px] h-[425px] border-[1px] border-[#ddd] rounded-[20px] relative px-[25px] pt-[45px] overflow-y-auto'
                        : 'flex flex-col gap-[15px] w-[943px] h-[425px] border-[1px] border-[#ddd] rounded-[20px] px-[25px] pt-[30px] overflow-y-auto justify-start'
                    }>
                        {/* small crown */}
                        {portfolioModal.isCrown && <div className='bg-portfolio-unit-modal-crown-ic-svg bg-no-repeat bg-cover w-[50px] h-[45px] absolute top-0 right-[20px]' />}
                        

                        {/* title */}
                        <div className='portfolio-modal-unit-box-content-title flex flex-row justify-center'>{portfolioModal.contentTitle}</div>

                        {/* content */}
                        <div className=' flex flex-col items-start justify-start'>
                            {portfolioModal.contentBody.map((bodyItem, bodyIndex) => {
                                const key = 'portfolio-modal-report-content-body-'+bodyIndex;
                                
                                return <div key={key} className='portfolio-modal-unit-box-content-body'>
                                    { bodyItem }
                                    {bodyItem.replace(' ','')===''&&<br/>}
                                </div>
                            })}
                        </div>
                    </div>
                    {ReportCompletionDateDiv()}
                    

                    <div className={!portfolioModal.isPrev
                        ? 'absolute top-[265px] left-[0px] bg-tab-prev-btn-disabled bg-contain w-[55px] h-[55px] bg-no-repeat hover:cursor-not-allowed'
                        : 'absolute top-[265px] left-[0px] bg-tab-rubric-modal-left bg-contain w-[55px] h-[55px] bg-no-repeat hover:cursor-pointer'}
                        onClick={handlePrev}
                    />
                    <div className={!portfolioModal.isNext
                        ? 'absolute top-[265px] right-[0px] bg-tab-next-btn-disabled bg-contain w-[55px] h-[55px] bg-no-repeat hover:cursor-not-allowed'
                        : 'absolute top-[265px] right-[0px] bg-tab-rubric-modal-right bg-contain w-[55px] h-[55px] bg-no-repeat hover:cursor-pointer'
                    }
                        onClick={handleNext}
                    />

                </div>
            )}
            
        </DialogContent>
        </Dialog>
        
    </div>
  );
}

