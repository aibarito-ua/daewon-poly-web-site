const GRAMMAR_CHECK:string = process.env.REACT_APP_GRAMMAR_CREATE_ORIGIN_CHANGE_TEXTS?process.env.REACT_APP_GRAMMAR_CREATE_ORIGIN_CHANGE_TEXTS:'';
const GRAMMAR_COMPARE:string = process.env.REACT_APP_GRAMMAR_COMPARE_TEXTS?process.env.REACT_APP_GRAMMAR_COMPARE_TEXTS:'';
const CHATBOT_API_URL:string = process.env.REACT_APP_CHATBOT_API_URL?process.env.REACT_APP_CHATBOT_API_URL:'';

// Login
const BACK_HOST:string=process.env.REACT_APP_BACK_HOST?process.env.REACT_APP_BACK_HOST:'';
const LOGIN:string=process.env.REACT_APP_LOGIN?process.env.REACT_APP_LOGIN:'';
const FORCE_LOGIN:string=process.env.REACT_APP_LOGIN_FORCE?process.env.REACT_APP_LOGIN_FORCE:'';

// Login Active Button
const JOIN_URL:string=process.env.REACT_APP_LOGIN_JOIN_URL?process.env.REACT_APP_LOGIN_JOIN_URL:'';
const FIND_ID_URL:string=process.env.REACT_APP_LOGIN_FIND_ID_URL?process.env.REACT_APP_LOGIN_FIND_ID_URL:'';
const FIND_PW_URL:string=process.env.REACT_APP_LOGIN_FIND_PW_URL?process.env.REACT_APP_LOGIN_FIND_PW_URL:'';

// Draft 
// Get
const UNIT_INFO:string=process.env.REACT_APP_UNIT_INFO?process.env.REACT_APP_UNIT_INFO:'';
// Save
// temporary
const DRAFT_SAVE_TEMPORARY:string = process.env.REACT_APP_DRAFT_SAVE_TEMPORARY?process.env.REACT_APP_DRAFT_SAVE_TEMPORARY:'';
// submit
const DRAFT_SUBMIT:string = process.env.REACT_APP_DRAFT_SUBMIT?process.env.REACT_APP_DRAFT_SUBMIT:'';

export const CONFIG = {
    GRAMMAR: {
        CHECK:GRAMMAR_CHECK,
        COMPARE:GRAMMAR_COMPARE
    },
    CHATBOT: {
        URL:CHATBOT_API_URL
    },
    LOGIN: {
        POST: {
            URL: BACK_HOST+LOGIN,
            FORCE_URL: BACK_HOST+FORCE_LOGIN
        },
        LINK: {
            POLY: {
                JOIN: JOIN_URL,
                FIND_ID:FIND_ID_URL,
                FIND_PW:FIND_PW_URL,
            }
        }
    },
    DRAFT: {
        GET: {
            UNIT_INFO: BACK_HOST+UNIT_INFO,
        },
        POST: {
            SAVE_TEMPORARY: BACK_HOST+DRAFT_SAVE_TEMPORARY,
            SUBMIT: BACK_HOST+DRAFT_SUBMIT,
        }
    }
}