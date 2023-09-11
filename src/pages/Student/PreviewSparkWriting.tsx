import React from 'react';
import useEssayWritingCenterDTStore from "../../store/useEssayWritingCenterDTStore";
import useLoginStore from "../../store/useLoginStore";
import useNavStore from "../../store/useNavStore";
import useSparkWritingStore from "../../store/useSparkWritingStore";
import { useNavigate, useParams } from 'react-router-dom';
import { PopupModalComponent } from '../../components/toggleModalComponents/popupModalComponent';
import contentComponent from '../../components/pageComponents/previewSparkWriting/contentComponent';
import { grammarCheck, grammarReset, previewTest, proofReadingCountUpdate } from './api/GrammarApi';
import useGrammarStore from '../../store/useGrammarStore';
import GrammarContentComponent from '../../components/pageComponents/previewSparkWriting/grammarContentComponent';
import { isEqual } from 'lodash';
import useControlAlertStore from '../../store/useControlAlertStore';
import { CommonFunctions } from '../../util/common/commonFunctions';
import { callUnitInfobyStudent, draft1stSubmit, draftSaveTemporary } from './api/EssayWriting.api';
import { useComponentWillMount } from '../../hooks/useEffectOnce';

const PreviewSparkWriting = (props:any) => {
    // stores
    // Spark Store
    const {
        sparkWritingData,
        setSelectBoxUnit,
        setProofreadingCount,
        setOutlineInputText,
        setSparkWritingDataFromAPI,
        setProofreadingCountReset
    } = useSparkWritingStore();
    // Nav Store
    const {setTopNavHiddenFlagged, setSubNavTitleString, selectUnitInfo, setSubRightNavTitleString} = useNavStore();
    
    // WritingCenter Store
    const {} = useEssayWritingCenterDTStore();
    // current role
    const {userInfo, role} = useLoginStore();
    const {setGrammarBody, setGrammarTitle, setGrammarAll, grammarTitle, grammarBody, grammarAll,
        resultTitle,resultBody, setGrammarResult,
        returnData, setGrammarOrigin,
        setGrammarResultInit
    } = useGrammarStore();
    const {
        commonAlertOpen, setCommonStandbyScreen, commonAlertClose,
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
    // save button flag
    const [isSaveButtonOpen, setIsSaveButtonOpen] = React.useState<boolean>(false);

    // undo history init
    const setInitHistorys = (hist:{title:TTitleHistory, body:TGrammarResponseResult[]}) => {
        const stateValue = GrammarContentComponent.setTInitHistorys(hist, bodyHistory);
        console.log('stateValue 49row==',stateValue)
        if (stateValue!==undefined) setBodyHistory(stateValue);
    }
    const setTitleValue = (hist:TTitleHistory) => {
        const stateValue = GrammarContentComponent.setTTitleHistorys(bodyHistory.title, hist);
        const past = stateValue?.past ? stateValue.past: [];
        const present = stateValue?.present ? stateValue?.present : [];
        const future: TTitleHistory[] = [];
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
    // Grammar tool Start/Proceed false: 시작 전, true: 진행중
    const [isGrammarProceed, setIsGrammarProceed] = React.useState<boolean>(false);
    // submit check flag
    const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
    
    // param hook
    const params = useParams();
    // path param to number
    const unitIndex:number = parseInt(params.unit!==undefined? params.unit:'1') - 1;
    // Navigate hook
    const navigate = useNavigate();

     // will mount grammar data check
     const beforeRenderedFn = async () => {
        
        // data reload 
        const reloadData = await callUnitInfobyStudent(userInfo.userCode, userInfo.courseName).then((response)=>{
            if (response.book_name!=='') {
                setSparkWritingDataFromAPI(response.units, response.book_name);
                setCountofUseAIProofreading(response.units[unitIndex].proofreading_count);
                return true;
            } else {
                return false;
            }
        })
        
        if (reloadData) {
            const checkTarget = sparkWritingData[unitIndex].draft_1_outline;
            // check submit?
            const checkSubmitted = sparkWritingData[unitIndex].draft_1_status.submit_date;
            if (checkSubmitted!==null) {
                console.log('test 11')
                setIsSubmitted(true);
            } else {
                let titleGrammarData:TTitleHistory = [];
                let bodyGrammarData:TbodyHistory = [];
                for (let unitsIdx = 0; unitsIdx < checkTarget.length; unitsIdx++) {
                    const targetValue = checkTarget[unitsIdx];
                    if (targetValue.grammar_correction_content_student&&targetValue.grammar_correction_content_student!=='') {
                        if (targetValue.name==='Title') {
                            titleGrammarData = JSON.parse(targetValue.grammar_correction_content_student);
                        } else {
                            const targetDataParsing = JSON.parse(targetValue.grammar_correction_content_student)
                            bodyGrammarData.push(targetDataParsing)
                        }
                    }
                }
                if (bodyGrammarData.length > 0) {
        
                    setBodyHistory({
                        title: {past: [], future: [], present: titleGrammarData},
                        body: {past:[], future: [], present: bodyGrammarData}
                    })
                    // setIsGrammarProceed(true);
                    // setGuideFlag(1)
                }
            }
            setCommonStandbyScreen({openFlag:false})
        } else {
            commonAlertOpen({
                alertType: 'warning',
                useOneButton: true,
                yesButtonLabel: 'OK',
                messages: ['Please try again.'],
                yesEvent: () => {
                    setCommonStandbyScreen({openFlag:false})
                    navigate(-1)
                }
            })
        }
    }
    useComponentWillMount(async ()=>{
        setCommonStandbyScreen({openFlag:true})
        await beforeRenderedFn();
    })

    // AI Proofreading Events
    const AIProofreadingOnClickEvent = () => setShowAIProofreadingModal(true);
    const AIProofreadingClose = () => setShowAIProofreadingModal(false);

    const AIProofreadingYesOnClick = async () => {
        // 추가 로직
        // grammar 시작 후
        // select 완료 여부
        // grammar 시작 전

        // count plus
        // const unitId = sparkWritingData[unitIndex].unit_id
        // const checkProofCount = setProofreadingCount(unitId)
        const ProofReadingCountValue = sparkWritingData[unitIndex].proofreading_count;
        // if (countofUseAIProofreading < 2) {
        if (ProofReadingCountValue < 2) {
            setCommonStandbyScreen({openFlag:true})
            // use grammar API
            const res = await grammarCheck(sparkWritingData[unitIndex].draft_1_outline);
            if (res.result_body.length>0) {
                const unitId = sparkWritingData[unitIndex].unit_id
                const proofReadingCountUpdateValue = ProofReadingCountValue+1;
                // const proofReadingCountUpdateValue = 1;
                const updateCountAPI = await proofReadingCountUpdate(userInfo.userCode, unitId, proofReadingCountUpdateValue);
                if (updateCountAPI.statusCode === 200) {
                    setProofreadingCount(unitId)
                    setCommonStandbyScreen({openFlag:false})
                    setIsGrammarProceed(true);
                    setInitHistorys({
                        title: res.result_title,
                        body: res.result_body
                    })
                }
            }
            setGuideFlag(1)
            // console.log('preview res ===',res)
        } else {
            // submit
        }
        
    }
    // check select grammars
    const checkSelectedGrammarModals = () => {
        const checkTitle = checkSelectedTitleGrammarModals();
        const checkBody = checkSelectedBodyGrammarModals();
        console.log('check title =',checkTitle,' body =',checkBody)
        return checkTitle? true: (checkBody?true:false);
    }
    // check title select grammars
    const checkSelectedTitleGrammarModals = () => {
        
        for (const presentTitle of bodyHistory.title.present) {
            for (const iPresentTitleValue of presentTitle) {
                let checkType0 = false;
                let checkType1 = false;
                let checkTypeMinus1 = false;
                let checkType2 = false;
    
                for (const wordTitleValue of iPresentTitleValue) {
                    for (const checkTitleTarget of wordTitleValue) {
                        switch (checkTitleTarget.type) {
                            case 0:
                                checkType0 = true;
                                continue;
                            case 1:
                                checkType1 = true;
                                continue;
                            case -1:
                                checkTypeMinus1 = true;
                                continue;
                            case 2:
                                checkType2 = true;
                                break;
                        }
                    }
    
                    if ((checkType1 || checkTypeMinus1) && !checkType2) {
                        return true; // 조건 충족 시 함수 종료
                    } else {
                        checkType0 = false;
                        checkType1 = false;
                        checkTypeMinus1 = false;
                        checkType2 = false;
                    }
                }
            }
        }
    
        return false; // 모든 반복이 끝나도 조건 미충족 시 false 반환
    };
    // check body select grammars
    const checkSelectedBodyGrammarModals = () => {
        console.log('body hist ===',bodyHistory.body.present)
        for (const item of bodyHistory.body.present) {
            for (const presentBody of item.data) {
                let checkType0 = false;
                let checkType1 = false;
                let checkTypeMinus1 = false;
                let checkType2 = false;
    
                for (const iPresentBodyValue of presentBody) {
                    for (const wordBodyValue of iPresentBodyValue) {
                        for (const checkBodyTarget of wordBodyValue) {
                            switch (checkBodyTarget.type) {
                                case 0:
                                    checkType0 = true;
                                    continue;
                                case 1:
                                    checkType1 = true;
                                    continue;
                                case -1:
                                    checkTypeMinus1 = true;
                                    continue;
                                case 2:
                                    checkType2 = true;
                                    break;
                            }
                        }
    
                        if ((checkType1 || checkTypeMinus1) && !checkType2) {
                            console.log('check body true ==',wordBodyValue)
                            console.log('checkType1::',checkType1)
                            console.log('checkTypeMinus1::',checkTypeMinus1)
                            console.log('(checkType1 || checkTypeMinus1) ::',(checkType1 || checkTypeMinus1))
                            console.log('checkType2::',checkType2)
                            return true; // 조건 충족 시 함수 종료
                        } else {
                            checkType0 = false;
                            checkType1 = false;
                            checkTypeMinus1 = false;
                            checkType2 = false;
                        }
                    }
                }
            }
        }
    
        return false; // 모든 반복이 끝나도 조건 미충족 시 false 반환
    };
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

    const clickTooltip = (willChangeValue:string, mainDiv:'Title'|'Body', paragraghData:number, paragraphIndex:number, sentenceIndex:number, wordIndex:number ) => {
        console.log('main div =',mainDiv)
        if (mainDiv === 'Body') {
            let dumyBodyHist:TBodyHistorys = JSON.parse(JSON.stringify(bodyHistory));
            let dumybodyHistory = dumyBodyHist.body.present;
            
            let checkIsSelected = false;
            const wordInnerLength = dumybodyHistory[paragraghData].data[paragraphIndex][sentenceIndex][wordIndex].length;
            for (let checkIdx = 0; checkIdx< wordInnerLength; checkIdx++) {
                const targetData = dumybodyHistory[paragraghData].data[paragraphIndex][sentenceIndex][wordIndex][checkIdx];
                const targetCheck = targetData.type;
                if (targetCheck !== 3 && targetCheck > 1) {
                    checkIsSelected=true;
                    break;
                }
            }
            console.log('checkIsSelected ==',checkIsSelected)
            if (!checkIsSelected) {
                const userSelectData:TGrammarResDiff = {
                    key: `${wordIndex}-${wordInnerLength}`,
                    type: 2,
                    word: willChangeValue,
                    correction_reason: []
                }
                dumybodyHistory[paragraghData].data[paragraphIndex][sentenceIndex][wordIndex].push(userSelectData);
                setBodyValue(dumybodyHistory);
            }
        } else if (mainDiv==='Title') {
            let dumyBodyHist:TBodyHistorys = JSON.parse(JSON.stringify(bodyHistory));
            let dumyTitleHistory = dumyBodyHist.title.present;
            let checkIsSelected =false;
            const wordInnerLength = dumyTitleHistory[paragraphIndex][sentenceIndex][wordIndex].length;
            for (let checkIdx = 0; checkIdx < wordInnerLength; checkIdx++) {
                const targetCheck = dumyTitleHistory[paragraphIndex][sentenceIndex][wordIndex][checkIdx].type;
                if (targetCheck!==3 && targetCheck > 1) {
                    checkIsSelected=true;
                    break;
                }
            }
            if (!checkIsSelected) {
                const userSelectData:TGrammarResDiff = {
                    key: `${wordIndex}-${wordInnerLength}`,
                    type: 2,
                    word: willChangeValue,
                    correction_reason: []
                }
                dumyTitleHistory[paragraphIndex][sentenceIndex][wordIndex].push(userSelectData);
                setTitleValue(dumyTitleHistory);
            }
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
    const replaceUpdateSparkWritingTitle = () => {
        const unitId = sparkWritingData[unitIndex].unit_id
        console.log('unit index =',sparkWritingData[unitIndex])
        console.log('unit ==',unitId)
        for (const presentTitle of bodyHistory.title.present) {
            let presentParagraghString = '';
            for (const iPresentTitleValue of presentTitle) {
                // let checkType0 = false;
                // let checkType1 = false;
                // let checkTypeMinus1 = false;
                // let checkType2 = false;
    
                for (const wordTitleValue of iPresentTitleValue) {
                    let addWordString = '';
                    for (const checkTitleTarget of wordTitleValue) {
                        switch (checkTitleTarget.type) {
                            case 0:
                                if (addWordString==='') {
                                    addWordString=checkTitleTarget.word;
                                }
                                continue;
                            case 1:
                                continue;
                            case -1:
                                continue;
                            case 2:
                                addWordString=checkTitleTarget.word;
                                break;
                        }
                    }
                    presentParagraghString+=addWordString;
                }

            }
            console.log('in checking proceed ')
            console.log('unitId : ',unitId, ', unitIndex ::',unitIndex)
            
            setOutlineInputText(presentParagraghString,unitId, unitIndex,1,1)
        }
    }
    const replaceUpdateSparkWritingBody = () => {
        const unitId = sparkWritingData[unitIndex].unit_id
        console.log('body history =',bodyHistory.body.present)
        for (const item of bodyHistory.body.present) {
            for (const presentBody of item.data) {
                
                // paragragh
                // let checkType0 = false;
                // let checkType1 = false;
                // let checkTypeMinus1 = false;
                // let checkType2 = false;
                let presentParagraghString = '';
                
                for (const iPresentTitleValue of presentBody) {
                    for (const wordTitleValue of iPresentTitleValue) {
                        
                        let wordString = '';
                        for (const checkTitleTarget of wordTitleValue) {
                            switch (checkTitleTarget.type) {
                                case 0:
                                    wordString = checkTitleTarget.word;
                                    continue;
                                case 1:
                                    continue;
                                case -1:
                                    continue;
                                case 2:
                                    wordString = checkTitleTarget.word;
                                    break;
                            }
                        }
                        
                        presentParagraghString+=wordString;
                    }
                }
                console.log('presentBody:::',presentParagraghString)
                // paragragh update store
                setOutlineInputText(presentParagraghString,unitId, unitIndex,item.order_index,1 )
            }
        }
    }
    // after grammar select complete, save db
    const grammarResultSave = () => {
        // title save
        // const titleSave = 
        for (const presentTitle of bodyHistory.title.present) {
            for (const iPresentTitleValue of presentTitle) {
                let checkType0 = false;
                let checkType1 = false;
                let checkTypeMinus1 = false;
                let checkType2 = false;
    
                for (const wordTitleValue of iPresentTitleValue) {
                    for (const checkTitleTarget of wordTitleValue) {
                        switch (checkTitleTarget.type) {
                            case 0:
                                checkType0 = true;
                                continue;
                            case 1:
                                checkType1 = true;
                                continue;
                            case -1:
                                checkTypeMinus1 = true;
                                continue;
                            case 2:
                                checkType2 = true;
                                break;
                        }
                    }
    
                    if ((checkType1 || checkTypeMinus1) && !checkType2) {
                        return true; // 조건 충족 시 함수 종료
                    } else {
                        checkType0 = false;
                        checkType1 = false;
                        checkTypeMinus1 = false;
                        checkType2 = false;
                    }
                }
            }
        }
        // body save
        const bodySave = replaceUpdateSparkWritingBody();
    }
    const forcedTemporarySave = async (isGrammarSave?:boolean) => {
        
        const targetData = sparkWritingData[unitIndex];
        const contentsData:TSparkWritingSaveTemporaryContent[] = targetData.draft_1_outline.map((item) => {
            const historyMinusIndex = targetData.draft_1_outline[0].name==='Title' ? 2:1;
            const currentGrammarIndex = item.order_index-historyMinusIndex;
            const grammar_correction_content_student = item.name==='Title'? JSON.stringify(bodyHistory.title.present): JSON.stringify(bodyHistory.body.present[currentGrammarIndex])
            return {
                heading_name: item.name,
                input_content: item.input_content,
                grammar_correction_content_student,
                order_index: item.order_index
            }
        });
        const data:TSparkWritingTemporarySaveData = {
            student_code: userInfo.userCode,
            student_name_en: userInfo.memberNameEn,
            student_name_kr: userInfo.memberNameKr,
            unit_id: targetData.unit_id,
            draft_index: 1,
            proofreading_count: targetData.proofreading_count,
            contents: contentsData
        };
        console.log('data ==',data)
        commonAlertOpen({
            useOneButton: true,
            yesButtonLabel: 'OK',
            alertType: 'continue',
            messages: ['Please temporary saving your data.'],
            yesEvent: async () => {
                const isSaveTemporary = await draftSaveTemporary(data);
                if (isSaveTemporary) {
                    if (isGrammarSave) {
                        commonAlertOpen({
                            useOneButton:true,
                            yesButtonLabel: 'OK',
                            alertType: 'continue',
                            messages: ['Temporary saving is complete.'],
                            yesEvent: async () => {
                                commonAlertClose()
                                CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role);
                            }
                        })
                    } else {
                        commonAlertOpen({
                            useOneButton:true,
                            yesButtonLabel: 'OK',
                            alertType: 'continue',
                            messages: ['Temporary saving is complete.'],
                            yesEvent: async () => {
                                commonAlertClose();
                                navigate(-1)
                            }
                        })
                    }
                } else {
                    commonAlertOpen({
                        messages: ['Are you sure you want to try again?'],
                        yesButtonLabel: 'Yes',
                        noButtonLabel: 'Cancel',
                        alertType: 'continue',
                        yesEvent: async ()=> {
                            await forcedTemporarySave();
                        },
                    })
                }
            }
        })
    }

    React.useMemo(()=>{
        previewTextforGrammarCheck();
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
// setCountofUseAIProofreading, countofUseAIProofreading 
        if (countofUseAIProofreading !== undefined || countofUseAIProofreading !== -1) {
            setCountofUseAIProofreading(sparkWritingData[unitIndex].proofreading_count);
        } else {
            if (countofUseAIProofreading < 2) {
                if (countofUseAIProofreading > 0) setOpenSubmitButton(true);
                setSelectBoxUnit(unitIndex, sparkWritingData[unitIndex].proofreading_count);

            } else if (countofUseAIProofreading === 2) {
                setOpenSubmitButton(true);
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

        // check grammar modal select
        if (bodyHistory.body.present.length > 0 && bodyHistory.title.present) {
            // grammar 진행 시작
            const checkGrammarsSelectAll = checkSelectedGrammarModals();
            if (countofUseAIProofreading===2) {
                if (checkGrammarsSelectAll) {
                    console.log('grammar 진행 중')
                    setIsSaveButtonOpen(true);
                    setOpenSubmitButton(false)
                } else {
                    console.log('grammar 진행 종료')
                    replaceUpdateSparkWritingTitle()
                    replaceUpdateSparkWritingBody()
                    setIsGrammarProceed(false)
                    setOpenSubmitButton(true)
                }
            } else if (countofUseAIProofreading>=0 && countofUseAIProofreading <2) {
                console.log(bodyHistory)
                if (checkGrammarsSelectAll) {
                    // grammar 진행중
                    console.log('grammar 진행 중')
                    setIsSaveButtonOpen(true);
                    setOpenSubmitButton(false)
                } else {
                    // grammar 종료
                    console.log('grammar 진행 종료')
                    replaceUpdateSparkWritingTitle()
                    replaceUpdateSparkWritingBody()
                    setIsGrammarProceed(false)
                    setOpenSubmitButton(true)
                }
            }
        } else {
            // grammar 진행 전
            console.log('grammar 진행 전')
            
            if (countofUseAIProofreading>0) {
                if (countofUseAIProofreading===2) {
                    const checkGrammarsSelectAll = checkSelectedGrammarModals();
                    if (checkGrammarsSelectAll) {
                        setOpenSubmitButton(false);
                    } else {
                        setOpenSubmitButton(true);
                    }
                };
                
                const submitDate = sparkWritingData[unitIndex].draft_1_status.submit_date;
                if (submitDate!==null && submitDate!=='') {
                    setIsSaveButtonOpen(false);
                } else {
                    if (bodyHistory.body.present.length>0) {
                        setIsSaveButtonOpen(true);
                    } else {
                        setIsSaveButtonOpen(false);
                    }
                }
            } else {
                setIsSaveButtonOpen(false);
            }
        }
        if (isSubmitted===undefined || !isSubmitted) {
            const checkSubmit = sparkWritingData[unitIndex].draft_1_status.submit_date;
            console.log('check submit ==',checkSubmit)
            if (checkSubmit===null||checkSubmit===undefined||checkSubmit==='') {
                setIsSubmitted(false)
            }
            if (countofUseAIProofreading > 0) {
                setIsSubmitted(false)
            }
        } else {
            if (sparkWritingData[unitIndex].draft_1_status.status===5) {
                setIsSubmitted(false)
            }
        }
        console.log('submit ==',isSubmitted)
        console.log('submit ==',sparkWritingData[unitIndex].proofreading_count)
        console.log('test outline items =',sparkWritingData)
        return ()=>{
            setTopNavHiddenFlagged(false)
            setSubNavTitleString('')
            setGrammarResultInit()
            setSubRightNavTitleString('')
        }
    },[
        // page state
        bodyHistory, countofUseAIProofreading, isSaveButtonOpen, isSubmitted,
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
                                        // return <></>
                                    })}
                                </span>
                            } )}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className={`buttons-div`}>
                    {!isSubmitted &&
                        <button className={!isSubmitted ?(sparkWritingData[unitIndex].proofreading_count===2?'hidden':`save-button-active`):'hidden'} onClick={()=>{
                            commonAlertOpen({
                                messages: ['Do you want to return to edit your writing?'],
                                yesButtonLabel: "Yes",
                                alertType: 'continue',
                                yesEvent: async ()=>{
                                    // grammar 시작 후
                                    // if (bodyHistory.body.present.length > 0) {
                                    //     // select 완료 여부
                                    //     if (isGrammarProceed) {
                                    //         // 진행 중
                                    //         await forcedTemporarySave();
                                    //         // commonAlertClose();
                                    //         // grammar data 저장
                                    //     } else {
                                    //         // 진행 종료
                                    //         // data 저장
                                    //         await forcedTemporarySave();

                                    //     }
                                    // } else {
                                        // grammar 시작 전
                                        commonAlertClose();
                                        navigate(-1);
                                    // }
                                    
                                },
                                noButtonLabel: "No"
                            })
                        }}>Edit</button>
                    }
                    {!isSubmitted &&
                        <div className={!isSubmitted ?`${isSaveButtonOpen?'save-button-active div-to-button-hover-effect':'hidden'}`:'hidden'} onClick={()=>{
                            if (isSaveButtonOpen) {
                                
                                commonAlertOpen({
                                    messages: ['Do you want to save?'],
                                    alertType: 'continue',
                                    yesButtonLabel: `Yes, I'm sure.`,
                                    noButtonLabel: `No, Cancel.`,
                                    yesEvent: async ()=> await forcedTemporarySave(true)
                                })
                            }

                        }}>Save</div>
                    }
                    {!isSubmitted &&
                        <button className={!isSubmitted 
                            ?`${sparkWritingData[unitIndex].proofreading_count<2?'save-button-active div-to-button-hover-effect':'save-button'}`
                            :'hidden'
                        } 
                        onClick={()=>{
                            commonAlertOpen({
                                messages: sparkWritingData[unitIndex].proofreading_count===2 ? ['You have already used AI proofreading twice.']: [
                                    'You can only use the AI proofreading tool twice. Are you sure you want to proceed?',
                                    `${sparkWritingData[unitIndex].proofreading_count}/2`
                                ],
                                yesButtonLabel: 'Yes',
                                noButtonLabel: 'No',
                                yesEvent: async () => await AIProofreadingYesOnClick()
                            })
                        }}>AI Proofreading</button>
                    }
                    {/* 임시 버튼 - will del */}
                    {!isSubmitted &&
                        <button className={!isSubmitted 
                            ?`${sparkWritingData[unitIndex].proofreading_count===2?'save-button-active div-to-button-hover-effect':'save-button'}`
                            :'hidden'
                        } 
                        onClick={()=>{
                            if (sparkWritingData[unitIndex].proofreading_count===2) {
                                commonAlertOpen({
                                    messages: [
                                        '임시 리셋 기능입니다.',
                                    ],
                                    yesButtonLabel: 'Yes',
                                    noButtonLabel: 'No',
                                    yesEvent: async () => {
                                        
                                        const data = {
                                            "student_code": userInfo.userCode,
                                            "unit_id": sparkWritingData[unitIndex].unit_id,
                                            "proofreading_count": 0
                                        }
                                        console.log('data =',data)
                                        const reset = await grammarReset(data);
                                        console.log('reset =',reset)
                                        if (reset.statusCode === 200) {
                                            setProofreadingCountReset(sparkWritingData[unitIndex].unit_id);
                                            
                                            setBodyHistory({
                                                title: { past: [], present: [], future: [] },
                                                body:{ past: [], present: [], future: [] }
                                            })
                                            await beforeRenderedFn();
                                        } 
                                        
                                    }
                                })
                            }
                        }}>Reset AI Count</button>
                    }

                    {!isSubmitted &&
                        <button className={ !isSubmitted ?`${(openSubmitButton)?'save-button-active div-to-button-hover-effect': (countofUseAIProofreading>0 ?'save-button-active div-to-button-hover-effect':'hidden')}`:'hidden'} onClick={()=>{
                            const checkGrammarsSelectAll = checkSelectedGrammarModals();
                            console.log('select all =',checkGrammarsSelectAll)
                            // grammar 시작 후
                            // select 완료 여부
                            // grammar 시작 전
                            if (!checkGrammarsSelectAll) {
                                replaceUpdateSparkWritingTitle();
                                replaceUpdateSparkWritingBody();
                            }
                            if (openSubmitButton&&countofUseAIProofreading>0) {
                                // submit date check
                                const currentSparkWritingData = sparkWritingData[unitIndex]
                                const submitDate = currentSparkWritingData.draft_1_status.submit_date;
                                let noMessages = '';
                                if (submitDate && submitDate!=='') {
                                    noMessages = `Unit ${currentSparkWritingData.unit_index} ${currentSparkWritingData.topic}'s 1st draft has been submitted.`
                                }
                                // onSubmitEvent()

                                commonAlertOpen({
                                    yesButtonLabel: 'Yes',
                                    alertType: 'continue',
                                    messages: [
                                        `Unit ${currentSparkWritingData.unit_index}: ${currentSparkWritingData.topic}`,
                                        'Are you ready to submit?'
                                    ],
                                    noButtonLabel: 'No',
                                    yesEvent: async () => {

                                        // submit
                                        // make contents 
                                        const contentsData:TSubmit1stDraftReqDataContent[] = currentSparkWritingData.draft_1_outline.map((item) => {
                                            const historyMinusIndex = item.name==='Title' ? 2:1;
                                            const currentGrammarIndex = item.order_index-historyMinusIndex;
                                            const grammar_correction_content_student = item.name==='Title'? JSON.stringify(bodyHistory.title.present): JSON.stringify(bodyHistory.body.present[currentGrammarIndex])
                                            return {
                                                input_content: item.input_content,
                                                grammar_correction_content_student,
                                                heading_name: item.heading_content,
                                                order_index: item.order_index
                                            }
                                        })
                                        const submitData:TSubmit1stDraftRequestData = {
                                            student_code: userInfo.userCode,
                                            student_name_en: userInfo.memberNameEn,
                                            student_name_kr: userInfo.memberNameKr,
                                            unit_id: currentSparkWritingData.unit_id,
                                            draft_index: 1,
                                            contents: contentsData,
                                            proofreading_count: currentSparkWritingData.proofreading_count
                                        }
                                        console.log('submit item = ',submitData)
                                        commonAlertClose();
                                        setCommonStandbyScreen({openFlag:true})
                                        const submit = await draft1stSubmit(submitData);
                                        
                                        console.log('submit return data =',submit)
                                        if (submit) {
                                            setCommonStandbyScreen({openFlag:false})
                                            commonAlertOpen({
                                                useOneButton:true,
                                                yesButtonLabel: 'OK',
                                                alertType: 'continue',
                                                messages: [`Unit ${currentSparkWritingData.unit_index} ${currentSparkWritingData.topic}'s 1st draft has been submitted.`],
                                                yesEvent: () => {
                                                    commonAlertClose()
                                                    CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role);
                                                }
                                            })
                                        }
                                    },
                                    closeEvent: async() => {
                                        if (noMessages!=='') {
                                            commonAlertOpen({
                                                messages: [noMessages],
                                                useOneButton: true,
                                                yesButtonLabel: 'OK',
                                                yesEvent: ()=> commonAlertClose(),
                                            })
                                        } else {
                                            commonAlertClose();
                                        }
                                    }
                                })
                            }
                        }}>Submit</button>
                    }
                </div>
            </div>
        </section>
    )
}

export default PreviewSparkWriting;

