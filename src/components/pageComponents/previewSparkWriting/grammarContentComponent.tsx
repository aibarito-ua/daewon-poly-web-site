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
        <svg {...props} width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="bt_undo">
        <g id="Rectangle 52">
        <rect width="34" height="34" rx="10" fill="#21C4CC"/>
        <rect x="0.5" y="0.5" width="33" height="33" rx="9.5" stroke="white" strokeOpacity="0.7"/>
        </g>
        <path id="Vector" d="M20.2245 13.0144H12.31L14.0241 11.2359C14.5172 10.7242 14.5172 9.89521 14.0241 9.38357C13.531 8.87236 12.732 8.87193 12.2389 9.38357L8.37025 13.3977L8.36646 13.4016C8.35342 13.4156 8.34038 13.4296 8.32775 13.444C8.32397 13.4483 8.3206 13.4527 8.31682 13.4571C8.30672 13.4688 8.29662 13.4806 8.28736 13.4929C8.28442 13.4968 8.28147 13.5007 8.27853 13.5042C8.26843 13.5173 8.25833 13.5304 8.24866 13.5439C8.24697 13.5466 8.24529 13.5487 8.24361 13.5514C8.23309 13.5662 8.22257 13.5815 8.21247 13.5972L8.21121 13.5994C8.09971 13.7731 8.02735 13.9757 8.00631 14.1944C8.00631 14.1975 8.00589 14.2009 8.00547 14.204C8.00379 14.2219 8.00252 14.2402 8.00168 14.2586C8.00084 14.2804 8 14.3022 8 14.3241C8 14.3459 8.00042 14.3677 8.00168 14.3895C8.00252 14.4079 8.00421 14.4258 8.00547 14.4441C8.00547 14.4472 8.00547 14.4507 8.00631 14.4537C8.02693 14.6724 8.09971 14.875 8.21121 15.0487L8.21247 15.0505C8.22257 15.0662 8.23309 15.081 8.24361 15.0963C8.24529 15.0989 8.24697 15.1011 8.24866 15.1037C8.25833 15.1173 8.26843 15.1304 8.27853 15.1435C8.28147 15.1474 8.28442 15.1513 8.28736 15.1548C8.29704 15.167 8.30714 15.1788 8.31682 15.1906C8.3206 15.195 8.32397 15.1993 8.32775 15.2037C8.34038 15.2181 8.35342 15.2321 8.36646 15.2461L8.37025 15.25L12.2389 19.2641C12.4855 19.5199 12.8082 19.6478 13.1313 19.6478C13.4544 19.6478 13.7776 19.5199 14.0237 19.2641C14.5168 18.7525 14.5168 17.9234 14.0237 17.4118L12.3096 15.6333H20.2241C22.0169 15.6333 23.4756 17.1468 23.4756 19.007C23.4756 20.8671 22.0169 22.3807 20.2241 22.3807H18.1313C17.4342 22.3807 16.8691 22.967 16.8691 23.6903C16.8691 24.4137 17.4342 25 18.1313 25H20.2241C23.4091 25 26 22.3117 26 19.007C26 15.7023 23.4095 13.0144 20.2245 13.0144Z" fill="white"/>
        </g>
        </svg>

      );
    }
    ,
    titleCompareDif1: (
        paragragh:TGrammarResDiff[][][],
        paragraphIndex:number, 
        clickTooltip: (willChangeValue: string, mainDiv: 'Title' | 'Body', paragraghData: number, paragraphIndex: number, sentenceIndex: number, wordIndex: number) => void 
    ) => {
        const RedArrow = (props:React.SVGAttributes<SVGElement>) => {
            return (
                <svg {...props} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="arrow">
                <path id="Vector 70" d="M13 19L16.2929 15.7071C16.6834 15.3166 16.6834 14.6834 16.2929 14.2929L13 11" stroke="#EB3A3A" strokeWidth="2" strokeLinecap="round"/>
                </g>
                </svg>
            )
        }
        return paragragh.map((sentence: TGrammarResDiff[][], sentenceIndex:number) => {
            const sentenceKey = `title-paragragh-${paragraphIndex}-sentence-${sentenceIndex}`;
                const sentence_max_index = sentence.length;
                const isSentenceEnd = sentenceIndex === sentence_max_index
            return <span className='' key={sentenceKey}>
                <span className={sentenceIndex===0?'pl-4': 'pl-1'}></span>
                {sentence.map((word:TGrammarResDiff[], wordIndex:number) => {
                    let returnValue:any = '';
                    const wordElementsLength = word.length;
                    // console.log('paragraghIDX =',paragraphIndex,'\nsentenceIDX =',sentenceIndex,'\nwordIDX =',wordIndex,'\nwordLength =',wordElementsLength)
                    if (wordElementsLength === 1) {
                        
                        const compareWordFlag = word[0].type;
                        const mainTagKey = `title-paragragh-${paragraphIndex}-sentence-${sentenceIndex}-word-${wordIndex}`;
                        const dataKey = word[0].key;
                        const currentWord = word[0].word;
                        const reasons = word[0].correction_reason;

                        if (compareWordFlag === 1) {
                            // only add
                            const textTagId = 'title-'+mainTagKey+'-add'
                            const describeText = [
                                reasons,
                                <span className='grammar-tooltip-custom-content-wrap'>
                                    <pre className='grammar-tooltip-custom-content-add-text'>{currentWord}</pre>
                                </span>
                            ]
                            returnValue = (
                                <GrammarTooltipCustom 
                                    mainTagkey={mainTagKey}
                                    textTagid={textTagId} 
                                    tagType={'add'} 
                                    compareResultText={currentWord}
                                    tooltipText={describeText} 
                                    acceptEventFunction={()=>clickTooltip(currentWord, 'Title',0, paragraphIndex, sentenceIndex, wordIndex)} 
                                    ignoreEventFunction={()=>clickTooltip('', 'Title', 0,paragraphIndex, sentenceIndex, wordIndex)} 
                                    thisIndex={[]}       
                                />
                            )
                        } else if (compareWordFlag === -1) {
                            // only delete
                            const textTagId = 'title-'+mainTagKey+'-del'
                            const describeText = [
                                reasons,
                                <span className='grammar-tooltip-custom-content-wrap'>
                                <pre className='grammar-tooltip-custom-content-delete-text'>{currentWord}</pre>
                                </span>
                            ];
                            returnValue = (
                                <GrammarTooltipCustom 
                                    mainTagkey={mainTagKey} 
                                    textTagid={textTagId} 
                                    tagType={'delete'} 
                                    compareResultText={currentWord}
                                    tooltipText={describeText} 
                                    acceptEventFunction={()=>clickTooltip('', 'Title',0, paragraphIndex, sentenceIndex, wordIndex)} 
                                    ignoreEventFunction={()=>clickTooltip(currentWord, 'Title',0, paragraphIndex, sentenceIndex, wordIndex)}
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
                        let addKey = '';
                        let addWord = '';
                        let deleteKey = '';
                        let deleteWord = '';
                        let reason:any = '';
                        let checkSelected = false;
                        let selectedWord = '';
                        let emptyKey = '';
                        let emptyWord = '';
                        
                        for (let innerWordIdx = 0; innerWordIdx < word.length; innerWordIdx++) {
                            const targetInnerWord = word[innerWordIdx];
                            if (targetInnerWord.type===1) {
                                // add
                                addKey = targetInnerWord.key;
                                addWord = targetInnerWord.word;
                                reason = targetInnerWord.correction_reason
                            } else if (targetInnerWord.type===-1) {
                                // delete
                                deleteKey = targetInnerWord.key;
                                deleteWord = targetInnerWord.word;
                                reason = targetInnerWord.correction_reason
                            } else if (targetInnerWord.type === 2) {
                                // check selected
                                selectedWord=targetInnerWord.word;
                                checkSelected=true;
                            } else {
                                // empty space
                                emptyKey=targetInnerWord.key;
                                emptyWord=targetInnerWord.word
                            }
                        }
                        
                        // // delete + add set
                        const JsxText = <span className='grammar-tooltip-custom-content-wrap'>
                            <span className='grammar-tooltip-custom-content-delete-text'>{deleteWord}</span>
                            <RedArrow/>
                            <span className='grammar-tooltip-custom-content-add-text'>{addWord}</span>
                        </span>
                        const describeText = [
                            reason,
                            JsxText 
                        ]
                        if (checkSelected) {
                            const textTagId = 'title-'+mainTagKey + '-ori'
                            returnValue = <span key={mainTagKey}><span id={textTagId}>{selectedWord}</span></span>
                        } else {
                            returnValue = (
                                <span key={mainTagKey+'-both'}>
                                    <GrammarTooltipCustom 
                                        mainTagkey={deleteKey} 
                                        textTagid={'title-'+mainTagKey+'-del'} 
                                        tagType={'delete'} 
                                        compareResultText={deleteWord}
                                        tooltipText={describeText} 
                                        acceptEventFunction={()=>clickTooltip(addWord, 'Title',0, paragraphIndex, sentenceIndex, wordIndex)} 
                                        ignoreEventFunction={()=>clickTooltip(deleteWord, 'Title',0, paragraphIndex, sentenceIndex, wordIndex)} 
                                        thisIndex={[]}                                    
                                    />
                                    <span key={emptyKey}><span id={'title-'+mainTagKey + '-ori'}>{emptyWord}</span></span>
                                    <GrammarTooltipCustom 
                                        mainTagkey={addKey} 
                                        textTagid={'title-'+mainTagKey+'-add'} 
                                        tagType={'add'} 
                                        compareResultText={addWord}
                                        tooltipText={describeText} 
                                        acceptEventFunction={()=>clickTooltip(addWord, 'Title',0, paragraphIndex, sentenceIndex, wordIndex)} 
                                        ignoreEventFunction={()=>clickTooltip(deleteWord, 'Title',0, paragraphIndex, sentenceIndex, wordIndex)} 
                                        thisIndex={[]}                                    
                                    />
                                </span>
                            )
                        }
                    }
                    return returnValue;
                }
                )}
                {!isSentenceEnd && <br/> }
            </span>
        })
    },
    bodyCompareDif1: (
        paragragh:TGrammarResponseResult, 
        paragraphIndex:number, 
        clickTooltip: (willChangeValue: string, mainDiv: 'Title' | 'Body', paragraghData: number, paragraphIndex: number, sentenceIndex: number, wordIndex: number) => void 
    ) => {
        const RedArrow = (props:React.SVGAttributes<SVGElement>) => {
            return (
                <svg {...props} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="arrow">
                <path id="Vector 70" d="M13 19L16.2929 15.7071C16.6834 15.3166 16.6834 14.6834 16.2929 14.2929L13 11" stroke="#EB3A3A" strokeWidth="2" strokeLinecap="round"/>
                </g>
                </svg>
            )
        }

        // select paragragh
        return <span key={`paragragh-${paragraphIndex}`}>{paragragh.data.map((paragraghData:TGrammarResDiff[][][], paragraghDataIndex:number)=>{
            const sentenceKey = `paragragh-${paragraphIndex}-sentence-${paragraghDataIndex}`;
            // paraghragh mapping
            return  <span className='flow-root' key={sentenceKey}>
                <span className={paragraghDataIndex===0?'pl-4': 'pl-1'}></span>
                {paragraghData.map((sentence:TGrammarResDiff[][], sentenceIndex:number) => {
                    // sentence map
                    return sentence.map((word:TGrammarResDiff[], wordIndex:number) => {
                        // word start
                        let returnValue:any = '';
                        // console.log('word ==',word)
                        // console.log('paragraghIDX =',paragraphIndex,'\nsentenceIDX =',sentenceIndex,'\nwordIDX =',wordIndex,'\nwordLength =',word.length)
                        const wordElementsLength = word.length;
                        // console.log('paragraghIDX =',paragraphIndex,'\nsentenceIDX =',sentenceIndex,'\nwordIDX =',wordIndex,'\nwordLength =',wordElementsLength)
                        if (wordElementsLength === 1) {
                            
                            const compareWordFlag = word[0].type;
                            const mainTagKey = `title-paragragh-${paragraphIndex}-sentence-${sentenceIndex}-word-${wordIndex}`;
                            const dataKey = word[0].key;
                            const currentWord = word[0].word;
                            const reasons = word[0].correction_reason;

                            if (compareWordFlag === 1) {
                                // only add
                                const textTagId = 'title-'+mainTagKey+'-add'
                                const describeText = [
                                    reasons,
                                    <span className='grammar-tooltip-custom-content-wrap'>
                                        <pre className='grammar-tooltip-custom-content-add-text'>{currentWord}</pre>
                                    </span>
                                ]
                                returnValue = (
                                    <GrammarTooltipCustom 
                                        mainTagkey={mainTagKey}
                                        textTagid={textTagId} 
                                        tagType={'add'} 
                                        compareResultText={currentWord}
                                        tooltipText={describeText} 
                                        acceptEventFunction={()=>clickTooltip(currentWord, 'Body', paragraphIndex, paragraghDataIndex, sentenceIndex, wordIndex)} 
                                        ignoreEventFunction={()=>clickTooltip('', 'Body', paragraphIndex, paragraghDataIndex, sentenceIndex, wordIndex)} 
                                        thisIndex={[]}       
                                    />
                                )
                            } else if (compareWordFlag === -1) {
                                // only delete
                                const textTagId = 'title-'+mainTagKey+'-del'
                                const describeText = [
                                    reasons,
                                    <span className='grammar-tooltip-custom-content-wrap'>
                                    <pre className='grammar-tooltip-custom-content-delete-text'>{currentWord}</pre>
                                    </span>
                                ];
                                returnValue = (
                                    <GrammarTooltipCustom 
                                        mainTagkey={mainTagKey} 
                                        textTagid={textTagId} 
                                        tagType={'delete'} 
                                        compareResultText={currentWord}
                                        tooltipText={describeText} 
                                        acceptEventFunction={()=>clickTooltip('', 'Body', paragraphIndex, paragraghDataIndex, sentenceIndex, wordIndex)} 
                                        ignoreEventFunction={()=>clickTooltip(currentWord, 'Body', paragraphIndex, paragraghDataIndex, sentenceIndex, wordIndex)}
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
                            let addKey = '';
                            let addWord = '';
                            let deleteKey = '';
                            let deleteWord = '';
                            let reason:any = '';
                            let checkSelected = false;
                            let selectedWord = '';
                            let emptyKey = '';
                            let emptyWord = '';
                            
                            for (let innerWordIdx = 0; innerWordIdx < word.length; innerWordIdx++) {
                                const targetInnerWord = word[innerWordIdx];
                                if (targetInnerWord.type===1) {
                                    // add
                                    addKey = targetInnerWord.key;
                                    addWord = targetInnerWord.word;
                                    reason = targetInnerWord.correction_reason
                                } else if (targetInnerWord.type===-1) {
                                    // delete
                                    deleteKey = targetInnerWord.key;
                                    deleteWord = targetInnerWord.word;
                                    reason = targetInnerWord.correction_reason
                                } else if (targetInnerWord.type === 2) {
                                    // check selected
                                    selectedWord=targetInnerWord.word;
                                    checkSelected=true;
                                } else {
                                    // empty space
                                    emptyKey=targetInnerWord.key;
                                    emptyWord=targetInnerWord.word
                                }
                            }
                            
                            // // delete + add set
                            const JsxText = <span className='grammar-tooltip-custom-content-wrap'>
                                <span className='grammar-tooltip-custom-content-delete-text'>{deleteWord}</span>
                                <RedArrow/>
                                <span className='grammar-tooltip-custom-content-add-text'>{addWord}</span>
                            </span>
                            const describeText = [
                                reason,
                                JsxText 
                            ]
                            if (checkSelected) {
                                const textTagId = 'title-'+mainTagKey + '-ori'
                                returnValue = <span key={mainTagKey}><span id={textTagId}>{selectedWord}</span></span>
                            } else {
                                returnValue = (
                                    <span key={mainTagKey+'-both'}>
                                        <GrammarTooltipCustom 
                                            mainTagkey={deleteKey} 
                                            textTagid={'title-'+mainTagKey+'-del'} 
                                            tagType={'delete'} 
                                            compareResultText={deleteWord}
                                            tooltipText={describeText} 
                                            acceptEventFunction={()=>clickTooltip(addWord, 'Body', paragraphIndex, paragraghDataIndex, sentenceIndex, wordIndex)} 
                                            ignoreEventFunction={()=>clickTooltip(deleteWord, 'Body', paragraphIndex, paragraghDataIndex, sentenceIndex, wordIndex)} 
                                            thisIndex={[]}                                    
                                        />
                                        <span key={emptyKey}><span id={'title-'+mainTagKey + '-ori'}>{emptyWord}</span></span>
                                        <GrammarTooltipCustom 
                                            mainTagkey={addKey} 
                                            textTagid={'title-'+mainTagKey+'-add'} 
                                            tagType={'add'} 
                                            compareResultText={addWord}
                                            tooltipText={describeText} 
                                            acceptEventFunction={()=>clickTooltip(addWord, 'Body', paragraphIndex, paragraghDataIndex, sentenceIndex, wordIndex)} 
                                            ignoreEventFunction={()=>clickTooltip(deleteWord, 'Body', paragraphIndex, paragraghDataIndex, sentenceIndex, wordIndex)} 
                                            thisIndex={[]}                                    
                                        />
                                    </span>
                                )
                            }
                        }
                        return returnValue;
                    })
            })}</span>;
        })}</span>;
    },
    // history tool
    undoRedoReset: (currentState: TBodyHistorys, actionType: 'UNDO'|'REDO'|'RESET'): TBodyHistorys => {
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
                    const reset_past_title: TTitleHistory[] =[];
                    const reset_present_title = origin.title.past.length>0 ? origin.title.past[0] : origin.title.present
                    const reset_future_title: TTitleHistory[] =[];
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
                const default_title_past: TTitleHistory[] =[];
                const default_title_present: TTitleHistory = [];
                const default_title_future: TTitleHistory[] =[];
                const default_past: TbodyHistory[] =[];
                const default_present: TbodyHistory = [];
                const default_future: TbodyHistory[] =[];
                return {
                    title: {past: default_title_past, present: default_title_present, future: default_title_future},
                    body: {past: default_past, present: default_present, future: default_future}
                }
        }
    },
    setTbodyHistorys: (currentState: TBodyHistorys['body'], hist: TbodyHistory):{past:TbodyHistory[], present: TbodyHistory}|undefined => {
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
    setTTitleHistorys: (currentState: TBodyHistorys['title'], hist: TTitleHistory):{past:TTitleHistory[], present: TTitleHistory}|undefined => {
        if (isEquel(currentState.present, hist)) return;
        const origin:TBodyHistorys['title'] = JSON.parse(JSON.stringify(currentState))
        let past:TTitleHistory[] = []
        let present:TTitleHistory = [];
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
        hist:{title:TTitleHistory, body:TGrammarResponseResult[]}, bodyHistory: TBodyHistorys
    ):TBodyHistorys|undefined => {
        const origin:TBodyHistorys = JSON.parse(JSON.stringify(bodyHistory));
        if (isEqual(origin.body, hist.body) && isEqual(origin.title, hist.title)) return;
        
        let titlePast:TTitleHistory[]=[];
        let titlePresent:TTitleHistory=[];
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
        const title_future: TTitleHistory[] =[]
        const future: TbodyHistory[] = []
        return {
            title: { past: titlePast, present: titlePresent, future: title_future},
            body: {past, present, future}
        }
    }
}

export default GrammarContentComponent;