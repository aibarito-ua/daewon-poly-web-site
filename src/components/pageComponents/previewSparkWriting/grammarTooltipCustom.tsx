import React from 'react';
import { 
    autoUpdate,
    flip,
    offset,
    useFloating,
    shift,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    FloatingPortal, 
    useClick,
} from '@floating-ui/react'
import type {Placement} from '@floating-ui/react'

interface IGrammarTooltipCustomProps {
    mainTagkey: string;
    textTagid: string;
    tagType: string; // "add" or "delete"
    compareResultText: string;
    tooltipText: (string|JSX.Element)[];
    
    acceptEventFunction: Function;
    ignoreEventFunction: Function;

    thisIndex: number[];
    
    deleteTagString?: string;
    changeTagString?:string;
    beforeDeleteId?: string;

    [key:string]: any;
}
const GrammarTooltipCustom = (props: IGrammarTooltipCustomProps) => {
    const {
        mainTagkey,
        textTagid,
        tagType,
        compareResultText,
        tooltipText,

        acceptEventFunction,
        ignoreEventFunction,
        changeTagString,
        beforeDeleteId,
        deleteTagString,
        // changeId,
        thisIndex
    } = props;
    const [isOpen, setIsOpen] = React.useState(false);
    const [placement, setPlacement] = React.useState<Placement>('bottom-start');
    React.useEffect(()=>{
        // console.log('tooltip opened', thisIndex)
        const target = document.getElementById(textTagid);
        const windowXWidth = document.getElementById('root')?.clientWidth;
        let targetLeft = target?.getBoundingClientRect().left !== undefined ? target?.getBoundingClientRect().left : 0;
        let testWidth = windowXWidth !== undefined ? windowXWidth : 0;
        let testValue = targetLeft/testWidth > 0.6;
        if (testValue) {
            setPlacement('bottom-end')
        } else {
            setPlacement('bottom-start')
        }
    })

    const {refs, floatingStyles, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(10),
            flip({
                // crossAxis: placement.includes("-"),

                fallbackAxisSideDirection: "end",
                padding: 20
            }),
            shift({ padding: 20 })
        ]
    });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const click = useClick(context);
    // Role props for screen readers
    const role = useRole(context, {role: 'tooltip'});
    // Merge all the interactions into prop getters
    const {getReferenceProps, getFloatingProps} = useInteractions([
        focus,
        dismiss,
        role,
        click
    ]);
    return (
        <span key={mainTagkey} 
        className={`font-sans inline-block whitespace-pre-line hover:cursor-pointer ${tagType==='delete'? 'line-through': ''} ${tagType==='add'? 'text-[#14b690]':'text-[#ffc4cc]'}`}>
            <span id={textTagid}
            ref={refs.setReference} {...getReferenceProps()}
            >{compareResultText}
                {/* <span className={`font-sans inline-block whitespace-pre-line ${tagType==='delete'? 'line-through': ''}`}>{compareResultText}</span> */}
            </span>
            <FloatingPortal>
                {isOpen && (
                    <span
                        className='grammar-tooltip-custom justify-center'
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps}
                    >
                        <span className='flex w-full text-xs text-black'>{tooltipText[0]}</span>
                        <span className='flex w-full justify-center py-2 px-4'>{tooltipText[1]}</span>
                        {tagType==='add' && (
                            <span className='grammar-tooltip-custom-popup'>
                                <button className='grammar-tooltip-custom-popup-accept' onClick={()=>{
                                    acceptEventFunction(textTagid,changeTagString, beforeDeleteId, thisIndex)
                                    setIsOpen(false)
                                }}>Accept</button>
                                <button className='grammar-tooltip-custom-popup-ignore' onClick={()=>{
                                    ignoreEventFunction(textTagid, deleteTagString, beforeDeleteId, thisIndex)
                                    setIsOpen(false)
                                }}>Ignore</button>
                            </span>
                        )}
                        {tagType==='delete' && (
                            <span className='grammar-tooltip-custom-popup'>
                                <button className='grammar-tooltip-custom-popup-accept' onClick={()=>{
                                    acceptEventFunction()
                                    setIsOpen(false)
                                }}>Accept</button>
                                <button className='grammar-tooltip-custom-popup-ignore' onClick={()=>{
                                    ignoreEventFunction()
                                    setIsOpen(false)
                                }}>Ignore</button>
                            </span>
                        )}
                        
                    </span>
                )}
                
            </FloatingPortal>
        </span>
    )
}

export default GrammarTooltipCustom;