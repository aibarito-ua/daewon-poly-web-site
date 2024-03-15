import { useCallback } from "react";
import { OcrTextType } from "../types";
import OcrBtn from "../components/OcrBtn";
import useSparkWritingStore from "../../../../store/useSparkWritingStore";
import { useParams } from "react-router-dom";
import { getUnitIndex } from "../controller/DraftController";

interface IProps {
  textType: OcrTextType;
  inputText: string;
}

/** 2nd draft OCR 버튼 표시 및 입력 텍스트 처리
 * - EssayWriting.tsx 수정을 최소화하기 위해 후처리도 포함됨
 */
const SecondDraftOcrBtn = (props: IProps): JSX.Element => {
  const { textType, inputText } = props;

  const params = useParams();
  const { sparkWritingData, setOutlineInputText } = useSparkWritingStore();

  const handleConvertOcrText = useCallback((ocrText: string) => {
    const unitIndex = getUnitIndex(params.unit);
    const draftItem = sparkWritingData[unitIndex];

    const orderIndex = textType === "title" ? 1 : 2;
    setOutlineInputText(inputText + ocrText, draftItem.unit_id, draftItem.unit_index, orderIndex, 2);
  }, [inputText, params.unit, setOutlineInputText, sparkWritingData, textType]);

  return (
    <OcrBtn textType={textType} inputText={inputText} className={textType === "content" ? "absolute right-[52px]" : undefined} onConvertOcrText={handleConvertOcrText} />
  );
};

export default SecondDraftOcrBtn;
