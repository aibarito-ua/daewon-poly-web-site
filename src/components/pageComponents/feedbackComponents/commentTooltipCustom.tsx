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
    useHover,
} from '@floating-ui/react'
import type {Placement} from '@floating-ui/react'
import useSparkWritingStore from '../../../store/useSparkWritingStore';

interface IGrammarTooltipCustomProps {
    mainTagkey: string;
    // textTagid: string;
    compareResultText: string|JSX.Element;
    tooltipText: string;

    // thisIndex: number[];
    
    [key:string]: any;
}
const CommentTooltipCustom = (props: IGrammarTooltipCustomProps) => {
    const {
        mainTagkey,
        textTagid,
        compareResultText,
        tooltipText
    } = props;
    const [isOpen, setIsOpen] = React.useState(false);
    const [placement, setPlacement] = React.useState<Placement>('bottom-start');
    const {commentFocusId, setCommentFocusId} = useSparkWritingStore();
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
    React.useEffect(()=>{
        if (setCommentFocusId) {
            if (isOpen) {
                setCommentFocusId(mainTagkey)
            } else {
                setCommentFocusId('')
            }
        }
        console.log('tooltip main key ',mainTagkey)
        console.log('isOpen =',isOpen,)
    }, [isOpen])
    React.useEffect(()=>{
        if (commentFocusId === mainTagkey) {
            setIsOpen(true)
            refs.domReference.current?.scrollIntoView({
                behavior: "auto",
                block: 'nearest'
            })
        } else {
            setIsOpen(false)
        }
    }, [commentFocusId])

    const {refs, floatingStyles, context} = useFloating({
        
        open: isOpen,
        onOpenChange: setIsOpen,
        placement,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(10),
            flip({
                // crossAxis: placement.includes("-"),

                // fallbackAxisSideDirection: "end",
                fallbackPlacements:['top-start','right','bottom-start'],
                padding: 20
            }),
            shift({ padding: 20 }),
            
        ],
        
    });
    const focus = useFocus(context,{
        keyboardOnly:false,
        enabled:true
    });
    const dismiss = useDismiss(context);
    const click = useClick(context);
    // const hover = useHover(context);
    // Role props for screen readers
    const role = useRole(context, {role: 'tooltip'});
    // Merge all the interactions into prop getters
    const {getReferenceProps, getFloatingProps} = useInteractions([
        focus,
        dismiss,
        role,
        // hover,
        click,
        
        
    ]);
    return (
        <span key={mainTagkey} 
        className={`whitespace-pre-line hover:cursor-pointer z-[9999] relative rounded-[5px]`}>
            <span id={textTagid}
            ref={refs.setReference} {...getReferenceProps()}
            className={isOpen ? 'border-[2px] border-[#f1b02e] rounded-[2px]':'border-0 hover:border-[2px] hover:border-[#f1b02e] rounded-[2px]'}
            >{compareResultText}</span>
            <FloatingPortal>
                {isOpen && (
                    <span
                        className='draft-hover-tooltip-content-wrap'
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps}
                    >
                        <span className='flex w-full justify-center'>{tooltipText}</span>
                    </span>
                )}
                
            </FloatingPortal>
        </span>
    )
}

export default CommentTooltipCustom;