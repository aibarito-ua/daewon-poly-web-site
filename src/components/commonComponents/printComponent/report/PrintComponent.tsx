import React from "react";
import { useReactToPrint } from 'react-to-print';
import useLoginStore from "../../../../store/useLoginStore";
import ReportComponentToPrint from "./PrintReportComponent";
import useControlAlertStore from "../../../../store/useControlAlertStore";
import jsPDF from "jspdf";

const PrintReportExportButton = (props: {
    isActivityPage?:boolean;
})=> {
    const {
        isActivityPage
    } = props;
    const componentRef = React.useRef(null);
    const divRef = React.useRef<HTMLDivElement>(null);
    
    const [replaceBody, setReplaceBody] = React.useState<JSX.Element[][]>([]);
    const [isMulti, setIsMulti] = React.useState<boolean>(false);
    const {userInfo, isMobile} = useLoginStore();
    const {
        reportModalRubricData,
        reportSelectBookName,
        reportSelectFinder,
        reportSelectUnit,
        unitReportData,
        reportByUnitMainTitle,
    } = useControlAlertStore();
    React.useEffect(() => {
        if (divRef.current) {
            console.log('=== print effect ===')
            const checkRef = divRef.current;
            checkRef.style.display='block';
            const oneRowHeight = checkRef.children[0].children[0].clientHeight;
            const clientHeight = checkRef.clientHeight;
            // console.log('clientHeight =',clientHeight)
            // console.log('oneRowHeight =',oneRowHeight)
            let newHeight = oneRowHeight;
            let newTags:JSX.Element[][]=[];
            const minimumPrintTextCountNumber = 490;

            const childRef = checkRef.children;
            for (let i = 0; i < childRef.length; i++) {
                const childRow = childRef[i].children;
                for (let j = 0; j< childRow.length; j++) {
                    const childSpanText = childRow[j].textContent;
                    // console.log('childSpanText[j =',j,'] =',childSpanText)
                    const spanHeight = childRow[j].clientHeight;
                    newHeight += spanHeight;
                    const newtagsLength = newTags.length;
                    const jsxChildSpan:JSX.Element = <span key={childSpanText+'print-'+i+j} className='export-report-wr-oc-input'>{childSpanText}</span>;
                    if (newtagsLength === 0) {
                        // console.log('1 : length 0 push')
                        // 1줄인 경우 길이 체크
                        if (clientHeight > newHeight) {
                            // 박스 높이가 내용보다 큰 경우
                            newTags.push([])
                            newTags[0].push(jsxChildSpan);
                        } else {
                            // 박스 범위를 벗어난 높이인 경우
                            newTags.push([]);
                            const remainingText = childSpanText?.slice(0, minimumPrintTextCountNumber);
                            // console.log('remainingText length =',remainingText?.length)
                            // console.log('remainingText =',remainingText)
                            const remainingSpan = <span key={remainingText+'print-'+i+j} className="export-report-wr-oc-input">{remainingText}</span>;
                            newTags[0].push(remainingSpan);

                            const overflowText = childSpanText?.slice(minimumPrintTextCountNumber);
                            if (overflowText) {
                                newHeight = 0;
                                const overflowSpan = <span key={overflowText+'print-'+i+j} className="export-report-wr-oc-input">{overflowText}</span>;
                                newTags.push([]);
                                newTags[1].push(overflowSpan)
                            } else {
                                newHeight += spanHeight;
                            }
                        }
                        
                    } else if (newtagsLength===1) {
                        const lastIdx = newtagsLength-1;

                        if (clientHeight > newHeight) {
                            // console.log('2 : clientHeight > newHeight push')
                            newTags[lastIdx].push(jsxChildSpan);
                        } else if (clientHeight <= newHeight) {
                            // console.log('3 : clientHeight <= newHeight push')
                            newHeight = 0;
                            newTags.push([]);
                            newTags[lastIdx+1].push(jsxChildSpan);
                        }
                    } else {
                        const lastIdx = newtagsLength-1;
                        if (clientHeight > newHeight) {
                            // console.log('4 :')
                            newTags[lastIdx].push(jsxChildSpan);
                        } else if (clientHeight <= newHeight) {
                            // console.log('5 :')
                            newHeight=0;
                            newTags.push([]);
                            newTags[lastIdx+1].push(jsxChildSpan)
                        }
                    }
                };// for j end
            }// for i end
            checkRef.style.display='none';
            // console.log('newTags.length =',newTags)
            if (newTags.length>1) {
                setIsMulti(true);
            } else {
                setIsMulti(false);
            }
            setReplaceBody(newTags);
        }
    }, [reportSelectUnit, divRef.current])
    React.useEffect(()=>{
        console.log('is Multi =',isMulti)
    },[isMulti])

    const printRegular = useReactToPrint({
        content: () => componentRef.current
    })

    const handlePrint = () => {
        if(isMobile) {
            if (componentRef.current) {
                const doc = new jsPDF('p', 'mm');
                
                // TODO: change font if need
                // doc.setFont('Inter-Regular', 'normal');
        
                doc.html(componentRef.current, {
                    async callback(doc) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({message: 'print', data: doc.output('datauristring')}))
                    },
                    html2canvas: {
                        // TODO: change this, width other values
                        scale: 0.264,
                    }
                })
            }
        } else {
            printRegular()
        }
    }
    const ov_comments = unitReportData.teacher_comments.length> 0 ? (unitReportData.teacher_comments[0].draft_index===2? unitReportData.teacher_comments[0].comment : unitReportData.teacher_comments[1].comment):'';
    const ov_comments_split = ov_comments.split('\n');
    return (
        <div>
            {/* print area */}
            <div style={{display: 'none'}}>
                <div ref={componentRef} className="block w-full h-full">
                    {replaceBody.length> 0 && replaceBody.map((bodyItem, bodyIndex) => {
                        const key = 'print-ref-component-report-'+bodyItem[0].key+bodyIndex
                        const maxCount = replaceBody.length;
                        const currentCount = bodyIndex+1;
                        return <ReportComponentToPrint 
                        key={key}
                        currentOverall={bodyItem}
                        multi={{maxPageNum:maxCount, currentPageNum: currentCount}}
                        isMulti={isMulti}
                        userInfo={userInfo}
                        reportModalRubricData={reportModalRubricData}
                        reportSelectBookName={reportSelectBookName}
                        reportSelectFinder={reportSelectFinder}
                        reportSelectUnit={reportSelectUnit}
                        unitLabel={reportByUnitMainTitle}
                        unitReportData={unitReportData}
                        />

                    })}    
                </div>
            </div>
            {/* print button */}
            <button onClick={reportByUnitMainTitle!==''?handlePrint:()=>{}} className={isActivityPage ? 'bg-btn-report-modal-print-ic-svg bg-cover bg-no-repeat w-[100px] h-[51px]': "bg-tab-print-btn-ic-svg bg-no-repeat w-[100px] h-[48px]"}></button>
            <div style={{display:'none'}} ref={divRef}>
                
                <div className='flex flex-col justify-start items-start w-[200.118mm] h-[20.558mm] border-[0.24mm] rounded-[4.88mm] px-[3.706mm] py-[3.628mm]'>
                    {ov_comments_split.map((ovItem, ovIdx) => {
                        return <span key={ovIdx} className='export-report-wr-oc-input'>{ovItem}</span>
                    })}
                </div> 
            </div>
        </div>
    )
}

export default PrintReportExportButton;