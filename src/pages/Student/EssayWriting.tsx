import React from 'react';
import { EssayWritingDatas } from '../../utils/EssayWriting/textData';
import useNavStore from '../../store/useNavStore';
import useEssayWritingCenterDTStore from '../../store/useEssayWritingCenterDTStore';
import { SvgChevronRight } from '../../util/svgs/svgChevronRight';
import { EssayWritingSelectTopicAPI, EssayWritingSelectTopicfor2ndAPI } from './api/EssayWritingSelectTopic.api';
import { SvgRefreshIcon } from '../../util/svgs/svgRefresh';
import { useParams } from 'react-router-dom';

export const EssayWriting = () => {
    // outliner select ui event flag
    const [selectOutliner, setSelectOutliner] = React.useState<number>(0);
    // input text
    const [essayTopicInput, setEssayTopicInput] = React.useState<string>('');
    // call api proceeding
    const [proceedingAPI, setProceedingAPI] = React.useState<boolean>(false);
    // called api index
    const [inProgress, setInProgress] = React.useState<number>(0);
    // is can edit
    const [isCanUseEdit, setIsCanUseEdit] = React.useState<boolean>(false);

    // Nav Store
    const { 
        setTopNavHiddenFlagged,
        setSubNavTitleString,
        setSubRightNavTitleString,
        subRightNavTitleString,
        
        selectUnitInfo
    } = useNavStore();
    // WritingCenter Store
    const {essayWritingDatasStore, setUseAI1, setUseAI2, } = useEssayWritingCenterDTStore();
    const params = useParams();
    React.useEffect(()=>{
        setTopNavHiddenFlagged(true);
        setSubNavTitleString(`${selectUnitInfo.main} ${selectUnitInfo.sub}`);
        console.log('url param ==',params.unit,'\n',params.draft)
        if (params.draft === '1') {
            const rightTitle = <span><span className='ordinal'>{'1st'}</span>{' Draft'}</span>
            setSubRightNavTitleString(rightTitle)
        } else {
            const rightTitle = <span><span className='ordinal'>{'2nd'}</span>{' Draft'}</span>
            setSubRightNavTitleString(rightTitle)
        }
        if (essayTopicInput === undefined || essayTopicInput === '') {
            setEssayTopicInput(essayWritingDatasStore[0].topic);
        }
        return () => {
            // console.log('did unmount in Essay Writing Page')
            setTopNavHiddenFlagged(false)
            setSubNavTitleString('')
        }
    },[setTopNavHiddenFlagged, essayTopicInput, essayWritingDatasStore, setSubNavTitleString, setSubRightNavTitleString])

    const onAskEvent = async () => {
        if (essayTopicInput.trim() === '') {
            // toast message
            console.log('please check your input.')
            setEssayTopicInput('');
        } else {
            if (!proceedingAPI) {
                setUseAI1(essayTopicInput, '');
                setUseAI2(essayTopicInput, '');
                setProceedingAPI(true);
                setInProgress(1);
                // api setting
                const textFromAPI1 = await EssayWritingSelectTopicfor2ndAPI(essayTopicInput).then((result)=>{
                    setUseAI1(essayTopicInput, result.text);
                    setInProgress(2);
                    return result;
                });
                const textFromAPI2 = await EssayWritingSelectTopicAPI(essayTopicInput).then((result)=>{
                    setUseAI2(essayTopicInput, result.text);
                    setInProgress(0);
                    return result;
                })
                if (textFromAPI1.status !== 201 || textFromAPI2.status !== 201) {
                    // server error
                } else {
                    setProceedingAPI(false)
                }
            }
        }
    }
    const outlineDivMap = (v:string, i: number) => {
        const mainCheck = v.match(EssayWritingDatas.mainTitleNumbering);
        const subCheck = v.match(EssayWritingDatas.subTitleNumbering);
        return <p className={
            ` ${mainCheck!==null ? ''
            : (subCheck !== null ? 'ml-5': 'ml-8')}`
        } key={'text-test-'+i}>{v}</p>
    }
    return (
        <section className={`section-common-layout z-0`}>
            <div className='flex flex-1 justify-center w-screen pt-[10vh] px-[4vw] max-h-[90vh] z-10'>
            {/* select and next button */}
            {selectOutliner !== 0 && (
                <div className='absolute top-[50vh] right-0 max-md:hidden'>{SvgChevronRight}</div>
            )}
            <div className='relative flex-col flex-1 bg-gray-300 max-md:w-full md:w-11/12 md:h-[78vh] max-md:px-4 md:px-[3vw] max-md:py-4 md:py-[5vh] rounded-xl z-10'>
                {/* Title */}
                <div className='flex-col flex-1 justify-start text-start font-bold text-lg md:text-2xl sm:text-xl md:pl-4 h-[8vh]'>
                {EssayWritingDatas.HeadTexts.map((v,i) => {
                    return <p key={'essay-writing-texts'+i.toString()} className='flex-col flex-1'>{v}</p>
                })}
                </div>
                {/* Input && Button */}
                <div className='flex flex-1 max-md:flex-col justify-start text-start mt-4 pt-4 pb-4 md:pl-4 max-md:h-[15vh] md:h-[7vh]'>
                    <input className='md:w-10/12 w-full max-md:h-10 md:h-[5vh] rounded-md px-4'
                    onChange={(e)=>setEssayTopicInput(e.currentTarget.value)}
                    readOnly={proceedingAPI? true: false}
                    value={essayTopicInput}/>
                    <button className={`disabled:border-opacity-25 disabled:text-opacity-25 text-black md:w-1/12 w-full max-md:h-10 md:h-[5vh] md:mx-4 max-md:mt-4 md:mt-0 bg-white border-4 border-black rounded-3xl font-bold text-lg`}
                    disabled={proceedingAPI? true:false}
                    onClick={async(e)=>{
                        e.preventDefault();
                        await onAskEvent();
                    }}
                    >{EssayWritingDatas.inputButtonTexts[0]}</button>
                </div>
                
                {/* Outliners */}
                <div className='flex md:flex-wrap flex-row relative mt-4 max-md:flex-col gap-4 max-md:h-4/5 h-[50vh] max-md:pb-4 z-30'>
                
                    {essayWritingDatasStore.map((textItem, textItemIndex)=>{
                        return (
                            <div className='relative flex flex-1 h-full' key={'text-item-'+textItemIndex}>
                            <div key={'text-item-'+textItemIndex}
                            className={
                                `relative flex flex-col flex-1 h-full bg-white border-gray-200 border-2 z-40 w-full md:w-4/12 max-md:mb-4 overflow-y-auto p-2 ${(selectOutliner !== 0 && selectOutliner === (textItemIndex+1)) ? 'ring-8 ring-yellow-400' : '' } ${textItemIndex === 2 ? `justify-center text-center`: `justify-start text-start`}`
                            }
                            onClick={()=>{
                                if (selectOutliner === (textItemIndex+1)) {
                                    setSelectOutliner(0);
                                } else {
                                    setSelectOutliner(textItemIndex+1);
                                }
                            }}>
                                
                                {(selectOutliner !== 0 && selectOutliner === (textItemIndex+1)) 
                                ? <div className='absolute top-[35%] right-0 md:hidden'>{SvgChevronRight}</div>
                                : ''
                                }
                                
                                {textItemIndex===0 && (inProgress!==1 
                                    ? textItem.text.split('\n').map((v, i)=>outlineDivMap(v,i))
                                    : <div>Loading....</div>
                                )}
                                {textItemIndex===1 && (inProgress===0 
                                    ? textItem.text.split('\n').map((v, i)=>outlineDivMap(v,i))
                                    : <div>Loading....</div>
                                )}
                                {textItemIndex===2 && textItem.text.split('\n').map((v,i)=>outlineDivMap(v,i))}
                            </div>
                            <div className='w-fit absolute z-50 -bottom-9 right-0 px-3 py-1'>
                                <div className='flex flex-1 flex-row content-center items-center w-full'>
                                    <div className='w-fit bg-slate-600 text-white px-2 py-1 h-8 rounded-md'>Edit</div>
                                    <div className='w-fit bg-slate-600 text-white px-2 py-1 h-8 rounded-md'>{SvgRefreshIcon}</div>
                                </div>
                            </div>
                            </div>
                        )
                    })}
                    
                </div>
            </div>
            </div>
        </section>
    )
}