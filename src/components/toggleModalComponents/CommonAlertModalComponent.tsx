import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useControlAlertStore from '../../store/useControlAlertStore';
import {commonSvgs} from '../../util/svgs/commonModalSvgs'
import {debounce} from 'lodash';

export default function CommonAlertModalComponent(
  
) {
  const {
    commonAlertOpenFlag,
    commonAlertMessage,
    commonAlertHeadTitle,
    commonAlertNoLabel,
    commonAlertYesLabel,
    commonAlertOneButton,
    commonAlertType,
    commonAlertMessageFontFamily,
    commonAlertPriorityLevel,

    // setCommonAlertHeadTitle,
    commonAlertClose,
    // setCommonAlertMessage,
    // commonAlertOpen,
    commonAlertCloseEvent,
    commonAlertYesFunctionEvent,
  } = useControlAlertStore();  
  
  const [isUseLeftButton, setIsUseLeftButton] = React.useState<boolean>(false);
  const [isUseRightButton, setIsUseRightButton] = React.useState<boolean>(false);
  const [zIndexInit, setZIndexInit] = React.useState<number>();

  React.useEffect(()=>{
    if (commonAlertPriorityLevel === 0) {
      setZIndexInit(2000000000)
    } else if (commonAlertPriorityLevel === 1) {
      setZIndexInit(2000000000)
    } else if (commonAlertPriorityLevel === 2) {
      setZIndexInit(2100000000)
    } else if (commonAlertPriorityLevel === 3) {
      setZIndexInit(2147483647)
    }
  }, [commonAlertOpenFlag])

  React.useEffect(()=>{
    if (isUseLeftButton) {
      handleCallbackDebounce();
      setIsUseLeftButton(false)
    }
  }, [isUseLeftButton])

  const handleCallbackDebounce = React.useCallback(
    debounce( async () => {
      console.log('debouncing...')
      if (commonAlertYesFunctionEvent!==null) {
        commonAlertYesFunctionEvent()
        
      } else {
        if (commonAlertType!=='continue' && commonAlertType!=='warningContinue') {
          
          commonAlertClose();
        }
      }
    }, 1000, {leading:true, trailing: false}), []
  )
  // const handleLeft = () => {
  //   if (commonAlertYesFunctionEvent!==null) {
  //     commonAlertYesFunctionEvent()
  //   } else {
  //     if (commonAlertType!=='continue' && commonAlertType!=='warningContinue') {
        
  //       commonAlertClose();
  //     }
  //   }
  // };

  const handleRight = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (isUseRightButton) return;
    setIsUseRightButton(true);
    if (commonAlertCloseEvent!==null) {
      commonAlertCloseEvent();
    } else {
      if (commonAlertType!=='continue' && commonAlertType!=='warningContinue') {
        commonAlertClose();
      }
    }
    setIsUseRightButton(false);
  };

  const handleClose = () => {
    if (commonAlertType!=='continue' && commonAlertType!=='warningContinue') {
      commonAlertClose();
    }
  }
  
  return (
    <div className='flex'>
      <Dialog className=''
      PaperProps={{sx:{
        borderRadius: '20px',
        zIndex: zIndexInit
      }}}
      open={commonAlertOpenFlag} 
    // open={true}
      // onClose={handleClose}
      >
        <DialogContent 
          className={ (commonAlertType==='warning'||commonAlertType==='warningContinue')? 'flex flex-1 flex-col w-fit min-w-[390px] h-fit':'flex flex-1 flex-col w-fit min-w-[390px] h-[160px]'}
          sx={{
            paddingY:0,
            paddingX: 0
          }}
        >
        <div className='flex flex-1 flex-col h-full justify-center border-t border-t-[#dddddd]'>
            {(commonAlertType==='warning'||commonAlertType==='warningContinue') && <div className='flex flex-row justify-center'><commonSvgs.ExclamationMarkIcon className='w-[100px] h-[100px] mt-[36px]'/></div>}
            
            {commonAlertHeadTitle !== '' && <div className={`text-center text-[20px] font-[700] text-[#222222] ${(commonAlertType==='warning'||commonAlertType==='warningContinue')? 'mt-[20px]': 'mt-[39.4px]'} ${commonAlertMessageFontFamily==='Roboto' ? 'font-roboto':'font-notoSansCJKKR'}`}>{commonAlertHeadTitle}</div>}
            <div className={(commonAlertType==='warning'||commonAlertType==='warningContinue') ? (
                commonAlertHeadTitle !== '' ? 'mt-[10px] mb-[30px]':'mt-[23px] mb-[30px]'
            ): (
                commonAlertHeadTitle !== '' ? 'mt-[10px] mb-[28.6px]':'mt-[48px] mb-[36.1px]'
            )}>
                {commonAlertMessage.map((msg, msgIdx)=>{
                    const keyValue = 'msg-'+msgIdx;
                    return (
                    <div key={keyValue}
                        className={commonAlertMessageFontFamily==='Roboto' ? 'text-center font-roboto text-[18px] px-[36px] font-[500] text-[#444444]':'text-center font-notoSansCJKKR text-[18px] px-[36px] font-[500] text-[#444444]'}
                    >{msg}</div>
                    )
                })}
            </div>
        </div>
        </DialogContent>
        <DialogActions sx={{
          display:'flex',
          padding:0,
          margin:0,
        }}>
            {commonAlertOneButton ? (
                <div className='flex flex-1 flex-row justify-center w-full h-[50px] mb-[10px] mx-[10px] items-center'>
                  <div className='flex flex-1 h-full justify-center font-[Roboto] font-[700] text-[16px] bg-[#42278f] rounded-[15px] text-[#ffffff] hover:cursor-pointer items-center'
                    onClick={()=>{setIsUseLeftButton(true)}}
                  >{commonAlertYesLabel}</div>
                </div>
              ):(
                <div className='flex flex-1 flex-row justify-center w-full h-[50px] mb-[10px] mx-[10px] gap-[10px] items-center'>
                  <div className='flex flex-1 h-full max-w-[180px] justify-center font-[Roboto] font-[700] text-[16px] bg-[#dcdadf] rounded-[15px] text-[#959aaa] hover:cursor-pointer items-center'
                  
                  onClick={()=>{setIsUseLeftButton(true)}}
                  >{commonAlertYesLabel}</div>
                  <div className='flex flex-1 h-full max-w-[180px] justify-center font-[Roboto] font-[700] text-[16px] bg-[#42278f] rounded-[15px] text-[#ffffff] hover:cursor-pointer items-center'
                    onClick={handleRight}
                  >{commonAlertNoLabel}</div>
                </div>
            )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
