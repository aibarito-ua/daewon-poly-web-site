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
import useControlAlertStore from '../../store/useControlAlertStore';
import { CommonFunctions } from '../../util/common/commonFunctions';

const PreviewSparkWriting = (props:any) => {
    // stores
    // Spark Store
    const {sparkWritingData, setSelectBoxUnit} = useSparkWritingStore();
    // Nav Store
    const {setTopNavHiddenFlagged, setSubNavTitleString, selectUnitInfo, setSubRightNavTitleString} = useNavStore();
    
    // WritingCenter Store
    const {} = useEssayWritingCenterDTStore();
    // current role
    const {} = useLoginStore();
    const {setGrammarBody, setGrammarTitle, setGrammarAll, grammarTitle, grammarBody, grammarAll,
        resultTitle,resultBody, setGrammarResult,
        returnData, setGrammarOrigin,
        setGrammarResultInit
    } = useGrammarStore();
    const {
        commonAlertOpen, setCommonStandbyScreen
    } = useControlAlertStore();

    // page States
    const [bodyHistory, setBodyHistory] = React.useState<TBodyHistorys>(
        {
            title: { past: [], present: [], future: [] },
            body:{ past: [], present: [], future: [] }
        }
    );
    const [isUndoBody, setIsUndoBody] = React.useState<boolean>(false);
    const [remakeBodyItem, setRemakeBodyItem] = React.useState<number[][]>([]);


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
            setCommonStandbyScreen({openFlag:true})
            let checkResultData: any[] = []
            for await (const idx of grammarAll) {
                
                const res = await grammarCheck(idx)
                checkResultData.push(res)
            }
            const grammarResults = setGrammarOrigin(checkResultData);

            // const consoleText = JSON.stringify(grammarResults)
            // console.log('origin =',)
            setCommonStandbyScreen({openFlag:false})
            setInitHistorys({
                title: grammarResults.resultTitle,
                body: grammarResults.resultBody
            })
            setGuideFlag(1)
        } else {

        }
        
    }
    const previewTextforGrammarCheck = () => {
        const outlineData:TSparkWritingData = sparkWritingData[unitIndex];
        // margin index setting
        const bodyItemDump:TSparkWritingDataOutline[] = JSON.parse(JSON.stringify(outlineData.draft_1_outline));
        const bodyOutlineItems = bodyItemDump.splice(1);
        const bodyItemNames = CommonFunctions.outlineNameLists(bodyOutlineItems);
        const bodyItemRemake:TSparkWritingDataOutline[][] = CommonFunctions.outlineDataFormRemake(bodyItemNames, bodyOutlineItems);
        const remakeItem:number[][] = [];
        let remakeNumber = -1;
        for (let i = 0; i < bodyItemRemake.length; i++) {
            const itemInBodyItemRemake = bodyItemRemake[i];
            remakeItem.push([]);
            for (let j = 0; j < itemInBodyItemRemake.length; j++) {
                if (remakeItem[i].length===0) {
                    remakeNumber+=1;
                    remakeItem[i].push(remakeNumber)
                } else {
                    remakeNumber+=1;
                    remakeItem[i].push(remakeNumber)
                }
            }
        }
        setRemakeBodyItem(remakeItem);
        let makeGrammarItems:any[] = [];
        outlineData.draft_1_outline.map((item, itemIndex) => {
            makeGrammarItems.push(item.input_content.trim())
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
    const onSubmitEvent = () => {
        if (!openSubmitButton) {
            return;
        } else {
            let draftText = '';
            const unitTitle_1 = selectUnitInfo.main.replace(/\.$/gi,'');
            if (params.draft === '1') {
                draftText='1st draft'
            } else { draftText='2nd draft'}
            const yesMessage = <p className='ordinal'>{`Your ${unitTitle_1} ${selectUnitInfo.sub}'s ${draftText} has been submitted.`}</p>
            
            commonAlertOpen({
                head: `${unitTitle_1}: ${selectUnitInfo.sub}`,
                alertType: 'continue',
                messages: ['Are you ready to submit?'],
                yesButtonLabel: 'Yes',
                noButtonLabel: 'No',
                yesEvent: () => {
                    commonAlertOpen({
                        useOneButton: true,
                        messages: [yesMessage],
                        yesButtonLabel: 'OK',
                    })
                }
            })
        }
    }

    React.useMemo(()=>{
        previewTextforGrammarCheck()
    }, [sparkWritingData])
    
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
            const countCheck = sparkWritingData[unitIndex].proofreading_count;
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
        // console.log('test outline items =',sparkWritingData[unitIndex])
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
        
    ])
    

    // Render Page
    return (
        <section className={`section-spark-writing z-0 use-nav-top bg-draft-background-image bg-no-repeat bg-cover object-contain`}>
            <div className='wrap-contain-spark-writing'>
                {/* guide text */}
                <div className='wrap-guide-text-spark-writing relative'>
                    <p className='flex flex-1 justify-center'>
                    {guideText.map((text:string)=>{
                        return text
                    })}
                    </p>
                    {(guideFlag===1 && bodyHistory.title) && (
                        <button className={`absolute top-[8px] right-[15px] items-center ${isUndoBody ? ' cursor-pointer':' cursor-default'}`}
                        disabled={!isUndoBody}
                        onClick={()=>undoValue()}
                        ><GrammarContentComponent.resetButtonIcon className='w-[34px] h-[34px]' /></button>
                    )}
                </div>
                {/* content */}
                <div className='wrap-content-spark-writing'>
                    {guideFlag===0 && contentComponent(sparkWritingData[unitIndex], params.draft!==undefined?params.draft:'')}
                    {guideFlag===1 && (
                        <div className='flex flex-1 flex-col w-full h-full pt-[24px] px-[12px] z-0 overflow-y-auto'>
                            {bodyHistory.title && (
                                <div className='flex flex-1 w-full h-fit justify-center z-0'>
                                    <div className='flex flex-row w-full h-fit max-h-full text-start'>
                                        <div className='flow-root w-full overflow-y-auto'>
                                        {bodyHistory.title.present && Array.isArray(bodyHistory.title.present) &&bodyHistory.title.present.map((v, i) => GrammarContentComponent.titleCompareDif1(v, i, clickTooltip))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className='flex flex-col text-start w-full h-full max-h-full pt-[26px] overflow-y-auto z-0'>
                            {bodyHistory.body.present && Array.isArray(bodyHistory.body.present) && remakeBodyItem.map((bodyRemakeStruct, bodyRemakeStructIndex)=> {
                                return <span className='pb-[20px]' key={bodyRemakeStructIndex}>
                                    {bodyRemakeStruct.map((bodyRemakeNumber, bodyRemakeNumberIndex)=>{
                                        const v = bodyHistory.body.present[bodyRemakeNumber];
                                        return GrammarContentComponent.bodyCompareDif1(v, bodyRemakeNumber, clickTooltip)
                                    })}
                                </span>
                            } )}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className={`buttons-div`}>
                    <button className={`save-button-active`} onClick={()=>{
                        commonAlertOpen({
                            messages: ['Do you want to save?'],
                            yesButtonLabel: "Yes",
                            yesEvent: ()=>{
                                navigate(-1);
                            },
                            noButtonLabel: "No"
                        })
                    }}>Edit</button>
                    <button className={`${countofUseAIProofreading<2?'save-button-active div-to-button-hover-effect':'save-button'}`} 
                    onClick={()=>{
                        commonAlertOpen({
                            messages: countofUseAIProofreading===2 ? ['You have already used AI proofreading twice.']: [
                                'You can only use the AI proofreading tool twice. Are you sure you want to proceed?',
                                `${countofUseAIProofreading}/2`
                            ],
                            yesButtonLabel: 'Yes',
                            noButtonLabel: 'No',
                            yesEvent: async () => await AIProofreadingYesOnClick()
                        })
                    }}>AI Proofreading</button>
                    <button className={`${openSubmitButton?'save-button-active div-to-button-hover-effect':'save-button'}`} onClick={()=>{
                        onSubmitEvent()
                    }}>Submit</button>
                </div>
            </div>
        </section>
    )
}

export default PreviewSparkWriting;