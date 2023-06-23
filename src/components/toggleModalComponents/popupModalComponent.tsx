import React from 'react'

interface IPopupModalComponentProps {
    Message: (string|JSX.Element)[];
    YesMessage: string;
    NoMessage: string;
    onClose: ()=>void;
    onClickYes: ()=>void;
    showFlag: boolean;

    // modal popup position by percent
    positionLeft?: string;
    positionTop?: string;
    positionRight?: string;
    positionBottom?: string;

    closeFlag?: boolean;
    Icon?: JSX.Element;
}
// tailwind
// Modal
// PopupModal
export const PopupModalComponent = (props: IPopupModalComponentProps) => {
    const {
        onClose, onClickYes,
        showFlag, Icon, closeFlag, 
        Message, YesMessage, NoMessage, 
        positionLeft, positionTop, positionRight, positionBottom
    } = props;
    // const default_Icon = <svg className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    // Close Custom Button
    const CloseButton = () => {
        return (
            <button type="button" 
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" 
                onClick={onClose}
                >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
            </button>
        )
    }
    // No Custom Button
    const NoButton = () => {
        return (
            <button 
                onClick={onClose}
                type="button" 
                className={`${YesMessage!==undefined? "save-button ml-2": "save-button"} ${NoMessage===undefined||NoMessage===''? 'hidden':''}`}
            >{NoMessage!==undefined? NoMessage: 'No, cancel'}</button>
        )
    }
    // Yes Custom Button
    const YesButton = () => {
        return (
            <button 
                type="button"
                className={NoMessage!==undefined? "save-button ml-2": "save-button"}
                onClick={onClickYes}
            >{YesMessage!==undefined? YesMessage: "Yes, I'm sure."}</button>
        )
    }
    // Main Modal Popup
    return (
        <div tabIndex={-1} className={`modal-popup-background-div ${showFlag? '':'hidden'}`}>
            <div className="modal-popup-area-div">
                <div className="modal-popup-area-window-div"
                >
                    {closeFlag && <CloseButton/>}
                    <div className="p-6 text-center">
                        {Icon!==undefined && Icon}
                        {/* {Icon===undefined && default_Icon} */}
                        {Message.length !== 0 && Message.map((messageItem:any, msgIndex:number)=>{
                            if (typeof(messageItem) === 'string') {
                                return (
                                    <p key={msgIndex} className="modal-popup-messages-div">{messageItem}</p>
                                )
                            } else {
                                return messageItem
                            }
                        })}
                        {YesMessage !== undefined && <YesButton />}
                        {NoMessage!==undefined && <NoButton/>}
                    </div>
                </div>
            </div>
        </div>
    )
}