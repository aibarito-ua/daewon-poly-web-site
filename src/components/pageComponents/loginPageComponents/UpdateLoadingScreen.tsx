import { FC } from "react";

export const UpdateLoadingScreen: FC<{onCloseButtonClicked: () => void}> = ({onCloseButtonClicked}) => {
    return (
        <div className="container">
            <div className="login-area">
                {/* <div className={`absolute right-[24px] top-[24px] w-[65px] h-[65px] bg-app-close-button-svg bg-no-repeat bg-contain hover:cursor-pointer`} 
                    onClick={onCloseButtonClicked}
                /> */}
                <div className="update-msg">
                    <h1 className="update-msg__tit">Writing Hub 업데이트 안내</h1>
                    <p className="update-msg__desc">
                    신규 기능 이용을 위해 업데이트가 필요해요.
                    <br />
                    잠시 후 오픈되는 업데이트 진행 팝업에서
                    <br />
                    <strong>[확인]</strong> 버튼을 눌러 주세요.
                    </p>
                </div>
            </div>
        </div>
    );
}