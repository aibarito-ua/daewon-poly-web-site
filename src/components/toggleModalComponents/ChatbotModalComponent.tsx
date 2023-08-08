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
// import buttonImage from './img/buttonEllaImg.png'
import buttonImage from '../../util/svgs/btn-chatbot-ella.svg';

export default function FormDialog() {
    
  const [open, setOpen] = React.useState(false);
  const [inputText, setInputText] = React.useState('');
  const [chatHistory, setChatHistory] = React.useState<(string | string[])[][]>([]);
  const [dataHist, setDataHist] = React.useState<string[][]>([]);
  const {
    name
  } = useLoginStore();
  const ai_name = 'Ella';
  // const user_name = name;
  const user_name = 'UaTester';
  React.useEffect(()=>{
    if (!open) {
        setInputText('')
        setChatHistory([])
        setDataHist([])
    }
  }, [open])
  React.useEffect(()=>{
    if (inputText === '') {
        let evt=document.getElementById('chatbot-modal-input-textarea');
        if (evt) {
            evt.style.height = 'auto';
            evt.style.height = evt.scrollHeight + 'px';
        }
    }
  }, [inputText])
  React.useEffect(()=>{
    console.log('chat history log =',chatHistory)
  },[chatHistory])

  const callDialogAPIFN = async (txt:string) => {
    console.log('chat history before api =',chatHistory)
    let dumyDataHist = JSON.parse(JSON.stringify(dataHist))
    dumyDataHist.push(["{CHILDNAME}", txt])
    let dumyHist = JSON.parse(JSON.stringify(chatHistory));
    dumyHist.push(["{CHILDNAME}", txt])
    setChatHistory(dumyHist);
    // let dumyHist = [...chatHistory, ]
    setInputText('')
    return await callDialogAPI(ai_name, user_name, dumyDataHist).then(async (res)=>{
        let name = res[0][0];
        console.log('name ==',name)
        let pushValue:any = [name]
        let resultData:string[] = []
        for await (const value of res) {
            resultData.push(value[1])
            dumyDataHist.push(value);
        }
        pushValue.push(resultData);
        dumyHist.push(pushValue);
        setChatHistory(dumyHist);
        setDataHist(dumyDataHist);
    });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onChangeValue = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log('current value =',e.currentTarget.value)
    e.currentTarget.style.height = 'auto';
    e.currentTarget.style.height = e.currentTarget.scrollHeight+'px';
    const value = e.currentTarget.value;
    const inputValue = value.replace(/\n{2,}/gm, '\n')
    setInputText(inputValue)
  }

  const onKeyUpEvent = async (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key==='Enter') {
        if (!e.shiftKey) {
            console.log('enter')
            console.log('inputText =',inputText)
            
            e.currentTarget.value = '';
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.height = e.currentTarget.scrollHeight+'px';
            const inputTextValue = inputText.replace(/\n$/gmi,'');
            await callDialogAPIFN(inputTextValue);
        } 
    }
  }

  return (
    <div className='flex'>
    <button 
        className={`chatbot-modal-button`}
        // className='relative z-50'
        onClick={handleClickOpen}
    ></button>
      <Dialog className=''
      sx={{ '.MuiDialog-container':{ backgroundColor: 'rgba(0,0,0,0.5)'},
        '.MuiDialog-paper': { 
          width: '700px',
          minHeight: '390px',
          padding: '32px 0 0',
          borderRadius: '20px',
          backgroundColor: '#fff',
          marginTop: '-200px',
        }
      }}
      open={open} onClose={handleClose}>
        {/* <DialogTitle>Chatbot</DialogTitle> */}
        <DialogContent 
            className='flex flex-1 flex-col min-w-[500px] h-[390px]'
            sx={{padding: '0 20px'}}
        >
        <div className='flex flex-1 h-[290px]'>

        <div className='flex flex-grow flex-col-reverse w-full overflow-y-auto'>
        {chatHistory.slice(0).reverse().map((hist, idx)=>{
            const chatDiv = hist[0] === ai_name ? 'chat-ai-div' : 'chat-user-div';
            const chatItemPosition = hist[0]===ai_name ? '': 'chat-user-div-position';
            const chatItem = hist[0]=== ai_name ? 'chat-ai-div-child' : 'chat-user-div-child';
            let nameDiv:any = <div>{hist[0]===ai_name?ai_name: user_name}</div>;
            
            
            return <div key={'chatmodal-ai-chat-hist-'+idx.toString()} className={chatDiv}>
                <div className={chatItemPosition}>
                    <div className={`chat-user-name-div ${chatItemPosition}`}>{nameDiv}</div>
                    {Array.isArray(hist[1]) && <div className='flex flex-col'>{hist[1].map((v, i)=>{
                        return <div key={i} className={chatItem}>{v}</div>
                    })}</div>
                    }
                    {typeof(hist[1])==='string' && <div className={chatItem}>{hist[1]}</div>}
                </div>
                </div>
        })}
        </div>
        </div>
        </DialogContent>
        <DialogActions sx={{
          borderTop: 'solid 1px #d9dde1',
          padding: '19px 20px',
          minHeight: '94px'
        }}>
          <textarea 
            id='chatbot-modal-input-textarea'
            className='chatbot-chat-textarea'
            style={{resize:'none'}}
            autoFocus
            rows={1}
            placeholder='Type your question here.'
            onChange={(e)=>onChangeValue(e)}
            onKeyUp={async (e)=>await onKeyUpEvent(e)}
            value={inputText}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}
