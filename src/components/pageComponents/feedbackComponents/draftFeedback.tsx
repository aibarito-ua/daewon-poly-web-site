import React from 'react';
import CommentTooltipCustom from './commentTooltipCustom';
import CommentTooltipCustomInModal from './commentTooltipCustomInModal';

const loadFeedbackDraftTitle = (
    props: {
        feedbackDataInStudent: TSparkWritingData;
        usePage?: 'Modal'|''; 
    }
) => {
    const {feedbackDataInStudent,usePage} = props;
    const draftOutline = feedbackDataInStudent.draft_1_outline;
    const comments = feedbackDataInStudent.draft_1_comment;

    const findCommentByCommentIndex = (comment_index:number) => {
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].comment_index === comment_index) {
                const commentData = comments[i];
                return commentData;
            }
        }
        const emptyReturn:TCommentData = {
            comment:'',comment_className:'',
            comment_index:-1, paragraph_name: '',
            end_index:-1,start_index:-1, target_text: ''
        }
        return emptyReturn;
    }

    return draftOutline.map((paragraphItem, paragraphIndex) => {
        const paragraphKey = 'title'+paragraphItem.order_index+paragraphIndex;
        const screenData = paragraphItem.screen_data;
        if (paragraphIndex!==0) {
            return null;
        } else {
            let returnValue:JSX.Element[]=[];
            const jsxElements:JSX.Element[]=[];
            screenData.map((wordItem, wordIndex) => {
                // comment check
                const currentCommentIdx = wordItem.comment_index;
                const currentType = wordItem.type;
                const mainTagKey = `title-`+wordIndex+'-'+currentType;
                const af_item = wordIndex < screenData.length? screenData[wordIndex+1]:null;
                // 'update-words'
                if (currentType === -1) {
                    const jsxTag=<span key={mainTagKey} className='update-words'>
                        <span className='text-[#eb3a3a] line-through h-fit'>{wordItem.text}</span></span>
                    returnValue.push(jsxTag);
                    
                } else if (currentType === 1) {
                    const jsxTag = <span key={mainTagKey} className='update-words'>
                        <span className='text-[#00be91]'>{wordItem.text}</span></span>
                    returnValue.push(jsxTag);
                } else {
                    // type 0
                    const jsxTag=<span className='update-words' key={mainTagKey}>{wordItem.text}</span>
                    returnValue.push(jsxTag);
                }
                // comment check
                if (af_item?.comment_index !== currentCommentIdx) {
                    if (currentCommentIdx===-1) {
                        jsxElements.push(...returnValue)
                        returnValue=[];
                    } else {
                        const currentCommentItem = findCommentByCommentIndex(currentCommentIdx);
                        const createSpan = <span className={'rounded-[2px]'}
                        id={currentCommentItem.comment_className}
                        key={currentCommentItem.comment_className}
                        style={{
                            backgroundColor:'yellow',
                            userSelect:'none',
                            height: 'fit-content',
                            cursor: 'pointer',
                        }}
                        >{returnValue}</span>;
                        const tooltipSpans = usePage 
                        ? <CommentTooltipCustomInModal 
                            compareResultText={createSpan}
                            mainTagkey={currentCommentItem.comment_className}
                            tooltipText={currentCommentItem.comment}
                        /> 
                        : <CommentTooltipCustom 
                            compareResultText={createSpan}
                            mainTagkey={currentCommentItem.comment_className}
                            tooltipText={currentCommentItem.comment}
                        />

                        jsxElements.push(tooltipSpans);
                        returnValue=[];
                    }
                }
                return true;
            });

            return <div className='draft-title-paragragh-wrap h-fit'
            id={'Title'} key={paragraphKey}
            >
            {jsxElements}
            </div>
        }
    })
}
const loadFeedbackDraftBody = (
    props: {
        feedbackDataInStudent: TSparkWritingData;
        usePage?: 'Modal'|'';
    }
) => {
    const {feedbackDataInStudent,usePage} = props;
    const draftOutline = feedbackDataInStudent.draft_1_outline;
    const comments = feedbackDataInStudent.draft_1_comment;

    const findCommentByCommentIndex = (comment_index:number) => {
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].comment_index === comment_index) {
                const commentData = comments[i];
                return commentData;
            }
        }
        const emptyReturn:TCommentData = {
            comment:'',comment_className:'',
            comment_index:-1, paragraph_name: '',
            end_index:-1,start_index:-1, target_text: ''
        }
        return emptyReturn;
    }

    return draftOutline.map((paragraphItem, paragraphIndex) => {
        const paragraphKey = 'body'+paragraphItem.order_index+paragraphIndex;
        const screenData = paragraphItem.screen_data;
        if (paragraphIndex===0) {
            return null;
        } else {
            let returnValue:JSX.Element[]=[];
            const jsxElements:JSX.Element[]=[];
            screenData.map((wordItem, wordIndex) => {
                // comment check
                const currentCommentIdx = wordItem.comment_index;
                const currentType = wordItem.type;
                const mainTagKey = `body-`+wordIndex+'-'+currentType;
                const af_item = wordIndex < screenData.length? screenData[wordIndex+1]:null;
                // 'update-words'
                if (currentType === -1) {
                    const jsxTag=<span key={mainTagKey} className='update-words'>
                        <span className='text-[#eb3a3a] line-through h-fit whitespace-pre-wrap'>{wordItem.text}</span></span>
                    returnValue.push(jsxTag);
                    
                } else if (currentType === 1) {
                    const jsxTag = <span key={mainTagKey} className='update-words'>
                        <span className='text-[#00be91] whitespace-pre-wrap'>{wordItem.text}</span></span>
                    returnValue.push(jsxTag);
                } else {
                    // type 0
                    const jsxTag=<span className='update-words whitespace-pre-wrap' key={mainTagKey}>{wordItem.text}</span>
                    returnValue.push(jsxTag);
                }
                // comment check
                if (af_item?.comment_index !== currentCommentIdx) {
                    if (currentCommentIdx===-1) {
                        jsxElements.push(...returnValue)
                        returnValue=[];
                    } else {
                        const currentCommentItem = findCommentByCommentIndex(currentCommentIdx);

                        const createSpan = <span className={`rounded-[2px]`}
                        id={currentCommentItem.comment_className}
                        key={currentCommentItem.comment_className}
                        style={{
                            backgroundColor:'yellow',
                            userSelect:'none',
                            height: '26px',
                            cursor: 'pointer'
                        }}
                        >{returnValue}</span>;
                        const tooltipSpans = usePage==='Modal' 
                        ? <CommentTooltipCustomInModal 
                            compareResultText={createSpan}
                            mainTagkey={currentCommentItem.comment_className}
                            tooltipText={currentCommentItem.comment}
                        /> 
                        : <CommentTooltipCustom 
                            compareResultText={createSpan}
                            mainTagkey={currentCommentItem.comment_className}
                            tooltipText={currentCommentItem.comment}
                        />

                        jsxElements.push(tooltipSpans);
                        returnValue=[];
                    }
                }
                return true;
            });

            return <div className='draft-body-paragragh-wrap'
            id={'Body'} key={paragraphKey}
            >
            {jsxElements}
            </div>
        }
    })
}
const draftViewBox = {
    loadFeedbackDraftTitle,
    loadFeedbackDraftBody
}
export default draftViewBox