import React from 'react';

const ReportWordCountSummaryComponent = (props:{item: TReportByStudent}) => {
    const {item } = props;
    // console.log('ReportWordCountSummaryComponent =',item)
    return (
        <div className='report-chart-righ-word-count-div'>
            <div className='report-chart-righ-word-count-title'>
                <span className='report-chart-righ-word-count-title-span select-none'>{'word count summary'}</span>
            </div>
            <div className='report-chart-righ-word-count-content'>
                {item.word_counts.map((wordCoundItem, wordCountIdx) => {
                    const word_count = wordCoundItem.word_count;
                    const sentence_count = wordCoundItem.sentence_count;
                    const wordPerSentenceStr = (word_count / sentence_count).toFixed(1);
                    
                    return (
                        <div className='report-chart-righ-word-count-content-wrap' key={wordCoundItem.draft_index}>
                            <div className='report-chart-righ-word-count-content-title select-none'><span>{`${wordCoundItem.draft_index===1 ? '1st draft': '2nd draft'}`}</span></div>
                            <div className={`report-chart-righ-word-count-content-items ${wordCoundItem.draft_index===1? 'border-r-[1px] border-r-[#ddd]':''}`}>
                                <div className='report-chart-righ-word-count-content-item select-none'>
                                    <span className='report-chart-righ-word-count-content-item-title whitespace-nowrap'>{`- Words`}</span>
                                    <span className='report-chart-righ-word-count-content-item-value'>{word_count}</span>
                                </div>
                                <div className='report-chart-righ-word-count-content-item select-none'>
                                    <span className='report-chart-righ-word-count-content-item-title whitespace-nowrap'>{`- Sentences`}</span>
                                    <span className='report-chart-righ-word-count-content-item-value'>{sentence_count}</span>
                                </div>
                                <div className='report-chart-righ-word-count-content-item select-none'>
                                    <span className='report-chart-righ-word-count-content-item-title whitespace-nowrap'>{`- Words per Sentence`}</span>
                                    <span className='report-chart-righ-word-count-content-item-value'>{wordPerSentenceStr}</span>
                                </div>
                            </div>        
                        </div>        
                    )
                })}
            </div>
        </div>
    )
}
const ReportCorrectionSummaryComponent = (
    props: {item: TReportByStudent}
) => {
    const {item } = props;
    console.log('===ReportCorrectionSummaryComponent===')
    console.log('=== props item ==', item)
    const [correctionDiv, setCorrectionDiv] = React.useState<JSX.Element[]>([]);
    
    const [selectReason, setSelectReason]= React.useState<"grammar" | "spelling" | "punctuation"|''>(''); 
    React.useEffect(()=>{

        const grammar = item.grammar_correction.grammar;
        let correctionDiv:JSX.Element[]=[];
        correctionDiv = grammar.sentences.map((sentenceItem, sentenceIndex) => {
            const key1 = 'report-correction-summary-init-'+sentenceIndex+'-div';
            return <div className='flex flex-row justify-start justify-items-start w-full' key={key1}>
                <span className='report-tooltip-custom-content-bullet'>{'•'}</span>
                <span className='grammar-tooltip-custom-content-list-item'>{sentenceItem.map((wordItem , wordIndex) => {
                // console.log('word ==',wordItem)
                const isGrammarCheck = wordItem.correction_reason.indexOf('grammar') !== -1
                const key2 = key1+'-wordItem-'+wordIndex+'-'+wordItem.type;
                if (wordItem.type === 1) {
                    return <span key={key2} className={`report-chart-correction-content-add-text ${isGrammarCheck && '!bg-[#ffea2c]'}`}>{wordItem.word}</span>
                } else if (wordItem.type === -1 ) {
                    return <span key={key2} className={`report-chart-correction-content-delete-text ${isGrammarCheck && '!bg-[#ffea2c]'}`}>{wordItem.word}</span>
                } else {
                    return <span key={key2} className='grammar-tooltip-custom-content-normal-text'>{wordItem.word}</span>
                }
            })}</span></div>
        })
        setCorrectionDiv(correctionDiv)
        setSelectReason('grammar')
    },[item])

    const SelectArrow = (props:React.SVGAttributes<SVGElement>) => {
        return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="5" height="7" viewBox="0 0 5 7" fill="none">
            <path d="M1 1L3.5 3.5L1 6" stroke="#21C39A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    }
    const GrammarSentence = (grammar:TReportByStudentGrammarCorrectionItem) => {
        console.log('=== TEST GRAMMAR SENTENCE CREATE ====')
        console.log('grammar =',grammar)

        return (
            <div className='report-chart-righ-correction-content-item'
            onClick={()=>{
                let correctionDiv:JSX.Element[]=[];
                correctionDiv = grammar.sentences.map((sentenceItem, sentenceIndex) => {
                    const key1 = 'report-correction-summary-grammar-'+sentenceIndex+'-div';
                    return <div className='flex flex-row justify-start justify-items-start w-full' key={key1}>
                        <span className='report-tooltip-custom-content-bullet'>{'•'}</span>
                        <span className='grammar-tooltip-custom-content-list-item'>{sentenceItem.map((wordItem , wordIndex) => {
                            
                            const isGrammarCheck = wordItem.correction_reason.indexOf('grammar') !== -1;
                            const key = key1+'wordItem-'+wordIndex+'-'+wordItem.type;
                            if (wordItem.type === 1) {
                                return <span key={key} className={`report-chart-correction-content-add-text ${isGrammarCheck && '!bg-[#ffea2c]'}`} >{wordItem.word}</span>
                            } else if (wordItem.type === -1 ) {
                                return <span key={key} className={`report-chart-correction-content-delete-text ${isGrammarCheck && '!bg-[#ffea2c]'}`}>{wordItem.word}</span>
                            } else {
                                return <span key={key} className='grammar-tooltip-custom-content-normal-text'>{wordItem.word}</span>
                            }
                    })}</span></div>
                })
                setCorrectionDiv(correctionDiv)
                setSelectReason('grammar')
            }}
            >
                <div className='flex flex-row select-none'>
                    <span className={selectReason === 'grammar' 
                            ? 'report-chart-righ-correction-content-item-title-selected'
                            : 'report-chart-righ-correction-content-item-title'}>
                        {`-`}
                        <span className={selectReason === 'grammar' 
                            ? 'pl-[4px] underline'
                            : 'pl-[4px]'}>{'grammar'}
                        </span>
                    </span>
                    <span className='report-chart-righ-correction-content-item-value'>{grammar.corrections_count}</span>
                    { selectReason === 'grammar' ? <span className='report-chart-righ-correction-content-item-arrow'><SelectArrow/></span>: null}
                </div>
            </div>
        )   
    }
    const PuctuationSentence = (punctuation:TReportByStudentGrammarCorrectionItem) => {
        
        return (
            <div className='report-chart-righ-correction-content-item'
            onClick={()=>{
                let correctionDiv:JSX.Element[]=[];
                correctionDiv = punctuation.sentences.map((sentenceItem, sentenceIndex) => {
                    const key1 = 'report-correction-summary-puctuation-'+sentenceIndex+'-div';
                    return <div className='flex flex-row justify-start justify-items-start w-full' key={key1}>
                        <span className='report-tooltip-custom-content-bullet'>{'•'}</span>
                        <span className='grammar-tooltip-custom-content-list-item'>{sentenceItem.map((wordItem , wordIndex) => {

                            const isPunctuationCheck = wordItem.correction_reason.indexOf('punctuation') !== -1
                            const key = key1+'wordItem'+wordIndex+'-'+wordItem.type;
                            if (wordItem.type === 1) {
                                return <span key={key} className={`report-chart-correction-content-add-text ${isPunctuationCheck && '!bg-[#ffea2c]'}`} >{wordItem.word}</span>
                            } else if (wordItem.type === -1 ) {
                                return <span key={key} className={`report-chart-correction-content-delete-text ${isPunctuationCheck && '!bg-[#ffea2c]'}`}>{wordItem.word}</span>
                            } else {
                                return <span key={key} className='grammar-tooltip-custom-content-normal-text'>{wordItem.word}</span>
                            }
                    })}</span></div>
                })
                setCorrectionDiv(correctionDiv)
                setSelectReason('punctuation')
            }}
            >
                <div className='flex flex-row select-none'>
                    <span className={selectReason === 'punctuation' 
                            ? 'report-chart-righ-correction-content-item-title-selected'
                            : 'report-chart-righ-correction-content-item-title'}>
                        {`-`}
                        <span className={selectReason === 'punctuation' 
                            ? 'pl-[4px] underline'
                            : 'pl-[4px]'}>{'punctuation'}
                        </span>
                    </span>
                    <span className='report-chart-righ-correction-content-item-value'>{punctuation.corrections_count}</span>
                    { selectReason === 'punctuation' ? <span className='report-chart-righ-correction-content-item-arrow'><SelectArrow/></span>: null}
                </div>
            </div>
        )   
    }
    const SpellingSentence = (punctuation:TReportByStudentGrammarCorrectionItem) => {
        
        return (
            <div className='report-chart-righ-correction-content-item'
            onClick={()=>{
                let correctionDiv:JSX.Element[]=[];
                
                correctionDiv = punctuation.sentences.map((sentenceItem, sentenceIndex) => {
                    const key1 = 'report-correction-summary-puctuation-'+sentenceIndex+'-div';
                    return <div className='flex flex-row justify-start justify-items-start w-full' key={key1}>
                        <span className='report-tooltip-custom-content-bullet'>{'•'}</span>
                        <span className='grammar-tooltip-custom-content-list-item'>{sentenceItem.map((wordItem , wordIndex) => {
                            console.log('word ==',wordItem)
                            const isSpellingCheck = wordItem.correction_reason.indexOf('spelling') !== -1
                            const key = key1+'wordItem'+wordIndex+'-'+wordItem.type;
                            if (wordItem.type === 1) {
                                return <span key={key} className={`report-chart-correction-content-add-text ${isSpellingCheck && '!bg-[#ffea2c]'}`} >{wordItem.word}</span>
                            } else if (wordItem.type === -1 ) {
                                return <span key={key} className={`report-chart-correction-content-delete-text ${isSpellingCheck && '!bg-[#ffea2c]'}`}>{wordItem.word}</span>
                            } else {
                                return <span key={key} className='grammar-tooltip-custom-content-normal-text'>{wordItem.word}</span>
                            }
                    })}</span></div>
                })
                setCorrectionDiv(correctionDiv)
                setSelectReason('spelling')
            }}
            >
                <div className='flex flex-row select-none'>
                    <span className={selectReason === 'spelling' 
                            ? 'report-chart-righ-correction-content-item-title-selected'
                            : 'report-chart-righ-correction-content-item-title'}>
                        {`-`}
                        <span className={selectReason === 'spelling' 
                            ? 'pl-[4px] underline'
                            : 'pl-[4px]'}>{'spelling'}
                        </span>
                    </span>
                    <span className='report-chart-righ-correction-content-item-value'>{punctuation.corrections_count}</span>
                    { selectReason === 'spelling' ? <span className='report-chart-righ-correction-content-item-arrow'><SelectArrow/></span>: null}
                </div>
            </div>
        )   
    }

    return (
        <div className='report-chart-righ-word-count-div'>
            <div className='report-chart-righ-word-count-title'>
                <span className='report-chart-righ-word-count-title-span select-none'>{'correction summary'}</span>
            </div>
            <div className='report-chart-righ-correction-content'>

                <div className='report-chart-righ-correction-content-wrap-1'>
                    <div className='report-chart-righ-word-count-content-title select-none w-fit'>1st draft</div>
                    <div className='report-chart-righ-correction-content-items'>
                        {item.grammar_correction.grammar && GrammarSentence(item.grammar_correction.grammar)}
                        {item.grammar_correction.spelling && SpellingSentence(item.grammar_correction.spelling)}
                        {item.grammar_correction.punctuation && PuctuationSentence(item.grammar_correction.punctuation)}
                        
                    </div>
                    <div className={'ml-[13px] report-chart-righ-correction-content-wrap-2 w-full'}>
                        {correctionDiv}
                    </div>
                </div>
            </div>
        </div>
    )
}

const ReportTeachersComments = (
    props: {
        teacherComments:TReportByStudentTeacherComment[]
    }
) => {
    const {teacherComments}=props;
    const [viewComment, setViewComment] = React.useState<JSX.Element[]>([]);

    React.useEffect(()=>{
        if (teacherComments.length > 0) {
            let dumpVC:JSX.Element[] = [];
            for (let i = 0; i < teacherComments.length; i ++) {
                if (teacherComments[i].draft_index === 2) {
                    const targetComment = teacherComments[i].comment.split('\n');
                    for (let j = 0; j < targetComment.length; j++) {
                        const key = '2-tcp-item-'+i+'-'+j
                        const viewItem = <span key={key}>{targetComment[j]}</span>
                        // console.log('test ==',targetComment[j])
                        dumpVC.push(viewItem);
                    }
                }
            };
            setViewComment(dumpVC);
        }
    },[teacherComments])
    return (
        <div className='report-chart-righ-word-count-div'>
            <div className='report-chart-righ-word-count-title'>
                <span className='report-chart-righ-word-count-title-span select-none'>{`Teacher's Comments`}</span>
            </div>
            <div className='report-chart-teacher-comment-content-box'>
                {/* <span>{`1st Draft: ${teacherComments[0].draft_index===1? teacherComments[0].comment : teacherComments[1].comment}`}</span> */}
                <span className='report-chart-teacher-comment-content-box-span'>{viewComment.length>0? viewComment: '*강사가 해당 Unit 평가시 입력한 comment'}</span>
            </div>
        </div>
    )
}
const ReportCompletionDateDiv = (
    props: {
        reportByUnitAPIData: TReportByStudent;
        isActivityPage?:boolean;
    }
) => {
    const formatDate = (inputDate: string, split?:string): string => {
        const date = new Date(inputDate);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        // formattedData = 월/일/년도
        // Replace '/' with '.'
        const replaceDate = formattedDate.split('/');
    
        // change locate
        const splitStr = split ? split : '.'
        return `${replaceDate[2]}${splitStr}${replaceDate[0]}${splitStr}${replaceDate[1]}`
    }
    const dates = props.reportByUnitAPIData.completion_date;
    let firstDate = '';
    let secondDate = '';
    for (let i = 0; i < dates.length; i++) {
        if (dates[i].draft_index===1) {
            const date = dates[i].date
            firstDate= `[1st Draft] ${formatDate(date,'-')}`
        } else if (dates[i].draft_index === 2) {
            const date = dates[i].date
            secondDate= `[2nd Draft] ${formatDate(date,'-')}`
        }
    }
    return <div className={props.isActivityPage ? 'absolute bottom-[20px] right-[50px] flex flex-row items-center gap-[5px] h-[9px]':'absolute bottom-[15px] right-[20px] flex flex-row items-center gap-[5px] h-[9px]'}>
        <div className='report-chart-right-complete-date-title font-bold'>{`Completion Date`}</div>
        <div className='report-chart-right-complete-date-title'>{':'}</div>
        <div className='report-chart-right-complete-date-title'>{firstDate}</div>
        <div className='w-[1px] h-[9px] bg-[#bbb]'/>
        <div className='report-chart-right-complete-date-title'>{secondDate}</div>
    </div>
}
const ReportItemComponents = {
    ReportWordCountSummaryComponent,
    ReportCorrectionSummaryComponent,
    ReportTeachersComments,
    ReportCompletionDateDiv
}

export default ReportItemComponents;