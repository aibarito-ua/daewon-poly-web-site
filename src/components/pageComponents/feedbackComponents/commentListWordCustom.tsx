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
import useSparkWritingStore from '../../../store/useSparkWritingStore';

interface ICommentListWordCustomProps {
    mainTagkey: string;
    comment:string;
    commentClassName:string;
    [key:string]: any;
}
const CommentListWordCustom = (props: ICommentListWordCustomProps) => {
    const {
        mainTagkey,
        commentClassName,
        comment
    } = props;
    const [isOpen, setIsOpen] = React.useState(false);
    const {commentFocusId, setCommentFocusId} = useSparkWritingStore();
    React.useEffect(()=>{
        if (setCommentFocusId) {
            if (isOpen) {
                console.log('tooltip main key ')
                setCommentFocusId(commentClassName)
            } else {
                setCommentFocusId('')
            }
        }
        console.log('isOpen =',commentClassName)
    }, [isOpen])
    React.useEffect(()=>{
        if (commentFocusId === commentClassName) {
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
    }, [commentFocusId])

    const {refs, floatingStyles, context} = useFloating({
        
        open: isOpen,
        onOpenChange: setIsOpen,
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
        // <span key={mainTagkey} 
        // className={`whitespace-pre-line hover:cursor-pointer z-[9999] relative rounded-[5px]`}>
        //     <span id={textTagid}
        //     ref={refs.setReference} {...getReferenceProps()}
        //     className={isOpen ? 'border-[2px] border-[#f1b02e] rounded-[2px]':'border-0 hover:border-[2px] hover:border-[#f1b02e] rounded-[2px]'}
        //     >{compareResultText}</span>
        //     <FloatingPortal>
        //         {isOpen && (
        //             <span
        //                 className='draft-hover-tooltip-content-wrap'
        //                 ref={refs.setFloating}
        //                 style={floatingStyles}
        //                 {...getFloatingProps}
        //             >
        //                 <span className='flex w-full justify-center'>{tooltipText}</span>
        //             </span>
        //         )}
                
        //     </FloatingPortal>
        // </span>
        <div className={!isOpen 
            ?'flex w-[300px] border-[1px] border-[#dbdbdb] bg-white rounded-[15px] p-[10px]'
            : 'flex w-[300px] border-[2px] border-[#f1b02e] bg-white rounded-[15px] p-[10px]'
        } key={mainTagkey}
        ref={refs.setReference} {...getReferenceProps()}
        style={{
            fontFamily: 'Roboto',
            fontSize: '16px',
            color: '#333',
            lineHeight: 1.38,
            textAlign:'left'
        }}
        onClick={()=>{
            setIsOpen(true)
        }}
        
        >{comment}
            <FloatingPortal></FloatingPortal>
        </div>
    )
}

export default CommentListWordCustom;