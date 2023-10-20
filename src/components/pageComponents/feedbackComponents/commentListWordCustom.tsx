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
    const {commentFocusIdInModal, setCommentFocusIdInModal} = useSparkWritingStore();
    const [placement, setPlacement] = React.useState<Placement>('bottom-start');
    
    React.useEffect(()=>{
        if (setCommentFocusIdInModal) {
            if (isOpen) {
                console.log('tooltip main key ')
                setCommentFocusIdInModal(commentClassName)
            } else {
                setCommentFocusIdInModal('')
            }
        }
        console.log('isOpen =',commentClassName)
    }, [isOpen])
    React.useEffect(()=>{
        if (commentFocusIdInModal === commentClassName) {
            setIsOpen(true)
            refs.domReference.current?.scrollIntoView({
                behavior: "auto",
                block: 'nearest'
            })
        } else {
            setIsOpen(false)
        }
    }, [commentFocusIdInModal])

    React.useEffect(()=>{
        // console.log('tooltip opened', thisIndex)
        const target = document.getElementById(mainTagkey+'-inModal');
        const windowXWidth = document.getElementById('teacher-feedback-detail-modal-content-left')?.clientWidth;
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
        // onClick={()=>{
        //     setIsOpen(true)
        // }}
        >{comment}
            <FloatingPortal></FloatingPortal>
        </div>
    )
}

export default CommentListWordCustom;