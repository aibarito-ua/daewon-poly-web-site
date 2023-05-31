import React from 'react';
import useNavStore from '../../store/useNavStore';
import { Button } from 'flowbite-react';
import { EssayWritingDatas } from '../../utils/EssayWriting/textData';
import useEssayWritingCenterDTStore from '../../store/useEssayWritingCenterDTStore'
import {CommonFunctions} from '../../util/common/commonFunctions'
import { useNavigate } from 'react-router-dom';
import useLoginStore from '../../store/useLoginStore';
import { SvgIconCheck } from '../../util/svgs/svgCheck';

const EssayWritingSelectTopic = () => {
    const navigate = useNavigate();
    const {role} = useLoginStore();
    const {setTopNavHiddenFlagged, setSubNavTitleString, setSubRightNavTitleString} = useNavStore()
    const {setUseAI1, setUseAI2, setUseUser, proceedingTopicIndex, completeTopicIndex, setCompleteTopicIndex, setProceedingTopicIndex} = useEssayWritingCenterDTStore();
    React.useEffect(()=>{
        setTopNavHiddenFlagged(true);
        setSubNavTitleString('Essay Writing')
        setSubRightNavTitleString('');
        setCompleteTopicIndex(proceedingTopicIndex)
        return () => {
            setTopNavHiddenFlagged(false);
            setSubNavTitleString('');
        }
    },[setTopNavHiddenFlagged, setSubNavTitleString,setSubRightNavTitleString, proceedingTopicIndex])

    const selectWritingTopic = async (title:string, topic: string) => {
        const subNavRightTitle = `${title}. ${topic}`;
        console.log('text =',subNavRightTitle)
        setSubRightNavTitleString(subNavRightTitle);
        setUseUser(topic);
        CommonFunctions.goLink('EssayWriting', navigate, role);
    }
    
    return (
        <section className='section-common-layout'>
            <div className="flex flex-1 sm:flex-col px-4 gap-4 w-screen justify-center text-center align-middle">
                {EssayWritingDatas.selectBoxTopics.map((item, topicsIndex)=>{
                    return (
                        <div className='flex flex-row gap-4' key={topicsIndex}>
                            {item.map((rowItem, rowIndex)=>{
                                // 진행중 0, 진행완료 1, 미진행 2
                                const checkProceeding = completeTopicIndex[rowItem.topicIndex-1]
                                return <Button key={rowIndex} 
                                className={`relative flex flex-1 select-writing-topic-item-button ${checkProceeding === 2? 'bg-gray-600': 'bg-gray-300 hover:ring-8 hover:ring-yellow-400 focus:ring-8 focus:ring-yellow-400'}`}
                                disabled={checkProceeding === 2 ? true : false}
                                onClick={async ()=>{
                                    if (checkProceeding === 2) {
                                        // 미진행 => 진행중인 topic부터 진행하세요
                                    } else if (checkProceeding === 1) {
                                        // 완료한 글 확인
                                    } else {
                                        await selectWritingTopic(rowItem.title, rowItem.topic);
                                    }
                                }}
                                ><span className=''>{rowItem.title}</span><span className='absolute top-0 right-0'>{checkProceeding===1 ? SvgIconCheck: ''}</span></Button>
                            })}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default EssayWritingSelectTopic;