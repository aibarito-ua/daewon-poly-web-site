import React from 'react';
import useNavStore from '../../store/useNavStore';
import useEssayWritingCenterDTStore from '../../store/useEssayWritingCenterDTStore';
import useSparkWritingStore from '../../store/useSparkWritingStore';
import { useNavigate, useParams } from 'react-router-dom';
import textBoxImg from '../../util/png/textKeyBox.png'
import textSubBoxImg from '../../util/png/outlinTextSubBox.png'
import {PopupModalComponent} from '../../components/toggleModalComponents/popupModalComponent'
import useLoginStore from '../../store/useLoginStore';
import { CommonFunctions } from '../../util/common/commonFunctions';
import FormDialog from '../../components/toggleModalComponents/ChatbotModalComponent';
import { commonIconSvgs } from '../../util/svgs/commonIconsSvg';
import useControlAlertStore from '../../store/useControlAlertStore';
import { useComponentWillMount } from '../../hooks/useEffectOnce';
import { callUnitInfobyStudent, draftSaveTemporary } from './api/EssayWriting.api';
interface IDUMPOutlineItem {
    name:string;
    CheckWriting: string;
    [key:string]: any[]|any;
}

const EssayWriting = () => {
    
    // input text
    const [essayTopicInput, setEssayTopicInput] = React.useState<string>('');
    
    // fold flag
    const [foldFlag, setFoldFlag] = React.useState<boolean[]>([]);
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

    // user info
    const {
        userInfo
    } = useLoginStore();
    // Nav Store
    const { 
        setTopNavHiddenFlagged,
        setSubNavTitleString,
        setSubRightNavTitleString,
        selectUnitInfo
    } = useNavStore();
    // WritingCenter Store
    const {essayWritingInputItems, } = useEssayWritingCenterDTStore();
    // Spark Store
    const { setOutlineInputText, sparkWritingData} = useSparkWritingStore();
    const params = useParams();
    // console.log('params : unit =',params.unit,': draft =',params.draft)
    const UnitIndex:string = params.unit!==undefined? params.unit: '0';
    const DraftIndex:string = params.draft!==undefined? params.draft: '0';
    // Navigate hook
    const navigate = useNavigate();
    // current role
    const {role} = useLoginStore();
    const {commonAlertOpen, commonAlertClose,setCommonStandbyScreen} = useControlAlertStore();

    const pageInitSetting = async () => {
        return await callUnitInfobyStudent(userInfo.userCode, userInfo.courseName).then((response) => {
            const data = response.units
            setOriginalTargetData(data);
            setIsSaved(false);
            return true;
        })
    }
    useComponentWillMount(async ()=>{
        // console.log('unit data =', sparkWritingData[parseInt(UnitIndex)-1])
        setCommonStandbyScreen({openFlag:true})
        const init = await pageInitSetting()
        if (init) {
            setCommonStandbyScreen({openFlag:false})
        }
        
        return ()=>{
            setIsSaved(false);
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
            const foldInit = Array.from({length: leng}, ()=>false)
            setFoldFlag(foldInit)
        } else {
            if (updateFoldIndex !== undefined) {
                const target = document.getElementById(`fold-div-${updateFoldIndex}`)
                target?.scrollIntoView({behavior: 'auto', block: 'end'})
            }
        }

        if (params.draft === '1') {
            const rightTitle = <span>{'Step 1'}<span className='ordinal pl-4 pr-1'>{'1st'}</span>{'Draft'}</span>
            setSubRightNavTitleString(rightTitle)
        } else {
            const rightTitle = <span>{'Step 2'}<span className='ordinal pl-4 pr-1'>{'2nd'}</span>{'Draft'}</span>
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
        }
    },[
        // page state
        params,
        foldFlag,
        essayTopicInput,
        paramValues,
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
                        messages:['“Title” can be up to 120 characters including spaces.'],
                        useOneButton: true,
                        yesButtonLabel: 'OK',
                        yesEvent: () => {
                            setOutlineInputText(redoTitleText, unitId, unitIndex, orderIndex, 1)
                        }
                    })
                    return;
                }
                const sum = targetFlags.reduce((a,b) => (a+b));
                // sum === 0 => Preview && save 활성화
                // sum >0, sum < targetFlags.length; -> save 활성화
                // else -> 모든 버튼 비활성화
                if (sum === 0) {
                    setIsSaveButtonOpen(true)
                    setIsPreviewButtonOpen(true);
                } else if (sum > 0 && sum < targetFlags.length) {
                    setIsSaveButtonOpen(true)
                } else {
                    setIsPreviewButtonOpen(false);
                    setIsSaveButtonOpen(false)
                }
            }
        }
    },[])

    const temporarySaveFunction = async () => {
        const targetData = sparkWritingData[parseInt(UnitIndex)-1]
        const draftIndex = parseInt(DraftIndex);
        const contensData:TSparkWritingSaveTemporaryContent[] = targetData.draft_1_outline.map((item) => {
            const input_content = item.input_content.replace(/\s{2,}/g, ' ');
            return {
                heading_name: item.name,
                input_content,
                grammar_correction_content_student: '',
                order_index: item.order_index,
            }
        })
        // console.log('content =',contensData)
        const data:TSparkWritingTemporarySaveData = {
            student_code: userInfo.userCode,
            student_name_en: userInfo.memberNameEn,
            student_name_kr: userInfo.memberNameKr,
            unit_id: targetData.unit_id,
            draft_index: draftIndex,
            proofreading_count: targetData.proofreading_count,
            contents: contensData
        }
        // console.log('data ==',data)
        const isSaveTemporary = await draftSaveTemporary(data);
        if (isSaveTemporary) {
            setIsSaved(true);
            commonAlertOpen({
                useOneButton: true,
                yesButtonLabel: 'OK',
                messages: ['Temporary saving is complete.']
            })
        } else {
            commonAlertOpen({
                messages: ['Are you sure you want to try again?'],
                yesButtonLabel: 'Yes',
                noButtonLabel: 'Cancel',
                yesEvent: async ()=> await temporarySaveFunction(),
            })
        }
    }
    
    const foldFlagFunction = (i:number) => {
        // console.log('fold settings ==',foldFlag)
        const dumpFlags = foldFlag.map((foldItem, foldIndex)=>{
            if (foldIndex === i) {
                return !foldItem
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
        let checkFlag = false;
        const contensData:TSparkWritingSaveTemporaryContent[] = targetData.draft_1_outline.map((item, itemIndex) => {
            const input_content = item.input_content.replace(/\s{2,}/g, ' ');
            const originalInputContent = originalTarget.draft_1_outline[itemIndex].input_content.replace(/\s{2,}/g, ' ');
            if (input_content !== originalInputContent) {
                checkFlag=true;
            }
            return {
                heading_name: item.name,
                input_content,
                grammar_correction_content_student: '',
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
                                
                                return <div>
                                    <div className='outline-content-box-item'
                                    key={i+'-'+itemIndex+'-body-'+item.order_index}><span className=''></span>{item.heading_content}</div>
                                    <div 
                                        className='outline-content-box-item'>
                                            
                                            <textarea rows={1} style={{'resize':'none'}} 
                                            id={item.name+item.order_index}
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                                            placeholder={`Start typing in your ${item.name}...`}
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
                                            ></textarea>
                                        </div>
                                    </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        })
    }
    return (
        <section className={`section-spark-writing z-0 use-nav-top bg-draft-background-image bg-no-repeat bg-cover object-contain`}>
            <div className='absolute w-fit h-fit top-[15px] right-[20px]'>
                <FormDialog />
            </div>
            <div className='wrap-contain-spark-writing'>
                {/* guide text */}
                <div className='wrap-guide-text-spark-writing'>
                    {'* Fill out the following outline.'}
                </div>
                {/* content */}
                <div className='wrap-content-spark-writing'>
                    {outlineBody(sparkWritingData[parseInt(UnitIndex)-1])}
                </div>
                <div className={`buttons-div ${(isPreviewButtonOpen||isSaveButtonOpen)? '': ''}`}>
                    <div className={`${isSaveButtonOpen?'save-button-active div-to-button-hover-effect':'save-button'}`} onClick={()=>{
                        if (isSaveButtonOpen) {
                            // setShowSaveModal(true)
                            callbackCheckValues()
                            commonAlertOpen({
                                messages: ['Do you want to save?'],
                                yesButtonLabel: `Yes, I'm sure.`,
                                noButtonLabel: `No, Cancel.`,
                                yesEvent: async ()=> await temporarySaveFunction()
                            })
                        }
                    }}>Save</div>
                    <div className={`${isPreviewButtonOpen?'save-button-active div-to-button-hover-effect':'save-button'}`} onClick={()=>{
                        if (isPreviewButtonOpen) {
                            callbackCheckValues()
                            // setShowPreviewModal(true)
                                commonAlertOpen({
                                    messages:['Are you ready to preview your writing?'],
                                    alertType: 'continue',
                                    yesButtonLabel: `Yes, I'm sure.`,
                                    noButtonLabel: `No, Cancel.`,
                                    yesEvent: ()=>{
                                        if (isSaved) {
                                            CommonFunctions.goLink(`WritingClinic/SparkWriting/${params.unit}/${params.draft}/Preview`, navigate, role);
                                            commonAlertClose();
                                        } else {
                                            const check = checkNewLine();
                                            if (check) {
                                                commonAlertOpen({
                                                    messages: ['There is modified data.','Proceed to save.'],
                                                    useOneButton:true,
                                                    alertType: 'continue',
                                                    yesButtonLabel: `OK`,
                                                    yesEvent: async ()=> {
                                                        await temporarySaveFunction();
                                                        commonAlertClose();
                                                        CommonFunctions.goLink(`WritingClinic/SparkWriting/${params.unit}/${params.draft}/Preview`, navigate, role);
                                                    }
                                                })
                                            } else {
                                                commonAlertClose();
                                                CommonFunctions.goLink(`WritingClinic/SparkWriting/${params.unit}/${params.draft}/Preview`, navigate, role);
                                            }
                                            

                                        }
                                    }
                                })
                            
                        }
                    }}>Preview</div>
                </div>
            </div>
        </section>
    )
}

export default EssayWriting;