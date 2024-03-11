import useLoginStore from "../../../../../store/useLoginStore";

export const MAX_IMAGE_PC_WIDTH = 1088;

export const MAX_IMAGE_PC_HEIGHT = 530;

export const MAX_IMAGE_PAD_WIDTH = 1280;

export const MAX_IMAGE_PAD_HEIGHT = 660;

export const RETAKE_BTN_ENABLED = false;

/** OCR 모달 풀스크린이 아닌 팝업으로 표시 유무 */
export const OCR_POPUP_MODE_ENABLED = false;

/** pad - 풀스크린, pc - flag에 따른 선택적 풀스크린 */
export const isAlwaysFullScreenOcrModal = () => !OCR_POPUP_MODE_ENABLED || useLoginStore.getState().isMobile;