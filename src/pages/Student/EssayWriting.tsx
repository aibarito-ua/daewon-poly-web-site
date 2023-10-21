import React from 'react';
import useNavStore from '../../store/useNavStore';
import useEssayWritingCenterDTStore from '../../store/useEssayWritingCenterDTStore';
import useSparkWritingStore from '../../store/useSparkWritingStore';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginStore from '../../store/useLoginStore';
import { CommonFunctions } from '../../util/common/commonFunctions';
import FormDialog from '../../components/toggleModalComponents/ChatbotModalComponent';
import { commonIconSvgs } from '../../util/svgs/commonIconsSvg';
import useControlAlertStore from '../../store/useControlAlertStore';
import { useComponentWillMount } from '../../hooks/useEffectOnce';
import { callUnitInfobyStudent, draft2ndSubmit, draftSaveTemporary } from './api/EssayWriting.api';
import draftViewBox from '../../components/pageComponents/feedbackComponents/draftFeedback';
import TeacherFeedbackDetailModalComponents from '../../components/toggleModalComponents/TeacherFeedbackDetailModalComponents';

const EssayWriting = () => {

    // 1nd draft에서 완료 후 툴팁 제어
    const tooltipControlDivRef = React.useRef(null);
    
    // input text
    const [essayTopicInput, setEssayTopicInput] = React.useState<string>('');
    
    // fold flag
    const [foldFlag, setFoldFlag] = React.useState<boolean[]>([]);
    const draft1stRefs = React.useRef<(HTMLTextAreaElement|null)[]>([]);
    const draft2ndRefs = React.useRef<(HTMLTextAreaElement|null)[]>([]);
    const [updateFoldIndex, setUpdateFoldIndex] = React.useState<number>();

    // check open  Buttons
    const [isSaveButtonOpen, setIsSaveButtonOpen] = React.useState<boolean>(false);
    const [isPreviewButtonOpen, setIsPreviewButtonOpen] = React.useState<boolean>(false);

    // unit/draft index params: unit start to 0, draft use 1 or 2
    const [paramValues, setParamValues] = React.useState<{unitIndex:number, draft:number}>({unitIndex:0, draft: 0});

    // save flag
    const [ isSaved, setIsSaved] = React.useState<boolean>(false);
    // 비교할 원본 데이터
    const [originalTargetData, setOriginalTargetData] = React.useState<TSparkWritingDatas>([]);

    // 1st overall comment
    const [overallComment1stDraft, setOverallComment1stDraft] = React.useState<{open:boolean, content: string}>({content:'', open: false});
    
    // comment focus flag -> target border
    // const [commentFocusId, setCommentFocusId] = React.useState<string>('');

    // 2nd save active flag
    const [draft2ndSaveActive, setDraft2ndSaveActive] = React.useState<boolean>(false);
    // 2nd submit active flag
    const [draft2ndSubmitActive, setDraft2ndSubmitActive] = React.useState<boolean>(false);

    // 2nd draft input update check flag
    const [isUpdateDraft2Inputs, setIsUpdateDraft2Inputs] = React.useState<boolean>(false);

    // user info
    const {
        userInfo
    } = useLoginStore();
    // Nav Store
    const { 
        setTopNavHiddenFlagged,
        setSubNavTitleString,
        setSubRightNavTitleString,
        selectUnitInfo,
        goBackFromDraftInUnitPage,
        setGoBackFromDraftInUnitPage,
    } = useNavStore();
    // WritingCenter Store
    const {essayWritingInputItems, } = useEssayWritingCenterDTStore();
    // Spark Store
    const { 
        setOutlineInputText,
        sparkWritingData,
        feedbackDataInStudent,
        setFeedbackDataInStudent,
        draft2ndPageSet,
        setDraft2ndPageSet,
        commentFocusId,
        sparkWritingDataDumy,
        historyDataDelete,
        previewPageInitFlag,
        setPreviewPageInitFlag
    } = useSparkWritingStore();
    const params = useParams();
    // console.log('params : unit =',params.unit,': draft =',params.draft)
    const UnitIndex:string = params.unit!==undefined? params.unit: '0';
    const DraftIndex:string = params.draft!==undefined? params.draft: '0';
    // Navigate hook
    const navigate = useNavigate();
    // current role
    const {role} = useLoginStore();
    const {commonAlertOpen, commonAlertClose,setCommonStandbyScreen, setReturn1stDraftReasonAlertOpen} = useControlAlertStore();

    const pageInitSetting = async () => {
        const init = await callUnitInfobyStudent(userInfo.userCode, userInfo.courseName, userInfo.accessToken).then((response) => {
            const data = response.units
            console.log('response page init set api =',response)
            setOriginalTargetData(data);
            setIsSaved(false);
            return true;
        })
        setPreviewPageInitFlag('')
        const currentDraft = params.draft ? params.draft : '';
        if (init) {
            if (currentDraft === '1') {
                const draft1stStatus = sparkWritingData[parseInt(UnitIndex)-1].draft_1_status;
                if (draft1stStatus.status === 5) {
                    // setCommonStandbyScreen({openFlag:false})
                    // return submit
                    setReturn1stDraftReasonAlertOpen({
                        openFlag:true, 
                        returnReason: draft1stStatus.return_reason,
                        returnTeacherComment: draft1stStatus.return_teacher_comment,
                        NoEvent:()=>{
                            CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                        },
                        yesEvent:()=>{
        
                        }
                    })
                } else if (draft1stStatus.status===4) {
                    // 1차 완료 , 2차 시작 init 
                    setOverallComment1stDraft({open:false, content: draft1stStatus.overall_comment});
                    const targetPageFlag = sparkWritingData[parseInt(UnitIndex)-1].draft_2_init_page_flag;
                    console.log(' == targetPageFlag=1=',targetPageFlag)
                    setDraft2ndPageSet(targetPageFlag);
                }
                setCommonStandbyScreen({openFlag:false})
            } else if (currentDraft === '2') {
                const currentData = sparkWritingData[parseInt(UnitIndex)-1];
                if (currentData) {
                    console.log('currentData =',currentData)
                    const draft2ndStatus = currentData.draft_2_status;
                    const draft1stStatus = currentData.draft_1_status;
                    const targetPageFlag = currentData.draft_2_init_page_flag;
                    console.log('test data =',draft2ndStatus, ', ',draft1stStatus,', ',targetPageFlag)
                    
                    if (draft2ndStatus.status === 5) {
                        console.log(' == targetPageFlag=2=',targetPageFlag)
                        setOverallComment1stDraft({open:false, content: draft1stStatus.overall_comment});
                        setDraft2ndPageSet(targetPageFlag);
                        
                        // return submit
                        setReturn1stDraftReasonAlertOpen({
                            openFlag:true, 
                            returnReason: draft2ndStatus.return_reason,
                            returnTeacherComment: draft2ndStatus.return_teacher_comment,
                            NoEvent:()=>{
                                setDraft2ndPageSet('')
                                setDraft2ndSaveActive(false)
                                setDraft2ndSubmitActive(false)
                                CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                            },
                            yesEvent:()=>{
                            }
                        })
                    } else if (draft2ndStatus.status===4) {
                        // 1차 완료 , 2차 시작 init 
                        console.log(' == targetPageFlag=3=',targetPageFlag)
                        setOverallComment1stDraft({open:false, content: draft1stStatus.overall_comment});
                        setDraft2ndPageSet(targetPageFlag);
                    }

                    // 1차 데이터 셋팅
                    if (draft1stStatus.status===4) {
                        // 1차 완료 , 2차 시작 init 
                        setOverallComment1stDraft({open:false, content: draft1stStatus.overall_comment});
                        setDraft2ndPageSet(targetPageFlag);
                    }
                    setCommonStandbyScreen({openFlag:false})
                }
            }
        }
        return init;
    }
    useComponentWillMount(async ()=>{
        const currentDraft = params.draft ? params.draft : '';
        console.log('unit data =', sparkWritingData[parseInt(UnitIndex)-1])
        console.log('essay writing 102 | draft test =',)
        setCommonStandbyScreen({openFlag:true})
        const initEnd = await pageInitSetting().then((init) => {
            
            return init;
        })
        
        
        return ()=>{
            console.log('is did un mout?')
            setIsSaved(false);
            // setDraft2ndPageSet('')
        }
    })

    React.useEffect(()=>{
        setTopNavHiddenFlagged(true);
        setSubNavTitleString(`${selectUnitInfo.main} ${selectUnitInfo.sub}`);
        // path param to number
        const unitIndex:number = parseInt(params.unit!==undefined? params.unit:'1') - 1;
        const draftIndex:number = parseInt(params.draft !== undefined ? params.draft: '1');
        if(paramValues === undefined) {
            setParamValues({unitIndex:unitIndex, draft:draftIndex})
        }
        
        // fold
        if (foldFlag.length === 0) {
            const data = sparkWritingData[unitIndex];
            // console.log('fold 0', data)
            const leng = data.draft_1_outline.length;
            let isFirstComeHere = false;
            for (let i = 0; i < data.draft_1_outline.length; i++) {
                const targetInput = data.draft_1_outline[i].input_content;
                if (targetInput.length > 0) {
                    isFirstComeHere=true;
                    break;
                }
            }
            const foldInit = isFirstComeHere ? Array.from({length: leng}, ()=>true) : Array.from({length: leng}, ()=>false)
            setFoldFlag(foldInit)
        } else {
            if (updateFoldIndex !== undefined) {
                const controllClass = `foldFlag:::[${updateFoldIndex}]`;
                for (let i = 0; i < foldFlag.length; i++) {
                    const target = draft1stRefs.current[i];
                    if (target) {
                        if (target.className.includes(controllClass)) {
                            target.style.height='auto';
                            target.style.height = target.scrollHeight+'px';
                            
                        }
                        if (updateFoldIndex === i) {
                            target.scrollIntoView({behavior:'auto', block: 'end'})
                        }
                    }
                }
            }
        }

        if (params.draft === '1') {
            const rightTitle = <span>{'Step 1.'}<span className='ordinal pl-2 pr-1'>{'1st'}</span>{'Draft'}</span>
            setSubRightNavTitleString(rightTitle)
        } else {
            if (originalTargetData.length>0) {
                console.log('draft 2 value update')
                const draft2Outlines = sparkWritingData[unitIndex].draft_2_outline;
                const dumyDraft2Outlines = originalTargetData[unitIndex].draft_2_outline;
                let isUpdate2nd = false;
                for (let i = 0; i < draft2Outlines.length; i++) {
                    if (draft2Outlines[i].input_content !== dumyDraft2Outlines[i].input_content) {
                        isUpdate2nd = true;
                        break;
                    }
                }
                console.log('isUpdate =',isUpdate2nd)
                setIsUpdateDraft2Inputs(isUpdate2nd);
            } 
            const rightTitle = <span>{'Step 2.'}<span className='ordinal pl-2 pr-1'>{'2nd'}</span>{'Draft'}</span>
            setSubRightNavTitleString(rightTitle)
        }
        if (essayTopicInput === undefined || essayTopicInput === '') {
            
            // nav header setting
            setEssayTopicInput(sparkWritingData[unitIndex].topic);
        }
        
        callbackCheckValues();
        return () => {
            // console.log('did unmount in Essay Writing Page')
            setTopNavHiddenFlagged(false)
            setSubNavTitleString('')
            setSubRightNavTitleString('')
            setIsPreviewButtonOpen(false);
            setIsSaveButtonOpen(false);
            setIsUpdateDraft2Inputs(false);
        }
    },[
        // page state
        params,
        foldFlag,
        essayTopicInput,
        paramValues,
        draft2ndPageSet, draft2ndSaveActive, draft2ndSubmitActive,
        // nav store
        setTopNavHiddenFlagged, 
        setSubNavTitleString,
        setSubRightNavTitleString,
        selectUnitInfo,
        // WritingCenter Store
        essayWritingInputItems,
        sparkWritingData
        // Spark Store
    ])
    React.useEffect(()=>{
        const unitIndex:number = parseInt(params.unit!==undefined? params.unit:'1') - 1;
        const target = sparkWritingData[unitIndex].draft_2_outline;
        // 2nd draft check
        // if (target[0].input_content!=='' && target[1].input_content!=='' ) {
        //     setDraft2ndSubmitActive(true);
        //     setDraft2ndSaveActive(true);
        // } else if (target[0].input_content!=='' || target[1].input_content!=='' ) {
        //     setDraft2ndSaveActive(true);
        //     setDraft2ndSubmitActive(false);
        // } else {
        //     setDraft2ndSubmitActive(false);
        //     setDraft2ndSaveActive(false);
        // }
        if (params.draft && params.draft==='1') {

            if (sparkWritingData !== undefined) {
                if (DraftIndex==='1') {
                    const targetDataOutline = sparkWritingData[parseInt(UnitIndex)-1].draft_1_outline;
                    const max_leng = targetDataOutline.length;
                    let titleMaxLengthCheck = false;
    
                    let orderIndex = -1;
                    let unitId = -1;
                    let unitIndex = -1;
                    let redoTitleText = '';
    
                    let targetFlags = Array.from({length:max_leng},()=>1)
                    targetFlags = targetDataOutline.map((v,i) => {
                        const target_leng = v.input_content.replaceAll(' ','').length;
                        if (v.name === 'Title') {
                            console.log('input =',target_leng,', ',v.input_content,)
                            const lengthTitle = v.input_content.length;
                            orderIndex = v.order_index;
                            unitId = sparkWritingData[parseInt(UnitIndex)-1].unit_id;
                            unitIndex = sparkWritingData[parseInt(UnitIndex)-1].unit_index;
                            if (lengthTitle > 120) {
                                redoTitleText = v.input_content.substring(0, 120);
                                titleMaxLengthCheck = true;
                            }
                        }
                        if (target_leng >= 10) {
                            // 10자 이상
                            return 0;
                        } else {
                            // 10자 미만
                            return 1;
                        }
                    })
                    if (titleMaxLengthCheck) {
                        commonAlertOpen({
                            messages:['The title cannot be more than 120 characters.'],
                            useOneButton: true,
                            yesButtonLabel: 'OK',
                            yesEvent: () => {
                                setOutlineInputText(redoTitleText, unitId, unitIndex, orderIndex, 1)
                                commonAlertClose();
                            }
                        })
                        return;
                    }
                    const sum = targetFlags.reduce((a,b) => (a+b));
                    // sum === 0 => Preview && save 활성화
                    // sum >0, sum < targetFlags.length; -> save 활성화
                    // else -> 모든 버튼 비활성화
                    console.log('in callback effect - sum: ', sum,', targetFlags: ',targetFlags)
                    if (sum === 0) {
    
                        setIsSaveButtonOpen(true)
                        setIsPreviewButtonOpen(true);
                        setGoBackFromDraftInUnitPage(()=>{
                            commonAlertOpen({
                                messages: ['Do you want to exit?'],
                                alertType: 'warningContinue',
                                yesButtonLabel:'Yes',
                                noButtonLabel: 'No',
                                yesEvent: async () => {
                                    callbackCheckValues()
                                    commonAlertOpen({
                                        messages: ['Do you want to save your current progress before you leave?'],
                                        alertType: 'warningContinue',
                                        yesButtonLabel: `No`,
                                        noButtonLabel: `Yes`,
                                        closeEvent: async ()=> {
                                            await temporarySaveFunction();
                                            commonAlertClose();
                                        },
                                        yesEvent: () => {
                                            commonAlertClose();
                                            setDraft2ndPageSet('')
                                            setDraft2ndSaveActive(false)
                                            setDraft2ndSubmitActive(false)
                                            CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                                        }
                                    })
                                },
                                closeEvent: () => {
                                    commonAlertClose();
                                }
                            })
                        })
                    } else if (sum > 0 && sum < targetFlags.length) {
                        setIsSaveButtonOpen(true)
                        setGoBackFromDraftInUnitPage(()=>{
                            commonAlertOpen({
                                messages: ['Do you want to exit?'],
                                alertType: 'warningContinue',
                                yesButtonLabel:'Yes',
                                noButtonLabel: 'No',
                                yesEvent: async () => {
                                    callbackCheckValues()
                                    commonAlertOpen({
                                        messages: ['Do you want to save your current progress before you leave?'],
                                        alertType: 'warningContinue',
                                        yesButtonLabel: `No`,
                                        noButtonLabel: `Yes`,
                                        closeEvent: async ()=> {
                                            await temporarySaveFunction();
                                            commonAlertClose();
                                        },
                                        yesEvent: () => {
                                            commonAlertClose();
                                            setDraft2ndPageSet('')
                                            setDraft2ndSaveActive(false)
                                            setDraft2ndSubmitActive(false)
                                            CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                                        }
                                    })
                                },
                                closeEvent: () => {
                                    commonAlertClose();
                                }
                            })
                        })
                    } else {
                        setIsPreviewButtonOpen(false);
                        setIsSaveButtonOpen(false)
                        setGoBackFromDraftInUnitPage(()=>{
                            commonAlertOpen({
                                messages: ['Do you want to exit?'],
                                alertType: 'warningContinue',
                                yesButtonLabel:'Yes',
                                noButtonLabel: 'No',
                                yesEvent: async () => {
                                    commonAlertClose();
                                    setDraft2ndPageSet('')
                                    setDraft2ndSaveActive(false)
                                    setDraft2ndSubmitActive(false)
                                    CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                                },
                                closeEvent: () => {
                                    commonAlertClose();
                                }
                            })
                        })
                    }
                }
            }
        }
    }, [sparkWritingData]);

    React.useEffect(()=>{
        const unitIndex:number = parseInt(params.unit!==undefined? params.unit:'1') - 1;
        const target = sparkWritingData[unitIndex]
        console.log('draft2ndPageSet ==',draft2ndPageSet)
        if (target.draft_2_status.status === 0||target.draft_2_status.status === 5) {
            console.log('1')
            if (target.draft_2_outline[0].input_content==='' && target.draft_2_outline[1].input_content==='') {
                console.log('1-1')
                if (draft2ndPageSet==='revise') {
                    console.log('revise')
                    const target1st = target.draft_1_outline;
                    console.log('==target1st=',target1st)
                    let titleInput = '';
                    let bodyInput = '';
                    for (let i = 0; i < target1st.length; i++) {
                        const current1stTarget = target1st[i];
                        console.log('==current1stTarget=',current1stTarget)
                        if (current1stTarget.name === 'Title') {
                            titleInput = current1stTarget.input_content
                        } else {
                            bodyInput += current1stTarget.input_content+'\n\n';
                        }
                    }
                    console.log('titleInput =',titleInput)
                    console.log('bodyInput =',bodyInput)
                    setOutlineInputText(titleInput, target.unit_id, target.unit_index, 1,2)
                    setOutlineInputText(bodyInput, target.unit_id, target.unit_index, 2,2)
                } else if (draft2ndPageSet==='fresh') {
                    setOutlineInputText('', target.unit_id, target.unit_index, 1,2)
                    setOutlineInputText('', target.unit_id, target.unit_index, 2,2)
                } else {
                    
                }
            } else {
                console.log('1-2')
            }
        } else if (target.draft_2_status.status === 1) {
            console.log('2')
            if (draft2ndPageSet === '') {
                setDraft2ndPageSet(target.draft_2_init_page_flag)
            }
            if (target.draft_2_outline[0].input_content==='' && target.draft_2_outline[1].input_content==='') {
                if (draft2ndPageSet==='revise') {
                    console.log('revise')
                    const target1st = target.draft_1_outline;
                    console.log(' target =',target)
                    let titleInput = '';
                    let bodyInput = '';
                    for (let i = 0; i < target1st.length; i++) {
                        const current1stTarget = target1st[i];
                        console.log(' current1stTarget = ',current1stTarget)
                        if (current1stTarget.name === 'Title') {
                            titleInput = current1stTarget.input_content
                        } else {
                            bodyInput += current1stTarget.input_content+'\n\n';
                        }
                    }
                    console.log('titleInput =',titleInput)
                    console.log('bodyInput =',bodyInput)
            
                    setOutlineInputText(titleInput, target.unit_id, target.unit_index, 1,2)
                    setOutlineInputText(bodyInput, target.unit_id, target.unit_index, 2,2)
                    setDraft2ndSaveActive(true)
                    setDraft2ndSubmitActive(true)
                } else if (draft2ndPageSet==='fresh') {
                    setOutlineInputText('', target.unit_id, target.unit_index, 1,2)
                    setOutlineInputText('', target.unit_id, target.unit_index, 2,2)
                } else {
                    
                }
            }
            
        }
    }, [draft2ndPageSet])
    
    const callbackCheckValues = React.useCallback( ()=>{
        if (sparkWritingData !== undefined) {
            if (DraftIndex==='1') {
                const targetDataOutline = sparkWritingData[parseInt(UnitIndex)-1].draft_1_outline;
                const max_leng = targetDataOutline.length;
                let titleMaxLengthCheck = false;

                let orderIndex = -1;
                let unitId = -1;
                let unitIndex = -1;
                let redoTitleText = '';

                let targetFlags = Array.from({length:max_leng},()=>1)
                targetFlags = targetDataOutline.map((v,i) => {
                    const target_leng = v.input_content.replaceAll(' ','').length;
                    if (v.name === 'Title') {
                        console.log('input =',target_leng,', ',v.input_content,)
                        const lengthTitle = v.input_content.length;
                        orderIndex = v.order_index;
                        unitId = sparkWritingData[parseInt(UnitIndex)-1].unit_id;
                        unitIndex = sparkWritingData[parseInt(UnitIndex)-1].unit_index;
                        if (lengthTitle > 120) {
                            redoTitleText = v.input_content.substring(0, 120);
                            titleMaxLengthCheck = true;
                        }
                        // check line break
                        const checkLineBreakTitle = v.input_content.match(/\n/gmi);
                        if (checkLineBreakTitle) {
                            redoTitleText = v.input_content.replace(/\n/gmi, '');
                            titleMaxLengthCheck = true;
                        }
                    }
                    if (target_leng >= 10) {
                        // 10자 이상
                        return 0;
                    } else {
                        // 10자 미만
                        return 1;
                    }
                })
                
                if (titleMaxLengthCheck) {
                    commonAlertOpen({
                        messages:['The Enter/Return key cannot be used in this section.'],
                        useOneButton: true,
                        yesButtonLabel: 'OK',
                        yesEvent: () => {
                            setOutlineInputText(redoTitleText, unitId, unitIndex, orderIndex, 1)
                        }
                    })
                    return;
                } else {
                    
                    const sum = targetFlags.reduce((a,b) => (a+b));
                    // sum === 0 => Preview && save 활성화
                    // sum >0, sum < targetFlags.length; -> save 활성화
                    // else -> 모든 버튼 비활성화
                    console.log('in callback effect - sum: ', sum,', targetFlags: ',targetFlags,'len =',targetFlags.length)
    
                    if (sum === 0) {
    
                        setIsSaveButtonOpen(true)
                        console.log('setGoBackFromDraftInUnitPage 1')
                        setGoBackFromDraftInUnitPage(()=>{
                            commonAlertOpen({
                                messages: ['Do you want to exit?'],
                                alertType: 'warningContinue',
                                yesButtonLabel:'Yes',
                                noButtonLabel: 'No',
                                yesEvent: async () => {
                                    callbackCheckValues()
                                    commonAlertOpen({
                                        messages: ['Do you want to save your current progress before you leave?'],
                                        alertType: 'warningContinue',
                                        yesButtonLabel: `No`,
                                        noButtonLabel: `Yes`,
                                        closeEvent: async ()=> {
                                            await temporarySaveFunction();
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
                        setIsPreviewButtonOpen(true);
                    } else if (sum > 0 && sum < targetFlags.length) {
                        setIsSaveButtonOpen(true)
                        console.log('setGoBackFromDraftInUnitPage 2')
                        setGoBackFromDraftInUnitPage(()=>{
                            commonAlertOpen({
                                messages: ['Do you want to exit?'],
                                alertType: 'warningContinue',
                                yesButtonLabel:'Yes',
                                noButtonLabel: 'No',
                                yesEvent: async () => {
                                    callbackCheckValues()
                                    commonAlertOpen({
                                        messages: ['Do you want to save your current progress before you leave?'],
                                        alertType: 'warningContinue',
                                        yesButtonLabel: `No`,
                                        noButtonLabel: `Yes`,
                                        closeEvent: async ()=> {
                                            await temporarySaveFunction();
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
                    } else {
                        console.log('setGoBackFromDraftInUnitPage 3')
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
                        setIsPreviewButtonOpen(false);
                        setIsSaveButtonOpen(false)
                    }

                }
            } else if (DraftIndex==='2') {

                // title validate
                const targetDataOutline = sparkWritingData[parseInt(UnitIndex)-1].draft_2_outline;
                const max_leng = targetDataOutline.length;
                let titleMaxLengthCheck = false;
                let orderIndex = -1;
                let unitId = -1;
                let unitIndex = -1;
                let redoTitleText = '';
                let targetFlags = Array.from({length:max_leng},()=>1)
                targetFlags = targetDataOutline.map((item,i) => {
                    const target_length = item.input_content.replaceAll(' ','').length;
                    if (item.name === 'Title') {
                        const titleLength = item.input_content.length;
                        orderIndex = item.order_index;
                        unitId = sparkWritingData[parseInt(UnitIndex)-1].unit_id;
                        unitIndex = sparkWritingData[parseInt(UnitIndex)-1].unit_index;
                        if (titleLength > 120) {
                            redoTitleText = item.input_content.substring(0, 120);
                            titleMaxLengthCheck = true;
                        }
                        const checkTitleLineBreak = item.input_content.match(/\n/gmi);
                        
                        if (checkTitleLineBreak) {
                            redoTitleText = item.input_content.replace(/\n/gmi,'');
                            titleMaxLengthCheck = true;
                        }
                    }
                    if (target_length >= 10) {
                        // 10자 이상
                        return 0;
                    } else {
                        // 10자 미만
                        return 1;
                    }
                })
                console.log('titleMaxLengthCheck = ',titleMaxLengthCheck)
                if (titleMaxLengthCheck) {

                    commonAlertOpen({
                        messages:['The Enter/Return key cannot be used in this section.'],
                        useOneButton: true,
                        yesButtonLabel: 'OK',
                        yesEvent: () => {
                            commonAlertClose();
                            setOutlineInputText(redoTitleText, unitId, unitIndex, 1,2)
                        }
                    })
                    return;
                } else {
                    const sum = targetFlags.reduce((a,b) => (a+b));
                    // sum 0 -> submit
                    // sum 1 -> save
                    // sum 2 -> 버튼 비활성화
                    console.log('in callback effect - sum: ', sum,', targetFlags: ',targetFlags,'len =',targetFlags.length)
                    
                    
                    console.log('isUpdateDraft2Inputs =',isUpdateDraft2Inputs)
                    if (sum === 0) {
                        setDraft2ndSubmitActive(true);
                        setDraft2ndSaveActive(true);
                    } else if (sum === 1) {
                        setDraft2ndSubmitActive(false);
                        setDraft2ndSaveActive(true);
                    } else {
                        setDraft2ndSubmitActive(false);
                        setDraft2ndSaveActive(false);
                    }
                }

                // draft2ndSaveActive
                // draft2ndSubmitActive
                let questionOpenSave = false;
                if (draft2ndSaveActive) {
                    if (draft2ndSubmitActive) {
                        if (isUpdateDraft2Inputs ) {
                            questionOpenSave = true;
                        } else {
                            questionOpenSave = false;
                        }
                    } else {
                        questionOpenSave = false;
                    }
                } else {
                    questionOpenSave = false;
                }
                console.log('test callback flags =',questionOpenSave)
            }
        }
    },[]);

    React.useEffect(()=>{
        if (sparkWritingData !== undefined) {
            if (DraftIndex==='2') {
                callbackCheckValues()
                // draft2ndSaveActive
                // draft2ndSubmitActive
                // console.log('is after update?',sparkWritingData[parseInt(UnitIndex)].draft_2_outline)
                // console.log('is after update?2',sparkWritingDataDumy[parseInt(UnitIndex)].draft_2_outline)
                let questionOpenSave = false;
                if (draft2ndSaveActive||draft2ndSubmitActive) {
                    questionOpenSave = true;
                } else {
                    questionOpenSave = false;
                }
                if (isUpdateDraft2Inputs) {
                    if (questionOpenSave) {
                        console.log('setGoBackFromDraftInUnitPage 6')
                        setGoBackFromDraftInUnitPage(()=>{
                            commonAlertOpen({
                                messages: ['Do you want to exit?'],
                                alertType: 'warningContinue',
                                yesButtonLabel:'Yes',
                                noButtonLabel: 'No',
                                yesEvent: async () => {
                                    callbackCheckValues()
                                    commonAlertOpen({
                                        messages: ['Do you want to save your current progress before you leave?'],
                                        alertType: 'warningContinue',
                                        yesButtonLabel: `No`,
                                        noButtonLabel: `Yes`,
                                        closeEvent: async ()=> {
                                            setCommonStandbyScreen({openFlag:true})
                                            setDraft2ndPageSet('')
                                            await temporarySaveFunction();
                                            commonAlertClose();
                                        },
                                        yesEvent: () => {
                                            commonAlertClose();
                                            setDraft2ndPageSet('')
                                            setDraft2ndSaveActive(false)
                                            setDraft2ndSubmitActive(false)
                                            CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                                        }
                                    })
                                },
                                closeEvent: () => {
                                    commonAlertClose();
                                }
                            })
                        })
                    } else {
                        console.log('setGoBackFromDraftInUnitPage 7')
                        setGoBackFromDraftInUnitPage(()=>{
                            commonAlertOpen({
                                messages: ['Do you want to exit?'],
                                alertType: 'warningContinue',
                                yesButtonLabel:'Yes',
                                noButtonLabel: 'No',
                                yesEvent: async () => {
                                    commonAlertClose();
                                    setDraft2ndPageSet('')
                                    setDraft2ndSaveActive(false)
                                    setDraft2ndSubmitActive(false)
                                    CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                                },
                                closeEvent: () => {
                                    commonAlertClose();
                                }
                            })
                        })
                    }
                } else {
                    setGoBackFromDraftInUnitPage(()=>{
                        commonAlertOpen({
                            messages: ['Do you want to exit?'],
                            alertType: 'warningContinue',
                            yesButtonLabel:'Yes',
                            noButtonLabel: 'No',
                            yesEvent: async () => {
                                commonAlertClose();
                                setDraft2ndPageSet('')
                                setDraft2ndSaveActive(false)
                                setDraft2ndSubmitActive(false)
                                CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                            },
                            closeEvent: () => {
                                commonAlertClose();
                            }
                        })
                    })
                }
                
            }
        }
    },[
        draft2ndSaveActive,draft2ndSubmitActive,isUpdateDraft2Inputs
    ])

    const temporarySaveFunction = async () => {
        const targetData = sparkWritingData[parseInt(UnitIndex)-1]
        const draftIndex = parseInt(DraftIndex);
        if (draftIndex === 1){
            const contensData:TSparkWritingSaveTemporaryContent[] = targetData.draft_1_outline.map((item) => {
                const input_content = item.input_content.replace(/\s{2,}/g, ' ');
                return {
                    heading_name: item.name,
                    input_content,
                    grammar_correction_content_student: item.grammar_correction_content_student!==''? (isSaveButtonOpen?'':item.grammar_correction_content_student):'',
                    order_index: item.order_index,
                }
            })

            const data:TSparkWritingTemporarySaveData = {
                student_code: userInfo.userCode,
                student_name_en: userInfo.memberNameEn,
                student_name_kr: userInfo.memberNameKr,
                class_name: userInfo.className,
                unit_id: targetData.unit_id,
                draft_index: draftIndex,
                proofreading_count: targetData.proofreading_count,
                contents: contensData,
                draft_init_page_flag:''
            }
            // console.log('data ==',data)
            
            const isSaveTemporary = await draftSaveTemporary(data, userInfo.accessToken).then((response)=>{
                if (response) {
                    setIsSaved(true);
                    commonAlertClose();
                }
                return response;
            });
            if (isSaveTemporary) {
                setDraft2ndPageSet('')
                setDraft2ndSaveActive(false)
                setDraft2ndSubmitActive(false)
                CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
            } else {
                commonAlertOpen({
                    messages: ['Are you sure you want to try again?'],
                    yesButtonLabel: 'Yes',
                    noButtonLabel: 'Cancel',
                    yesEvent: async ()=> await temporarySaveFunction(),
                })
            }
            
        } else if (draftIndex === 2) {
            
            const contentsData:TSparkWritingSaveTemporaryContent[] = targetData.draft_2_outline.map((item) => {
                const input_content = item.input_content.replace(/[^\S\n]{2,}/g, ' ');
                return {
                    grammar_correction_content_student:item.grammar_correction_content_student!==''? item.grammar_correction_content_student:'',
                    input_content,
                    heading_name: item.name,
                    order_index: item.order_index
                }
            });
            
            const data:TSparkWritingTemporarySaveData = {
                student_code: userInfo.userCode,
                student_name_en: userInfo.memberNameEn,
                student_name_kr: userInfo.memberNameKr,
                class_name: userInfo.className,
                unit_id: targetData.unit_id,
                draft_index: draftIndex,
                proofreading_count: targetData.proofreading_count,
                contents: contentsData,
                draft_init_page_flag: draft2ndPageSet
            };
            const isSaveTemporary = await draftSaveTemporary(data, userInfo.accessToken);
            if (isSaveTemporary) {
                setCommonStandbyScreen({openFlag:false});
                setIsSaved(true);
                commonAlertClose();
                setDraft2ndPageSet('')
                setDraft2ndSaveActive(false)
                setDraft2ndSubmitActive(false)
                CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                // commonAlertOpen({
                //     useOneButton: true,
                //     yesButtonLabel: 'OK',
                //     messages: ['Temporary saving is complete.'],
                //     yesEvent: ()=>{
                //         commonAlertClose();
                //         CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)
                //     }
                // })
            } else {
                setCommonStandbyScreen({openFlag:false})
                commonAlertOpen({
                    messages: ['Are you sure you want to try again?'],
                    yesButtonLabel: 'Yes',
                    noButtonLabel: 'Cancel',
                    yesEvent: async ()=> {
                        setCommonStandbyScreen({openFlag:true})
                        await temporarySaveFunction()
                    },
                })
            }
        }
    }

    const submit2ndDraftFunction = async () => {
        const targetData = sparkWritingData[parseInt(UnitIndex)-1]
        const draftIndex = parseInt(DraftIndex);
        const contents:TSubmit2ndDraftReqDataContent[] = targetData.draft_2_outline.map((item) => {
            const input_content = item.input_content.replace(/[^\S\n]{2,}/g, ' ');
            return {
                input_content,
                heading_name: item.name,
                order_index: item.order_index
            }
        });
        const submitData:TSubmit2ndDraftRequestData = {
            student_code: userInfo.userCode,
            student_name_en: userInfo.memberNameEn,
            student_name_kr: userInfo.memberNameKr,
            class_name: userInfo.className,
            unit_id: targetData.unit_id,
            draft_index: draftIndex,
            contents,

        }
        commonAlertClose();
        setCommonStandbyScreen({openFlag:true});
        const submit = await draft2ndSubmit(submitData, userInfo.accessToken);
        if (submit) {
            setCommonStandbyScreen({openFlag:false})
            commonAlertOpen({
                useOneButton: true,
                yesButtonLabel: 'OK',
                messages: [
                    `Your Unit ${targetData.unit_index} ${targetData.topic}'s`,
                    <span><span style={{textDecoration:'underline', fontWeight:700}}>2<sup>nd</sup>draft</span> has been submitted.</span>
                ],
                yesEvent: async () => {
                    commonAlertClose();
                    setDraft2ndPageSet('')
                    setDraft2ndSaveActive(false)
                    setDraft2ndSubmitActive(false)
                    CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role);
                }
            })
        } else {
            setCommonStandbyScreen({openFlag:false})
            commonAlertOpen({
                messages: ['Are you sure you want to try again?'],
                yesButtonLabel: 'Yes',
                noButtonLabel: 'Cancel',
                yesEvent: async ()=> {
                    setCommonStandbyScreen({openFlag:true})
                    await submit2ndDraftFunction()
                },
            })
        }
    }
    const foldFlagFunction = (i:number) => {
        // console.log('fold settings ==',foldFlag)
        const dumpFlags = foldFlag.map((foldItem, foldIndex)=>{
            if (foldIndex === i) {
                if (!foldItem) {
                    return !foldItem
                } else {
                    return foldItem
                }
            } else return foldItem;
        })
        setFoldFlag(dumpFlags)
        setUpdateFoldIndex(i);
    }
    // 수정된 데이터인지 체크
    const checkNewLine = () => {
        const targetData = sparkWritingData[parseInt(UnitIndex)-1]
        const draftIndex = parseInt(DraftIndex);
        const originalTarget = originalTargetData[parseInt(UnitIndex)-1];
        console.log('originalTarget =',originalTarget)
        let checkFlag = false;
        const targetOutline = originalTarget? originalTarget.draft_1_outline:[];
        const contensData:TSparkWritingSaveTemporaryContent[] = targetData.draft_1_outline.map((item, itemIndex) => {
            const input_content = item.input_content.replace(/\s{2,}/g, ' ');
            const originalInputContent = targetOutline[itemIndex]?.input_content.replace(/\s{2,}/g, ' ');
            if (input_content !== originalInputContent) {
                checkFlag=true;
            }
            return {
                heading_name: item.name,
                input_content,
                grammar_correction_content_student: item.grammar_correction_content_student!==''? item.grammar_correction_content_student:'',
                order_index: item.order_index,
            }
        })
        return checkFlag;
    }
    const outlineBody = (outlineItem: TSparkWritingData ) => {
        let outlineOrigin:TSparkWritingDataOutline[] = JSON.parse(JSON.stringify(outlineItem.draft_1_outline));
        const targetMaxLength = outlineOrigin.length;
        // title 정리
        let allNames:string[] = CommonFunctions.outlineNameLists(outlineOrigin);
        // console.log('targets =',allNames)
        // 데이터 폼 만들기
        let manufactureItem:TSparkWritingDataOutline[][] = CommonFunctions.outlineDataFormRemake(allNames, outlineOrigin);
        // console.log('data =',manufactureItem)
        return allNames.map((title, i) => {
            const controllClass = `foldFlag:::[${i}]`
            return <div className={`flex flex-wrap flex-col w-full h-fit z-0 relative ${foldFlag[i]? 'bg-white':'bg-transparent'}`} 
            key={i} id={title+i}>
                <div className='outline-accordion-div-wrap'>
                    <button type="button" 
                        className="outline-accordion-button"
                        onClick={()=>foldFlagFunction(i)}
                    >
                        <span className='outline-accordion-button-inner'>
                            <span className='outline-accordion-button-inner-text'>{title}</span>
                            <span className={foldFlag[i] ? 'hidden':'outline-accordion-button-inner-arrow'}><commonIconSvgs.DownArrowIcon/></span>
                        </span>
                    </button>
                    <div className="text-left">
                        <div className={`${foldFlag[i]? 'pt-[5px] pb-[20px]': 'hidden'}`} id={`fold-div-${i}`}>
                            { manufactureItem[i].map((item, itemIndex) => {
                                // console.log('manufacture item [',itemIndex,'] =',item, )
                                const manuKey = 'menufactureItem-'+item.name+item.order_index+itemIndex;
                                return <div key={manuKey}>
                                    <div className='outline-content-box-item'
                                    key={i+'-'+itemIndex+'-body-'+item.order_index}><span className=''></span>{item.heading_content}</div>
                                    <div 
                                        className='outline-content-box-item'>
                                            
                                            <textarea rows={1} style={{'resize':'none','overflow':'hidden'}}
                                                ref={(el) => {
                                                    draft1stRefs.current[i]= el
                                                }}
                                                id={item.name+item.order_index}
                                                className={`${controllClass} block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500`} 
                                                // placeholder={`Start typing in your ${item.name}...`}
                                                placeholder={`Write here.`}
                                                onChange={(e)=>{
                                                    e.currentTarget.style.height = 'auto';
                                                    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                                                    const unitId = outlineItem.unit_id
                                                    const unitIndex = outlineItem.unit_index
                                                    const orderIndex = item.order_index
                                                    setOutlineInputText(e.currentTarget.value, unitId, unitIndex, orderIndex, 1)
                                                    callbackCheckValues()
                                                }}
                                                value={item.input_content}
                                            />
                                        </div>
                                    </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        })
    }
    const Draft1stWritingPage = () => {
        return (
            <div className='wrap-contain-spark-writing'>
                {/* guide text */}
                <div className='wrap-guide-text-spark-writing'>
                    {'Fill out the following outline.'}
                </div>
                {/* content */}
                <div className='wrap-content-spark-writing'>
                    {outlineBody(sparkWritingData[parseInt(UnitIndex)-1])}
                </div>
                <div className={`buttons-div ${(isPreviewButtonOpen||isSaveButtonOpen)? '': ''}`}>
                    <div className={`${isSaveButtonOpen?'save-button-active div-to-button-hover-effect':'save-button'}`} onClick={()=>{
                        console.log('isSaveButtonOpen =',isSaveButtonOpen)
                        if (isSaveButtonOpen) {
                            // setShowSaveModal(true)
                            callbackCheckValues()
                            commonAlertOpen({
                                messages: ['Do you want to save your current progress and return to the main menu?'],
                                yesButtonLabel: `Yes`,
                                noButtonLabel: `No`,
                                yesEvent: async ()=> await temporarySaveFunction()
                            })
                        }
                    }}>Save</div>
                    <div className={`${isPreviewButtonOpen?'save-button-active div-to-button-hover-effect':'save-button'}`} onClick={()=>{
                        if (isPreviewButtonOpen) {
                            callbackCheckValues()
                                commonAlertOpen({
                                    messages:['Are you ready to preview your writing?'],
                                    alertType: 'continue',
                                    yesButtonLabel: `No`,
                                    noButtonLabel: `Yes`,
                                    closeEvent: async ()=>{
                                        const unitIndex = parseInt(UnitIndex);
                                        const draftIndex = parseInt(DraftIndex);
                                        historyDataDelete(unitIndex, draftIndex)
                                        setPreviewPageInitFlag('UPDATE_WRITE');
                                        CommonFunctions.goLink(`WritingClinic/SparkWriting/${params.unit}/${params.draft}/Preview`, navigate, role);
                                        commonAlertClose();
                                    },
                                    yesEvent: async () => {
                                        commonAlertClose();
                                    }
                                })
                        }
                    }}>Preview</div>
                </div>
            </div>
        )
    }

    const Draft2ndWritingPage = () => {
        const draftItem = sparkWritingData[parseInt(UnitIndex)-1];
        console.log(' 2ND DRAFT draftItem :',draftItem)
        console.log('draft2ndSaveActive =',draft2ndSaveActive)
        console.log('draft2ndSubmitActive',draft2ndSubmitActive)
        console.log('isUpdateDraft2Inputs =',isUpdateDraft2Inputs)
        return (
            <div className='wrap-contain-2nd-spark-writing'>
                <div className='wrap-guide-2nd-top-text-spark-writing'>{'Check your teacher’s feedback and work on your 2nd draft.'}</div>
                <div className='flex flex-row w-full gap-[10px] mt-[10px]'>
                    <div className='flex flex-col flex-1' style={{willChange:'transform'}}>
                        
                        {/* guide text */}
                        <div className='wrap-guide-2nd-text-spark-writing' ref={tooltipControlDivRef}>
                            {'teacher feedback'}
                            <TeacherFeedbackDetailModalComponents draftItem={draftItem}/>
                        </div>
                        <div className='wrap-content-2nd-spark-writing'>
                            <div className='teacher-feedback-title-font'>{
                                draftViewBox.loadFeedbackDraftTitle({feedbackDataInStudent:draftItem})
                            }</div>
                            <div className='teacher-feedback-body-font'>{
                                draftViewBox.loadFeedbackDraftBody({feedbackDataInStudent:draftItem})
                            }</div>
                        </div>
                        
                    </div>
                    <div className='flex flex-col flex-1'>
                        <div className='wrap-guide-2nd-text-spark-writing'>
                            {'2nd draft'}
                        </div>
                        
                        {/* select 2nd draft start page */}
                        {draft2ndPageSet==='' && 
                            <div className='wrap-content-2nd-spark-writing'>
                                <div className='flex flex-1 flex-col items-center justify-center gap-[20px]'>
                                    <div className='draft-2nd-select-button-fresh' onClick={()=>{
                                        setOutlineInputText('', draftItem.unit_id, draftItem.unit_index, 1,2)
                                        setOutlineInputText('', draftItem.unit_id, draftItem.unit_index, 2,2)
                                        setDraft2ndPageSet('fresh')
                                    }}/>
                                    <div className='draft-2nd-select-button-revise' onClick={()=>{
                                        setDraft2ndPageSet('revise')
                                        setDraft2ndSaveActive(true)
                                        setDraft2ndSubmitActive(true)
                                        callbackCheckValues();
                                    }}/>
                                </div>
                            </div>
                        }

                        {/* Fresh Page */}
                        {draft2ndPageSet === 'fresh' &&
                            <div className='wrap-content-2nd-spark-writing'>
                            <div className='draft-2nd-title-font items-center'>
                                {/* 2nd draft title content */}
                                <textarea className='draft-2nd-title-wrap-textarea'
                                    maxLength={120}
                                    rows={1}
                                    ref={(textarea)=>{
                                        if (textarea) {
                                            textarea.style.height='auto';
                                            textarea.style.height = textarea.scrollHeight+'px';
                                        }
                                    }}
                                    onChange={(e) => {
                                        // e.currentTarget.style.height='auto';
                                        // e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                                        const value = e.currentTarget.value;
                                        setOutlineInputText(value, draftItem.unit_id, draftItem.unit_index, 1,2)
                                    }}
                                    value={draftItem.draft_2_outline[0].input_content}
                                />
                            </div>
                            <div className='flex flex-1'>
                                {/* 2nd draft body content */}
                                <textarea className='draft-2nd-body-wrap-textarea placeholder:text-[#aaa]'
                                    onChange={(e) => {
                                        const value = e.currentTarget.value;
                                        setOutlineInputText(value, draftItem.unit_id, draftItem.unit_index, 2, 2);
                                    }}
                                    placeholder='Start typing'
                                    value={draftItem.draft_2_outline[1].input_content}
                                />
                            </div>
                            </div>
                        }
                        {/* Revise 1st Draft Page */}
                        {draft2ndPageSet === 'revise' &&
                            <div className='wrap-content-2nd-spark-writing'>
                            <div className='draft-2nd-title-font items-center'>
                                {/* 2nd draft title content */}
                                <textarea className='draft-2nd-title-wrap-textarea'
                                    maxLength={120}
                                    rows={1}
                                    ref={(textarea)=>{
                                        if (textarea) {
                                            textarea.style.height='auto';
                                            textarea.style.height = textarea.scrollHeight+'px';
                                        }
                                    }}
                                    onChange={(e) => {
                                        // e.currentTarget.style.height='auto';
                                        // e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                                        const value = e.currentTarget.value;
                                        setOutlineInputText(value, draftItem.unit_id, draftItem.unit_index, 1,2)
                                    }}
                                    value={draftItem.draft_2_outline[0].input_content}
                                />
                            </div>
                            <div className='flex flex-1'>
                                {/* 2nd draft body content */}
                                <textarea className='draft-2nd-body-wrap-textarea placeholder:text-[#aaa]'
                                    onChange={(e) => {
                                        const value = e.currentTarget.value;
                                        setOutlineInputText(value, draftItem.unit_id, draftItem.unit_index, 2, 2);
                                    }}
                                    placeholder='Start typing'
                                    value={draftItem.draft_2_outline[1].input_content}
                                />
                            </div>
                            </div>
                        }
                    </div>
                </div>
                <div className='absolute right-[30px] bottom-[25px] flex flex-row gap-[10px]'>
                    {/* <div className='' onClick={()=>setDraft2ndPageSet('')}>test return page set</div> */}
                    <div className={`${draft2ndSaveActive?'save-button-active div-to-button-hover-effect':'save-button'}`} onClick={async () => {
                        if (draft2ndSaveActive) {
                            commonAlertOpen({
                                messages:['Do you want to save your current progress and return to the main menu?'],
                                yesButtonLabel: 'Yes',
                                noButtonLabel: 'No',
                                yesEvent: async () => {
                                    commonAlertClose();
                                    setCommonStandbyScreen({openFlag:true})
                                    // setDraft2ndPageSet('')
                                    await temporarySaveFunction();
                                }
                            })
                        }
                    }}>Save</div>
                    <div className={`${draft2ndSubmitActive?'save-button-active div-to-button-hover-effect':'save-button'}`} onClick={async () => {
                        if (draft2ndSubmitActive) {
                            commonAlertOpen({
                                head: `Unit ${draftItem.unit_index} : ${draftItem.topic}`,
                                messages: ['Are you ready to submit?'],
                                // messages: [
                                //     `Unit ${draftItem.unit_index} : ${draftItem.topic}`,
                                //     'Are you ready to submit?'
                                // ],
                                alertType: 'continue',
                                yesButtonLabel: 'Yes',
                                noButtonLabel: 'No',
                                yesEvent: async () => {
                                    commonAlertClose();
                                    setCommonStandbyScreen({openFlag:true})
                                    // setDraft2ndPageSet('')
                                    await submit2ndDraftFunction();
                                },
                            })
                        }
                    }}>Submit</div>
                </div>
            </div>
        )
    }
    return (
        <section className={`section-spark-writing z-0 use-nav-top bg-draft-background-image bg-no-repeat bg-cover object-contain`}>
            {/* draft 1 => chat */}
            {DraftIndex === '1' && (
                <div className='absolute w-fit h-fit top-[15px] right-[20px] overflow-auto'>
                    <FormDialog />
                </div>
            )}
            {/* draft 2 => overall comment */}
            {/* {DraftIndex === '2' && overallComment1stDraft.content!=='' && ( */}
            {DraftIndex === '2' && (
                <div className='flex flex-row absolute w-fit h-[80px] overflow-auto top-[30px] right-[35px] gap-[50px] z-[50]'>
                    <div className={overallComment1stDraft.open? 'overall-comment-2nd-draft-write-top-tooltip-content':'hidden'}>
                        <span></span>
                        {overallComment1stDraft.content}
                        <span></span>
                    </div>
                    <div className='overall-comment-2nd-draft-write-top-button'
                    onClick={()=>{
                        setOverallComment1stDraft({
                            content:overallComment1stDraft.content,
                            open: !overallComment1stDraft.open
                        });
                    }}>{'overall comments'}</div>
                </div>
            )}

            { DraftIndex==='1' && Draft1stWritingPage()}
            { DraftIndex==='2' && Draft2ndWritingPage()}
        </section>
    )
}

export default EssayWriting;