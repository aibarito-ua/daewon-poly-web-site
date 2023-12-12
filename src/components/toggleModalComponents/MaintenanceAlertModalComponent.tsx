import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useLoginStore from '../../store/useLoginStore';

export default function MaintenanceAlertModalComponent(
  
) {
  const {
    maintenanceData,
    setMaintenanceData,
  } = useLoginStore();  
  const [zIndexInit, setZIndexInit] = React.useState<number>();
  React.useEffect(()=>{
    if (maintenanceData.open) {
      setZIndexInit(2000000000)
    } else {
      setZIndexInit(0);
    }
  }, [maintenanceData])

  // const handleClose = () => {
  //   let data = maintenanceData
  //   data.open=false;
  //   setMaintenanceData(data)
  // }
  
  return (
    <div className='flex'>
      <Dialog className=''
      PaperProps={{sx:{
        borderRadius: '20px',
        zIndex: zIndexInit
      }}}
      open={maintenanceData.open} 
      >
        <DialogTitle sx={{
            minWidth: '500px',
            width: '100%',
            background: '#7861bb',
            textAlign: 'center',
            height: '70px',
        }}><span className='maintenance-modal-title'>{'시스템 점검 안내'}</span></DialogTitle>
        <DialogContent 
          className={ 'flex flex-1 flex-col w-[500px] h-fit'}
          sx={{
            paddingY:0,
            paddingX: '20px'
          }}
        >
        <div className='flex flex-1 flex-col h-full justify-center mt-[36px] mb-[30px]'>
            <div className={''}>
                {maintenanceData.data.maintenance_description_kr.map((msg, msgIdx)=>{
                    const keyValue = 'msg-'+msgIdx;
                    return (
                    <div key={keyValue}
                        className={'maintenance-modal-message'}
                    >{msg}</div>
                    )
                })}
            </div>
        </div>
        </DialogContent>
        <DialogActions 
          sx={{
            minWidth: '500px',
            width: '100%',
            height: 'fit',
            paddingY: '20px',
            paddingX: '20px',
          }}
        >
          <div className='flex bg-[#ebf1f8] w-full h-[86px] pt-[15px] rounded-[10px] justify-center items-center relative'>
            <span className='maintenance-modal-time-message'>{maintenanceData.data.time_description_kr}</span>
            <span className='absolute top-[-15px] flex w-[500px] justify-center'>
              <span className='maintenance-modal-time-title'>{'점검시간'}</span>
            </span>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
