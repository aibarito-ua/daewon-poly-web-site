import { NavigateFunction } from "react-router-dom";
import useControlAlertStore from "../../../../store/useControlAlertStore";
import useLoginStore from "../../../../store/useLoginStore";
import useSparkWritingStore from "../../../../store/useSparkWritingStore";
import { callUnitInfobyStudent, draftSaveTemporary } from "../../api/EssayWriting.api";
import { MAX_DRAFT_CONTENT_LENGTH, MAX_DRAFT_PARAGRAPH_LENGTH, MAX_DRAFT_TITLE_LENGTH, MAX_NUMBER_OF_WORD_CHARACTERS, MIN_DRAFT_CONTENT_LENGTH, MIN_DRAFT_TITLE_LENGTH, TITLE_OUTLINE_NAME } from "../consts";
import { goSparkWriting, goSparkWritingPreview } from "./Navigate";
import { handleExceptionServerErr, setMaintenanceData } from "./ServerErrorExceptionHandling";
import Message from "../Message";
import { checkDuplicateLogin } from "../../api/Login.api";
import useNavStore from "../../../../store/useNavStore";
import { showConfirmPopup } from "./AlertModalController";

export async function fetchSparkWritingUnits(params: { userCode: string; courseName: string; accessToken: string; }):
    Promise<{ book_name: string; units: TSparkWritingDatas; } | undefined> {
    const { userCode, courseName, accessToken } = params;
    const res = await callUnitInfobyStudent(userCode, courseName, accessToken);
    if (res.data) {
        setMaintenanceData(res.data);
        return undefined;
    }

    const { book_name, units } = res;
    return { book_name, units };
}

export function initPage(unitIdxStr: string | undefined, draft: string | undefined, navigate: NavigateFunction): void {
    useSparkWritingStore.getState().setPreviewPageInitFlag('');

    const unitIndex = getUnitIndex(unitIdxStr);
    const { draft_1_status, draft_2_init_page_flag } = useSparkWritingStore.getState().sparkWritingData[getUnitIndex(unitIdxStr)];
    const status = draft_1_status.status;
    if (status === 5) {
        const feedChecked = useControlAlertStore.getState().teacherFeedbackModalChecked.find((data) => data.index === unitIndex)?.isChecked ?? false;
        if (feedChecked) return;

        useControlAlertStore.getState().setReturn1stDraftReasonAlertOpen({
            openFlag: true,
            returnReason: draft_1_status.return_reason,
            returnTeacherComment: draft_1_status.return_teacher_comment,
            NoEvent: () => goSparkWriting(navigate),
            yesEvent: () => useControlAlertStore.getState().setTeacherFeedbackModalChecked(true, unitIndex),
        })
    } else if (status === 4) {
        // 1차 완료, 2차 시작 init
        useSparkWritingStore.getState().setDraft2ndPageSet(draft_2_init_page_flag);
    }

    registerGoBackFromDraftInUnitPage(unitIdxStr, draft, navigate);
}

/** 1st draft 임시 저장 */
export async function saveTemporarily(unitIdxStr: string | undefined, draft: string | undefined, navigate: NavigateFunction) {
    const { draft_1_outline, unit_id, proofreading_count } = useSparkWritingStore.getState().sparkWritingData[getUnitIndex(unitIdxStr)];
    const tempContents: TSparkWritingSaveTemporaryContent[] = draft_1_outline.map((item) => {
        return {
            heading_name: item.name,
            input_content: item.input_content,
            grammar_correction_content_student: item.grammar_correction_content_student,
            order_index: item.order_index,
            is_input_open: item.is_input_open
        }
    });

    const draftIdxStr = draft ?? '0';
    const gapTime = useSparkWritingStore.getState().setSparkWritingUnitEnd(unitIdxStr ?? '0', draftIdxStr);

    const { userCode, memberNameEn, memberNameKr, className, campusName, accessToken } = useLoginStore.getState().userInfo;

    const tempData: TSparkWritingTemporarySaveData = {
        student_code: userCode,
        student_name_en: memberNameEn,
        student_name_kr: memberNameKr,
        class_name: className,
        campus_name: campusName,
        unit_id,
        draft_index: parseInt(draftIdxStr),
        proofreading_count,
        contents: tempContents,
        draft_2_init_page_flag: '',
        draft_1_page_outline_type: 'WO',
        duration: gapTime,
    };
    const res = await draftSaveTemporary(tempData, accessToken);
    handleExceptionServerErr(res, navigate);
    if (res.is_server_error) {
        if (res.is_retry) {
            useControlAlertStore.getState().commonAlertOpen({
                messageFontFamily: "Roboto",
                yesButtonLabel: "Yes",
                noButtonLabel: "No",
                messages: Message.Popups.SAVE,
                yesEvent: () => {
                    useControlAlertStore.getState().commonAlertClose();
                    saveTemporarily(unitIdxStr, draft, navigate);
                },
                closeEvent: () => useControlAlertStore.getState().commonAlertClose(),
            });
        }
        return;
    }

    // 저장 결과 처리
    useSparkWritingStore.getState().setDraft2ndPageSet('');
    resetChatHistEvent();
    goSparkWriting(navigate);
}

