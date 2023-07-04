import React from 'react';
import useEssayWritingCenterDTStore from "../../store/useEssayWritingCenterDTStore";
import useLoginStore from "../../store/useLoginStore";
import useNavStore from "../../store/useNavStore";
import useSparkWritingStore from "../../store/useSparkWritingStore";
import { useNavigate, useParams } from 'react-router-dom';
import { PopupModalComponent } from '../../components/toggleModalComponents/popupModalComponent';
import contentComponent from '../../components/pageComponents/previewSparkWriting/contentComponent';
import { grammarCheck, previewTest } from './api/GrammarApi';
import useGrammarStore from '../../store/useGrammarStore';
import GrammarContentComponent from '../../components/pageComponents/previewSparkWriting/grammarContentComponent';
import { isEqual } from 'lodash';

const PreviewSparkWriting = (props:any) => {
    // stores
    // Spark Store
    const {outlineItems, checkWritingValues, selectBoxUnit, setSelectBoxUnit} = useSparkWritingStore();
    // Nav Store
    const {setTopNavHiddenFlagged, setSubNavTitleString, selectUnitInfo, setSubRightNavTitleString} = useNavStore();
    // WritingCenter Store
    const {} = useEssayWritingCenterDTStore();
    // current role
    const {} = useLoginStore();
    const {setGrammarBody, setGrammarTitle, setGrammarAll, grammarTitle, grammarBody, grammarAll,
        resultTitle,resultBody, setGrammarResult,
        returnData, 
        setGrammarResultInit
    } = useGrammarStore();

    // page States
    const [bodyHistory, setBodyHistory] = React.useState<TBodyHistorys>(
        {
            title: { past: [], present: [], future: [] },
            body:{ past: [], present: [], future: [] }
        }
    );
    const [isUndoBody, setIsUndoBody] = React.useState<boolean>(false);


    const setInitHistorys = (hist:{title:TbodyHistory, body:TbodyHistory}) => {
        const stateValue = GrammarContentComponent.setTInitHistorys(hist, bodyHistory);
        if (stateValue!==undefined) setBodyHistory(stateValue);
    }
    const setTitleValue = (hist:TbodyHistory) => {
        const stateValue = GrammarContentComponent.setTTitleHistorys(bodyHistory.title, hist);
        const past = stateValue?.past ? stateValue.past: [];
        const present = stateValue?.present ? stateValue?.present : [];
        const future: TbodyHistory[] = [];
        const currentHist = bodyHistory.body;
        setBodyHistory({
            title: {past, present, future},
            body: {past: [...currentHist.past, currentHist.present], present: currentHist.present, future: []}
        })
    }

    const setBodyValue = (hist:TbodyHistory) => {
        const stateValue = GrammarContentComponent.setTbodyHistorys(bodyHistory.body, hist);
        const past = stateValue?.past ? stateValue.past: [];
        const present = stateValue?.present ? stateValue?.present : [];
        const future: TbodyHistory[] = [];
        const currentHist = bodyHistory.title;
        setBodyHistory({
            title: {past: [...currentHist.past, currentHist.present], present: currentHist.present, future: []},
            body: {past, present, future}
        })
    }
    const undoValue = () => {
        // UNDO
        const undoState = GrammarContentComponent.undoRedoReset(bodyHistory, 'UNDO')
        setBodyHistory(undoState)
    }

    // page state
    // Guide text
    const [guideText, setGuideText] = React.useState<string[]>([]);
    const [guideFlag, setGuideFlag] = React.useState<number>(0);
    // Button Flags && Modal
    // Edit button flag
    const [openEditButton, setOpenEditButton] = React.useState<boolean>(false);
    const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
    // AI Proofreading button flag
    const [openAIProofreadingButton, setOpenAIProofreadingButton] = React.useState<boolean>(false);
    const [showAIProofreadingModal, setShowAIProofreadingModal] = React.useState<boolean>(false);
    // Submit Button Flag
    const [openSubmitButton, setOpenSubmitButton] = React.useState<boolean>(false);
    // AI Proofreading count
    const [countofUseAIProofreading, setCountofUseAIProofreading] = React.useState<number>(-1);
    
    // param hook
    const params = useParams();
    // path param to number
    const unitIndex:number = parseInt(params.unit!==undefined? params.unit:'1') - 1;
    // Navigate hook
    const navigate = useNavigate();

    // AI Proofreading Events
    const AIProofreadingOnClickEvent = () => setShowAIProofreadingModal(true);
    const AIProofreadingClose = () => setShowAIProofreadingModal(false);
    const AIProofreadingYesOnClick = async () => {
        // count plus
        if (countofUseAIProofreading < 2) {
            let checkResultData: any[] = []
            for await (const idx of grammarAll) {
                
                const res = await grammarCheck(idx)
                checkResultData.push(res)
            }
            // setGrammarResult(checkResultData)
            // checkResultData = [...returnData]
            const grammarResults = setGrammarResult(checkResultData);

            const consoleText = JSON.stringify(grammarResults)
            console.log(consoleText)

            setInitHistorys({
                title: grammarResults.resultTitle,
                body: grammarResults.resultBody
            })
            setGuideFlag(1)
            AIProofreadingClose()
            // 각 문단별로 split된 결과를 배열로 받음 원본&수정본
            // console.log('responses = ',rsps)
            // 배열간에 두 데이터를 비교해주는 컴포넌트 생성할것!

            // const countPlus = countofUseAIProofreading+1
            // setCountofUseAIProofreading(countPlus);
        } else {

        }
        
    }
    const previewTextforGrammarCheck = () => {
        type outlineData = {
            name:string;
            CheckWriting: string;
            [key:string]: any[]|any;
        }
        const outlineData:outlineData = outlineItems[unitIndex];
        let makeGrammarItems:any[] = [];
        const items = Object.values(outlineData).splice(6);
        const keys = Object.keys(outlineData).splice(6);
        keys.map((_keyItem, keyIndex)=>{
            items[keyIndex].map((bodyItem:any, _bodyItemIndex:number)=>{
                if (typeof(bodyItem) !== 'string') {
                    const flagText = Object.keys(bodyItem).includes('text')
                    if (flagText) {
                        makeGrammarItems.push(bodyItem.text.trim())
                    } else {
                        return bodyItem.map((subItem:string|TOutlineValues, subItemIndex:number)=>{
                            if (typeof(subItem) !== 'string') {
                                makeGrammarItems.push(subItem.text.trim())
                            }
                        })
                    }
                }
            })
        })
        setGrammarAll(makeGrammarItems)
    }

    const clickTooltip = (willChangeValue:string, mainDiv:'Title'|'Body', paragraphIndex:number, sentenceIndex:number, wordIndex:number ) => {
        
        if (mainDiv === 'Body') {
            let dumyBodyHist:TBodyHistorys = JSON.parse(JSON.stringify(bodyHistory));
            let dumybodyHistory = dumyBodyHist.body.present;
            dumybodyHistory[paragraphIndex][sentenceIndex][wordIndex] = [[0, willChangeValue]]
            setBodyValue(dumybodyHistory);
        } else if (mainDiv==='Title') {
            let dumyBodyHist:TBodyHistorys = JSON.parse(JSON.stringify(bodyHistory));
            let dumybodyHistory = dumyBodyHist.title.present;
            dumybodyHistory[paragraphIndex][sentenceIndex][wordIndex] = [[0, willChangeValue]]
            setTitleValue(dumybodyHistory);
        }
    }

    React.useMemo(()=>{
        previewTextforGrammarCheck()
    }, [outlineItems])
    
    React.useMemo(()=>{
        if (guideFlag===undefined) {
            setGuideFlag(0)
        } else if (guideFlag === 0) {
            if (guideText.length === 0||guideText===undefined) setGuideText(['* Check your writing.']);
        } else if (guideFlag === 1) {
            const guideTextData = [
                'Before you submit, check the revised writing.',
                'Tap the colored text and choose whether to make changes or not.',
                'When it\'s done, submit your 1st draft.'
            ];
            setGuideText(guideTextData)
        }
    }, [guideFlag]);

    // did mount
    React.useEffect(()=>{
        setTopNavHiddenFlagged(true);
        setSubNavTitleString(`${selectUnitInfo.main} ${selectUnitInfo.sub}`);
        if (params.draft === '1') {
            const rightTitle = <span>{'Step 1'}<span className='ordinal pl-4 pr-1'>{'1st'}</span>{'Draft'}</span>
            setSubRightNavTitleString(rightTitle)
        } else if (params.draft === '2') {
            const rightTitle = <span>{'Step 2'}<span className='ordinal pl-4 pr-1'>{'2nd'}</span>{'Draft'}</span>
            setSubRightNavTitleString(rightTitle)
        }
        // count AI Proofreading
        if (countofUseAIProofreading === undefined || countofUseAIProofreading === -1) {
            const countCheck = selectBoxUnit[unitIndex].countofUseAIProofreading;
            setCountofUseAIProofreading(countCheck)
        } else {
            if (countofUseAIProofreading < 2) {
                if (countofUseAIProofreading > 0) setOpenSubmitButton(true);
                setSelectBoxUnit(unitIndex, countofUseAIProofreading);

            } else if (countofUseAIProofreading === 2) {
                if (countofUseAIProofreading > 0) setOpenSubmitButton(true);
                setOpenAIProofreadingButton(true);
            }
            // use grammar checking
            setShowAIProofreadingModal(false)
        }
        
        // undo check
        if (bodyHistory.body.present&&bodyHistory.title.present) {
            if ( bodyHistory.body.present.length > 0 && bodyHistory.title.present.length > 0) {
                let isUndoPossible;
                isUndoPossible = bodyHistory.body.past && bodyHistory.body.past.length > 0;
                if (isUndoPossible===false) {
                    isUndoPossible = bodyHistory.title.past && bodyHistory.title.past.length > 0;
                }
                setIsUndoBody(isUndoPossible);
            } else if (bodyHistory.body.present.length > 0 && bodyHistory.title.present.length === 0) {
                const isUndoPossible = bodyHistory.body.past && bodyHistory.body.past.length > 0;
                setIsUndoBody(isUndoPossible);
            } else {
                setIsUndoBody(false);
            }
        }
        console.log('test outline items =',outlineItems[unitIndex])
        return ()=>{
            setTopNavHiddenFlagged(false)
            setSubNavTitleString('')
            setGrammarResultInit()
            setSubRightNavTitleString('')
        }
    },[
        // page state
        countofUseAIProofreading, setCountofUseAIProofreading, bodyHistory,
        // Nav store
        setTopNavHiddenFlagged, setSubNavTitleString, setSubRightNavTitleString,
        // Spark store
        outlineItems
    ])

    // Render Page
    return (
        <section className={`section-common-layout z-0`}>
            <div className='flex flex-1 flex-col w-full pt-[10vh] h-full px-14 pb-4 z-0'>
                {/* guide text */}
                <div className='flex flex-col font-bold w-full justify-start py-4 text-black h-1/12 z-0'>
                    {guideText.map((text:string, textIdx:number)=>{
                        return <p className='flex flex-1' key={'guide-text-'+textIdx}>{text}</p>
                    })}
                </div>
                {/* content */}
                {guideFlag===0 && contentComponent(outlineItems[unitIndex])}
                
                {(guideFlag===1 && bodyHistory.title) && (
                    <div className='flex w-full mb-4 h-fit max-h-[10vh] justify-center z-0'>
                        <div className='flex flex-row w-11/12 h-fit max-h-full gap-2 text-start'>
                            <div className='flex w-1/12 text-lg font-bold text-black p-3'>{`Title:`}</div>
                            <div className='flow-root whitespace-pre-line bg-gray-200 w-full text-xl overflow-y-auto text-black rounded-xl px-4 py-3'>
                                {bodyHistory.title.present && Array.isArray(bodyHistory.title.present) &&bodyHistory.title.present.map((v, i) => GrammarContentComponent.titleCompareDif1(v, i, clickTooltip))}
                            </div>
                        </div>
                        <button className={`flex w-fit h-full items-center ${isUndoBody ? ' cursor-pointer':' cursor-default'}`}
                        disabled={!isUndoBody}
                        onClick={()=>undoValue()}
                        ><GrammarContentComponent.resetButtonIcon /></button>
                    </div>
                )}
                {guideFlag===1 && 
                <div className='flex flex-1 flex-col w-full h-full pb-4 z-0 overflow-y-auto'>
                    <div className='flex flex-col bg-[#f3f3f3] text-start w-full h-full max-h-full overflow-y-auto rounded-2xl px-4 z-0 gap-4 py-4'>
                        <div className='flex flex-col gap-4 py-4 whitespace-pre-line'>
                            {bodyHistory.body.present && Array.isArray(bodyHistory.body.present) && bodyHistory.body.present.map((v, i)=> GrammarContentComponent.bodyCompareDif1(v, i, clickTooltip) )}
                        </div>
                    </div>
                </div>
                }
                
            </div>
            <div className={`buttons-div`}>
                <button className={`save-button`} onClick={()=>{
                    // alert('Edit')
                    setGuideFlag(1)
                    navigate(-1);
                    // setShowSaveModal(true)
                    // callbackCheckValues()
                }}>Edit</button>

                <button className={`${openAIProofreadingButton?'disabled-button':'not-disabled-button'}`} 
                // disabled={openAIProofreadingButton}
                onClick={()=>AIProofreadingOnClickEvent()}>AI Proofreading</button>

                <button className={`save-button ${openSubmitButton?'':'hidden'}`} onClick={()=>{
                    alert('Submit')
                    // callbackCheckValues()
                    // setShowPreviewModal(true)
                }}>Submit</button>
            </div>
            {/* AI Proofreading modal popup */}
            <PopupModalComponent 
                Message={countofUseAIProofreading===2 ? ['You have already used AI proofreading twice.']: [
                    'You can only use AI proofreading twice. Are you sure you want to proceed now?',
                    <p className='' key="show-count-p-tag">{`${countofUseAIProofreading}/2`}</p>
                ]}
                NoMessage={countofUseAIProofreading===2 ? '':'Not Yet'}
                YesMessage={countofUseAIProofreading===2 ? 'OK':'Yes'}
                onClickYes={countofUseAIProofreading===2 ? AIProofreadingClose: async ()=> await AIProofreadingYesOnClick()}
                onClose={AIProofreadingClose}
                showFlag={showAIProofreadingModal}
            />
            {/* Submit modal popup */}
            <PopupModalComponent 
                Message={[
                    ''
                ]}
                NoMessage=''
                YesMessage=''
                onClickYes={()=>{}}
                onClose={()=>{}}
                showFlag={false}
            />
        </section>
    )
}

export default PreviewSparkWriting;