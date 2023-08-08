import useLoginStore from "../../../store/useLoginStore";
import { commonIconSvgs } from "../../../util/svgs/commonIconsSvg";

export default function SmallHead (props: {
    mainTitle: string,
    subTitle?: string,
}) {
    const { userInfo } = useLoginStore();
    return (
        <div className='flex flex-row'>
            <div className="flex flex-col">
                <div className='flex flex-row items-center gap-[9px] pl-[30px] pt-[40px]'>
                    <span className='w-[5px] h-[25px]'><commonIconSvgs.ClinicTitleRectIcon/></span>
                    {props.mainTitle!=='' && <span className='left-top-text-title'>{props.mainTitle}</span>}
                </div>
                {(props.subTitle!==undefined||props.subTitle!=='') && <span className='left-top-text-sub-title'>{props.subTitle}</span>}
            </div>
            <div className='top-right-user-info'>
                <commonIconSvgs.UserInfoRightTopImg />
                <div className='top-right-user-info-text'>
                    <div className='top-right-user-info-text-en-name'>{userInfo.memberNameEn}</div>
                    <div className='top-right-user-info-text-class'>{userInfo.courseName}</div>
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