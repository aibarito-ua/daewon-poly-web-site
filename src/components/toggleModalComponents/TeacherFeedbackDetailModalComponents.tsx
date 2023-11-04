import * as React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,

} from '@mui/material';
import draftViewBox from '../pageComponents/feedbackComponents/draftFeedback';
import useSparkWritingStore from '../../store/useSparkWritingStore';
import CommentListWordCustom from '../pageComponents/feedbackComponents/commentListWordCustom';

export default function TeacherFeedbackDetailModalComponents (props: {
    draftItem: TSparkWritingData,
}) {
    const [open, setOpen] = React.useState(false);
    const {commentFocusIdInModal, setCommentFocusIdInModal} = useSparkWritingStore();
    const {draftItem} = props;
    const handleOpen = () => {
        // console.log('test ==',draftItem)
        // console.log('draftItem.draft_1_comment =',draftItem.draft_1_comment)
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    React.useEffect(()=>{
        // console.log( 'commentFocusIdInModal ==', commentFocusIdInModal)
    
    }, [commentFocusIdInModal])
    return (
        <div className='flex'>
            <div className={draftItem.draft_1_comment.length > 0 ? `draft-teacher-feedback-title-docs-find-button hover:cursor-pointer`: 'hidden'}
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
                        <div className='w-[50px] h-[55px] -top-[25px] -right-[25px] hover:cursor-pointer absolute bg-no-repeat bg-contain bg-modal-close-button-svg'
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
                        overflow: 'hidden'
                    }}
                >
                    <div className='flex flex-row'>
                        <div className='wrap-content-2nd-spark-writing-teacher-modal flex-1'
                            id={'teacher-feedback-detail-modal-content-left'}
                        >
                            <div className='flex flex-col h-full'>
                                <div className='teacher-feedback-title-font items-center'>{
                                    draftViewBox.loadFeedbackDraftTitle({feedbackDataInStudent:draftItem,usePage:'Modal'})
                                }</div>
                                <div className='teacher-feedback-body-font py-[20px]'>{
                                    draftViewBox.loadFeedbackDraftBody({feedbackDataInStudent:draftItem,usePage:'Modal'})
                                }</div>
                            </div>
                        </div>
                        <div className='flex flex-col w-[340px] h-[594px] overflow-y-scroll'>
                            <div className='flex flex-col w-[340px] bg-[#f4f1fc] gap-[10px] p-[20px] h-fit'>
                                
                                {draftItem.draft_1_comment.map((item,draftCommentIndex) => {
                                    const key = 'teacherFeedbackModalComment-'+draftCommentIndex
                                    return <CommentListWordCustom 
                                        comment={item.comment}
                                        commentClassName={item.comment_className}
                                        mainTagkey={key}
                                    />
                                })}
                            </div>
                        </div>
                    </div>

                </DialogContent>
            </Dialog>
        </div>
    )
}