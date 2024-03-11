import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import useLoginStore from "../../../../store/useLoginStore";
import { useCallback } from "react";
import Message from "../Message";
import useSparkWritingStore from "../../../../store/useSparkWritingStore";
import { fetchSparkWritingUnits, getUnitIndex, inputContentsExists } from "../controller/DraftController";
import { goOcrDraft } from "../controller/Navigate";
import useControlAlertStore from "../../../../store/useControlAlertStore";
import { showConfirmPopup } from "../controller/AlertModalController";

const OcrDraftFormatBtn = (): JSX.Element => {
  const params = useParams();
  const navigate = useNavigate();

  const { sparkWritingData } = useSparkWritingStore();
  
  const handleClick = useCallback(() => {
    const unitIndex = getUnitIndex(params.unit);
    const targetDataOutline = sparkWritingData[unitIndex].draft_1_outline;
    if ((inputContentsExists(targetDataOutline))) {
      showConfirmPopup({
        messages: Message.Popups.CHANGE_DRAFT_MODE,
        btnNames: ['Yes', 'No'],
        yesIdx: 0,
        yesCb: () => fetchDataAndGoPage(params.unit ?? '', params.draft ?? '', navigate)
      });
    } else {
      fetchDataAndGoPage(params.unit ?? '', params.draft ?? '', navigate);
    }
  }, [navigate, params.draft, params.unit, sparkWritingData]);

  return (
    <div className="flex items-center h-[90px]">
      <div className='ocr-draft-outline-btn div-to-button-hover-effect' onClick={handleClick}>
        <div className='w-[36px] h-[36px]'>
          <div className="ocr-draft-no-outline-btn-icon bg-no-repeat bg-contain w-[36px] h-[36px]" />
        </div>
        <span className='ocr-draft-outline-btn-text min-w-[80px]'>No Outline</span>
      </div>
    </div>
  );
};

export default OcrDraftFormatBtn;

async function fetchDataAndGoPage(unit: string, draft: string, navigate: NavigateFunction) {
  useControlAlertStore.getState().setCommonStandbyScreen({ openFlag: true });
  const { userCode, courseName, accessToken } = useLoginStore.getState().userInfo;

  const { sparkWritingData } = useSparkWritingStore.getState();

  // 저장 페이지 타입이 outline인 경우 input_content 리셋 후 이동
  const writingData  = sparkWritingData[getUnitIndex(unit)];
  if (writingData.draft_1_page_outline_type === 'WL') {
    writingData.draft_1_outline.forEach((item) => {
      useSparkWritingStore.getState().setOutlineInputText('', writingData.unit_id, writingData.unit_index, item.order_index, 1);
    });

    return goOcrDraft(unit, draft, navigate);
  }

  // 저장 페이지 타입이 without outline인 경우 데이터 fetch 후 이동
  const res = await fetchSparkWritingUnits({ userCode, courseName, accessToken});
  useControlAlertStore.getState().setCommonStandbyScreen({ openFlag: false })
  if (!res) {
    navigate('/');
    return;
  }

  useSparkWritingStore.getState().setSparkWritingDataFromAPI(res.units, res.book_name);

  goOcrDraft(unit, draft, navigate);
}