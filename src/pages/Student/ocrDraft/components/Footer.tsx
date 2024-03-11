import { useCallback } from 'react';

interface IProps {
    previewBtnVisible: boolean;
    saveBtnVisible: boolean;
    onClickPreviewBtn: () => void;
    onClickSaveBtn: () => void;
}

export const Footer = ({ previewBtnVisible, saveBtnVisible, onClickPreviewBtn, onClickSaveBtn }: IProps): JSX.Element => {
    const handleClickSaveBtn = useCallback(() => {
        if (!saveBtnVisible) return;

        onClickSaveBtn();
    }, [onClickSaveBtn, saveBtnVisible]);

    const handleClickPreviewBtn = useCallback(() => {
        if (!previewBtnVisible) return;

        onClickPreviewBtn();
    }, [onClickPreviewBtn, previewBtnVisible]);

    return (
        <div className={`buttons-div ${(previewBtnVisible|| saveBtnVisible)? '': ''}`}>
            <div className={`${saveBtnVisible?'save-button-active div-to-button-hover-effect':'save-button'}`} onClick={handleClickSaveBtn}>Save</div>
            <div className={`${previewBtnVisible?'save-button-active div-to-button-hover-effect':'save-button'}`} onClick={handleClickPreviewBtn}>Preview</div>
        </div>
    )
}