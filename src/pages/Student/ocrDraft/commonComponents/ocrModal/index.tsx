import { useEffect, useState, useCallback} from "react";
import Dialog from "@mui/material/Dialog";
import useControlAlertStore from "../../../../../store/useControlAlertStore";
import OcrImgCropArea from "./components/OcrImgCropArea";
import OcrCompleteArea from "./components/OcrCompleteArea";
import { getFileToBase64 } from "../../controller/OcrController";
import { OcrTextType } from "../../types";
import { checkMaxNumberOfContentCharacters, checkMaxNumberOfParagraphCharacters, checkMaxNumberOfTitleCharacters, checkMaxNumberOfWordCharacters } from "../../controller/DraftController";
import Message from "../../Message";
import { showAlertPopup, showConfirmPopup } from "../../controller/AlertModalController";
import { CONTINUOUS_SPECIAL_CHARACTERS_REGEX, DOUBLE_QUATES_REGEX, LAST_NEW_LINE_REGEX, LAST_SPACE_REGEX, NOT_ALLOWED_CHARACTERS_REGEX, SPECIAL_CHARACTERS_SPACE_REGEX } from "../../consts";
import { MAX_IMAGE_PAD_HEIGHT, MAX_IMAGE_PAD_WIDTH, MAX_IMAGE_PC_HEIGHT, MAX_IMAGE_PC_WIDTH, isAlwaysFullScreenOcrModal } from "./consts";
import { CommonInputValidate } from "../../../../../util/common/commonFunctions";

const MAX_DISPLAY_SPECIAL_CHARACTERS = 10;

export default function OcrModalComponent() {
  const { ocrModalData, setOcrModalData } = useControlAlertStore();

  const [originImgSrc, setOriginImgSrc] = useState<string>("");
  const [croppedImgUrl, setCroppedImgUrl] = useState<string | undefined>();
  const [ocrText, setOcrText] = useState<string>("");

  useEffect(() => {
    if (!ocrModalData.imgFile) return;
    
    const imageHeight = isAlwaysFullScreenOcrModal() ? MAX_IMAGE_PAD_HEIGHT : MAX_IMAGE_PC_HEIGHT;
    const imageWidth = isAlwaysFullScreenOcrModal() ? MAX_IMAGE_PAD_WIDTH : MAX_IMAGE_PC_WIDTH;
    getFileToBase64(ocrModalData.imgFile, imageWidth, imageHeight).then((base64) => setOriginImgSrc(base64));
  }, [ocrModalData.imgFile]);

  const handleChangeImgFile = useCallback((file: File) => {
    const imageHeight = isAlwaysFullScreenOcrModal() ? MAX_IMAGE_PAD_HEIGHT : MAX_IMAGE_PC_HEIGHT;
    const imageWidth = isAlwaysFullScreenOcrModal() ? MAX_IMAGE_PAD_WIDTH : MAX_IMAGE_PC_WIDTH;
    getFileToBase64(file, imageWidth, imageHeight).then((base64) => setOriginImgSrc(base64));
    setCroppedImgUrl(undefined);
  }, []);

  const closeModal = useCallback(() => {
    setOcrModalData({ openFlag: false, imgFile: undefined });

      // reset
      URL.revokeObjectURL(originImgSrc);
      URL.revokeObjectURL(croppedImgUrl || "");
      setCroppedImgUrl(undefined);
      setOcrText("");
  }, [setOcrModalData]);

  const handleClose = useCallback(() => {
    showConfirmPopup({
      messages: Message.Popups.EXIT_OCR_MODAL,
      alertType: 'continue',
      btnNames: ['Yes', 'No'],
      yesIdx: 0,
      yesCb: () => closeModal(),
    });
  }, [croppedImgUrl, originImgSrc, setOcrModalData]);

  const handleNext = useCallback(() => {
    const { textType } = ocrModalData;
    if (!textType) return;

    const inputText = ocrModalData.inputText ?? "";
    if (!validateTitle(textType, inputText, ocrText)) return;

    if (!validateContent(textType, inputText, ocrText)) return;

    if (ocrModalData.onResOcrEvent) {
      let resultText = ocrText;
      if (textType === "title" && inputText.length > 0 && !LAST_SPACE_REGEX.test(inputText)) {
        resultText = " " + ocrText;
      } else if ("content" && inputText.length > 0 && !LAST_NEW_LINE_REGEX.test(inputText)) {
        resultText = "\n" + ocrText;
      }
      ocrModalData.onResOcrEvent(resultText);
    }

    closeModal();
  }, [handleClose, ocrModalData, ocrText]);

  const handleConvertOcrText = useCallback((croppedImgUrl: string, ocrText: string) => {
    const adjustText = CommonInputValidate.replaceTextareaBlurCheck(ocrText.replace(NOT_ALLOWED_CHARACTERS_REGEX, "").replace(/\n/g, " "));

    if (adjustText.trim().length === 0) {
      showAlertPopup(Message.Popups.OCR_PROCESSING_FAILED);
      return;
    }

    setCroppedImgUrl(croppedImgUrl);
    setOcrText(adjustText);
  }, []);

  const fullScreen = isAlwaysFullScreenOcrModal();
  return (
    <div className="flex">
      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        scroll="body"
        sx={{
          '.MuiPaper-root': {
              width: '1280px',
              height: '800px',
          },
          '.MuiDialog-paper':{
              position: 'relative',
              backgroundColor: 'rgba(0,0,0,0.0)',
              boxShadow: 'none',
              margin: 0,
          }
      }}
        open={ocrModalData.openFlag}
        onClose={handleClose}
      >
        <div className={fullScreen ? 'ocr-modal-pad-frame' : 'ocr-modal-pc-frame'}>
          {!croppedImgUrl && (
            <OcrImgCropArea
              fullScreen={fullScreen}
              originImgUrl={originImgSrc}
              onChangeImage={handleChangeImgFile}
              onConvertOcrText={handleConvertOcrText}
              onClose={handleClose}
            />)}
          {croppedImgUrl && (
            <OcrCompleteArea
              fullScreen={fullScreen}
              croppedImgUrl={croppedImgUrl}
              ocrText={ocrText}
              textType={ocrModalData.textType ?? 'title'}
              onChangeText={setOcrText}
              onChangeImage={handleChangeImgFile}
              onClickNext={handleNext}
              onClose={handleClose}
            />)}
        </div>
      </Dialog>
    </div>
  );
}

