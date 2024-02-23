# .env
### `REACT_APP_BACK_HOST` :  backend host url
### `REACT_APP_GRAMMAR_CREATE_ORIGIN_CHANGE_TEXTS` : proofreading end-point
### `REACT_APP_PROOFREADING_COUNT_UPDATE` : proofreading temporary reset count end-point
### `REACT_APP_CHATBOT_API_URL` : free chat end-point
### `REACT_APP_LOGIN` : writing hub login -> Poly 로그인 후 기본값 체크
### `REACT_APP_LOGIN_FORCE` : writing hub login -> validate 후 로그인 처리
### `REACT_APP_LOGIN_JOIN_URL` : poly url ../signUpForm01.do
### `REACT_APP_LOGIN_FIND_ID_URL` : poly url ../findIdForm01.do
### `REACT_APP_LOGIN_FIND_PW_URL` : poly url ../findPwForm01.do
### `REACT_APP_DRAFT_SAVE_TEMPORARY` : draft temporary save end-point
### `REACT_APP_DRAFT_SUBMIT` : draft submit end-point
### `REACT_APP_UNIT_INFO` : 학생의 course의 모든 unit 불러오기
### `REACT_APP_SPARK_GET_REPORT_OVERALL_BY_STUDENT` : get Overall Report data
### `REACT_APP_SPARK_GET_PORTFOLIO_BY_STUDENT` : get Portfolio data
### `REACT_APP_POLY_SERVICE` : poly url ../service.do
### `REACT_APP_POLY_PRIVACY` : poly url ../privacy.do
### `REACT_APP_POLY_WITHDRAW` : 회원 탈퇴 처리
### `REACT_APP_CHECK_DUPLICATE_LOGIN` : check device

### `REACT_APP_MAINTENANCE` : 점검 관련 (쿠키 이름)
### `REACT_APP_MAINTENANCE_ERROR_CODE` : 특정 에러 확인 코드

### `REACT_APP_IS_DEV` : 서버가 개발 서버인지 분류 및 체크 (임시 리셋 버튼)
### `그외 변수` : 코드 내에서 사용되지 않거나 이전에 테스트를 위해 만들어진 변수들입니다.

접속 시 앱 버전 정보가 없는 경우 사용하는 변수
REACT_APP_ANDROID_VERSION=1.0.4
REACT_APP_IOS_VERSION=1.0.5
REACT_APP_ELECTRON_VERSION=1.0.6

# poly-web-site