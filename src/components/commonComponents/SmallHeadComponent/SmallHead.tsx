import React from 'react';
import useLoginStore from "../../../store/useLoginStore";
import { commonIconSvgs } from "../../../util/svgs/commonIconsSvg";
import useProgressPageStore from '../../../store/useProgressPageStore';
import NoImage from './no_image_profile.png';
import axios from 'axios';

export default function SmallHead (props: {
    mainTitle: string,
    subTitle?: string,
}) {
    const { userInfo, setInfoModal } = useLoginStore();
    const {progressTabActiveIndex, setProgressTabActiveIndex} = useProgressPageStore();
    const [isProfileImage, setIsProfileImage] = React.useState<boolean>(false);
    const progressButtonLabel = [
        'spark writing',
        // 'free writing'
    ];
    // console.log('subTitle ==',props.subTitle)
    const testUrl = 'http://file.koreapolyschool.com'
    // console.log('userInfo.userImagePath =',userInfo.userImagePath)
    React.useEffect(()=>{
        console.log('')
        if (userInfo.userImagePath === testUrl) {
            setIsProfileImage(false)
        } else {
            axios.get(userInfo.userImagePath).then((response) => {
                // console.log('res img: ',response)
                setIsProfileImage(true)
            }).catch((reject) => {
                // console.log('rej img: ',reject)
                setIsProfileImage(false)
            })
        }
    }, [])
    return (
        <div className='flex flex-row justify-between'>
            <div className="flex flex-col">
                <div className='flex flex-row items-center gap-[9px] pl-[30px] pt-[40px]'>
                    <span className='w-[5px] h-[25px]'><commonIconSvgs.ClinicTitleRectIcon/></span>
                    {props.mainTitle!=='' && <span className='left-top-text-title select-none'>{props.mainTitle}</span>}
                </div>
                {props.subTitle!==undefined && <span className='left-top-text-sub-title select-none'>{props.subTitle}</span>}
                {(props.mainTitle==='Progress'&&props.subTitle===undefined) && (
                    <div className="left-top-progress-buttons-div select-none">
                        {progressButtonLabel.map((item, progressButtonIndex) => {
                            return <div key={progressButtonIndex} className={progressTabActiveIndex===progressButtonIndex ? 'left-top-progress-button-active': 'left-top-progress-button'}>{item}</div>
                        })}
                    </div>
                )}
                {(props.mainTitle==='Report'&&props.subTitle===undefined) && (
                    <div className="left-top-progress-buttons-div select-none">
                        {progressButtonLabel.map((item, progressButtonIndex) => {
                            return <div key={progressButtonIndex} className={progressTabActiveIndex===progressButtonIndex ? 'left-top-progress-button-active': 'left-top-progress-button'}>{item}</div>
                        })}
                    </div>
                )}
                {(props.mainTitle==='Portfolio'&&props.subTitle===undefined) && (
                    <div className="left-top-progress-buttons-div select-none">
                        {progressButtonLabel.map((item, progressButtonIndex) => {
                            return <div key={progressButtonIndex} className={progressTabActiveIndex===progressButtonIndex ? 'left-top-progress-button-active': 'left-top-progress-button'}>{item}</div>
                        })}
                    </div>
                )}
            </div>
            <div className='top-right-user-info' onClick={()=>setInfoModal({isOpen:true})}>
                <commonIconSvgs.UserInfoRightTopImg />
                <div className='top-right-user-info-text'>
                    <div className='top-right-user-info-text-en-name select-none'>{userInfo.memberNameEn}</div>
                    <div className='top-right-user-info-text-class select-none'>{userInfo.courseName}</div>
                </div>
                <div className={`top-right-user-info-img bg-user-no-profile-image-view`} style={{
                    backgroundImage: isProfileImage ? 'url("'+userInfo.userImagePath+'")': NoImage,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain'
                }}/>
            </div>
        </div>
    )
}