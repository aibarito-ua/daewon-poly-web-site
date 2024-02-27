import ReportItemComponents from "./ItemComponents/ReportItemComponents";
import ReportChart from '../reportChart';

const ReportByUnitComponent = (props: {
    reportByUnitAPIData: TReportByStudent
}) => {
    console.log('=== ReportByUnitComponent ===')
    console.log('reportByUnitAPIData ==',props.reportByUnitAPIData)
    return (
        <div className='flex flex-col w-full h-full'>
            <div className='flex flex-row justify-center items-center'>
                <span className='report-chart-report-by-unit-title'>
                {/* {unitReportModal.unitTitle} */}
                </span>
            </div>
            <div className='flex flex-row gap-[40px] justify-center'>
                <div className='flex'>
                    <ReportChart/>
                </div>
                <div className='report-chart-right-components-div pb-[20px] gap-[5px] relative'>
                    <ReportItemComponents.ReportWordCountSummaryComponent 
                        // item={reportByUnitData.wordCountSummary}
                        item={props.reportByUnitAPIData}
                    />
                    <ReportItemComponents.ReportCorrectionSummaryComponent 
                        item={props.reportByUnitAPIData}
                    />
                    <ReportItemComponents.ReportTeachersComments 
                        teacherComments = {props.reportByUnitAPIData.teacher_comments}
                    />
                </div>

            </div>
        </div>
    )
}

export default ReportByUnitComponent;