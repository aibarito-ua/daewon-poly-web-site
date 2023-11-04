import React from 'react';
import useEssayWritingCenterDTStore from "../../store/useEssayWritingCenterDTStore";
import useLoginStore from "../../store/useLoginStore";
import useNavStore from "../../store/useNavStore";
import useSparkWritingStore from "../../store/useSparkWritingStore";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
        setProofreadingCountReset,
        sparkWritingBookName,
        // page init set
        previewPageInitFlag,
        setPreviewPageInitFlag,
    } = useSparkWritingStore();
    // Nav Store
    const {
        setTopNavHiddenFlagged, setSubNavTitleString, selectUnitInfo, setSubRightNavTitleString,
        setSelectUnitInfo,
        goBackFromDraftInUnitPage, setGoBackFromDraftInUnitPage
    } = useNavStore();
    
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
        commonStandbyScreen
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
      //  console.log('stateValue 49row==',stateValue)
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
    // grammar가 끝난 후 현재 페이지 분기처리
    const [isPreview, setIsPreview] = React.useState<boolean>(true);
    
    // param hook
    const params = useParams();
    // path param to number
    const unitIndex:number = parseInt(params.unit!==undefined? params.unit:'1') - 1;
    const draftIndex:number = parseInt(params.draft!==undefined? params.draft: '0');
    // after submit standby feedback
    const isStandbyFeedback:string= params.status?params.status:'';
    
    // Navigate hook
    const navigate = useNavigate();
    const locationInfo = useLocation();
    // will mount grammar data check
    const beforeRenderedFn = async () => {
        let reloadData:boolean;
        
        if (params.unit && params.draft) {
            
            // const isBeforePathCheck = sparkWritingData[unitIndex].draft_1_status.status;
            const isBeforePathCheck = previewPageInitFlag;
            if (isBeforePathCheck === "UPDATE_WRITE") {
                const response = {
                    book_name: sparkWritingBookName,
                    units: sparkWritingData
                };
                console.log('response ==',response)
                setSparkWritingDataFromAPI(response.units, response.book_name);
                setCountofUseAIProofreading(response.units[unitIndex].proofreading_count);
                reloadData = true;
            } else {
                // data reload 
                reloadData = await callUnitInfobyStudent(userInfo.userCode, userInfo.courseName, userInfo.accessToken).then((response)=>{
                    console.log('response ==',response)
                    if (response.book_name!=='') {
                        setSparkWritingDataFromAPI(response.units, response.book_name);
                        setCountofUseAIProofreading(response.units[unitIndex].proofreading_count);
                        return true;
                    } else {
                        return false;
                    }
                })
            }
            if (reloadData) {
                const checkTarget = sparkWritingData[unitIndex].draft_1_outline;
                // check submit?
                const checkSubmitted = sparkWritingData[unitIndex].draft_1_status.status;
              //  console.log('checkTarget =',checkTarget,'\ncheckSubmitted=',checkSubmitted)
              //  console.log(`sparkWritingData[${unitIndex}]=`,sparkWritingData[unitIndex])
                if (checkSubmitted > 1) {
                  //  console.log('test 11')
                    setIsSubmitted(true);
                    
                } else {
                    let titleGrammarData:{
                        past: TTitleHistory[];
                        present: TTitleHistory;
                        future: TTitleHistory[];
                    } = {past:[], present:[], future: []};
                    let bodyGrammarData:{
                        past: TbodyHistory[];
                        present: TbodyHistory;
                        future: TbodyHistory[];
                    } = {past:[], present:[], future: []};
    
                    for (let unitsIdx = 0; unitsIdx < checkTarget.length; unitsIdx++) {
                        const targetValue = checkTarget[unitsIdx];
                        if (targetValue.grammar_correction_content_student&&targetValue.grammar_correction_content_student!=='') {
                            if (targetValue.name==='Title') {
                                titleGrammarData = JSON.parse(targetValue.grammar_correction_content_student);
                            } else if (targetValue.order_index===2) {
                                const targetDataParsing = JSON.parse(targetValue.grammar_correction_content_student)
                                bodyGrammarData = targetDataParsing;
                            }
                        }
                    }
                    if (bodyGrammarData.present && bodyGrammarData.present.length > 0) {
            
                        setBodyHistory({
                            title: titleGrammarData,
                            body: bodyGrammarData
                        })
                        setIsGrammarProceed(true);
                        setIsPreview(false)
                        setGuideFlag(1)
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
        
       
    }
    useComponentWillMount(async ()=>{
        setCommonStandbyScreen({openFlag:true})
        console.log('params =',params)
        await beforeRenderedFn();
    })

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
            const res = await grammarCheck(sparkWritingData[unitIndex].draft_1_outline, userInfo.accessToken);
           console.log('res ====',res)
            if (res.result_body.length>0) {
                const unitId = sparkWritingData[unitIndex].unit_id
                // const proofReadingCountUpdateValue = 1;
                setProofreadingCount(unitId)
                setCommonStandbyScreen({openFlag:false})
                setIsPreview(false)
                setIsGrammarProceed(true);
                 console.log('res grammar =',res)
                setGuideFlag(1)
                setInitHistorys({
                    title: res.result_title,
                    body: res.result_body
                })

                // const proofReadingCountUpdateValue = ProofReadingCountValue+1;
                // const updateCountAPI = await proofReadingCountUpdate(userInfo.userCode, unitId, proofReadingCountUpdateValue, userInfo.accessToken);
                // if (updateCountAPI.statusCode === 200) {
                // }
            }
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
                      //  console.log('check body true ==',wordTitleValue)
                      //  console.log('checkType1::',checkType1)
                      //  console.log('checkTypeMinus1::',checkTypeMinus1)
                      //  console.log('(checkType1 || checkTypeMinus1) ::',(checkType1 || checkTypeMinus1))
                      //  console.log('checkType2::',checkType2)
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
      //  console.log('body hist ===',bodyHistory.body.present)
        for (const item of bodyHistory.body.present) {
            for (const presentBody of item.data) {
                let checkType0 = false;
                let checkType1 = false;
                let checkTypeMinus1 = false;
                let checkType2 = false;
    
                for (const iPresentBodyValue of presentBody) {
                    for (const wordBodyValue of iPresentBodyValue) {
                        for (const checkBodyTarget of wordBodyValue) {
                            if (checkBodyTarget.type === 0)checkType0 = true;
                            if (checkBodyTarget.type === 1) checkType1 = true;
                            if (checkBodyTarget.type === -1) checkTypeMinus1 = true;
                            if (checkBodyTarget.type === 2)checkType2 = true;
                        }
    
                        if ((checkType1 || checkTypeMinus1) && !checkType2) {
                          //  console.log('check body true ==',wordBodyValue)
                          //  console.log('checkType1::',checkType1)
                          //  console.log('checkTypeMinus1::',checkTypeMinus1)
                          //  console.log('(checkType1 || checkTypeMinus1) ::',(checkType1 || checkTypeMinus1))
                          //  console.log('checkType2::',checkType2)
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
          //  console.log('checkIsSelected ==',checkIsSelected)
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
    // const onSubmitEvent = () => {
    //     if (!openSubmitButton) {
    //         return;
    //     } else {
    //         let draftText = '';
    //         const unitTitle_1 = selectUnitInfo.main.replace(/\.$/gi,'');
    //         if (params.draft === '1') {
    //             draftText='1st draft'
    //         } else { draftText='2nd draft'}
    //         const yesMessage = <p className='ordinal'>{`Your ${unitTitle_1} ${selectUnitInfo.sub}'s ${draftText} has been submitted.`}</p>
            
    //         commonAlertOpen({
    //             head: `${unitTitle_1}: ${selectUnitInfo.sub}`,
    //             alertType: 'continue',
    //             messages: ['Are you ready to submit?'],
    //             yesButtonLabel: 'Yes',
    //             noButtonLabel: 'No',
    //             yesEvent: () => {
    //                 commonAlertOpen({
    //                     useOneButton: true,
    //                     messages: [yesMessage],
    //                     yesButtonLabel: 'OK',
    //                 })
    //             }
    //         })
    //     }
    // }
    const replaceUpdateSparkWritingTitle = () => {
        const unitId = sparkWritingData[unitIndex].unit_id
      //  console.log('unit index =',sparkWritingData[unitIndex])
      //  console.log('unit ==',unitId)
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
          //  console.log('in checking proceed ')
          //  console.log('unitId : ',unitId, ', unitIndex ::',unitIndex)
            
            setOutlineInputText(presentParagraghString,unitId, unitIndex,1,1)
        }
    }
    const replaceUpdateSparkWritingBody = () => {
        const unitId = sparkWritingData[unitIndex].unit_id
      //  console.log('body history =',bodyHistory.body.present)
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
              //  console.log('presentBody:::',presentParagraghString)
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
            const grammar_correction_content_student = item.name==='Title'? JSON.stringify(bodyHistory.title): (item.order_index===2 ? JSON.stringify(bodyHistory.body) : '')
            return {
                heading_name: item.name,
                input_content: item.input_content,
                grammar_correction_content_student,
                order_index: item.order_index,
                is_input_open: true
            }
        });
        const data:TSparkWritingTemporarySaveData = {
            student_code: userInfo.userCode,
            student_name_en: userInfo.memberNameEn,
            student_name_kr: userInfo.memberNameKr,
            class_name: userInfo.className,
            unit_id: targetData.unit_id,
            draft_index: 1,
            proofreading_count: targetData.proofreading_count,
            contents: contentsData
        };
      //  console.log('data ==',data)
        const isSaveTemporary = await draftSaveTemporary(data,userInfo.accessToken);
        
        if (isSaveTemporary) {
            // if (isGrammarSave) {
                commonAlertClose()
                CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role);
                // commonAlertOpen({
                //     useOneButton:true,
                //     yesButtonLabel: 'OK',
                //     alertType: 'continue',
                //     messages: ['Temporary saving is complete.'],
                //     yesEvent: async () => {
                        
                //     }
                // })
            // } else {
            //     commonAlertOpen({
            //         useOneButton:true,
            //         yesButtonLabel: 'OK',
            //         alertType: 'continue',
            //         messages: ['Temporary saving is complete.'],
            //         yesEvent: async () => {
            //             commonAlertClose();
            //             navigate(-1)
            //         }
            //     })
            // }
        } else {
            await forcedTemporarySave();
        }
        // commonAlertOpen({
        //     useOneButton: true,
        //     yesButtonLabel: 'OK',
        //     alertType: 'continue',
        //     messages: ['Do you want to save your current progress and return to the main menu?'],
        //     yesEvent: async () => {
                
        //     }
        // })
    }

    React.useMemo(()=>{
        previewTextforGrammarCheck();
    }, [sparkWritingData])
    
    React.useMemo(()=>{
        if (guideFlag===undefined) {
            setGuideFlag(0)
        } else if (guideFlag === 0) {
            if (guideText.length === 0||guideText===undefined) setGuideText(['Check your writing.']);
        } else if (guideFlag === 1) {
            
            const guideTextData = [
                'Before you submit, check the revised writing. Tap the colored text and choose whether to make changes or not.',
            ];
            setGuideText(guideTextData)
        }
    }, [guideFlag]);

    // did mount
    React.useEffect(()=>{
        setTopNavHiddenFlagged(true);
        setSubNavTitleString(`${selectUnitInfo.main} ${selectUnitInfo.sub}`);
        if (params.draft === '1') {
            const rightTitle = <span>{'Step 1.'}<span className='ordinal pl-2 pr-1'>{'1st'}</span>{'Draft'}</span>
            setSubRightNavTitleString(rightTitle)
        } else if (params.draft === '2') {
            const rightTitle = <span>{'Step 2.'}<span className='ordinal pl-2 pr-1'>{'2nd'}</span>{'Draft'}</span>
            setSubRightNavTitleString(rightTitle)
        }
// setCountofUseAIProofreading, countofUseAIProofreading 
        if (countofUseAIProofreading !== undefined || countofUseAIProofreading !== -1) {
            const proofreadingCount = sparkWritingData[unitIndex].proofreading_count;
            if (proofreadingCount > 0) {
                setOpenSubmitButton(true);
            };
            setCountofUseAIProofreading(proofreadingCount);
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
        console.log('goBackFromDraftInUnitPage =',goBackFromDraftInUnitPage)
        if (!goBackFromDraftInUnitPage) {
            setGoBackFromDraftInUnitPage(()=>{ 
                commonAlertOpen({
                    messages: ['Do you want to exit?'],
                    alertType: 'warningContinue',
                    yesButtonLabel:'Yes',
                    noButtonLabel: 'No',
                    yesEvent: async () => {
                        commonAlertClose();
                        CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                    },
                    closeEvent: () => {
                        commonAlertClose();
                    }
                })
            })
        }
        // check grammar modal select
        if (bodyHistory.body.present.length > 0 && bodyHistory.title.present) {
            // grammar 진행 시작
            console.log('bodyHistory 1==',bodyHistory)
            const checkGrammarsSelectAll = checkSelectedGrammarModals();
            console.log('checkGrammarsSelectAll ==',checkGrammarsSelectAll)
            if (countofUseAIProofreading===2) {
                if (checkGrammarsSelectAll) {
                   console.log('grammar 진행 중 1')
                    setIsSaveButtonOpen(true);
                    setIsGrammarProceed(true)
                    
                    setOpenSubmitButton(false)
                } else {
                   console.log('grammar 진행 종료 1')
                    replaceUpdateSparkWritingTitle()
                    replaceUpdateSparkWritingBody()
                    setIsGrammarProceed(false)
                    setOpenSubmitButton(true)
                }
            } else if (countofUseAIProofreading>=0 && countofUseAIProofreading <2) {
              //  console.log(bodyHistory)
                if (checkGrammarsSelectAll) {
                    // grammar 진행중
                   console.log('grammar 진행 중 2')
                    setIsSaveButtonOpen(true);
                    setIsGrammarProceed(true)
                    
                    setOpenSubmitButton(false);
                } else {
                    // grammar 종료
                   console.log('grammar 진행 종료 2')
                    replaceUpdateSparkWritingTitle()
                    replaceUpdateSparkWritingBody()
                    setIsGrammarProceed(false)
                    setOpenSubmitButton(true)
                }
            }
        } else {
            // grammar 진행 전
           console.log('grammar 진행 전')
            console.log('bodyHistory 1==',bodyHistory)
            console.log('countofUseAIProofreading =',countofUseAIProofreading)
            
            if (countofUseAIProofreading>0) {
                if (countofUseAIProofreading===2) {
                    const checkGrammarsSelectAll = checkSelectedGrammarModals();
                    console.log('checkGrammarsSelectAll =',checkGrammarsSelectAll)
                    if (checkGrammarsSelectAll) {
                        setOpenSubmitButton(false);
                    } else {
                        setOpenSubmitButton(true);
                    }
                };
                
                const submitDate = sparkWritingData[unitIndex].draft_1_status.submit_date;
                if (submitDate!==null && submitDate!=='') {
                    console.log('submitDate =',submitDate)
                    setIsSaveButtonOpen(false);
                } else {
                    console.log('bodyHistory.body.present.length =',bodyHistory.body.present.length)
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
                if (isStandbyFeedback!=='') {
                    setIsSubmitted(true);
                    setGoBackFromDraftInUnitPage(()=>{ 
                        commonAlertOpen({
                            messages: ['Do you want to exit?'],
                            alertType: 'warningContinue',
                            yesButtonLabel:'Yes',
                            noButtonLabel: 'No',
                            yesEvent: async () => {
                                commonAlertClose();
                                CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                            },
                            closeEvent: () => {
                                commonAlertClose();
                            }
                        })
                    })
                } else {
                    setIsSubmitted(false);
                    setGoBackFromDraftInUnitPage(()=>{ 
                        commonAlertOpen({
                            messages: ['Do you want to exit?'],
                            alertType: 'warningContinue',
                            yesButtonLabel:'Yes',
                            noButtonLabel: 'No',
                            yesEvent: async () => {
                                commonAlertOpen({
                                    messages: ['Do you want to save your current progress before you leave?'],
                                    alertType: 'warningContinue',
                                    yesButtonLabel: `No`,
                                    noButtonLabel: `Yes`,
                                    closeEvent: async ()=> {
                                        await forcedTemporarySave(true)
                                        commonAlertClose();
                                    },
                                    yesEvent: () => {
                                        commonAlertClose();
                                        CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                                    }
                                })
                            },
                            closeEvent: () => {
                                commonAlertClose();
                            }
                        })
                    })
                }
            }
            if (countofUseAIProofreading > 0) {
                if (isStandbyFeedback!=='') {
                    setIsSubmitted(true);
                    setGoBackFromDraftInUnitPage(()=>{ 
                        commonAlertOpen({
                            messages: ['Do you want to exit?'],
                            alertType: 'warningContinue',
                            yesButtonLabel:'Yes',
                            noButtonLabel: 'No',
                            yesEvent: async () => {
                                commonAlertClose();
                                CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                            },
                            closeEvent: () => {
                                commonAlertClose();
                            }
                        })
                    })
                } else {
                    setIsSubmitted(false);
                    setGoBackFromDraftInUnitPage(()=>{ 
                        commonAlertOpen({
                            messages: ['Do you want to exit?'],
                            alertType: 'warningContinue',
                            yesButtonLabel:'Yes',
                            noButtonLabel: 'No',
                            yesEvent: async () => {
                                commonAlertOpen({
                                    messages: ['Do you want to save your current progress before you leave?'],
                                    alertType: 'warningContinue',
                                    yesButtonLabel: `No`,
                                    noButtonLabel: `Yes`,
                                    closeEvent: async ()=> {
                                        await forcedTemporarySave(true)
                                        commonAlertClose();
                                    },
                                    yesEvent: () => {
                                        commonAlertClose();
                                        CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                                    }
                                })
                            },
                            closeEvent: () => {
                                commonAlertClose();
                            }
                        })
                    })
                }
            }
        } else {
            if (sparkWritingData[unitIndex].draft_1_status.status===5) {
                if (isStandbyFeedback!=='') {
                    setIsSubmitted(true);
                    setGoBackFromDraftInUnitPage(()=>{ 
                        commonAlertOpen({
                            messages: ['Do you want to exit?'],
                            alertType: 'warningContinue',
                            yesButtonLabel:'Yes',
                            noButtonLabel: 'No',
                            yesEvent: async () => {
                                commonAlertClose();
                                CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                            },
                            closeEvent: () => {
                                commonAlertClose();
                            }
                        })
                    })
                } else {
                    setIsSubmitted(false);
                    setGoBackFromDraftInUnitPage(()=>{ 
                        commonAlertOpen({
                            messages: ['Do you want to exit?'],
                            alertType: 'warningContinue',
                            yesButtonLabel:'Yes',
                            noButtonLabel: 'No',
                            yesEvent: async () => {
                                commonAlertOpen({
                                    messages: ['Do you want to save your current progress before you leave?'],
                                    alertType: 'warningContinue',
                                    yesButtonLabel: `No`,
                                    noButtonLabel: `Yes`,
                                    closeEvent: async ()=> {
                                        await forcedTemporarySave(true)
                                        commonAlertClose();
                                    },
                                    yesEvent: () => {
                                        commonAlertClose();
                                        CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                                    }
                                })
                            },
                            closeEvent: () => {
                                commonAlertClose();
                            }
                        })
                    })
                }
            } else {
                if (isStandbyFeedback!=='') {
                    setIsSubmitted(true);
                    setGoBackFromDraftInUnitPage(()=>{ 
                        commonAlertOpen({
                            messages: ['Do you want to exit?'],
                            alertType: 'warningContinue',
                            yesButtonLabel:'Yes',
                            noButtonLabel: 'No',
                            yesEvent: async () => {
                                commonAlertClose();
                                CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                            },
                            closeEvent: () => {
                                commonAlertClose();
                            }
                        })
                    })
                } else {
                    setIsSubmitted(false);
                    setGoBackFromDraftInUnitPage(()=>{ 
                        commonAlertOpen({
                            messages: ['Do you want to exit?'],
                            alertType: 'warningContinue',
                            yesButtonLabel:'Yes',
                            noButtonLabel: 'No',
                            yesEvent: async () => {
                                commonAlertOpen({
                                    messages: ['Do you want to save your current progress before you leave?'],
                                    alertType: 'warningContinue',
                                    yesButtonLabel: `No`,
                                    noButtonLabel: `Yes`,
                                    closeEvent: async ()=> {
                                        await forcedTemporarySave(true)
                                        commonAlertClose();
                                    },
                                    yesEvent: () => {
                                        commonAlertClose();
                                        CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                                    }
                                })
                            },
                            closeEvent: () => {
                                commonAlertClose();
                            }
                        })
                    })
                }
            }
        }
       console.log('isSubmitted ==',isSubmitted)
       console.log('proofreading count ==',sparkWritingData[unitIndex].proofreading_count)
       console.log('openSubmitButton =',openSubmitButton)
       console.log('isPreview =',isPreview)
       console.log('isGrammarProceed =',isGrammarProceed)
      //  console.log('test outline items =',sparkWritingData)

        return ()=>{
            setTopNavHiddenFlagged(false)
            setSubNavTitleString('')
            setGrammarResultInit()
            setSubRightNavTitleString('')
            setPreviewPageInitFlag('')
        }
    },[
        // page state
        bodyHistory, countofUseAIProofreading, isSaveButtonOpen, isSubmitted,
        // Nav store
        setTopNavHiddenFlagged, setSubNavTitleString, setSubRightNavTitleString,
        // Spark store
    ])

    const goBackEventSave = () => {
        setGoBackFromDraftInUnitPage(()=>{ 
            commonAlertOpen({
                messages: ['Do you want to exit?'],
                alertType: 'warningContinue',
                yesButtonLabel:'Yes',
                noButtonLabel: 'No',
                yesEvent: async () => {
                    commonAlertOpen({
                        messages: ['Do you want to save your current progress before you leave?'],
                        alertType: 'warningContinue',
                        yesButtonLabel: `No`,
                        noButtonLabel: `Yes`,
                        closeEvent: async ()=> {
                            await forcedTemporarySave(true)
                            commonAlertClose();
                        },
                        yesEvent: () => {
                            commonAlertClose();
                            CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                        }
                    })
                },
                closeEvent: () => {
                    commonAlertClose();
                }
            })
        })
    }
    const goBackEvent = () => {
        setGoBackFromDraftInUnitPage(()=>{ 
            commonAlertOpen({
                messages: ['Do you want to exit?'],
                alertType: 'warningContinue',
                yesButtonLabel:'Yes',
                noButtonLabel: 'No',
                yesEvent: async () => {
                    commonAlertClose();
                    CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                },
                closeEvent: () => {
                    commonAlertClose();
                }
            })
        })
    }
    

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
                        <button className={`absolute top-[8px] right-[15px] items-center ${isUndoBody ? ' cursor-pointer':'cursor-not-allowed'}`}
                        disabled={!isUndoBody}
                        onClick={isUndoBody ? ()=>undoValue():()=>{}}
                        >{
                            isUndoBody 
                            ? <GrammarContentComponent.resetButtonIcon className='w-[34px] h-[34px]' />
                            : <GrammarContentComponent.resetButtonDisabledIcon className='w-[34px] h-[34px]' />
                        }</button>
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
                                        <div className='flow-root w-full overflow-y-auto' style={{fontWeight:700}}>
                                        {bodyHistory.title.present && Array.isArray(bodyHistory.title.present) &&bodyHistory.title.present.map((v, i) => GrammarContentComponent.titleCompareDif1(v, i, clickTooltip))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className='flex flex-col text-start w-[1160px] max-w-[1160px] h-full max-h-full pt-[26px] overflow-y-auto overflow-x-hidden z-0'>
                            {(draftIndex!==2 && isStandbyFeedback==='') && bodyHistory.body.present && Array.isArray(bodyHistory.body.present) && remakeBodyItem.map((bodyRemakeStruct, bodyRemakeStructIndex)=> {
                                return <span className='pb-[20px] w-[1160px]' key={bodyRemakeStructIndex}>
                                    {bodyRemakeStruct.map((bodyRemakeNumber, bodyRemakeNumberIndex)=>{
                                        const v = bodyHistory.body.present[bodyRemakeNumber];
                                        // console.log('==test draft jsx ===',v)
                                        return GrammarContentComponent.bodyCompareDif1(v, bodyRemakeNumber, clickTooltip)
                                        // return <></>
                                    })}
                                </span>
                            } )}
                            {/* {(draftIndex===2 && isStandbyFeedback!=='') && (
                                sparkWritingData[unitIndex].draft_2_outline.map((bodyItem, bodyIndex) => {
                                    if (bodyItem.name==='Body') {
                                        return <div></div>
                                    } else return null;
                                })
                            )} */}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className={`buttons-div`}>
                    {!isSubmitted &&
                        <button className={`save-button-active`} onClick={()=>{
                            commonAlertOpen({
                                messages: ['Do you want to return to edit your writing?'],
                                yesButtonLabel: "No",
                                noButtonLabel: "Yes",
                                alertType: 'continue',
                                closeEvent: async ()=>{
                                    
                                    // grammar 시작 전
                                    commonAlertClose();
                                    // go to edit page
                                    const targetData = sparkWritingData[unitIndex];
                                    if (targetData.proofreading_count>0) {
                                        // edit은 세이브 필요 없을까?
                                        // await forcedTemporarySave(true)
                                    }
                                    // console.log('targetData =',targetData)
                                    const unitTitle = targetData.topic;
                                    const unitNum = targetData.unit_index;
                                    const draftNum = params.draft;
                                    // console.log('unitNum: ',targetData.topic)
                                    setSelectUnitInfo(`Unit ${unitNum}.`,unitTitle)
                                    const path = `WritingClinic/SparkWriting/${unitNum}/${draftNum}`
                                    // console.log('path =',path)
                                    CommonFunctions.goLink(path, navigate, role);  
                                },
                                yesEvent: () => commonAlertClose()
                            })
                        }}>Edit</button>
                    }
                    {!isSubmitted &&
                        <div className={!isSubmitted ?`${isSaveButtonOpen?'save-button-active div-to-button-hover-effect':'hidden'}`:'hidden'} onClick={()=>{
                            if (isSaveButtonOpen) {
                                if (!commonStandbyScreen.openFlag) {
                                    commonAlertOpen({
                                        messages: ['Do you want to save your current progress and return to the main menu?'],
                                        yesButtonLabel: `Yes`,
                                        noButtonLabel: `No`,
                                        yesEvent: async ()=> await forcedTemporarySave(true)
                                    })
                                }
                            }

                        }}>Save</div>
                    }
                    {!isSubmitted &&
                    
                        <button className={
                            isPreview 
                                ? (
                                    // preview 화면
                                    sparkWritingData[unitIndex].proofreading_count < 2
                                        ? 'save-button-active div-to-button-hover-effect'
                                        : 'save-button'
                                )
                                : (
                                    // proofreading화면 분기점
                                    'hidden'
                                )
                        } 
                        onClick={()=>{
                            if (!commonStandbyScreen.openFlag) {
                                if (sparkWritingData[unitIndex].proofreading_count===2) {
                                    commonAlertOpen({
                                        messages:  ['You have already used AI proofreading twice.'],
                                        useOneButton:true,
                                        yesButtonLabel: 'OK',
                                        // yesEvent: async () => await AIProofreadingYesOnClick()
                                    })
                                } else {
                                    commonAlertOpen({
                                        messages: [
                                            'You can only use the AI proofreading tool twice. Are you sure you want to proceed?',
                                            `(${sparkWritingData[unitIndex].proofreading_count+1}/2)`
                                        ],
                                        yesButtonLabel: 'No',
                                        noButtonLabel: 'Yes',
                                        closeEvent: async () => {
                                            commonAlertClose();
                                            await AIProofreadingYesOnClick();
                                        },
                                        yesEvent: () => commonAlertClose(),
                                    })
                                }
                            }
                        }}>Proofreading</button>
                    }
                    {/* 임시 버튼 - will del */}
                    {process.env.REACT_APP_IS_DEV==='ISDEVUA' &&
                        <button className={
                            
                            !isSubmitted 
                            
                                ?(
                                    sparkWritingData[unitIndex].proofreading_count===2
                                    ? 'save-button-active div-to-button-hover-effect'
                                    : 'save-button'
                                )
                                
                            :'hidden'

                            // submit 활성화 조건
                            // !isSubmitted && (openSubmitButton && countofUseAIProofreading>0) 
                            // submit 비활성화 조건
                            // !isSubmitted && (openSubmitButton && countofUseAIProofreading>0) && isGrammarProceed
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
                                      //  console.log('data =',data)
                                        const reset = await grammarReset(data, userInfo.accessToken);
                                      //  console.log('reset =',reset)
                                        if (reset.statusCode === 200) {
                                            setProofreadingCountReset(sparkWritingData[unitIndex].unit_id);
                                            await beforeRenderedFn();
                                        } 
                                        
                                    }
                                })
                            }
                        }}>Reset AI Count</button>
                    }

                    {!isSubmitted &&
                        <button className={ 
                            isPreview 
                                ? (
                                    // preview 화면
                                    sparkWritingData[unitIndex].proofreading_count === 2
                                        ? 'save-button-active div-to-button-hover-effect'
                                        : 'hidden'
                                )
                                : (
                                    // proofreading화면 분기점
                                    isGrammarProceed
                                        ? 'save-button'
                                        : (
                                            sparkWritingData[unitIndex].proofreading_count > 0 
                                                ? 'save-button-active div-to-button-hover-effect'
                                                :'save-button'
                                        )
                                )
                        }
                            onClick={()=>{
                                if (!commonStandbyScreen.openFlag) {
                                    const checkGrammarsSelectAll = checkSelectedGrammarModals();
                                    //  console.log('select all =',checkGrammarsSelectAll)
                                    // grammar 시작 후
                                    // select 완료 여부
                                    // grammar 시작 전
                                    if (!checkGrammarsSelectAll) {
                                        replaceUpdateSparkWritingTitle();
                                        replaceUpdateSparkWritingBody();
                                    }
                                    //  console.log('openSubmitButton =',openSubmitButton)
                                    if (openSubmitButton&&countofUseAIProofreading>0) {
                                        // submit date check
                                        const currentSparkWritingData = sparkWritingData[unitIndex]
                                        const submitDate = currentSparkWritingData.draft_1_status.submit_date;
                                        let noMessages = '';
                                        if (submitDate && submitDate!=='') {
                                            noMessages = `Your Unit ${currentSparkWritingData.unit_index} ${currentSparkWritingData.topic}'s 1st draft has been submitted.`
                                        }
                                        // onSubmitEvent()
                                        const replaceTopic = currentSparkWritingData.topic.replace(/s$/gmi,'');
                                        console.log('replaceTopic =',replaceTopic)
                                        commonAlertOpen({
                                            yesButtonLabel: 'No',
                                            alertType: 'continue',
                                            head: `Unit ${currentSparkWritingData.unit_index}: ${replaceTopic}`,
                                            messages: [
                                                // `Unit ${currentSparkWritingData.unit_index}: ${currentSparkWritingData.topic}`,
                                                'Are you ready to submit?'
                                            ],
                                            noButtonLabel: 'Yes',
                                            closeEvent: async () => {
        
                                                // submit
                                                // make contents 
                                                const contentsData:TSubmit1stDraftReqDataContent[] = currentSparkWritingData.draft_1_outline.map((item) => {
                                                    
                                                    const currentGrammarIndex = item.order_index-2;
                                                    // console.log('item =',item)
                                                    // console.log('currentGrammarIndex =',currentGrammarIndex)
                                                    const grammar_correction_content_student = guideFlag===1 ? (
                                                        item.name==='Title'? JSON.stringify(bodyHistory.title.present): JSON.stringify(bodyHistory.body.present[currentGrammarIndex].data)
                                                    ):(
                                                        item.grammar_correction_content_student
                                                    );
                                                    
                                                    return {
                                                        input_content: item.input_content,
                                                        grammar_correction_content_student,
                                                        heading_name: item.name,
                                                        order_index: item.order_index
                                                    }
                                                })
                                                const submitData:TSubmit1stDraftRequestData = {
                                                    student_code: userInfo.userCode,
                                                    student_name_en: userInfo.memberNameEn,
                                                    student_name_kr: userInfo.memberNameKr,
                                                    class_name: userInfo.className,
                                                    unit_id: currentSparkWritingData.unit_id,
                                                    draft_index: 1,
                                                    contents: contentsData,
                                                    proofreading_count: currentSparkWritingData.proofreading_count
                                                }
                                              //  console.log('submit item = ',submitData)
                                                commonAlertClose();
                                                setCommonStandbyScreen({openFlag:true})
                                                const submit = await draft1stSubmit(submitData, userInfo.accessToken);
                                                
                                              //  console.log('submit return data =',submit)
                                                if (submit) {
                                                    setCommonStandbyScreen({openFlag:false})
                                                    commonAlertOpen({
                                                        useOneButton:true,
                                                        yesButtonLabel: 'OK',
                                                        alertType: 'continue',
                                                        messages: [
                                                            `Your Unit ${currentSparkWritingData.unit_index} ${replaceTopic}'s`,
                                                            <span><span style={{textDecoration:'underline', fontWeight:700}}>1<sup>st</sup> draft</span> has been submitted.</span>
                                                        ],
                                                        yesEvent: () => {
                                                            commonAlertClose()
                                                            CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role);
                                                        }
                                                    })
                                                }
                                            },
                                            yesEvent: async() => {
                                                commonAlertClose();
                                            }
                                        })
                                    }

                                }
                        }}>Submit</button>
                    }
                </div>
            </div>
        </section>
    )
}

export default PreviewSparkWriting;

