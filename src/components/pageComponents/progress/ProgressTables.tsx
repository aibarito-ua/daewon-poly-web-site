import React from 'react';
import { progressIcons } from '../../../util/svgs/commonProgressIcons';
import ProgressPercent from '../../chartComponents/progressDoughnutChart'
const THeadText = (props: {str1:string,str2:string}) => {
    return (
        <th className='progress-page-view-box-table-header'>
            <span className='inline-flex flex-col'>
                <span className=''>{props.str1}</span>
                <span>{props.str2}</span>
            </span>
        </th>
    )
}
const formatDateforStringData = (targetDateString:string) => {
    const date = new Date(targetDateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth()+1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
const DateText = (props:{dateString:string}) => {
    return <span style={{
        display: 'flex',
        fontFamily: 'Roboto',
        fontWeight: 400,
        fontSize: '14px',
        justifyContent: 'center',
        color: '#222',
        maxHeight: '10px',
        width: '65px',
        height: '10px',
        flexGrow: 0,
        lineHeight: 'normal',
    }}>{props.dateString}</span>
}
const ProgressTable = (props:any) => {
    const {
        data
    } = props;
    console.log('progress table ==',data)
    const [isElectron, setIsElectron] = React.useState<boolean>(false);
    React.useEffect(()=>{
        if (window.navigator.userAgent.toLowerCase().indexOf('electron') > -1 ) {
            setIsElectron(true)
        } else {
            setIsElectron(false)
        }
    },[])
    const target:TSparkWritingDatas = data;
    // sort by unit index
    const unitDataArray = target.sort((a,b) => {
        return a.unit_index - b.unit_index
    });
    return (
        <div className={
            isElectron
            ?'w-[1010px] min-w-[1010px] h-[395px]'
            :'w-full min-2-[1010px] h-[395px]'
        }>
            
            <div className='progress-page-view-box-table-head-row gap-[40px] pr-[140px]'>
                {/* <div className='w-[440px] min-w-[440px] h-1'></div> */}
                <THeadText str1='1st' str2='draft'/>
                <THeadText str1='1st' str2='feedback'/>
                <THeadText str1='2nd' str2='draft'/>
                <THeadText str1='final' str2='evaluation'/>
            </div>
            
            <div className='flex flex-col gap-[5px]'>
                {unitDataArray.map((unitItem, unitIndex) => {
                    const firstDraftStatus = unitItem.draft_1_status.status;
                    const secondDraftStatus = unitItem.draft_2_status.status;
                    // icons
                    let firstDraftState = progressIcons.EntryBlueIcon;
                    let firstDraftFeedbackState = <progressIcons.NoEntryGrayRectIcon/>
                    let secondDrafteState = <progressIcons.NoEntryGrayCircleIcon/>
                    let finalEvaluationState = <progressIcons.NoEntryGrayRectIcon/>
                    // dates
                    let firstDraftStateData = '';
                    let firstDraftFeedbackStateData = '';
                    let secondDrafteStateData = '';
                    let finalEvaluationStateData = '';
                    // progress percent value 
                    let progressPercentValue = 0;
                    // 0> noentry, 0,0 -> 0%
                    // 1> temp-save 1,0 -> 0%
                    // 2> df=complete, fb=noentry 2,0 -> add 25%
                    // 3> df=complete, fb=temp-save 2,0-> add 25%
                    // 4> df=complete, fb=complete 2,1-> add 50%
                    // 5> df=return, fb=return 3,2 -> 0%
                    // first
                    if (firstDraftStatus===1) {
                        console.log(1)
                        progressPercentValue+=0;
                        firstDraftState=<progressIcons.SaveYellowCircleIcon/>;
                        firstDraftStateData=unitItem.draft_1_status.temp_save_date ? formatDateforStringData(unitItem.draft_1_status.temp_save_date): '';
                    } else if (firstDraftStatus === 2||firstDraftStatus===3) {
                        console.log(2)
                        progressPercentValue+=25;
                        firstDraftState=progressIcons.CheckGreenCircleIcon;
                        firstDraftFeedbackState=progressIcons.WaitFeedbackBlueRectIcon;
                        firstDraftStateData=unitItem.draft_1_status.submit_date ? formatDateforStringData(unitItem.draft_1_status.submit_date): '';
                    } else if (firstDraftStatus===4) {
                        console.log(4)
                        progressPercentValue+=50;
                        firstDraftState=progressIcons.CheckGreenCircleIcon;
                        firstDraftFeedbackState=<progressIcons.CheckBlueRectIcon/>;

                        secondDrafteState = progressIcons.EntryBlueIcon;
                        firstDraftStateData=unitItem.draft_1_status.submit_date ? formatDateforStringData(unitItem.draft_1_status.submit_date): '';
                        firstDraftFeedbackStateData=unitItem.draft_1_status.review_complete_date ? formatDateforStringData(unitItem.draft_1_status.review_complete_date):'';
                    } else if (firstDraftStatus===5) {
                        console.log(5)
                        progressPercentValue+=0;
                        firstDraftState=progressIcons.RecycleRedCircleIcon;
                        firstDraftFeedbackState=<progressIcons.RejectRedRectIcon/>;
                        firstDraftStateData=''
                        firstDraftFeedbackStateData=unitItem.draft_1_status.review_reject_date? formatDateforStringData(unitItem.draft_1_status.review_reject_date): '';
                    } else {} // 0 values
                    // second
                    if (secondDraftStatus===1) {
                        progressPercentValue+=0;
                        secondDrafteState=<progressIcons.SaveYellowCircleIcon/>;
                        secondDrafteStateData=unitItem.draft_2_status.temp_save_date? formatDateforStringData(unitItem.draft_2_status.temp_save_date):'';
                    } else if (secondDraftStatus === 2||secondDraftStatus===3) {
                        progressPercentValue+=25;
                        secondDrafteState=progressIcons.CheckGreenCircleIcon;
                        finalEvaluationState = progressIcons.WaitFeedbackBlueRectIcon;
                        secondDrafteStateData=unitItem.draft_2_status.submit_date? formatDateforStringData(unitItem.draft_2_status.submit_date):'';
                    } else if (secondDraftStatus===4) {
                        progressPercentValue+=50;
                        secondDrafteState=progressIcons.CheckGreenCircleIcon;
                        finalEvaluationState=<progressIcons.CheckBlueRectIcon/>;
                        secondDrafteStateData=unitItem.draft_2_status.submit_date? formatDateforStringData(unitItem.draft_2_status.submit_date):'';
                        finalEvaluationStateData=unitItem.draft_2_status.review_complete_date? formatDateforStringData(unitItem.draft_2_status.review_complete_date):'';
                    } else if (secondDraftStatus===5) {
                        progressPercentValue+=0;
                        secondDrafteState=progressIcons.RecycleRedCircleIcon;
                        finalEvaluationState=<progressIcons.RejectRedRectIcon/>;
                        // secondDrafteStateData=unitItem.draft_2_status.review_reject_date? formatDateforStringData(unitItem.draft_2_status.review_reject_date):'';
                        secondDrafteStateData=''
                        finalEvaluationStateData=unitItem.draft_2_status.review_reject_date? formatDateforStringData(unitItem.draft_2_status.review_reject_date): '';
                    } else {} // 0 values

                    return (
                        <div key={unitItem.unit_id} className='progress-page-view-box-table-body-row'>
                            <div className='text-start pl-[20px] h-[60px] max-h-[60px] w-[440px] min-w-[440px] py-0 my-0'>
                                <span className='inline-flex gap-[10px] h-[60px] items-center'>
                                    <span className='progress-page-view-box-list-icon'>unit {unitItem.unit_index}</span>
                                    <span 
                                    // className='progress-page-view-box-list-label'
                                    style={{
                                        fontFamily: 'Nunito',
                                        fontWeight: 800,
                                        fontStyle: 'normal',
                                        fontSize: '16px',
                                        flexGrow: 0,
                                        fontStretch: 'normal',
                                        lineHeight: 'normal',
                                        letterSpacing: 'normal'
                                    }}
                                    >{unitItem.topic}</span>
                                </span>
                            </div>
                            <div className='w-[70px] h-[60px] max-h-[60px] mr-[40px]'>
                                <span className='progress-page-view-box-table-body-icons'>
                                    {firstDraftState}
                                    <DateText dateString={firstDraftStateData}/>
                                </span>
                            </div>
                            <div className='w-[70px] h-[60px] max-h-[60px] mr-[40px]'>
                                <span className='progress-page-view-box-table-body-icons'>
                                    {firstDraftFeedbackState}
                                    <DateText dateString={firstDraftFeedbackStateData}/>
                                </span>
                            </div>
                            <div className='w-[70px] h-[60px] max-h-[60px] mr-[40px]'>
                                <span className='progress-page-view-box-table-body-icons'>
                                    {secondDrafteState}
                                    <DateText dateString={secondDrafteStateData}/>
                                </span>
                            </div>
                            <div className='w-[70px] h-[60px] max-h-[60px]'>
                                <span className='progress-page-view-box-table-body-icons'>
                                    {finalEvaluationState}
                                    <DateText dateString={finalEvaluationStateData}/>
                                </span>
                            </div>
                            <div className='w-[140px] h-[60px] max-h-[60px]'>
                                <span className='inline-flex items-center justify-center h-[60px]'>
                                <ProgressPercent itemName={'unit1'} value={progressPercentValue}/>
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ProgressTable;