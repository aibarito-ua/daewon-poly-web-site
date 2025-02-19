import { useCallback, useEffect, useState } from 'react';
import useSparkWritingStore from '../../../store/useSparkWritingStore';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSparkWritingUnits, getMinTextRequiredCount, getUnitIndex, initPage, previewDraft, saveTemporarily } from './controller/DraftController';
import { useComponentWillMount } from '../../../hooks/useEffectOnce';
import useControlAlertStore from '../../../store/useControlAlertStore';
import useLoginStore from '../../../store/useLoginStore';
import Message from './Message';
import { showConfirmPopup } from './controller/AlertModalController';

const MIN_REQUIRED_COUNT_FOR_PREVIEW_BTN = 2;

export default function useOcrDraft(): {
  saveBtnVisible: boolean;
  previewBtnVisible: boolean;
  title: string;
  content: string;
  onSave: () => void;
  onPreview: () => void;
  onChangeTitle: (text: string) => void;
  onChangeContent: (text: string) => void;
} {
    const params = useParams();
    const navigate = useNavigate();
  
    const { sparkWritingData, setOutlineInputText } = useSparkWritingStore();
    const { userInfo } = useLoginStore();
    // 로딩 스피너
    const { commonStandbyScreen, setCommonStandbyScreen } = useControlAlertStore();

    const [saveBtnVisible, setSaveBtnVisible] = useState(false);
    const [previewBtnVisible, setPreviewBtnVisible] = useState(false);
    
    useComponentWillMount(async () => {
      setCommonStandbyScreen({ openFlag: true });
      const res = await fetchSparkWritingUnits({ userCode: userInfo.userCode, courseName: userInfo.courseName, accessToken: userInfo.accessToken});
      setCommonStandbyScreen({ openFlag: false })
      if (!res) {
        navigate('/');
        return;
      }

      initPage(params.unit, params.draft, navigate);
    });
  
    useEffect(() => {
      const unitIndex = getUnitIndex(params.unit);
      const targetDataOutline = sparkWritingData[unitIndex].draft_1_outline;
      const totalRequiredCount = getMinTextRequiredCount(targetDataOutline);
      setSaveBtnVisible(totalRequiredCount > 0);
      setPreviewBtnVisible(totalRequiredCount >= MIN_REQUIRED_COUNT_FOR_PREVIEW_BTN);
    }, [params.unit, sparkWritingData]);

    const onSave = useCallback(() => {
      if (commonStandbyScreen.openFlag) return;

      const unitIndex = getUnitIndex(params.unit);
      const pageOutlineType = sparkWritingData[unitIndex].draft_1_page_outline_type;
      showConfirmPopup({
        messages: pageOutlineType === "WL" ? Message.Popups.SAVE_NO_OUTLINE : Message.Popups.SAVE,
        btnNames: ['Yes', 'No'],
        yesIdx: 0,
        yesCb: () => saveTemporarily({ unitIdxStr: params.unit, draft: params.draft, pageOutlineType, navigate })
      });
    }, [commonStandbyScreen.openFlag, navigate, params.draft, params.unit]);

    const onPreview = useCallback(() => {
      showConfirmPopup({
        messages: Message.Popups.PREVIEW,
        alertType: 'continue',
        btnNames: ['No', 'Yes'],
        yesIdx: 1,
        yesCb: () => previewDraft(params.unit, params.draft, navigate)
      });
    }, [navigate, params.draft, params.unit]);
  
    const onChangeTitle = useCallback((text: string) => {
      const unitIndex = getUnitIndex(params.unit);
      const draftData = sparkWritingData[unitIndex];
      setOutlineInputText(text, draftData.unit_id, draftData.unit_index, 1, 1);
    }, [params.unit, setOutlineInputText, sparkWritingData]);
  
    const onChangeContent = useCallback((text: string) => {
      const unitIndex = getUnitIndex(params.unit);
      const draftData = sparkWritingData[unitIndex];
      setOutlineInputText(text, draftData.unit_id, draftData.unit_index, 2, 1);
    }, [params.unit, setOutlineInputText, sparkWritingData]);

    return {
      saveBtnVisible,
      previewBtnVisible,
      title: sparkWritingData[getUnitIndex(params.unit)].draft_1_outline[0].input_content,
      content: sparkWritingData[getUnitIndex(params.unit)].draft_1_outline[1].input_content,
      onSave,
      onPreview,
      onChangeTitle,
      onChangeContent,
    };
}