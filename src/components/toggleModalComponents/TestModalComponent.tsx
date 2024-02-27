import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ReportComponentToPrint from '../commonComponents/printComponent/report/PrintReportComponent';
import useLoginStore from '../../store/useLoginStore';
import useControlAlertStore from '../../store/useControlAlertStore';

export default function TestModalComponent() {
    
  const [open, setOpen] = React.useState(false);
  
  React.useEffect(()=>{
    
  }, [open])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [replaceBody, setReplaceBody] = React.useState<JSX.Element[][]>([]);
    const [isReplace, setIsReplace] = React.useState<boolean>(false);
    const [isMulti, setIsMulti] = React.useState<boolean>(false);

    const {userInfo} = useLoginStore();
    const {
        reportModalRubricData,
        reportSelectBookName,
        reportSelectFinder,
        reportSelectUnit,
        unitReportData,
        reportByUnitMainTitle,
    } = useControlAlertStore();

  return (
    <div className=''>
    <button 
        className={`bg-tab-print-btn-ic-svg bg-no-repeat w-[100px] h-[48px]`}
        onClick={handleClickOpen}
    ></button>
      <Dialog className=''
      fullWidth={true}
      PaperProps={{sx:{
        width: '1075x',
        maxWidth: '1075px',
        height: '100%',
        backgroundColor: 'rgba(0.4,0,0.2, 0)',
        boxShadow: 'none',
        padding:0,
        margin:0,

      }}}
      open={open} onClose={handleClose}>
        <DialogTitle>Report</DialogTitle>
        <DialogContent 
        sx={{
          width: '100%',
          maxWidth: '100%',
          minWidth: 'fit-content'
        }}
            className='flex flex-1 flex-col w-full bg-[#f3f3f3] h-full'
        >
        
        <ReportComponentToPrint 
                currentOverall={[]}
                multi={{currentPageNum: 1, maxPageNum: 1}} 
                isMulti={isMulti}
                userInfo={userInfo}
                reportModalRubricData={reportModalRubricData}
                reportSelectBookName={reportSelectBookName}
                reportSelectFinder={reportSelectFinder}
                reportSelectUnit={reportSelectUnit}
                unitLabel={reportByUnitMainTitle}
                unitReportData={unitReportData}
                />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
