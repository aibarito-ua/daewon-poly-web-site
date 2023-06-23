import React from 'react';
interface IDUMPOutlineItem {
    name:string;
    CheckWriting: string;
    [key:string]: any[]|any;
}

const contentComponent = ( outlineItem: IDUMPOutlineItem ) => {
    const manufactureItem = {...outlineItem};
    const titleKeys = Object.keys(manufactureItem).splice(6,1);
    const titleItems = Object.values(manufactureItem).splice(6,1);
    const keys = Object.keys(manufactureItem).splice(7);
    const items = Object.values(manufactureItem).splice(7);
    // console.log('item =',titleKeys)
    // Title
    const contentTitleComponent = (titleKey:string, titleText:string, keyVal:any) => {
        return (<div className='flex flex-1 w-full mb-4 h-fit max-h-[10vh] justify-center z-0' key={keyVal}>
            <div className='flex flex-row w-11/12 h-fit max-h-full gap-2 text-start'>
                <div className='flex w-1/12 text-xl font-bold text-black p-3'>{`${titleKey}:`}</div>
                <div className='flow-root bg-gray-200 w-full text-xl overflow-y-auto text-black rounded-xl px-4 py-3'><span className='pl-4'/>{titleText}</div>
            </div>
        </div>)
    }
    // Body
    const contentBodyComponent = (itemIndex:number, text:string) => {
        return (<div className='' key={itemIndex}><span className='pl-4'></span>{text}</div>)
    }
    const contentSubBodyComponent = (subItemIndex:string, text:string) => {
        return (<div className='' key={subItemIndex}><span className='pl-4'></span>{text}</div>)
    }

    return (
        <div className='flex flex-1 flex-col w-full h-full pb-4 z-0 overflow-y-auto'>
            {titleKeys.map((keyItem:string, keyIndex:number)=>{
                if (keyItem === 'Title') {
                    return titleItems[keyIndex].map((item:any, itemIndex:number) => {
                        if (typeof(item) !== 'string') {
                            const keyValue = keyIndex+'-'+itemIndex
                            return contentTitleComponent(keyItem, item.text, keyValue)
                        }
                    })
                }
            })}

            <div className='flex flex-col bg-gray-200 text-start w-full h-full max-h-full overflow-y-auto rounded-2xl px-4 z-0'>
            {keys.map((keyItem:string, keyIndex:number)=>{
                return (
                    <div key={keyIndex} className='my-4'>
                    { Array.isArray(items[keyIndex]) && items[keyIndex].map((item:any, itemIndex:number)=>{
                        // console.log(itemIndex / 2)
                        if (typeof(item) !== 'string') {
                            const flagText = Object.keys(item).includes('text')
                            if (flagText) {
                                return contentBodyComponent(itemIndex, item.text)
                            } else {
                                return item.map((subItem:string|TOutlineValues, subItemIndex:number)=>{
                                    if (typeof(subItem) !== 'string') {
                                        const subContentKey = itemIndex+':'+subItemIndex;
                                        return contentSubBodyComponent(subContentKey, subItem.text)
                                    }
                                })
                            }   
                        }  
                    })}
                    </div>
                )
            })}
            </div>
        </div>
    )
}

export default contentComponent;