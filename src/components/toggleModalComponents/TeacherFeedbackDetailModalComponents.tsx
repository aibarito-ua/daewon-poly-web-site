import * as React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,

} from '@mui/material';
import draftViewBox from '../pageComponents/feedbackComponents/draftFeedback';
import useSparkWritingStore from '../../store/useSparkWritingStore';

export default function TeacherFeedbackDetailModalComponents (props: {
    draftItem: TSparkWritingData,
}) {
    const [open, setOpen] = React.useState(false);
    const {commentFocusId, setCommentFocusId} = useSparkWritingStore();
    const {draftItem} = props;
    const handleOpen = () => {
        console.log('test ==',draftItem)
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    React.useEffect(()=>{
        console.log( 'commentFocusId ==', commentFocusId)
    }, [commentFocusId])
    return (
        <div className='flex'>
            <div className={`draft-teacher-feedback-title-docs-find-button hover:cursor-pointer`}
            onClick={handleOpen}
            />
            <Dialog className=''
            open={open} 
            // onClose={handleClose}
            maxWidth={false}
            PaperProps={{sx: {
                width: '1164px',
                height: '714px',
                backgroundColor: 'rgba(0.4,0,0.2, 0)',
                boxShadow: 'none',
                margin: 0,
                padding: '32px',
            }}}
            >
                <DialogTitle
                    sx={{
                        position: 'relative',
                        backgroundColor: '#7861bb',
                        borderTopLeftRadius: '30px',
                        // border: '6px solid #7861bb'
                        color: 'white',
                        fontFamily: 'GothamRounded',
                        textAlign: 'center',
                        fontSize: '18px',
                        height: '50px',
                        padding:0,
                    }}
                    
                >
                    <div className='relative'>
                        <div className='flex h-[50px] items-center justify-center'>{'Teacher Feedback'}</div>
                        <div className='w-[50px] h-[55px] -top-[25px] -right-[25px] hover:cursor-pointer absolute bg-no-repeat bg-modal-close-button-svg'
                        onClick={handleClose}/>
                    </div>
                </DialogTitle>
                <DialogContent
                    sx={{
                        backgroundColor: '#fff',
                        borderBottomLeftRadius: '30px',
                        borderBottomRightRadius: '30px',
                        border: '6px solid #7861bb',
                        borderTop: 'none',
                        padding:0,
                    }}
                >
                    <div className='flex flex-row h-full'>
                        <div className='wrap-content-2nd-spark-writing flex-1' style={{height: '100%'}}>
                            <div className='teacher-feedback-title-font'>{
                                draftViewBox.loadFeedbackDraftTitle({feedbackDataInStudent:draftItem})
                            }</div>
                            <div className='teacher-feedback-body-font'>{
                                draftViewBox.loadFeedbackDraftBody({feedbackDataInStudent:draftItem})
                            }</div>
                        </div>
                        <div className='flex flex-col w-[340px] bg-[#f4f1fc] gap-[10px] p-[20px]'>
                            {draftItem.draft_1_comment.map((item,draftCommentIndex) => {
                                const key = 'teacherFeedbackModalComment-'+draftCommentIndex
                                return (
                                    <div className={commentFocusId!==item.comment_className 
                                        ?'flex w-[300px] border-[1px] border-[#dbdbdb] bg-white rounded-[15px] p-[10px]'
                                        : 'flex w-[300px] border-[2px] border-[#f1b02e] bg-white rounded-[15px] p-[10px]'
                                    } key={key}
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: '16px',
                                        color: '#333',
                                        lineHeight: 1.38,
                                        textAlign:'left'
                                    }}
                                    onClick={()=>{
                                        setCommentFocusId(item.comment_className);
                                        
                                    }}
                                    >{item.comment}</div>
                                )
                            })}
                        </div>
                    </div>

                </DialogContent>
            </Dialog>
        </div>
    )
}