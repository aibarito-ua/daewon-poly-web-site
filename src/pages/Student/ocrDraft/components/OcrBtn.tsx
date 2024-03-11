import { useCallback, useRef } from "react";
import { showOcrModal } from "../controller/OcrController";
import { OcrTextType } from "../types";

interface IProps {
  textType: OcrTextType;
  inputText: string;
  className?: string;
  onConvertOcrText: (ocrText: string) => void;
}

const OcrBtn = (props: IProps): JSX.Element => {
  const { textType, inputText, className, onConvertOcrText } = props;

  const inputFileRef = useRef<HTMLInputElement>(null);
  
  const handleClick = useCallback(() => inputFileRef.current?.click(), []);

  const handleChangeImgFile = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files || evt.target.files.length === 0) return;

    showOcrModal(evt.target.files[0], textType, inputText).then((convertedText) => onConvertOcrText(convertedText ?? ''));
    // 이벤트가 동작하지 않을 경우 reset 처리
    evt.target.value = '';
}, [inputText, onConvertOcrText, textType]);

  return (
    <button className={className ? `ocr-1st-draft-ocr-btn ${className}` : 'ocr-1st-draft-ocr-btn'} onClick={handleClick}>
      <input
        ref={inputFileRef}
        type='file'
        hidden
        accept='image/jpeg, image/png'
        // capture="environment" // capture camera
        onChange={handleChangeImgFile}
      />
    </button>
  );
};

export default OcrBtn;
