import { CommonFunctions } from '../../../util/common/commonFunctions';

const contentComponent = ( outlineItem: TSparkWritingData, draftStatus: string ) => {
    if (draftStatus!=='') {

        const manufactureItem:TSparkWritingDataOutline[] = draftStatus==='1'
            ? JSON.parse(JSON.stringify(outlineItem.draft_1_outline))
            :JSON.parse(JSON.stringify(outlineItem.draft_2_outline));
        const titleItem = manufactureItem.splice(0, 1);
        const bodyItemDump = manufactureItem.splice(0);
        const bodyItemNames = CommonFunctions.outlineNameLists(bodyItemDump)
        const bodyItem:TSparkWritingDataOutline[][] = CommonFunctions.outlineDataFormRemake(bodyItemNames, bodyItemDump);
        // console.log('bodyItemNames =',bodyItem)
        
        // Title
        const contentTitleComponent = (titleText:string, keyVal:any) => {
            return (<div className='flex flex-1 w-full h-fit justify-center z-0' key={keyVal}>
                <div className='flex flex-row w-full h-fit max-h-full text-center'>
                    <div className='flow-root w-full overflow-y-auto'>
                        <span>
                            <pre className='preview-text-pre'>{titleText}</pre>
                        </span>
                    </div>
                </div>
            </div>)
        }
        // Body
        const contentBodyComponent = (itemIndex:number, text:string, paddingStr:string) => {
            console.log('text=',text)
            let textSplit = text.split('\n');
            return (<span className={`flex flex-col ${paddingStr}`} key={itemIndex}>
                {textSplit.map((splitedText, splitedIndex)=>{
                    const innerSplitTagKey = itemIndex+'-'+splitedIndex
                    if (splitedText === '') {
                        return <span className='preview-body-text-pre-empty' key={innerSplitTagKey}></span>
                    } else {
                        return <span className='preview-body-text-pre' key={innerSplitTagKey}>{splitedText}</span>
                    }
                })}
            </span>)
        }
        // draft 2 body
        const contentBodyComponent2 = (itemIndex:number, text:string, paddingStr:string) => {
            const textArr = text.split('\n');
            console.log('textArr=',textArr)
            return textArr.map((textItem, textItemIndex)=>(
                <span className={`flex pb-[20px] w-[1160px] max-w-[1160px] overflow-hidden ${paddingStr}`} key={itemIndex+'-draft-2-'+textItemIndex}>
                    <span className='preview-body-text-pre w-[1160px] max-w-[1160px]'>{textItem}</span>
                </span>
            ));
        }
        console.log('bodyItem =',bodyItem)
        return (
            <div className='flex flex-1 flex-col w-full h-full pt-[24px] px-[12px] z-0 overflow-y-auto'>
                
                {titleItem[0].name.toLocaleLowerCase()==='title' && contentTitleComponent(titleItem[0].input_content, titleItem[0].name+titleItem[0].order_index)}
                <div className='flex flex-col text-start w-full h-full max-h-full pt-[26px] overflow-y-auto z-0'>
                    {draftStatus==='1' && bodyItem.map((item, itemIndex) => {
                        
                        return (
                            <div key={itemIndex} className='pb-[20px]'>
                                {item.map((innerItem, innerItemIndex)=>{
                                    return contentBodyComponent(innerItemIndex, innerItem.input_content, '')
                                })}
                            </div>
                        )
                    })}
                    {draftStatus==='2' && bodyItem.map((item, itemIndex) => (
                        // 2024 03 22 : 모든 텍스트는 입력 당시의 포멧으로 사용 ( 추가 변형은 모두 삭제 )
                        // <div key={itemIndex} className='pb-[20px]'>
                        //     {item.map((innerItem, innerItemIndex)=> contentBodyComponent2(innerItemIndex, innerItem.input_content, '') )}
                        // </div>
                        <div key={itemIndex} className='pb-[20px]'>
                            {item.map((innerItem, innerItemIndex)=>{
                                return contentBodyComponent(innerItemIndex, innerItem.input_content, '')
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    } else return null;
}

export default contentComponent;