import * as React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,

} from '@mui/material';
import useControlAlertStore from '../../store/useControlAlertStore';


export default function ReturnFeedbackModalComponent (

) {
    const {
        return1stDraftReasonAlert, setReturn1stDraftReasonAlertOpen,
    } = useControlAlertStore();
    React.useEffect(() => {

    },[])
    const handleClose = () => {
        setReturn1stDraftReasonAlertOpen({openFlag:false, returnReason:'', returnTeacherComment:''})
    }
    const noButtonHandler = async () => {
        if (return1stDraftReasonAlert.NoEvent) {
            handleClose();
            await return1stDraftReasonAlert.NoEvent();
        }
    }
    const yesButtonHandler = async () => {
        if (return1stDraftReasonAlert.yesEvent) {
            handleClose();
            await return1stDraftReasonAlert.yesEvent();
        }

    }

    return (
        <div className='flex ' >
            <Dialog className=''
            PaperProps={{sx: {
                borderRadius: '20px',
                paddingX: '25px',
                paddingY:'0px',
                width: '500px',
                height: '623.4px',
            }}}
            open={return1stDraftReasonAlert.openFlag}
            // onClose={handleClose}
            >
                <DialogTitle
                    sx={{
                        borderBottom: '1px solid #ddd',
                        fontFamily: 'Roboto',
                        fontSize: '16px',
                        color: '#222',
                        fontWeight: 600,
                        textAlign: 'left',
                        fontStretch: 'normal',
                        letterSpacing: 'normal',
                        lineHeight: 'normal',
                        paddingBottom: '30px',
                        paddingTop: '32px',
                        paddingLeft: '13px',
                        userSelect: 'none'
                    }}
                ><div className='h-fit'>
                    <div>{'Your teacher has returned your writing'}</div>
                    <div>{'for the following reason(s):'}</div>
                </div></DialogTitle>
                <DialogContent className='flex flex-1 flex-col'
                sx={{padding:0}}>
                    <div className='return-1st-draft-alert-return-reason'>{return1stDraftReasonAlert.returnReason}</div>
                    <div className='flex flex-col'>
                        <div className='return-1st-draft-alert-teacher-comment-title'>{`teacher's comment`}</div>
                        <textarea className='return-1st-draft-alert-teacher-comment-content' 
                            readOnly
                            value={return1stDraftReasonAlert.returnTeacherComment}
                        />
                    </div>
                    <div className='mt-[29px] mb-[28px]' style={{
                        fontFamily: 'Roboto',
                        fontSize: '16px',
                        color: '#222',
                        fontWeight: 'normal',
                        textAlign: 'center',
                        fontStretch: 'normal',
                        letterSpacing: 'normal',
                        lineHeight: 'normal',

                    }}>{`Do you want to redo your writing now?`}</div>
                    <div className='flex flex-row justify-center gap-[12px]'>
                        <div className='return-1st-draft-alert-button-no' onClick={noButtonHandler}>{'No'}</div>
                        <div className='return-1st-draft-alert-button-yes' onClick={yesButtonHandler}>{'Yes'}</div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}