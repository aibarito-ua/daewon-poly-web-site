import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { callDialogAPI } from '../../pages/Student/api/EssayWriting.api';
import useLoginStore from '../../store/useLoginStore';
import buttonImage from './img/report_image.png'

export default function ReportModalComponent() {
    
  const [open, setOpen] = React.useState(false);
  
  React.useEffect(()=>{
    
  }, [open])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onChangeValue = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // // console.log('current value =',e.currentTarget.value)
    // e.currentTarget.style.height = 'auto';
    // e.currentTarget.style.height = e.currentTarget.scrollHeight+'px';
    // const value = e.currentTarget.value;
    // const inputValue = value.replace(/\n{2,}/gm, '\n')
    // setInputText(inputValue)
  }

  const onKeyUpEvent = async (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if (e.key==='Enter') {
    //     if (!e.shiftKey) {
    //         console.log('enter')
    //         console.log('inputText =',inputText)
            
    //         e.currentTarget.value = '';
    //         e.currentTarget.style.height = 'auto';
    //         e.currentTarget.style.height = e.currentTarget.scrollHeight+'px';
    //         const inputTextValue = inputText.replace(/\n$/gmi,'');
    //         await callDialogAPIFN(inputTextValue);
    //     } 
    // }
  }

  return (
    <div className='flex'>
    <button 
        className={`chatbot-modal-button justify-center bg-black rounded-lg`}
        onClick={handleClickOpen}
    ><img className='flex w-12 h-12' src={buttonImage}/></button>
      <Dialog className=''
      open={open} onClose={handleClose}>
        <DialogTitle>Report</DialogTitle>
        <DialogContent 
            className='flex flex-1 flex-col min-w-[500px] bg-[#f3f3f3] h-[500px]'
        >
        <div className='flex flex-1 h-[400px]'>

        <div className='flex flex-grow flex-col-reverse w-full overflow-y-auto'>
        
        </div>
        
        </div>
          
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
