import React from 'react';

const ReportWordCountSummaryComponent = (props:{item: TWordCountSummaryItem}) => {
    const {item } = props;
    return (
        <div className='report-chart-righ-word-count-div'>
            <div className='report-chart-righ-word-count-title'>{item.title}</div>
            <div className='report-chart-righ-word-count-content'>

                <div className='report-chart-righ-word-count-content-wrap'>
                    <div className='report-chart-righ-word-count-content-title'>1st drafts</div>
                    <div className='report-chart-righ-word-count-content-items'>
                        {item.draft_1st.map((wordCountSummary1stItem, wordCountSummary1stIndex) => {
                            return (
                                <div key={wordCountSummary1stIndex}
                                className='report-chart-righ-word-count-content-item'>
                                    <span className='report-chart-righ-word-count-content-item-title'>{`- ${wordCountSummary1stItem.label}`}</span>
                                    <span className='report-chart-righ-word-count-content-item-value'>{wordCountSummary1stItem.value}</span>
                                </div>
                            )    
                        })}
                    </div>
                </div>
                
                <div className='report-chart-righ-word-count-content-divide-line'></div>

                <div className='report-chart-righ-word-count-content-wrap'>
                    <div className='report-chart-righ-word-count-content-title'>2nd drafts</div>
                    <div className='report-chart-righ-word-count-content-items'>
                    {item.draft_2nd.map((wordCountSummary2ndItem, wordCountSummary2ndIndex) => {
                            return (
                                <div key={wordCountSummary2ndIndex}
                                className='report-chart-righ-word-count-content-item'>
                                    <span className='report-chart-righ-word-count-content-item-title'>{`- ${wordCountSummary2ndItem.label}`}</span>
                                    <span className='report-chart-righ-word-count-content-item-value'>{wordCountSummary2ndItem.value}</span>
                                </div>
                            )    
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
const ReportCorrectionSummaryComponent = (
    props: {item: TCorrectionSummaryItem}
) => {
    const {item } = props;
    const [selectReason, setSelectReason]= React.useState<"grammar" | "spelling" | "punctuation">('grammar'); 
    const SelectRightArrow = (props:React.SVGAttributes<SVGElement>) => {
        return <svg {...props} width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="Vector 73" d="M1 1L3.5 3.5L1 6" stroke="#21C39A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>        
    }
    return (
        <div className='report-chart-righ-word-count-div'>
            <div className='report-chart-righ-word-count-title'>{item.title}</div>
            <div className='report-chart-righ-correction-content'>

                <div className='report-chart-righ-correction-content-wrap-1'>
                    <div className='report-chart-righ-word-count-content-title'>1st drafts</div>
                    <div className='report-chart-righ-correction-content-items'>
                        {item.correction.map((correctionItem, correctionIndex) => {
                            return (
                                <div key={correctionIndex}
                                className='report-chart-righ-correction-content-item'
                                onClick={()=>{
                                    setSelectReason(correctionItem.reason)
                                }}
                                >
                                    <span className='report-chart-righ-correction-content-item-title'>{`- ${correctionItem.reason}`}</span>
                                    <span className='report-chart-righ-correction-content-item-value'>{correctionItem.list.length}</span>
                                    <span className='report-chart-righ-correction-content-item-arrow'>{correctionItem.reason === selectReason && <SelectRightArrow/>}</span>
                                </div>
                            )    
                        })}
                    </div>
                </div>
                

                <div className='report-chart-righ-correction-content-wrap-2'>
                    {item.correction.map((paragraghItem, paragraghIndex) => {
                        if (paragraghItem.reason === selectReason) {
                            return paragraghItem.list.map((sentenceItem, sentenceIndex) => {
                                return sentenceItem.map((wordItem: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined)[], wordIndex: any) => {
                                    console.log('word ==',wordItem)
                                    const key = paragraghIndex+'-'+sentenceIndex+'-'+wordIndex+'-'+wordItem[0]
                                    if (wordItem[0] === 1) {
                                        return <span key={key} className='report-chart-correction-content-wrap'>
                                            <pre className='report-chart-correction-content-add-text'>{wordItem[1]}</pre>
                                        </span>
                                    } else if (wordItem[0] === -1 ) {
                                        return <span className='report-chart-correction-content-wrap'>
                                            <pre className='report-chart-correction-content-delete-text'>{wordItem[1]}</pre>
                                        </span>
                                    } else {
                                        return <span className='report-chart-correction-content-wrap'>
                                        <pre className='grammar-tooltip-custom-content-normal-text'>{wordItem[1]}</pre>
                                    </span>
                                    }
                                })
                            })
                        } else return null;
                    })}
                    <div className='report-chart-righ-word-count-content-items'>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ReportItemComponents = {
    ReportWordCountSummaryComponent,
    ReportCorrectionSummaryComponent
}

export default ReportItemComponents;