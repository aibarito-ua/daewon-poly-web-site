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
    // setMaintenanceData,
    closeMaintenanceModal
  } = useLoginStore();  
  const [zIndexInit, setZIndexInit] = React.useState<number>();
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [descriptionTitle, setDescriptionTitle] = React.useState('');
  // maintenanceData.data.is_type_maintenance
  React.useEffect(()=>{
    if (maintenanceData.open) {
      if (maintenanceData.data.is_type_maintenance) {
        setDialogTitle('시스템 점검 안내')
        setDescriptionTitle('점검시간')
      } else if (maintenanceData.data.is_type_service_stopped) {
        setDialogTitle('서비스 오픈 안내')
        setDescriptionTitle('오픈일정')
      } else {
        setDialogTitle('시스템 점검 안내')
        setDescriptionTitle('점검시간')
      }
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
  const YesButton = () => {
    return (
      <div className='flex w-full justify-center'>
        <button 
            type="button"
            className={"modal-popup-maintenance-stop-service-btn"}
            onClick={closeMaintenanceModal}
        >{'OK'}</button>
      </div>
    )
}
  
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
        }}><span className='maintenance-modal-title'>{dialogTitle}</span></DialogTitle>
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
              <span className='maintenance-modal-time-title'>{descriptionTitle}</span>
            </span>
          </div>
        </DialogActions>
        {maintenanceData.data.is_type_service_stopped && (
          <DialogActions 
            sx={{
              minWidth: '500px',
              width: '100%',
              height: 'fit',
              paddingY: '20px',
              paddingX: '20px',
            }}
          ><YesButton /></DialogActions>
        )}
      </Dialog>
    </div>
  );
}