/** 제목 오류 체크 및 팝업 표시 */
function validateTitle(textType: OcrTextType, inputText: string, ocrText: string) {
  if (textType === 'content') return true;
  
  const text = inputText.length > 0 && !LAST_SPACE_REGEX.test(inputText) ? inputText + " " + ocrText : inputText + ocrText;

   // 특수문자 점검
   if (!validateNotAllowedSpecialCharacters(ocrText)) {
    return false;
  }

  if (!validateNotAllowSpecialSymbols(ocrText)) {
    return false;
  }

  // 문장 점검
  if (!checkMaxNumberOfTitleCharacters(text)) {
    showAlertPopup(Message.Popups.MAX_NUMBER_OF_TITLE_CHARACTERS);
    return false;
  }

  // 단어 점검
  if (!checkMaxNumberOfWordCharacters(text)) {
    showAlertPopup(Message.Popups.MAX_NUMBER_OF_WORD_CHARACTERS);
    return false;
  }
  
  return true;
}

/** 본문 오류 체크 및 팝업 표시 */
function validateContent(textType: OcrTextType, inputText: string, ocrText: string) {
  if (textType === 'title') return true;

  const text = inputText + ocrText;
  // 특수문자 점검
  if (!validateNotAllowedSpecialCharacters(ocrText)) {
    return false;
  }

  if (!validateNotAllowSpecialSymbols(ocrText)) {
    return false;
  }

  // 단어 점검
  if (!checkMaxNumberOfWordCharacters(text)) {
    showAlertPopup(Message.Popups.MAX_NUMBER_OF_WORD_CHARACTERS);
    return false;
  }

  // 단락 점검
  if (!checkMaxNumberOfParagraphCharacters(text)) {
    showAlertPopup(Message.Popups.MAX_NUMBER_OF_PARAGRAPH_CHARACTERS);
    return;
  }

  // 본문 점검
  if (!checkMaxNumberOfContentCharacters(text)) {
      showAlertPopup(Message.Popups.MAX_NUMBER_OF_CHARACTERS);
      return;
  }
  
  return true;
}

/** 특수문자 점검 */
function validateNotAllowedSpecialCharacters(text: string) {
  const foundMatch = text.match(NOT_ALLOWED_CHARACTERS_REGEX);
  if (foundMatch) {
    const uniqueMatch = new Set(foundMatch);
    const limitedUniqueMatch = Array.from(uniqueMatch).slice(0, MAX_DISPLAY_SPECIAL_CHARACTERS).join("　");
    showAlertPopup([...Message.Popups.NOT_ALLOWED_SPECIAL_CHARACTERS, limitedUniqueMatch]);
    return false;
  }

  return true;
}

/** 허용 불가 연속 문자 점검 */
function validateNotAllowSpecialSymbols(text: string) {
  let allMatchedStr = text.match(CONTINUOUS_SPECIAL_CHARACTERS_REGEX)?.join("") ?? "";
  allMatchedStr += text.match(DOUBLE_QUATES_REGEX)?.join("") ?? "";
  allMatchedStr += text.match(SPECIAL_CHARACTERS_SPACE_REGEX)?.join("") ?? "";
  allMatchedStr += text.match(DOUBLE_QUATES_REGEX)?.join("") ?? "";
  if (allMatchedStr.length > 0) {
    const uniqueMatch = new Set(allMatchedStr.split(""));
    showAlertPopup([...Message.Popups.NOT_ALLOWED_SPECIAL_SYMBOLS, Array.from(uniqueMatch).slice(0, MAX_DISPLAY_SPECIAL_CHARACTERS).join("　")]);
    return false;
  }

  return true;
}