import { useCallback, useState } from "react"
import Message from "../Message"
import OcrBtn from "./OcrBtn";
import { checkMaxNumberOfWordCharacters, nextLineExists } from "../controller/DraftController";
import { MAX_DRAFT_TITLE_LENGTH } from "../consts";
import { CommonInputValidate } from "../../../../util/common/commonFunctions";
import { showAlertPopup } from "../controller/AlertModalController";

interface IProps {
    title: string;
    onChangeText: (text: string) => void;
}

export const TitleArea = ({ title, onChangeText }: IProps): JSX.Element => {
    const [focused, setFocused] = useState(false);

    const handleChangeText = useCallback((e: React.SyntheticEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        if (!checkMaxNumberOfWordCharacters(value)) {
            showAlertPopup(Message.Popups.MAX_NUMBER_OF_WORD_CHARACTERS);
            return;
        }

        if (nextLineExists(value)) {
            showAlertPopup(Message.Popups.NOT_ALLOWED_NEW_LINE);
            return;
        }

        if (!CommonInputValidate.writingEssayInputTitle(value)) return;

        onChangeText(value);
    }, [onChangeText]);

    const handleConvertTitleOcrText = useCallback((text: string) => {
        onChangeText(title + text);
    }, [onChangeText, title]);

    const handleFocus = useCallback(() => setFocused(true), []);
    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        onChangeText(CommonInputValidate.replaceTextareaBlurCheck(e.currentTarget.value));
    }, []);

    return (
        <div className='ocr-1st-draft-title-box'>
            <div className='ocr-1st-draft-title-text'>Title :</div>
            <div className={focused ? 'ocr-1st-draft-title-input-box ocr-1st-draft-title-input-box-active' : 'ocr-1st-draft-title-input-box'}>
                <input
                    className="ocr-1st-draft-title-input placeholder:text-[#aaa]"
                    placeholder={Message.Captions.OCR_DRAFT_PLACE_HOLDER}
                    value={title}
                    maxLength={MAX_DRAFT_TITLE_LENGTH}
                    onChange={handleChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <OcrBtn
                    inputText={title}
                    textType='title'
                    onConvertOcrText={handleConvertTitleOcrText}
                />
            </div>
        </div>
    )
}