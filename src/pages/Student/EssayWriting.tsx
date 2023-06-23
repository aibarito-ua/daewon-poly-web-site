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

    // Save modal
    const [showSaveModal, setShowSaveModal] = React.useState<boolean>(false);
    // Preview modal
    const [showPreviewModal, setShowPreviewModal] = React.useState<boolean>(false);

    // Chatbot open
    const [showChatbotModal, setShowChatbotModal] = React.useState<boolean>(false);
    // Modal State
    const [input, setInput] = React.useState<string>('');

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
    const {selectBoxUnit, outlineItems, setOutlineInputText, checkWritingValues} = useSparkWritingStore();
    const params = useParams();
    const UnitIndex:string = params.unit!==undefined? params.unit: '0';
    const DraftIndex:string = params.draft!==undefined? params.draft: '0';
    // Navigate hook
    const navigate = useNavigate();
    // current role
    const {role} = useLoginStore()

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
            const data = outlineItems[unitIndex];
            console.log('fold 0', data)
            const keys = Object.keys(data).splice(6);
            const leng = keys.length
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
            setEssayTopicInput(selectBoxUnit[unitIndex].topic);
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
        selectBoxUnit,
        // Spark Store
        outlineItems,
    ])

    const callbackCheckValues = React.useCallback( ()=>{
        if (checkWritingValues[`Unit_${params.unit}_${params.draft}`] !== undefined) {
            console.log('callback check')
            const checking:string[] = checkWritingValues[`Unit_${UnitIndex}_${DraftIndex}`];
            const unitIndex:number = parseInt(UnitIndex);
            const max_leng = parseInt(outlineItems[unitIndex-1].CheckWriting);
            let targetFlags = Array.from({length:max_leng},()=>1)
            targetFlags = checking.map((v:string, i:number)=>{
                const target_leng = v.replaceAll(' ','').length;
                if(target_leng >= 10) {
                    // console.log(`${i}번째 총 ${target_leng}`)
                    // 10자 이상
                    return 0
                } else {
                    // 미만
                    return 1
                }
            })
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
    },[])

    
    const foldFlagFunction = (i:number) => {
        console.log('fold settings ==',foldFlag)
        const dumpFlags = foldFlag.map((foldItem, foldIndex)=>{
            if (foldIndex === i) {
                return !foldItem
            } else return foldItem;
        })
        setFoldFlag(dumpFlags)
        setUpdateFoldIndex(i);
    }
    const outlineBody = (outlineItem: IDUMPOutlineItem ) => {
        const manufactureItem = {...outlineItem};
        const keys = Object.keys(manufactureItem).splice(6)
        const items = Object.values(manufactureItem).splice(6);
        
         return keys.map((v, i)=>{
            return <div className={`flex flex-wrap flex-col w-full h-fit z-0 relative ${foldFlag[i]? 'bg-white':'bg-transparent'}`} key={i} id={'ptitle'+i}>
                <div className='outline-accordion-div-wrap'>
                    <button type="button" 
                        className="outline-accordion-button"
                        onClick={()=>foldFlagFunction(i)}
                    >
                    <span className="outline-accordion-button-inner">{v}</span>
                    </button>
                
                        <div className="px-4 pb-4 text-left">
                    <div className={`${foldFlag[i]? '': 'hidden'}`} id={`fold-div-${i}`}>
                        {  Array.from(items[i]).map((item:any, itemIndex:number)=>{
                            if (typeof(item) === 'string') {
                                if (item !== '') {
                                    return <div 
                                        className='outline-content-box-item'
                                        key={itemIndex}><span className='pl-2'></span>{item}</div>
                                } else {
                                    return <div 
                                        className='outline-content-box-item'
                                        key={itemIndex}>{''}</div>
                                }
                            } else {
                                const flagText = Object.keys(item).includes('text')
                                if (flagText) {
                                    return <div 
                                        className='outline-content-box-item'
                                        key={itemIndex}>
                                            
                                            <textarea rows={1} style={{'resize':'none'}} 
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                                            placeholder={item.placeholder}
                                            onChange={(e)=>{
                                                e.currentTarget.style.height = 'auto';
                                                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                                                setOutlineInputText(e.currentTarget.value, UnitIndex, DraftIndex, v, item.inputIndex, itemIndex)
                                                callbackCheckValues()
                                            }}
                                            value={item.text}
                                            ></textarea>
                                        </div>
                                } else {
                                    return item.map((subItem:string|TOutlineValues, subItemIndex:number)=>{
                                        if (typeof(subItem) === 'string') {
                                            return <div 
                                            key={itemIndex+':'+subItemIndex} 
                                            className='outline-content-box-sub-item'>{subItem}</div>
                                        } else {
                                            return <div 
                                            className='outline-content-box-item'
                                            key={itemIndex+':'+subItemIndex}>
                                                <textarea rows={1} style={{'resize':'none'}} 
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                                                placeholder={subItem.placeholder}
                                                onChange={(e)=>{
                                                    e.currentTarget.style.height = 'auto';
                                                    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                                                    setOutlineInputText(e.currentTarget.value, UnitIndex, DraftIndex, v, subItem.inputIndex, itemIndex, subItemIndex)
                                                    callbackCheckValues()
                                                }}
                                                value={subItem.text}
                                                ></textarea>
                                            </div>
                                        }
                                    })
                                }
                            }
                        })}
                        </div>
                    </div>
                </div>
            </div>
        }
        )
    }

    return (
        <section className={`section-common-layout z-0 use-nav-top`}>
            <div className='flex flex-1 flex-col w-full h-full px-12 pb-4 z-0'>
                {/* guide text */}
                <div className='flex flex-row font-bold w-full justify-stretch py-4 text-black h-1/12 z-0'>
                    <p className='flex flex-1 justify-start'>* Fill out the following outline.</p>
                    <div className='flex flex-1 justify-end'>
                        <FormDialog />
                    </div>
                </div>
                {/* content */}
                <div className='flex flex-col bg-gray-200 w-full h-full overflow-y-auto gap-4 p-4 z-0'>
                    {outlineBody(outlineItems[parseInt(UnitIndex)-1])}
                </div>
            </div>

            <div className={`buttons-div ${(isPreviewButtonOpen||isSaveButtonOpen)? '': 'hidden'}`}>
                <div className={`save-button div-to-button-hover-effect ${isSaveButtonOpen?'':'hidden'}`} onClick={()=>{
                    setShowSaveModal(true)
                    callbackCheckValues()
                }}>Save</div>
                <div className={`save-button div-to-button-hover-effect ${isPreviewButtonOpen?'':'hidden'}`} onClick={()=>{
                    callbackCheckValues()
                    setShowPreviewModal(true)
                }}>Preview</div>
            </div>
            
            {/* Save Modal */}
            <PopupModalComponent 
                Message={[
                    'Do you want to save?'
                ]}
                YesMessage={`Yes, I'm sure.`}
                NoMessage={`No, Cancel.`}
                closeFlag={false}
                positionTop='10'
                positionLeft='50'
                onClickYes={()=>{

                    callbackCheckValues()
                    setShowSaveModal(false)
                }}
                onClose={()=>{
                    callbackCheckValues()
                    setShowSaveModal(false)
                }}
                showFlag={showSaveModal}
            />
            {/* Preview Modal */}
            <PopupModalComponent 
                Message={[
                    'Do you want to Preview?'
                ]}
                YesMessage={`Yes, I'm sure.`}
                NoMessage={`No, Cancel.`}
                closeFlag={false}
                positionTop='10'
                positionLeft='50'
                onClickYes={()=>{
                    
                    callbackCheckValues()
                    setShowPreviewModal(false)
                    CommonFunctions.goLink(`WritingClinic/SparkWriting/${params.unit}/${params.draft}/Preview`, navigate, role);
                }}
                onClose={()=>{
                    callbackCheckValues()
                    setShowPreviewModal(false)
                }}
                showFlag={showPreviewModal}
            />
        </section>
    )
}

export default EssayWriting;