import { useCallback, useRef, useState } from "react"
import Message from "../Message"
import OcrBtn from "./OcrBtn";
import { checkMaxNumberOfContentCharacters, checkMaxNumberOfParagraphCharacters, checkMaxNumberOfWordCharacters } from "../controller/DraftController";
import { CommonInputValidate } from "../../../../util/common/commonFunctions";
import { showAlertPopup } from "../controller/AlertModalController";

interface IProps {
    content: string;
    onChangeText: (text: string) => void;
}

export const ContentArea = ({ content, onChangeText }: IProps): JSX.Element => {
    const [focused, setFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const handleChangeContent = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        const { value } = e.currentTarget;

        // 단어 점검
        if (!checkMaxNumberOfWordCharacters(value)) {
            showAlertPopup(Message.Popups.MAX_NUMBER_OF_WORD_CHARACTERS);
            return;
        }

        // 단락 점검
        if (!checkMaxNumberOfParagraphCharacters(value)) {
            showAlertPopup(Message.Popups.MAX_NUMBER_OF_PARAGRAPH_CHARACTERS);
            return;
        }

        // 본문 점검
        if (!checkMaxNumberOfContentCharacters(value)) {
            showAlertPopup(Message.Popups.MAX_NUMBER_OF_CHARACTERS);
            return;
        }

        if (!CommonInputValidate.writingEssayInputBody(value)) return;

        onChangeText(value);
    }, [onChangeText]);

    const handleConvertContentOcrText = useCallback((text: string) => {
        onChangeText(content + text);
    }, [content, onChangeText]);

    const handleFocus = useCallback(() => setFocused(true), []);
    const handleBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
        setFocused(false);
        onChangeText(CommonInputValidate.replaceTextareaBlurCheck(e.currentTarget.value));
    }, []);

    const handleClickPlaceHolder = useCallback(() => {
        if (focused) return;

        textareaRef.current?.focus();
    }, [focused]);

    return (
        <div className={focused ? 'ocr-1st-draft-content-box ocr-1st-draft-content-box-active' : 'ocr-1st-draft-content-box'}>
            <textarea
                ref={textareaRef}
                className='ocr-1st-draft-content-textarea placeholder:text-[#aaa]'
                value={content}
                onChange={handleChangeContent}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            {content.length === 0 && <div className='ocr-1st-draft-content-place-holder' onClick={handleClickPlaceHolder}>{Message.Captions.OCR_DRAFT_PLACE_HOLDER}</div>}
            <OcrBtn
            inputText={content}
            textType='content'
            className='absolute right-[56px]'
            onConvertOcrText={handleConvertContentOcrText}
            />
        </div>
    )
}