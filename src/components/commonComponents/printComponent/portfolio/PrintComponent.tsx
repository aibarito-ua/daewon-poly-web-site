import React from "react";
import useLoginStore from "../../../../store/useLoginStore";
import ReportComponentToPrint from "./PrintPortfolioComponent";
import usePortfolioStore from "../../../../store/usePortfolioStore";
import { useReactToPrint } from "react-to-print";

const PortfolioPrintComponent = (props: {
    
})=> {
    const {
    } = props;
    const componentRef = React.useRef(null);
    const divRef = React.useRef<HTMLDivElement>(null);
    
    const [replaceBody, setReplaceBody] = React.useState<JSX.Element[][]>([]);
    const [isReplace, setIsReplace] = React.useState<boolean>(false);
    const [isMulti, setIsMulti] = React.useState<boolean>(false);
    const [selectUnit, setSelectUnit] = React.useState(0);

    const {userInfo, isMobile} = useLoginStore();
    const {
        displayPortfolioData,
        portfolioModal
    } = usePortfolioStore();

    React.useEffect(() => {
        
        if (portfolioModal.selectUnit !== selectUnit) {
            console.log('222')
            if (divRef.current) {
                const checkRef = divRef.current;
                checkRef.style.display='block';
                const oneRowHeight = checkRef.children[0].children[0].clientHeight; 
                const clientHeight = checkRef.clientHeight
                const offsetHeight = checkRef.offsetHeight;
                
                const scrollHeight = checkRef.scrollHeight;
                console.log('clientHeight =',clientHeight)
                console.log('offsetHeight =',offsetHeight)
                console.log('scrollHeight =',scrollHeight)
                
                let newHeight = oneRowHeight;
                let newTags:JSX.Element[][]=[];
                const childRef = checkRef.children;
                for (let i = 0; i < childRef.length; i++) {
                    const childRow = childRef[i].children;
                    for (let j = 0; j< childRow.length; j++) {
                        const childSpanText = childRow[j].textContent;
                        const spanHeight = childRow[j].clientHeight;
                        console.log('span height =',spanHeight)
                        newHeight += spanHeight;
                        const newtagsLength = newTags.length;
                        const jsxChildSpan = <span className='export-portfolio-body-content-font'>{childSpanText}<br /></span>;
                        if (newtagsLength === 0) {
                            if (clientHeight > newHeight) {
                                newTags.push([])
                                newTags[0].push(jsxChildSpan);
                            }
                        } else if (newtagsLength===1) {
                            const lastIdx = newtagsLength-1;

                            if (clientHeight > newHeight) {
                                newTags[lastIdx].push(jsxChildSpan);
                            } else if (clientHeight <= newHeight) {
                                newHeight = 0;
                                newTags.push([]);
                                newTags[lastIdx+1].push(jsxChildSpan);
                            }
                        } else {
                            const lastIdx = newtagsLength-1;
                            if (clientHeight > newHeight) {
                                newTags[lastIdx].push(jsxChildSpan);
                            } else if (clientHeight <= newHeight) {
                                newHeight=0;
                                newTags.push([]);
                                newTags[lastIdx+1].push(jsxChildSpan)
                            }
                        }
                    };// for j end
                }// for i end
                checkRef.style.display='none';
                if (newTags.length>1) {
                    setIsMulti(true);
                } else {
                    setIsMulti(false);
                }
                setSelectUnit(portfolioModal.selectUnit)
                setIsReplace(true);
                setReplaceBody(newTags);
            }


        } 
        if (!portfolioModal.open) {
            console.log('1111')
            setIsMulti(false);
            setIsReplace(false);
            setReplaceBody([]);
        }
    }, [portfolioModal, isReplace])

    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    })

    const print = () => {
        if(isMobile) {
            if (componentRef.current) {
                const targetRef = componentRef.current as HTMLDivElement;
                window.ReactNativeWebView.postMessage(JSON.stringify({message: 'print', data: targetRef.innerHTML}))
            }
        } else {
            handlePrint()
        }
    }

    return (
        <div>
            {/* print area */}
            <div style={{display: 'none'}} id='test'>
                <div ref={componentRef} className="block w-full h-full" id="print">
                    {replaceBody.length> 0 && replaceBody.map((bodyItem, bodyIndex) => {
                        const key = 'print-ref-component-report-'+bodyIndex
                        const maxCount = replaceBody.length;
                        const currentCount = bodyIndex+1;
                        return <ReportComponentToPrint 
                        key={key}
                        currentOverall={bodyItem}
                        multi={{maxPageNum:maxCount, currentPageNum: currentCount}}
                        isMulti={isMulti}
                        userInfo={userInfo}
                        displayPortfolioData={displayPortfolioData}
                        portfolioModal={portfolioModal}
                        />

                    })}    
                </div>
            </div>
            {/* print button */}
            {/* bg-tab-print-btn-ic-svg bg-no-repeat w-[100px] h-[48px] */}
            <button onClick={print} className={'bg-btn-report-modal-print-ic-svg bg-no-repeat w-[100px] h-[48px]'}></button>
            <div style={{display:'none'}} ref={divRef}>
                
                <div className='flex flex-col justify-start items-start w-[160.588mm] h-[202.676mm]'>
                    {portfolioModal.contentBody.map((ovItem, ovIdx) => {
                        return <span key={ovIdx} className='export-portfolio-body-content-font'>{ovItem}<br/></span>
                    })}
                </div> 
            </div>
        </div>
    )
}

export default PortfolioPrintComponent;