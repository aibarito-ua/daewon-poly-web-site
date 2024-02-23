import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { callDialogAPI } from '../../pages/Student/api/EssayWriting.api';
import useLoginStore from '../../store/useLoginStore';
import { CommonInputValidate } from '../../util/common/commonFunctions';
import useControlAlertStore from '../../store/useControlAlertStore';
import { logoutAPI } from '../../pages/Student/api/Login.api';
import { useNavigate } from 'react-router-dom';

export default function FormDialog() {
  const navigate = useNavigate();
  const inputRef = React.useRef<HTMLTextAreaElement|null>(null);
  const chatDivRef = React.useRef<HTMLDivElement|null>(null);
  const [open, setOpen] = React.useState(false);
  const [inputText, setInputText] = React.useState('');
  // chat history : app 유지
  const [chatHistory, setChatHistory] = React.useState<(string | string[])[][]>([]);
  // chat data history : app 유지
  const [dataHist, setDataHist] = React.useState<string[][]>([]);

  // input max length
  // const [inputLength, setInputLength] = React.useState<number>(0);
  // 매 회 completionToken 누적 : app 유지
  const [historyTokens, setHistoryTokens] = React.useState<number[]>([]);
  // before total token : app 유지
  const [beforeTurnTotalToken, setBeforeTurnTotalToken] = React.useState<number>(217);

  // input box controller
  const [isInputFocus, setIsInptFocus] = React.useState<boolean>(false);
  // block input
  const [blockInput, setBlockInput] = React.useState<boolean>(false)
  // external keyboard
  const [isKeyboardExternal, setIsKeyboardExrernal] = React.useState<boolean>(true)
  // message window bottom
  const messagesEndRef = React.useRef<HTMLDivElement|null>(null)

  // 입력 제한
  /**
   * 
   * @param targetText string
   * @returns boolean -> true: 사용 가능 / false: 사용 불가
   */
  const checkInputCharactersRegExps = (targetText: string) => {
    const checkNotSC = targetText.match(/[\{\}|\\`]{1,}/gmi)
    const checkOneSC = targetText.match(/[\[\]\/;:\)*\-_+<>@\#$%&\\\=\(\'\"]{2,}/gmi)
    const checkNotKR = targetText.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/gmi)
    if (checkNotSC!==null) {
        console.log('불가 문자 입력')
        return false;
    } else if (checkOneSC!==null) {
        console.log('2개 이상 금지')
        return false;
    } else if (checkNotKR!==null) {
        console.log('한국어')
        return false;
    } else {
        return true;
    }
  }
  
  const {
    userInfo, isMobile, device_id,
    deviceSize, windowSize, platform,
    setMaintenanceData
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
  
  React.useEffect(() => {
    if(isMobile) {
      window.addEventListener('message', receiveMessage, true);
    }
    return () => {
      if (isMobile) {
        window.removeEventListener('message', receiveMessage, true)
      }
    }
  }, [])
  
  React.useEffect(()=>{
    console.log('=== open effect ===')
    if (!open) {
      setInputText('')
      setChatHistory([])
      setDataHist([])
      setHistoryTokens([])
      setBeforeTurnTotalToken(217)
      setIsInptFocus(false)
    } else {
      if( isMobile) {
        sendMessage('open-chatbot-modal')
      } else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
        const electronData = (window as any).api.toElectron.sendSync('open-chatbot-modal')
        console.log('electron data:', electronData)
        if (electronData) {
          const isExistElectronData = receiveElectronData(electronData);
          if (!isExistElectronData) {
            const initHist = [ [ai_name, [ `Hi, ${user_name}`, 'How can I help you?' ]] ]
            setChatHistory(initHist)
          }
        }
      }
      setIsInptFocus(true)
    }

  }, [
    open, user_name, isMobile,
  ])
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
    console.log('set init chat history')
    if (chatHistory.length === 0) {
      const initHist = [ [ai_name, [ `Hi, ${user_name}`, 'How can I help you?' ]] ]
      setChatHistory(initHist)
    }
    scrollToBottom()
  },[chatHistory, dataHist])

  React.useLayoutEffect(()=>{
    console.log('platform=',platform)
    if (isInputFocus) {
      if(isMobile) {
        sendMessage('InputFocus')
      }
      if (inputRef.current) {
        const target = inputRef.current;
        target.blur();
        if (isMobile) {
          setMobileChatWindow()
        } else {
          target.focus();
          inputRef.current.scrollIntoView({behavior:'auto', block:'nearest'})
        }
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
      }
    }
  },[isInputFocus, inputRef])

  // electron receive
  const receiveElectronData = async (rnData:any) => {
    let isExistData = false;
    if (rnData['chatHistory']) {
      console.log('set chat history')
      isExistData=true;
      setChatHistory(rnData['chatHistory'])
    }
    if (rnData['dataHist']) {
      console.log('set data history')
      isExistData=true;
      setDataHist(rnData['dataHist'])
    }
    if (rnData['historyTokens']) {
      console.log('set history tokens')
      isExistData=true;
      setHistoryTokens(rnData['historyTokens'])
    }
    if (rnData['beforeTurnTotalToken']) {
      console.log('set beforeTurnTotalToken')
      isExistData=true;
      setBeforeTurnTotalToken(rnData['beforeTurnTotalToken'])
    }
    return isExistData;
  }
  
  /**
   * app 소켓 통신 이벤트
   * @param data 
   */
  const sendMessage = (data:any) => {
    console.log('Send message data =',data)
    const messageData = JSON.stringify(data);
    window.ReactNativeWebView.postMessage(messageData);
  };
  const receiveMessage = (event: any) => {
    console.log('Receive message data =',event.data);
    if(typeof event.data !== 'string')
        return
    const data = JSON.parse(event.data)
    const rnData = JSON.parse(event.data);
    if (rnData['chatHistory']) {
      console.log('set chat history')
      setChatHistory(rnData['chatHistory'])
    }
    if (rnData['dataHist']) {
      console.log('set data history')
      setDataHist(rnData['dataHist'])
    }
    if (rnData['historyTokens']) {
      console.log('set history tokens')
      setHistoryTokens(rnData['historyTokens'])
    }
    if (rnData['beforeTurnTotalToken']) {
      console.log('set beforeTurnTotalToken')
      setBeforeTurnTotalToken(rnData['beforeTurnTotalToken'])
    }

    if (inputRef.current) {
      const target = inputRef.current;
      target.blur();
      if (isMobile) {
        if(data['keyboardDidHide'] == true) {
          return;
        }
        if(data['isExternalKeyboard']) {
          setIsKeyboardExrernal(true)
          target.focus();
          inputRef.current.scrollIntoView({behavior:'auto', block:'nearest'})
          return
        } else {
          setIsKeyboardExrernal(false)
        }
        setMobileChatWindow()
      } else {
        target.focus();
        inputRef.current.scrollIntoView({behavior:'auto', block:'nearest'})
      }
    }
  }

  /**
   * app 화면별 viewer setting
   */
  const setMobileChatWindow = () => {
    if (inputRef.current) {
      const target = inputRef.current;
      target.blur();
      if (isMobile) {
        if (platform==='ios') {
          target.focus({
            preventScroll:true
          });
          const screenDiv = document.getElementById('route-wrapper-div');
          if (screenDiv) {
            const screenRootSize = windowSize.height;
            const deviceScreenSize = deviceSize.height;
            console.log('sizeGap: ',screenRootSize-deviceScreenSize)
            const gapSize = screenRootSize-deviceScreenSize;
            screenDiv.style.marginTop= gapSize+'px';
          }
        }
        if (platform==='android') {
          target.focus();
          inputRef.current.scrollIntoView({behavior:'auto', block:'nearest'})
        }
      } else {
        target.focus();
        inputRef.current.scrollIntoView({behavior:'auto', block:'nearest'})
      }
    }
  }
  const scrollToBottom = () => {
    console.log('===scrollToBottom ===')
    if(messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior:'smooth'})
  }

  /**
   * 챗봇 이벤트
   * @param txt 입력 텍스트
   * @returns Promise<void>: update state
   */
  const callDialogAPIFN = async (txt:string) => {
    // api 용 data
    let dumyDataHist = JSON.parse(JSON.stringify(dataHist))
    dumyDataHist.push(["{CHILDNAME}", txt])

    // 채팅용 data
    let dumyChatHist = JSON.parse(JSON.stringify(chatHistory));
    dumyChatHist.push(["{CHILDNAME}", txt])

    let dumyHistAllTokens:number[] = JSON.parse(JSON.stringify(historyTokens))
    setChatHistory(dumyChatHist);
    setInputText('')

    return await callDialogAPI(ai_name, user_name, dumyDataHist, userInfo.accessToken).then(async (res)=>{
      setBlockInput(false)
      if (res.is_server_error) {
        if (res.data) {
          let maintenanceInfo:TMaintenanceInfo = res.data;
          maintenanceInfo.start_date = res.data.start_date;
          maintenanceInfo.end_date = res.data.end_date;
          let dumyMaintenanceData:TMaintenanceData = {
            alertTitle: '시스템 점검 안내',
            data: maintenanceInfo,
            open: false,
            type: ''
          }
          setCommonStandbyScreen({openFlag:false})
          setMaintenanceData(dumyMaintenanceData)
          navigate('/')
          
        } else {
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
  
        let targetTotalToken = res.usages.total_tokens;
        for await (const target of chatHistory) {
          if (targetTotalToken > 3000) {
            // delete
            const deleteToken = dumyHistAllTokens.splice(0,1);
            targetTotalToken = targetTotalToken - deleteToken[0];
            dumyDataHist.splice(0,1);
          }
        }
        pushValue.push(resultData);
        dumyChatHist.push(pushValue);
        setIsInptFocus(true)

        // app repository update
        const appRepositoryData = { 
          chatHistory:dumyChatHist,
          dataHist,dumyDataHist,
          historyTokens:dumyHistAllTokens,
          beforeTurnTotalToken:totalUseToken,
          userInfo
        }
        console.log('==appRepositoryData==:',appRepositoryData)
        if (isMobile) {
          window.ReactNativeWebView.postMessage(JSON.stringify({event: "chatbot", data: appRepositoryData}));
        } else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
          (window as any).api.toElectron.send('chatbot', appRepositoryData)
        }

        setBeforeTurnTotalToken(totalUseToken);
        setHistoryTokens(dumyHistAllTokens);
        setChatHistory(dumyChatHist);
        setDataHist(dumyDataHist);
      }
    })
  }

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onChangeValue = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('=== onChangeValue ====')
    e.preventDefault();
    if(blockInput) {
      return
    } else {
      const value = CommonInputValidate.chat(e.currentTarget.value);
      const checkNotChar = checkInputCharactersRegExps(value)
      if (checkNotChar) {
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.height = e.currentTarget.scrollHeight+'px';
        const inputValue = value.replace(/\n{2,}/gm, '\n')
        setInputText(inputValue)
      }
    }
  }

  const onKeyUpEvent = async (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log(' ==== onKeyUpEvent ====')
    if (e.key==='Enter' && !blockInput) {
        if (isMobile || !e.shiftKey) {
          if (e.currentTarget.value.replace(/\s+/gmi, '') !== '') {
            e.currentTarget.value = '';
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.height = e.currentTarget.scrollHeight+'px';
            const inputTextValue = inputText.replace(/\n$/gmi,'');
            setBlockInput(true)
            await callDialogAPIFN(inputTextValue);
          }
        } 
    }
  }
  const marginTopTrueValue = platform==='ios'? '-430px':'0px';
  return (
    <div className='flex'>
    <button 
        className={open ? `chatbot-modal-button`:'chatbot-modal-button-inactive'}
        onClick={handleClickOpen}
    ></button>
      <Dialog className=''
      sx={{ '.MuiDialog-container':{ backgroundColor: 'rgba(0,0,0,0.5)'},
        '.MuiDialog-paper': { 
          minWidth:'750px',
          width: '750px',
          minHeight: isMobile ? (isInputFocus && !isKeyboardExternal ? '390px':'650px'): '650px',
          height: '390px',
          paddingTop: '32px',
          paddingLeft: '25px',
          paddingRight: '25px',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          marginTop: isMobile ? (isInputFocus && !isKeyboardExternal ? marginTopTrueValue: '-50px'): '-50px',
        }
      }}
      open={open} >
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
          }}>
            <div className='w-[50px] h-[50px] m-0 p-0 bg-modal-close-button-svg bg-contain bg-no-repeat'
              onClick={handleClose}
              onTouchEnd={handleClose}  
            />
          </button>
        </div>
        <DialogContent 
          className='flex flex-1 flex-col min-w-[500px] h-[390px] bg-white rounded-sm'
          sx={{padding: '0 20px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px'}}
        >
          <div className='flex flex-1 h-[290px]'>
            <div className='flex flex-grow flex-col-reverse w-full overflow-y-auto pb-[20px]'
            ref={chatDivRef}
            id={'chat-window-div'}>
              <div ref={messagesEndRef}/>
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
          minHeight: '94px',
          backgroundColor: '#fff',
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px'
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
