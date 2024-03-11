/** 제목 최대 길이  */
export const MAX_DRAFT_TITLE_LENGTH = 120;

/** 본문 최대 길이 */
export const MAX_DRAFT_CONTENT_LENGTH = 10000;

/** 단락 최대 길이 */
export const MAX_DRAFT_PARAGRAPH_LENGTH = 1800;

/** 제목 최소 길이 */
export const MIN_DRAFT_TITLE_LENGTH = 1;

/** 본문 최소 길이 */
export const MIN_DRAFT_CONTENT_LENGTH = 10;

/** outline format 중 타이틀의 이름 */
export const TITLE_OUTLINE_NAME = 'Title';

/** 단어당 최대 글자 수 */
export const MAX_NUMBER_OF_WORD_CHARACTERS = 45;

/** 입력 불가 특수 문자 - `, |, {, }, \ */
export const NOT_ALLOWED_SPECIAL_CHARACTERS_REGEX = /[`|{}\\]{1,}/gmi;

/** 연속된 특수 문자 정규식 */
export const CONTINUOUS_SPECIAL_CHARACTERS_REGEX = /[[\]/;:*\-_+<>@#$%&\\=]{2,}/gmi;

/** 특수 문자 사이 공백 정규식 */
export const SPECIAL_CHARACTERS_SPACE_REGEX = /([[\]/;:*\-_+<>@#$%&\\=]+\s+[[\]/;:*\-_+<>@#$%&\\=]+)/gmi;

/** 3개 이상 따옴표 정규식 */
export const DOUBLE_QUATES_REGEX = /['"]{2,}/gmi;

/** 따옴표 사이 공백 정규식 */
export const QUOTES_SPACE_REGEX = /([`]+\s+[`]+)/gmi;

/** 한글 정규식 */
export const KOREAN_REGEX = /[ㄱ-ㅎㅏ-ㅣ가-힣]/gmi;

/** 3개 이상 공백 정규식 */
export const TWO_OR_MORE_SPACE_REGEX = /\s{2,}/gmi;

/** 3개 이상 줄바꿈 정규식 */
export const THREE_OR_MORE_NEW_LINE_REGEX = /[\n]{3,}/gmi;

/** 개행 문자 정규식 */
export const NEW_LINE_REGEX = /[\n\r]/g;

/** 문자열의 마지막 개행 문자 정규식 */
export const LAST_NEW_LINE_REGEX = /\n+$/;

/** 문자열의 마지막 공백 문자 정규식 */
export const LAST_SPACE_REGEX = /\s+$/;

/** Without Outline 마지막 경로 */
export const WO_LAST_SUBPATH = '/WithoutOutline';