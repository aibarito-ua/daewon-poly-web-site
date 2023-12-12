const GRAMMAR_CHECK:string = process.env.REACT_APP_GRAMMAR_CREATE_ORIGIN_CHANGE_TEXTS?process.env.REACT_APP_GRAMMAR_CREATE_ORIGIN_CHANGE_TEXTS:'';
const GRAMMAR_COMPARE:string = process.env.REACT_APP_GRAMMAR_COMPARE_TEXTS?process.env.REACT_APP_GRAMMAR_COMPARE_TEXTS:'';
const CHATBOT_API_URL:string = process.env.REACT_APP_CHATBOT_API_URL?process.env.REACT_APP_CHATBOT_API_URL:'';
const PROOFREADING_COUNT_UPDATE:string = process.env.REACT_APP_PROOFREADING_COUNT_UPDATE?process.env.REACT_APP_PROOFREADING_COUNT_UPDATE:'';
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

// portfolio by student
const SPARK_GET_PORTFOLIO_BY_STUDENT:string = process.env.REACT_APP_SPARK_GET_PORTFOLIO_BY_STUDENT? process.env.REACT_APP_SPARK_GET_PORTFOLIO_BY_STUDENT:'';
// report overall by student
const SPARK_GET_REPORT_OVERALL_BY_STUDENT:string = process.env.REACT_APP_SPARK_GET_REPORT_OVERALL_BY_STUDENT?process.env.REACT_APP_SPARK_GET_REPORT_OVERALL_BY_STUDENT:'';
// 이용 약관
const POLY_SERVICE = process.env.REACT_APP_POLY_SERVICE ? process.env.REACT_APP_POLY_SERVICE : '';
// 개인정보처리방침
const POLY_PRIVACY = process.env.REACT_APP_POLY_PRIVACY ? process.env.REACT_APP_POLY_PRIVACY : '';
// 회원 앱 탈퇴 
const POLY_WITHDRAW = process.env.REACT_APP_POLY_WITHDRAW ? process.env.REACT_APP_POLY_WITHDRAW : '';

// Duplicate Login Check
const CHECK_DUPLICATE_LOGIN = process.env.REACT_APP_CHECK_DUPLICATE_LOGIN ? process.env.REACT_APP_CHECK_DUPLICATE_LOGIN:'';

// MAINTENANCE
// COOKIE DATA NAME
const MAINTENANCE_COOKIE_NAME= process.env.REACT_APP_MAINTENANCE_COOKIE ? process.env.REACT_APP_MAINTENANCE_COOKIE:'';
// MAINTENANCE ERROR Code
const MAINTENANCE_ERROR_CODE = process.env.REACT_APP_MAINTENANCE_ERROR_CODE ? process.env.REACT_APP_MAINTENANCE_ERROR_CODE:'';

export const CONFIG = {
    MAINTENANCE: {
        COOKIE: {
            NAME: MAINTENANCE_COOKIE_NAME
        },
        ERROR: {
            CODE: MAINTENANCE_ERROR_CODE
        }
    },
    GRAMMAR: {
        CHECK:BACK_HOST+GRAMMAR_CHECK,
        COMPARE:GRAMMAR_COMPARE,
        PROOF_READING_COUNT_UPDATGE: BACK_HOST+PROOFREADING_COUNT_UPDATE,
    },
    CHATBOT: {
        URL:BACK_HOST+CHATBOT_API_URL
    },
    LOGIN: {
        POST: {
            URL: BACK_HOST+LOGIN,
            FORCE_URL: BACK_HOST+FORCE_LOGIN,
            WITHDRAW: BACK_HOST+POLY_WITHDRAW,
        },
        LINK: {
            POLY: {
                JOIN: JOIN_URL,
                FIND_ID:FIND_ID_URL,
                FIND_PW:FIND_PW_URL,
                SERVICE: POLY_SERVICE,
                PRIVACY: POLY_PRIVACY
            }
        },
        DUPLICATE_CHECK: BACK_HOST+CHECK_DUPLICATE_LOGIN
    },
    DRAFT: {
        GET: {
            UNIT_INFO: BACK_HOST+UNIT_INFO,
        },
        POST: {
            SAVE_TEMPORARY: BACK_HOST+DRAFT_SAVE_TEMPORARY,
            SUBMIT: BACK_HOST+DRAFT_SUBMIT,
        }
    },
    REPORT: {
        GET: {
            PORTFOLIO_BY_STUDENT: BACK_HOST+SPARK_GET_PORTFOLIO_BY_STUDENT,
            SPARK_GET_REPORT_OVERALL_BY_STUDENT: BACK_HOST+SPARK_GET_REPORT_OVERALL_BY_STUDENT,
        }
    }
}