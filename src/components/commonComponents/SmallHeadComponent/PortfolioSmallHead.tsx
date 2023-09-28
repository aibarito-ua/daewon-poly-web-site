import React from 'react';
import useLoginStore from "../../../store/useLoginStore";
import { commonIconSvgs } from "../../../util/svgs/commonIconsSvg";

export default function PortfolioSmallHead (props: {
    mainTitle: string,
    subTitle?: string,
}) {
    const { userInfo } = useLoginStore();
    const progressButtonLabel = [
        'spark writing',
        // 'free writing'
    ];
    // console.log('subTitle ==',props.subTitle)
    return (
        <div className='flex flex-row'>
            <div className="flex flex-col">
                <div className='flex flex-row items-center gap-[9px] pl-[30px] pt-[40px]'>
                    <span className='w-[5px] h-[25px]'><commonIconSvgs.ClinicTitleRectIcon/></span>
                    {props.mainTitle!=='' && <span className='left-top-text-title select-none'>{props.mainTitle}</span>}
                </div>
                {props.subTitle!==undefined && <span className='left-top-text-sub-title select-none'>{props.subTitle}</span>}
                
                {(props.mainTitle==='Portfolio'&&props.subTitle===undefined) && (
                    <div className="left-top-progress-buttons-div select-none">
                        {progressButtonLabel.map((item, progressButtonIndex) => {
                            return <button key={progressButtonIndex} 
                            className={'left-top-progress-button-active'
                                // progressTabActiveIndex===progressButtonIndex 
                                // ? 'left-top-progress-button-active'
                                // : 'left-top-progress-button'
                            }>{item}</button>
                        })}
                    </div>
                )}
            </div>
            <div className='top-right-user-info'>
                <commonIconSvgs.UserInfoRightTopImg />
                <div className='top-right-user-info-text'>
                    <div className='top-right-user-info-text-en-name select-none'>{userInfo.memberNameEn}</div>
                    <div className='top-right-user-info-text-class select-none'>{userInfo.courseName}</div>
                </div>
                <div className={`top-right-user-info-img`} style={{
                    backgroundImage: 'url("'+userInfo.userImagePath+'")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}/>
            </div>
        </div>
    )
}