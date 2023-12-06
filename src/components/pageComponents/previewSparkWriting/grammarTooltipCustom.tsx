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
    compareResultText: string|JSX.Element;
    tooltipText: (string|string[]|JSX.Element)[];
    
    acceptEventFunction: Function;
    ignoreEventFunction: Function;

    thisIndex: number[];
    
    deleteTagString?: string;
    changeTagString?:string;
    beforeDeleteId?: string;

    addEmpty?: 'before'|'after'|undefined;

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
        thisIndex,
        addEmpty,
    } = props;
    const [isOpen, setIsOpen] = React.useState(false);
    const [placement, setPlacement] = React.useState<Placement>('bottom-start');
    React.useEffect(()=>{
        // console.log('tooltip opened', thisIndex)
        // console.log('tooltipText =',tooltipText)
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
    const RedArrow = (props:React.SVGAttributes<SVGElement>) => {
        return (
            <svg {...props} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="arrow">
            <path id="Vector 70" d="M13 19L16.2929 15.7071C16.6834 15.3166 16.6834 14.6834 16.2929 14.2929L13 11" stroke="#EB3A3A" strokeWidth="2" strokeLinecap="round"/>
            </g>
            </svg>
        )
    }
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
    // console.log(compareResultText.toString().length)
    // console.log('compareResultText=[',compareResultText,']')
    const displayResultText = compareResultText!==' ' ? compareResultText : <span>&nbsp;</span>
    return (
        <span key={mainTagkey} 
        className={`whitespace-pre-line hover:cursor-pointer rounded-[5px] 
            ${tagType==='delete'? 'line-through': ''} 
            ${tagType==='add'? 'text-[#00be91] bg-[#def4e7]':'text-[#eb3a3a] bg-[#ffe8e8]'}
            ${addEmpty!==undefined && (
                addEmpty==='before'? 'ml-[3px]': (addEmpty==='after'? 'mr-[3px]':'')
            )} `}>
            <span id={textTagid}
            ref={refs.setReference} {...getReferenceProps()}
            >{compareResultText.toString().length===0 ? ' ' : compareResultText } 
            </span>
            <FloatingPortal>
                {isOpen && (
                    <span
                        className='grammar-tooltip-custom justify-center'
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps}
                    >
                        <span className='grammar-tooltip-custom-title capitalize'>{tooltipText[0]}</span>
                        {typeof(tooltipText[1])==='string'? (
                            <span className='flex w-full justify-center'>{tooltipText[1]}</span>
                        ): tooltipText[1]}
                        
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