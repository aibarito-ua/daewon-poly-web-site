import { useCallback } from "react";
import BottomBtns from "./BottomBtns";
import { KOREAN_REGEX, NEW_LINE_REGEX, THREE_OR_MORE_NEW_LINE_REGEX, TWO_OR_MORE_SPACE_REGEX } from "../../../consts";
import { OcrTextType } from "../../../types";
import useLoginStore from "../../../../../../store/useLoginStore";

// const MAX_PC_MODAL_CROPPED_IMG_HEIGHT = 426;
const MAX_PC_CROPPED_IMG_HEIGHT = 552;
/** 552 설정 시 키보드가 textarea 전체를 가리므로 임의 조정값 */
const MAX_PAD_CROPPED_IMG_HEIGHT = 452;

interface IProps {
  fullScreen: boolean;
  croppedImgUrl: string;
  ocrText: string;
  textType: OcrTextType;
  onChangeText: (ocrText: string) => void;
  onChangeImage: (file: File) => void;
  onClickNext: () => void;
}

export default function OcrCompleteArea(props: IProps) {
  const { fullScreen, croppedImgUrl, ocrText, textType, onChangeText, onChangeImage, onClickNext } = props;
  const { isMobile } = useLoginStore();

  const handleChangeText = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (textType === "title" && evt.target.value.match(NEW_LINE_REGEX)) return;

      if (!checkNotAllowCharacters(evt.target.value)) return;
      
      onChangeText(evt.target.value);
  }, [onChangeText, textType]);

  return (
    <>
      <div
        className={fullScreen ? 'ocr-modal-pad-body-box' : 'ocr-modal-pc-body-box'}
      >
        <img
          alt="Crop preview"
          src={croppedImgUrl}
          style={{ margin: "0 auto", objectFit: 'contain', maxHeight: `${isMobile ? MAX_PAD_CROPPED_IMG_HEIGHT : MAX_PC_CROPPED_IMG_HEIGHT}px` }}
        />
        <div className='ocr-modal-textarea-box'>
          <textarea
            className='ocr-modal-textarea'
            value={ocrText}
            onChange={handleChangeText}
          />
        </div>
      </div>
      <BottomBtns
        nextBtnDisabled={ocrText.length === 0}
        fullScreen={fullScreen}
        onChangeImage={onChangeImage}
        onClickNext={onClickNext}
      />
    </>
  );
}

/** 한글, 연속 개행, 연속 공백 체크 */
function checkNotAllowCharacters(text: string) {
  if (text.match(KOREAN_REGEX)) return false;
  if (text.match(TWO_OR_MORE_SPACE_REGEX)) return false;
  if (text.match(THREE_OR_MORE_NEW_LINE_REGEX)) return false;

  return true;
}