export async function previewDraft(unit: string | undefined, draft: string | undefined, navigate: NavigateFunction) {
    const { accessToken } = useLoginStore.getState().userInfo;

    const res = await checkDuplicateLogin(accessToken);
    handleExceptionServerErr(res, navigate);
    if (res.is_server_error) {
        if (res.is_retry) {
            useControlAlertStore.getState().commonAlertOpen({
                messageFontFamily: "Roboto",
                yesButtonLabel: "Yes",
                noButtonLabel: "No",
                messages: Message.Popups.SAVE,
                yesEvent: () => {
                    useControlAlertStore.getState().commonAlertClose();
                    saveTemporarily(unit, draft, navigate);
                },
                closeEvent: () => useControlAlertStore.getState().commonAlertClose(),
            });
        }
        return;
    }

    const unitIdxStr = unit ?? '0';
    const draftIdxStr = draft ?? '0';
    useSparkWritingStore.getState().historyDataDelete(parseInt(unitIdxStr), parseInt(draftIdxStr));
    useSparkWritingStore.getState().setPreviewPageInitFlag('UPDATE_WRITE');
    // preview로 넘어가기 전에 타입 지정 필요(저장하지 않고 넘어가는 경우 대비)
    useSparkWritingStore.getState().setTempDraft1PageOutlineType('WO');
    goSparkWritingPreview(unitIdxStr, draftIdxStr, navigate);
}

/** Unit을 number로 변환 */ 
export const getUnitIndex = (unit: string | undefined): number => unit !== undefined ? parseInt(unit) - 1 : 0;

/** Outline 데이터 중 최소 텍스트 요구량을 통과한 데이터 개수 */
export function getMinTextRequiredCount(sparkWritingDataOutlines: TSparkWritingDataOutline[]): number {
    const minTextRequiredArr = sparkWritingDataOutlines.map((data: TSparkWritingDataOutline) => {
        const textLength = data.input_content.replaceAll(' ', '').length;
        return data.name === TITLE_OUTLINE_NAME ? textLength >= MIN_DRAFT_TITLE_LENGTH : textLength >= MIN_DRAFT_CONTENT_LENGTH;
      });
    const totalRequiredCount = minTextRequiredArr.filter((data: boolean) => data === true).length;
    return totalRequiredCount;
}

/** Outline 데이터 중 입력된 텍스트가 있는지 유무 */
export function inputContentsExists(sparkWritingDataOutlines: TSparkWritingDataOutline[]): boolean {
    const foundIdx = sparkWritingDataOutlines.findIndex((data) => data.input_content.length > 0);
    return foundIdx >= 0;
}

/** 단어 최대 글자수 체크 */
export function checkMaxNumberOfWordCharacters(text:string) {
    const targetValue = text.split(/[\n|\s]/gmi);
    return targetValue.findIndex((word) => word.length > MAX_NUMBER_OF_WORD_CHARACTERS) < 0;
}

/** 단락당 최대 글자수 체크 */
export function checkMaxNumberOfParagraphCharacters(text: string) {
    const splits = text.split('\n');
    return splits.findIndex((paragraph) => paragraph.length > MAX_DRAFT_PARAGRAPH_LENGTH) < 0;
}

/** 타이틀 최대 글자수 체크 */
export const checkMaxNumberOfTitleCharacters = (title: string) => title.length <= MAX_DRAFT_TITLE_LENGTH;

/** 본문 최대 글자수 체크 */
export function checkMaxNumberOfContentCharacters(content: string) {
    const targetValue = content.replaceAll(' ', '');
    return targetValue.length <= MAX_DRAFT_CONTENT_LENGTH;
}

export const nextLineExists = (sentence: string) => sentence.includes('\n');

/** 우상단 엘라 채팅 리셋 */
function resetChatHistEvent() {
    if (useLoginStore.getState().isMobile) {
        window.ReactNativeWebView.postMessage(JSON.stringify('ResetChat'))        
    } else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
        (window as any).api.toElectron.send('ResetChat')
    }
}

/** 좌상단 백버튼 처리 로직 */
function registerGoBackFromDraftInUnitPage(unitIdxStr: string | undefined, draft: string | undefined, navigate: NavigateFunction): void {
    // 백버튼 클릭 시 콜백 등록
    useNavStore.getState().setGoBackFromDraftInUnitPage(() => {
        const unitIndex = getUnitIndex(unitIdxStr);
        const targetDataOutline = useSparkWritingStore.getState().sparkWritingData[unitIndex].draft_1_outline;
        const inputContentExistCount = getMinTextRequiredCount(targetDataOutline);

        const showConfirmExitSave = () => {
            showConfirmPopup({
                messages: Message.Popups.EXIT_SAVE,
                btnNames: ['No', 'Yes'],
                yesIdx: 1,
                alertType: 'warningContinue',
                // 저장
                yesCb: async () => {
                    await saveTemporarily(unitIdxStr, draft, navigate);
                },
                noCb: () => {
                    resetChatHistEvent();
                    goSparkWriting(navigate);
                },
            });
        };

        showConfirmPopup({
            messages: Message.Popups.EXIT,
            btnNames: ['Yes', 'No'],
            yesIdx: 0,
            alertType: 'warningContinue',
            yesCb: () => {
                if (inputContentExistCount === 0) {
                    resetChatHistEvent();
                    goSparkWriting(navigate);
                    return;
                }

                // 입력된 텍스트가 있으면 추가 확인 팝업
                showConfirmExitSave();
            },
        });
    });
}