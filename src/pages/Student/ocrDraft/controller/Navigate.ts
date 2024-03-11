import { NavigateFunction } from "react-router-dom";
import { CommonFunctions } from "../../../../util/common/commonFunctions";
import useLoginStore from "../../../../store/useLoginStore";
import { WO_LAST_SUBPATH } from "../consts";

const SPARK_WRITING_PATH = 'WritingClinic/SparkWriting';

export function getDraftPath(unitNum: number | string, draftNum: string, pageType?: TDraft1stOulinePageType) {
    const subPagePath = draftNum === '1' && pageType === 'WO' ? WO_LAST_SUBPATH : '';
    return `${SPARK_WRITING_PATH}/${unitNum}/${draftNum}${subPagePath}`;
}

export function goOcrDraft(unit: string, draft: string, navigate: NavigateFunction) {
    CommonFunctions.goLink(`${SPARK_WRITING_PATH}/${unit}/${draft}${WO_LAST_SUBPATH}`, navigate, useLoginStore.getState().role);
}

export function goOutlineDraft(unit: string, draft: string, navigate: NavigateFunction) {
    CommonFunctions.goLink(`${SPARK_WRITING_PATH}/${unit}/${draft}`, navigate, useLoginStore.getState().role);
}

export function goSparkWriting(navigate: NavigateFunction) {
    CommonFunctions.goLink(SPARK_WRITING_PATH, navigate, useLoginStore.getState().role);
}

export function goSparkWritingPreview(unit: string, draft: string, navigate: NavigateFunction) {
    CommonFunctions.goLink(`${SPARK_WRITING_PATH}/${unit}/${draft}/Preview`, navigate, useLoginStore.getState().role);
}