const Captions = {
    OCR_DRAFT_PLACE_HOLDER: "Enter text here by typing or scanning your writing.",
}

const Popups = {
    CHANGE_DRAFT_MODE: ["Leaving this page will delete your unsaved content.", "Are you sure you want to leave?"],
    MAX_NUMBER_OF_WORD_CHARACTERS: ["You have exceeded the maximum number of characters","allowed per word."],
    MAX_NUMBER_OF_TITLE_CHARACTERS: ["The title cannot be more than 120 characters."],
    NOT_ALLOWED_NEW_LINE: ["The Enter/Return key cannot be used in this section."],
    MAX_NUMBER_OF_PARAGRAPH_CHARACTERS: ["One paragraph cannot exceed 1,800 characters.", "If you wish to write more, press the Enter/Return", "key to create a new paragraph."],
    MAX_NUMBER_OF_CHARACTERS: ["You have exceeded the maximum number of characters allowed."],
    SAVE: ["Do you want to save your current", "progress and return to the main menu?"],
    PREVIEW: ["Are you ready to preview your writing?"],
    LOGIN_DUPLICATED: ["중복 로그인으로 자동 로그아웃 처리 되었습니다."],
    SERVER_NOT_CONNECTED: ["Cannot conntect to the server.", "Please try again later."],
    NOT_ALLOWED_SPECIAL_CHARACTERS: ["You cannot use the following characters: `  |  {  }  \\"],
    NOT_ALLOWED_SPECIAL_SYMBOLS: ["The text contains some special symbols", "you can't use one after the other.\n", "Allowed symbols: ! ? ( ) ., ~ ^"],
    OCR_PROCESSING_FAILED: ["Processing failed."],
    EXIT: ["Do you want to exit?"],
    EXIT_SAVE: ['Do you want to save your current', 'progress before you leave?'],
    EXIT_OCR_MODAL: ['Are you sure you want to leave?'],
}

const Message = {
    Captions,
    Popups,
};

export default Message;