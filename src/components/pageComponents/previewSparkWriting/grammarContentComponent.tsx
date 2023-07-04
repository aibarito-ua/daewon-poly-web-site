import React from 'react';
import GrammarTooltipCustom from './grammarTooltipCustom';
import { Diff } from 'diff-match-patch';
import isEquel from 'lodash/isEqual';
import { SVGAttributes } from "react";
import isEqual from 'lodash/isEqual';

const GrammarContentComponent = {
    // Draft 1 Body Component map value

    resetButtonIcon(props: SVGAttributes<SVGElement>):JSX.Element {
      return (
        <svg {...props} className='h-8 w-8 pointer-events-none' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> 
                <path d="M7 10.625H14.2C14.2 10.625 14.2 10.625 14.2 10.625C14.2 10.625 17 10.625 17 13.625C17 17 14.2 17 14.2 17H13.4" stroke="#7ed0ec" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
                <path d="M10.5 14L7 10.625L10.5 7" stroke="#7ed0ec" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#7ed0ec" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
            </g>
        </svg>
      );
    }
    ,
    titleCompareDif1: (
        paragragh:Diff[][][], 
        paragraphIndex:number, 
        clickTooltip: (willChangeValue: string, mainDiv: 'Title' | 'Body', paragraphIndex: number, sentenceIndex: number, wordIndex: number) => void 
    ) => {
        return paragragh.map((sentence: Diff[][], sentenceIndex:number) => {
            const sentenceKey = `title-paragragh-${paragraphIndex}-sentence-${sentenceIndex}`;
                const sentence_max_index = sentence.length;
                const isSentenceEnd = sentenceIndex === sentence_max_index
            return <span className='' key={sentenceKey}>
                <span className={sentenceIndex===0?'pl-4': 'pl-1'}></span>
                {sentence.map((word:Diff[], wordIndex:number) => {
                    let returnValue:any = '';
                    if (word.length === 1) {
                        const compareWordFlag = word[0][0];
                        const mainTagKey = `title-paragragh-${paragraphIndex}-sentence-${sentenceIndex}-word-${wordIndex}`;
                        const currentWord = word[0][1];
                        if (compareWordFlag === 1) {
                            // only add
                            const textTagId = 'title-'+mainTagKey+'-add'
                            const describeText = ['Spelling',currentWord ]
                            returnValue = (
                                <GrammarTooltipCustom 
                                    mainTagkey={mainTagKey} 
                                    textTagid={textTagId} 
                                    tagType={'add'} 
                                    compareResultText={currentWord}
                                    tooltipText={describeText} 
                                    acceptEventFunction={()=>clickTooltip(currentWord, 'Title', paragraphIndex, sentenceIndex, wordIndex)} 
                                    ignoreEventFunction={()=>clickTooltip('', 'Title', paragraphIndex, sentenceIndex, wordIndex)} 
                                    thisIndex={[]}       
                                />
                            )
                        } else if (compareWordFlag === -1) {
                            // only delete
                            const textTagId = 'title-'+mainTagKey+'-del'
                            const describeText = [
                                'Grammar',
                                <pre className='font-sans inline-block line-through'>{currentWord}</pre>
                            ];
                            returnValue = (
                                <GrammarTooltipCustom 
                                    mainTagkey={mainTagKey} 
                                    textTagid={textTagId} 
                                    tagType={'delete'} 
                                    compareResultText={currentWord}
                                    tooltipText={describeText} 
                                    acceptEventFunction={()=>clickTooltip('', 'Title', paragraphIndex, sentenceIndex, wordIndex)} 
                                    ignoreEventFunction={()=>clickTooltip(currentWord, 'Title', paragraphIndex, sentenceIndex, wordIndex)}
                                    thisIndex={[]}
                                />
                            )
                        } else {
                            // original
                            const textTagId = 'title-'+mainTagKey + '-ori'
                            returnValue = <span key={mainTagKey}><span id={textTagId}>{currentWord}</span></span>
                        }
                    } else {
                        // delete + add set
                        const mainTagKey = `title-paragragh-${paragraphIndex}-sentence-${sentenceIndex}-word-${wordIndex}`;
                        
                        const DeleteWord = word[0][1];
                        const AddWord = word[1][1];
                        const describeText = ['Spelling', `${DeleteWord} >> ${AddWord}`]
                        
                        returnValue = (
                            <span key={mainTagKey+'-both'}>
                                <GrammarTooltipCustom 
                                    mainTagkey={mainTagKey} 
                                    textTagid={'title-'+mainTagKey+'-del'} 
                                    tagType={'delete'} 
                                    compareResultText={DeleteWord}
                                    tooltipText={describeText} 
                                    acceptEventFunction={()=>clickTooltip(AddWord, 'Title', paragraphIndex, sentenceIndex, wordIndex)} 
                                    ignoreEventFunction={()=>clickTooltip(DeleteWord, 'Title', paragraphIndex, sentenceIndex, wordIndex)} 
                                    thisIndex={[]}                                    
                                />
                                <GrammarTooltipCustom 
                                    mainTagkey={mainTagKey} 
                                    textTagid={'title-'+mainTagKey+'-add'} 
                                    tagType={'add'} 
                                    compareResultText={AddWord}
                                    tooltipText={describeText} 
                                    acceptEventFunction={()=>clickTooltip(AddWord, 'Title', paragraphIndex, sentenceIndex, wordIndex)} 
                                    ignoreEventFunction={()=>clickTooltip(DeleteWord, 'Title', paragraphIndex, sentenceIndex, wordIndex)} 
                                    thisIndex={[]}                                    
                                />
                            </span>
                        )
                    }
                    return returnValue;
                }
                )}
                {!isSentenceEnd && <br/> }
            </span>
        })
    },
    bodyCompareDif1: (
        paragragh:Diff[][][], 
        paragraphIndex:number, 
        clickTooltip: (willChangeValue: string, mainDiv: 'Title' | 'Body', paragraphIndex: number, sentenceIndex: number, wordIndex: number) => void 
    ) => {
        return <span key={`paragragh-${paragraphIndex}`}>{paragragh.map((sentence:Diff[][], sentenceIndex:number)=>{
            const sentenceKey = `paragragh-${paragraphIndex}-sentence-${sentenceIndex}`;
            return  <span className='flow-root' key={sentenceKey}>
                <span className={sentenceIndex===0?'pl-4': 'pl-1'}></span>
                {sentence.map((word:Diff[], wordIndex:number) => {
                let returnValue:any = '';
                if (word.length === 1) {
                    const compareWordFlag = word[0][0];
                    const mainTagKey = `paragragh-${paragraphIndex}-sentence-${sentenceIndex}-word-${wordIndex}`;
                    const currentWord = word[0][1];
                    if (compareWordFlag === 1) {
                        // only add
                        const textTagId = mainTagKey+'-add'
                        
                        const describeText = ['Spelling',currentWord ]
                        returnValue = (
                            <GrammarTooltipCustom 
                                mainTagkey={mainTagKey} 
                                textTagid={textTagId} 
                                tagType={'add'} 
                                compareResultText={currentWord}
                                tooltipText={describeText} 
                                acceptEventFunction={()=>clickTooltip(currentWord, 'Body', paragraphIndex, sentenceIndex, wordIndex)} 
                                ignoreEventFunction={()=>clickTooltip('', 'Body', paragraphIndex, sentenceIndex, wordIndex)} 
                                thisIndex={[]}       
                            />
                        )
                    } else if (compareWordFlag === -1) {
                        // only delete
                        const textTagId = mainTagKey+'-del'
                        const describeText = [
                            'Grammar',
                            <pre className='font-sans inline-block line-through'>{currentWord}</pre>
                        ];
                        returnValue = (
                            <GrammarTooltipCustom 
                                mainTagkey={mainTagKey} 
                                textTagid={textTagId} 
                                tagType={'delete'} 
                                compareResultText={currentWord}
                                tooltipText={describeText} 
                                acceptEventFunction={()=>clickTooltip('', 'Body', paragraphIndex, sentenceIndex, wordIndex)} 
                                ignoreEventFunction={()=>clickTooltip(currentWord, 'Body', paragraphIndex, sentenceIndex, wordIndex)}
                                thisIndex={[]}
                            />
                        )
                    } else {
                        // original
                        const textTagId = mainTagKey + '-ori'
                        returnValue = <span key={mainTagKey}><span id={textTagId}>{currentWord}</span></span>
                    }
                } else {
                    // delete + add set
                    const mainTagKey = `paragragh-${paragraphIndex}-sentence-${sentenceIndex}-word-${wordIndex}`;
                    
                    const DeleteWord = word[0][1];
                    const AddWord = word[1][1];
                    const describeText = ['Spelling', `${DeleteWord} >> ${AddWord}`]
                    
                    returnValue = (
                        <span key={mainTagKey+'-both'}>
                            <GrammarTooltipCustom 
                                mainTagkey={mainTagKey} 
                                textTagid={mainTagKey+'-del'} 
                                tagType={'delete'} 
                                compareResultText={DeleteWord}
                                tooltipText={describeText} 
                                acceptEventFunction={()=>clickTooltip(AddWord, 'Body', paragraphIndex, sentenceIndex, wordIndex)} 
                                ignoreEventFunction={()=>clickTooltip(DeleteWord, 'Body', paragraphIndex, sentenceIndex, wordIndex)} 
                                thisIndex={[]}                                    
                            />
                            <GrammarTooltipCustom 
                                mainTagkey={mainTagKey} 
                                textTagid={mainTagKey+'-add'} 
                                tagType={'add'} 
                                compareResultText={AddWord}
                                tooltipText={describeText} 
                                acceptEventFunction={()=>clickTooltip(AddWord, 'Body', paragraphIndex, sentenceIndex, wordIndex)} 
                                ignoreEventFunction={()=>clickTooltip(DeleteWord, 'Body', paragraphIndex, sentenceIndex, wordIndex)} 
                                thisIndex={[]}                                    
                            />
                        </span>
                    )
                }
                return returnValue;
            })}</span>;
        })}</span>;
    },
    // history tool
    undoRedoReset: (currentState: TBodyHistorys, actionType: 'UNDO'|'REDO'|'RESET') => {
        const origin:TBodyHistorys = JSON.parse(JSON.stringify(currentState))
        const isCheckTitle = origin.title.present && origin.title.present.length > 0
        switch (actionType) {
            case 'UNDO':
                const undo_past = origin.body.past.slice(0, origin.body.past.length - 1);
                const undo_present = origin.body.past[origin.body.past.length - 1];
                const undo_future = [origin.body.present, ...origin.body.future];
                if (isCheckTitle) {
                    const undo_past_title = origin.title.past.slice(0, origin.title.past.length - 1);
                    const undo_present_title = origin.title.past[origin.title.past.length - 1];
                    const undo_future_title = [origin.title.present, ...origin.title.future];
                    return {
                        title: {past:undo_past_title, present: undo_present_title, future: undo_future_title},
                        body: {past:undo_past, present:undo_present, future:undo_future}
                    };
                } else {
                    return {
                        title: origin.title,
                        body: {past:undo_past, present:undo_present, future:undo_future}
                    };
                }
            case 'REDO':
                const redo_past = [...origin.body.past, origin.body.present];
                const redo_present = origin.body.future[0];
                const redo_future = origin.body.future.slice(1);
                if (isCheckTitle) {
                    const redo_past_title = [...origin.title.past, origin.title.present];
                    const redo_present_title = origin.title.future[0];
                    const redo_future_title = origin.title.future.slice(1);
                    return {
                        title: {past: redo_past_title, present: redo_present_title, future: redo_future_title},
                        body: {past:redo_past, present:redo_present, future:redo_future}
                    }
                } else {
                    return {
                        title: origin.title,
                        body: {past:redo_past, present:redo_present, future:redo_future}
                    }

                }
            case 'RESET':
                const reset_past: TbodyHistory[] =[];
                const reset_present = origin.body.past.length>0 ? origin.body.past[0] : origin.body.present
                const reset_future: TbodyHistory[] =[];
                if (isCheckTitle) {
                    const reset_past_title: TbodyHistory[] =[];
                    const reset_present_title = origin.title.past.length>0 ? origin.title.past[0] : origin.title.present
                    const reset_future_title: TbodyHistory[] =[];
                    return {
                        title: {past: reset_past_title, present: reset_present_title, future: reset_future_title},
                        body: {past:reset_past, present: reset_present, future: reset_future}
                    }
                } else {
                    return {
                        title: origin.title,
                        body: {past:reset_past, present: reset_present, future: reset_future}
                    }

                }
            default:
                const default_past: TbodyHistory[] =[];
                const default_present: TbodyHistory = [];
                const default_future: TbodyHistory[] =[];
                return {
                    title: {past: default_past, present: default_present, future: default_future},
                    body: {past: default_past, present: default_present, future: default_future}
                }
        }
    },
    setTbodyHistorys: (currentState: TBodyHistorys['body'], hist: TbodyHistory):{past:TbodyHistory[], present: TbodyHistory[]}|undefined => {
        if (isEquel(currentState.present, hist)) return;
        const origin:TBodyHistorys['body'] = JSON.parse(JSON.stringify(currentState))
        let past:TbodyHistory[] = []
        let present:TbodyHistory = [];
        if (origin.past.length === 0) {
            if (origin.present.length > 0) {
                // console.log('past not, present !!')
                past = [origin.present]
                present = hist
            } else {
                // console.log('past not, present not')
                past = []
                present = hist;
            }
        } else {
            if (origin.present.length > 0) {
                // console.log('past !!, present !!')
                past = [...origin.past, origin.present]
                present = hist
            } else {
                // console.log('past !!, present not')
                past = []

            }
        };
        return {past, present};
    },
    setTTitleHistorys: (currentState: TBodyHistorys['title'], hist: TbodyHistory):{past:TbodyHistory[], present: TbodyHistory[]}|undefined => {
        if (isEquel(currentState.present, hist)) return;
        const origin:TBodyHistorys['title'] = JSON.parse(JSON.stringify(currentState))
        let past:TbodyHistory[] = []
        let present:TbodyHistory = [];
        if (origin.past.length === 0) {
            if (origin.present.length > 0) {
                // console.log('past not, present !!')
                past = [origin.present]
                present = hist
            } else {
                // console.log('past not, present not')
                past = []
                present = hist;
            }
        } else {
            if (origin.present.length > 0) {
                // console.log('past !!, present !!')
                past = [...origin.past, origin.present]
                present = hist
            } else {
                // console.log('past !!, present not')
                past = []

            }
        };
        return {past, present};
    },
    setTInitHistorys: (
        hist:{title:TbodyHistory, body:TbodyHistory}, bodyHistory: TBodyHistorys
    ):TBodyHistorys|undefined => {
        const origin:TBodyHistorys = JSON.parse(JSON.stringify(bodyHistory));
        if (isEqual(origin.body, hist.body) && isEqual(origin.title, hist.title)) return;
        
        let titlePast:TbodyHistory[]=[];
        let titlePresent:TbodyHistory=[];
        let past:TbodyHistory[] = []
        let present:TbodyHistory = [];
        if (origin.body.past.length === 0) {
            if (origin.body.present.length > 0) {
                // console.log('past not, present !!')
                past = [origin.body.present]
                present = hist.body
            } else {
                // console.log('past not, present not')
                past = []
                present = hist.body;
            }
        } else {
            if (origin.body.present.length > 0) {
                // console.log('past !!, present !!')
                past = [...origin.body.past, origin.body.present]
                present = hist.body
            } else {
                // console.log('past !!, present not')
                past = []
            }
        };

        if (origin.title.past.length === 0) {
            if (origin.title.present.length > 0) {
                // console.log('past not, present !!')
                titlePast = [origin.title.present]
                titlePresent = hist.title
            } else {
                // console.log('past not, present not')
                titlePast = []
                titlePresent = hist.title;
            }
        } else {
            if (origin.title.present.length > 0) {
                // console.log('past !!, present !!')
                titlePast = [...origin.title.past, origin.title.present]
                titlePresent = hist.title
            } else {
                // console.log('past !!, present not')
                titlePast = []
            }
        };
        const future: TbodyHistory[] = []
        return {
            title: { past: titlePast, present: titlePresent, future: future},
            body: {past, present, future}
        }
    }
}

export default GrammarContentComponent;