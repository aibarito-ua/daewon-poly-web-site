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
        textAlign: 'center',
        color: '#222',
        maxHeight: '10px',
        width: '55px',
        height: '10px',
        flexGrow: 0,
        lineHeight: 'normal',
    }}>{props.dateString}</span>
}
const ProgressTable = (props:any) => {
    const {
        data
    } = props;
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
        <table className={
            isElectron
            ?'w-[1010px] p-[10px]'
            :'w-full p-[10px]'
        }>
            <thead className='table-header-group'>
                <tr className='progress-page-view-box-table-head-row'>
                    <td className='w-[440px]'></td>
                    <THeadText str1='1st' str2='draft'/>
                    <THeadText str1='1st' str2='feedback'/>
                    <THeadText str1='2nd' str2='draft'/>
                    <THeadText str1='final' str2='evaluation'/>
                    <td className='w-[140px]'></td>
                </tr>
            </thead>
            <tbody className=''>
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
                        firstDraftStateData=unitItem.draft_1_status.review_reject_date? formatDateforStringData(unitItem.draft_1_status.review_reject_date): '';
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
                        secondDrafteStateData=unitItem.draft_2_status.review_reject_date? formatDateforStringData(unitItem.draft_2_status.review_reject_date):'';
                        finalEvaluationStateData=unitItem.draft_2_status.review_reject_date? formatDateforStringData(unitItem.draft_2_status.review_reject_date): '';
                    } else {} // 0 values

                    return (
                        <tr key={unitItem.unit_id} className='progress-page-view-box-table-body-row'>
                            <td className='text-start pl-[20px] h-[60px] max-h-[60px] py-0 my-0 bg-white'>
                                <span className='inline-flex gap-[10px] h-[60px] items-center'>
                                    <span className='progress-page-view-box-list-icon'>unit {unitItem.unit_index}</span>
                                    <span className=''>{unitItem.topic}</span>
                                </span>
                            </td>
                            <td className='h-[60px] max-h-[60px] py-0 my-0 bg-white'>
                                <span className='progress-page-view-box-table-body-icons'>
                                    {firstDraftState}
                                    <DateText dateString={firstDraftStateData}/>
                                </span>
                            </td>
                            <td className='h-[60px] max-h-[60px] py-0 my-0 bg-white'>
                                <span className='progress-page-view-box-table-body-icons'>
                                    {firstDraftFeedbackState}
                                    <DateText dateString={firstDraftFeedbackStateData}/>
                                </span>
                            </td><td className='h-[60px] max-h-[60px] py-0 my-0 bg-white'>
                                <span className='progress-page-view-box-table-body-icons'>
                                    {secondDrafteState}
                                    <DateText dateString={secondDrafteStateData}/>
                                </span>
                            </td><td className='h-[60px] max-h-[60px] py-0 my-0 bg-white'>
                                <span className='progress-page-view-box-table-body-icons'>
                                    {finalEvaluationState}
                                    <DateText dateString={finalEvaluationStateData}/>
                                </span>
                            </td>
                            <td className='w-[140px] h-[60px] max-h-[60px] py-0 my-0 bg-white'>
                                <span className='inline-flex items-center justify-center h-[60px]'>
                                <ProgressPercent itemName={'unit1'} value={progressPercentValue}/>
                                </span>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default ProgressTable;