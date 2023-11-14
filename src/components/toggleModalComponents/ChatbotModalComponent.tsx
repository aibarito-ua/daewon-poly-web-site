import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { callDialogAPI } from '../../pages/Student/api/EssayWriting.api';
import useLoginStore from '../../store/useLoginStore';
import { CommonInputValidate } from '../../util/common/commonFunctions';
import useControlAlertStore from '../../store/useControlAlertStore';
import { logoutAPI } from '../../pages/Student/api/Login.api';

export default function FormDialog() {
  const inputRef = React.useRef<HTMLTextAreaElement|null>(null);
  const chatDivRef = React.useRef<HTMLDivElement|null>(null);
  const [open, setOpen] = React.useState(false);
  const [inputText, setInputText] = React.useState('');
  const [chatHistory, setChatHistory] = React.useState<(string | string[])[][]>([]);
  const [dataHist, setDataHist] = React.useState<string[][]>([]);

  // input max length
  const [inputLength, setInputLength] = React.useState<number>(0);
  // 매 회 completionToken 누적
  const [historyTokens, setHistoryTokens] = React.useState<number[]>([]);
  // before total token
  const [beforeTurnTotalToken, setBeforeTurnTotalToken] = React.useState<number>(217);

  // input box controller
  const [isInputFocus, setIsInptFocus] = React.useState<boolean>(false);

  
  const {
    userInfo, isMobile, device_id,
    deviceSize, windowSize, platform
  } = useLoginStore();
  const {
    setCommonStandbyScreen, commonAlertOpen,commonAlertClose
  } = useControlAlertStore();
  const ai_name = 'Ella';
  // const user_name = name;
  // const user_name = 'UaTester';
  const user_name = `${userInfo.memberNameEn}`;

  const logoutFn =async () => {
    logoutAPI(userInfo.userCode, device_id)
    if(isMobile)
        window.ReactNativeWebView.postMessage(JSON.stringify('logout'))
    else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
        (window as any).api.toElectron.send('clear')
    }
    window.location.reload()
  }

  // React.useLayoutEffect(()=>{
  //   const targetRef = inputRef.current;
  //   if (targetRef) {
  //     const parentClass = targetRef.parentElement?.parentElement?.parentElement;
  //     const height1 = parentClass?.clientHeight;
  //     const heigth2 = parentClass?.offsetHeight;
  //     const height3 = parentClass?.scrollHeight;
  //     if (isInputFocus && height1===390) {
  //       targetRef.focus();
  //       // targetRef.scrollIntoView({behavior:'auto', block:'nearest'})
  //     }
  //   }
    
  // }, [inputRef, isInputFocus])
  React.useEffect(()=>{
    if (!open) {
        setInputText('')
        setChatHistory([])
        setDataHist([])
        setHistoryTokens([])
        setBeforeTurnTotalToken(217)
        setInputLength(0)
        setIsInptFocus(false)
    } else {
      setIsInptFocus(true)
      // let evt=document.getElementById('chatbot-modal-input-textarea');
      // evt?.focus()
      const initHist = [ [ai_name, [ `Hi, ${user_name}`, 'How can I help you?' ]] ]
      setChatHistory(initHist)
      // callBackFocus()
    }
  }, [open, user_name])
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
    console.log('dataHist log =',dataHist)

  },[chatHistory, dataHist])

  React.useLayoutEffect(()=>{
    if (isInputFocus) {
      if (inputRef.current) {
        const target = inputRef.current;
        target.blur();
        target.focus({
          preventScroll:true
        });
        if (platform==='ios') {
          const screenDiv = document.getElementById('route-wrapper-div');
          if (screenDiv) {
            const screenRootSize = windowSize.height;
            const deviceScreenSize = deviceSize.height;
            console.log('sizeGap: ',screenRootSize-deviceScreenSize)
            const gapSize = screenRootSize-deviceScreenSize;
            screenDiv.style.marginTop= gapSize+'px';
          }
        }
        // if (chatDivRef.current) {
        //   chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
        // }
      }
    } else {
      if (inputRef.current) {
        const target = inputRef.current;
        target.blur();
        const screenDiv = document.getElementById('route-wrapper-div');
        if (platform==='ios') {
          if (screenDiv) {
            const screenRootSize = windowSize.height;
            const deviceScreenSize = deviceSize.height;
            console.log('sizeGap: ',screenRootSize-deviceScreenSize)
            screenDiv.style.marginTop= '0'
          }
        }
        // if (chatDivRef.current) {
        //   chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
        // }
      }
    }
  },[isInputFocus, inputRef])
  

  const callDialogAPIFN = async (txt:string) => {
    // console.log('chat history before api =',chatHistory,'\n',dataHist)
    // api 용 data
    let dumyDataHist = JSON.parse(JSON.stringify(dataHist))
    dumyDataHist.push(["{CHILDNAME}", txt])

    // 채팅용 data
    let dumyChatHist = JSON.parse(JSON.stringify(chatHistory));
    dumyChatHist.push(["{CHILDNAME}", txt])

    let dumyHistAllTokens:number[] = JSON.parse(JSON.stringify(historyTokens))
    setChatHistory(dumyChatHist);
    // let dumyHist = [...chatHistory, ]
    setInputText('')
    // let pushValue:any = []
    // let resultData:string[] = [];
    // console.log('dumyDataHist ==',dumyDataHist,'\n',dumyChatHist)

    return await callDialogAPI(ai_name, user_name, dumyDataHist, userInfo.accessToken).then(async (res)=>{
      if (res.is_server_error) {
        setCommonStandbyScreen({openFlag:false})
        if (res.isDuplicateLogin) {
          commonAlertOpen({
            messages: ['중복 로그인으로 자동 로그아웃 처리 되었습니다.'],
            priorityLevel: 2,
            messageFontFamily:'NotoSansCJKKR',
            useOneButton: true,
            yesButtonLabel:'OK',
            yesEvent: async() => {
                await logoutFn()
            }
          })
        } else {
          commonAlertOpen({
            messages: [
                'Cannot connect to the server.',
                'Please try again later.'
            ],
            priorityLevel: 2,
            useOneButton: true,
            yesButtonLabel:'OK',
            yesEvent: () => {
                commonAlertClose();
            }
          })
        }
      } else {
        let pushValue:any = [ai_name]
        let resultData:string[] = []
        const userUseToken:number = res.usages.prompt_tokens-beforeTurnTotalToken;
        const createdToken:number = res.usages.completion_tokens;
        const dumyHistAllTokensMaxIndex = historyTokens.length;
  
        const totalUseToken:number = res.usages.total_tokens;
        
        dumyHistAllTokens.splice(dumyHistAllTokensMaxIndex, 0, userUseToken, createdToken);
        for await (const value of res.text) {
            resultData.push(value[1])
            dumyDataHist.push(value);
        }
        // console.log('after dumyDataHist : ',dumyDataHist)
        // console.log('after dumyHistAllToken =',dumyHistAllTokens)
  
        let targetTotalToken = res.usages.total_tokens;
        for await (const target of chatHistory) {
          if (targetTotalToken > 3000) {
            // delete
            // console.log('target ==',target)
            const deleteToken = dumyHistAllTokens.splice(0,1);
            targetTotalToken = targetTotalToken - deleteToken[0];
            dumyDataHist.splice(0,1);
          }
        }
        // console.log('after api용',dumyDataHist.length,' : ',dumyDataHist)
        // console.log('after 채팅용',dumyChatHist.length,' : ',dumyChatHist)
        // console.log('after dumyHistAllToken =',dumyHistAllTokens)
        pushValue.push(resultData);
        dumyChatHist.push(pushValue);
        setIsInptFocus(false)
        setBeforeTurnTotalToken(totalUseToken)
        setHistoryTokens(dumyHistAllTokens);
        setChatHistory(dumyChatHist);
        setDataHist(dumyDataHist);
        
      }
      
    })

  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onChangeValue = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log('current value =',e.currentTarget.value)
    // [ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]
    // const removeE = CommonEmoji.remove(e.currentTarget.value);
    // const value = removeE.text.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]|[{}`\\]||(&#)|/gmi,'');
    const value = CommonInputValidate.chat(e.currentTarget.value);
    const checkNotSC = value.match(/[\{\}|\\`]{1,}/gmi)
    const checkOneSC = value.match(/[\[\]\/;:\)*\-_+<>@\#$%&\\\=\(\'\"]{2,}/gmi)
    if (checkNotSC!==null) {
      console.log('불가 문자 입력')
    } else if (checkOneSC!==null) {
      console.log('2개 이상 금지')
    } else {
      e.currentTarget.style.height = 'auto';
      e.currentTarget.style.height = e.currentTarget.scrollHeight+'px';
      const inputValue = value.replace(/\n{2,}/gm, '\n')
      const countInputLength = inputValue.length
      setInputLength(countInputLength)
      setInputText(inputValue)
    }
  }

  const onKeyUpEvent = async (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key==='Enter') {
        if (isMobile || !e.shiftKey) {
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
        className={open ? `chatbot-modal-button`:'chatbot-modal-button-inactive'}
        // className='relative z-50'
        onClick={handleClickOpen}
    ></button>
      <Dialog className=''
      sx={{ '.MuiDialog-container':{ backgroundColor: 'rgba(0,0,0,0.5)'},
        '.MuiDialog-paper': { 
          minWidth:'700px',
          width: '700px',
          minHeight: isInputFocus ? '390px':'650px',
          // minHeight: '390px',
          height: '390px',
          padding: '32px 0 0',
          borderRadius: '20px',
          backgroundColor: '#fff',
          marginTop: isInputFocus ? '-430px': '-50px',
          // marginTop: '-310px',
        }
      }}
      open={open} onClose={handleClose}>
        {/* <DialogTitle>Chatbot</DialogTitle> */}
        <DialogContent 
            className='flex flex-1 flex-col min-w-[500px] h-[390px]'
            sx={{padding: '0 20px'}}
        >
        <div className='flex flex-1 h-[290px]'>

        <div className='flex flex-grow flex-col-reverse w-full overflow-y-auto pb-[20px]'
        ref={chatDivRef}
        id={'chat-window-div'}
        >
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
          <div className='flex flex-col w-full'>
            <textarea 
              id='chatbot-modal-input-textarea'
              ref={inputRef}
              className='chatbot-chat-textarea'
              autoFocus={isInputFocus}
              style={{resize:'none'}}
              maxLength={1000}
              rows={1}
              placeholder='Type your question here.'
              onChange={(e)=>onChangeValue(e)}
              onKeyUp={async (e)=>await onKeyUpEvent(e)}
              onFocus={()=>{
                setIsInptFocus(true)
              }}
              onBlur={()=>{
                setIsInptFocus(false)
              }}
              value={inputText}
            />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
