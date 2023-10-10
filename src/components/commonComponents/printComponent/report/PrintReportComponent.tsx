import React from 'react';
import PrintReportBarChart from '../../../chartComponents/printReportBarChart'
import PrintReportDoughnutChart from '../../../chartComponents/printReportDoughnutChart'

interface IReportComponentToPrintProps {
    reportModalRubricData: TRubricInfo[];
    // unitReportsData: TUnitReportsData[];
    // unitRubricScoresData: TUnitScoreData;
    reportSelectFinder: TDropdownSelectBoxDataTypes;
    reportSelectUnit: number;
    userInfo: TUserInfoData;
    currentOverall: JSX.Element[];

    unitLabel:string;
    unitReportData: TReportByStudent;
    reportSelectBookName: string;
    multi: {
        maxPageNum: number;
        currentPageNum: number;
    }
    isMulti: boolean;
}

class ReportComponentToPrint extends React.PureComponent<IReportComponentToPrintProps> {
    formatDate = (inputDate: string, split?:string): string => {
        const date = new Date(inputDate);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        // formattedData = 월/일/년도
        // Replace '/' with '.'
        const replaceDate = formattedDate.split('/');
    
        // change locate
        const splitStr = split ? split : '.'
        return `${replaceDate[2]}${splitStr}${replaceDate[0]}${splitStr}${replaceDate[1]}`
    }

    getCategoryColor = (category:string) => {
        if (category==='ideas') {
            return '#588ee1'
        } else if (category==='organization') {
            return '#f6914d'
        } else if (category==='voice') {
            return '#aa6bd4'
        } else if (category==='word choice') {
            return '#30c194'
        } else if (category==='sentence fluency') {
            return '#6865cc'
        } else if (category==='conventions') {
            return '#db5757'
        } else {
            return ''
        }
    }

    skillAnalysisComponent = (
        key: string,
        category: string,
        aimed_result: string[],
        score_name: string,
        score_desc: string,
    ) => {
        const colors = this.getCategoryColor(category);
        
        score_name = score_name.replace('_', ' ')
        
        // 52.483
        return <div key={key} className={`flex w-[98.824mm] h-[52.483mm]`}>
            <div className={`flex flex-col w-[98.824mm] h-[49.339mm] mt-[3.144mm] border-[0.24mm] rounded-[4.89mm] relative`} style={{
                borderColor: colors
            }}>
                <div className={`absolute w-[35.082mm] h-[6.530mm] pt-[1.1mm] rounded-[3.265mm] left-[31.871mm] -top-[3.144mm] export-report-wr-sa-title-font`} style={{
                    backgroundColor: colors
                }}>{category}</div>

                {/* aimed result */}
                <div className='flex export-report-wr-sa-ar-title uppercase ml-[4.941mm] mt-[1.451mm]'>{'aimed result'}</div>
                <ul className='list-disc list-inside export-report-wr-sa-ar-value ml-[4.941mm] h-[12.335mm]'>
                    {aimed_result.map((aimedResult, aimedResultIdx) => {
                        return <li className='' key={'print-aimed-result-'+aimedResultIdx}>{aimedResult}</li>
                    })}
                </ul>
                {/* score */}
                <div className='flex export-report-wr-sa-ar-title uppercase ml-[4.941mm] mt-[1.451mm]'>{score_name}</div>
                <p className='export-report-wr-sa-ar-value ml-[4.941mm]'>{score_desc}</p>
            </div>

        </div>
    }
    skillAnalysisAllComp = (skillAnalysis:{
        category: string;
        aimed_result: string[];
        score_name: string;
        score_desc: string;
    }[]) => {
        
        return skillAnalysis.map((skillAnalysisItem, skillAnalysisIdx) => {
            const key = `skill-analysis-item-${skillAnalysisIdx}-${skillAnalysisItem.category}`
            return this.skillAnalysisComponent(key,skillAnalysisItem.category, skillAnalysisItem.aimed_result, skillAnalysisItem.score_name, skillAnalysisItem.score_desc);
        })
    }

    render() {
        const {
            reportModalRubricData,
            reportSelectFinder,
            reportSelectUnit,
            // reportSelectedOverallBarChart,
            // reportSelectedOverallPieChart,
            // unitReportsData,
            // unitRubricScoresData,

            unitLabel,
            reportSelectBookName,
            unitReportData,
            userInfo,
            currentOverall,
            multi, isMulti
        } = this.props;

        let completeDate1stBF = unitReportData.completion_date.length>0 ? (unitReportData.completion_date[0].draft_index===1?unitReportData.completion_date[0].date:unitReportData.completion_date[1].date):'';
        let completeDate2ndBF = unitReportData.completion_date.length>0 ? (unitReportData.completion_date[0].draft_index===2?unitReportData.completion_date[0].date:unitReportData.completion_date[1].date):'';
        
        const completeDate1st = this.formatDate(completeDate1stBF,'-')
        const completeDate2nd = this.formatDate(completeDate2ndBF,'-')
        const sortLabels = [
            'ideas',
            'organization',
            'voice',
            'word choice',
            'sentence fluency',
            'conventions',
        ];
        
        const skillAnalysis = sortLabels.map((categoryName) => {

            
            let aimed_result:string[]=[];
            let score_name:string='';
            let score_desc:string='';
            let rubricDesc:TRubricTypeDataItem[]=[];
            let rubricSc = unitReportData.rubric.categories;
            
            for (let j = 0; j < reportModalRubricData.length; j++) {
                if (reportModalRubricData[j].unit_index === reportSelectUnit) {
                    const currentRubricByUnit = reportModalRubricData[j].rubric; 
                    rubricDesc = currentRubricByUnit.rubric_description

                }
            }


            for (let i = 0; i < rubricSc.length; i++ ) {
                const currentRubricSc = rubricSc[i];
                for (let j = 0; j < rubricDesc.length; j++) {
                    const currentRubricDesc = rubricDesc[j];
                    if (currentRubricSc.category === categoryName && currentRubricDesc.category === categoryName) {
                        aimed_result = currentRubricDesc.explanation;
                        const scNm = currentRubricSc.score;
                        score_name = scNm=== 10 ? 'excellent': ( scNm===8 ? 'very_good': ( scNm===6 ? 'good': (scNm===4?'fair': 'poor')));
                        score_desc = scNm=== 10 ? currentRubricDesc.excellent: ( 
                            scNm===8 ? currentRubricDesc.very_good: ( 
                                scNm===6 ? currentRubricDesc.good: (
                                    scNm===4?currentRubricDesc.fair: currentRubricDesc.poor)));
                        return {
                            category: categoryName,
                            aimed_result, score_name, score_desc
                        }
                        
                    }
                }
            }
            return {
                category: categoryName,
                aimed_result, score_name, score_desc
            }

        })
        // comment
        // const ov_comments = reportByUnitAPIData.teacher_comments[0].draft_index===2? reportByUnitAPIData.teacher_comments[0].comment : reportByUnitAPIData.teacher_comments[1].comment;
        // const ov_comments_split = ov_comments.split('\n');
        // console.log('ov_comments_split ==',ov_comments_split)
        return (
            <div className='print-container'>
                <div className='flex flex-col w-[210mm] h-[297mm] bg-white'>
                    {/* info row */}
                    <div className='flex flex-row gap-[7.659mm]'>
                        {/* icon */}
                        <div className='flex flex-col w-[24.212mm] h-[22.299mm] ml-[7.659mm] mt-[7.498mm] gap-[1.693mm]'>
                            <div className='flex w-[9.388mm] h-[11.125mm] ml-[7.659mm] bg-center bg-no-repeat bg-report-ic-wr'/>

                            <div className='flex flex-col w-[24.212mm] h-[7.498mm] justify-center items-center'>
                                <div className='export-lm-wh-font-gothamrounded' style={{
                                    fontSize: '3.870mm',
                                    lineHeight: '4.595mm'
                                }}>Writing Hub</div>
                                <div className='export-lm-wh-font-sub-title' style={{
                                    fontSize: '2.902mm',
                                    lineHeight:'4.353mm'
                                }}>spark writing</div>
                            </div>
                        </div>

                        {/* user info */}
                        <div className='flex flex-col w-[165.529mm] h-[27.814mm] border-t-[0.242mm] border-t-[#111] mt-[4.837mm]'>
                            <div className='flex flex-row border-b-[0.242mm] border-b-[#ddd]'>
                                <div className='flex items-center pl-[2.471mm] w-[27.671mm] h-[12.335mm] bg-[#f2f9ff] export-report-wr-userinfo-font-label'>{'level / class'}</div>
                                <div className='flex items-start justify-center pl-[2.471mm] w-[61.765mm] flex-col export-report-wr-userinfo-font-value'>
                                    <span>{reportSelectFinder.level}/</span>
                                    <span>{userInfo.courseName}</span>
                                </div>
                                <div className='flex items-center pl-[2.471mm] w-[17.047mm] h-[12.335mm] bg-[#f2f9ff] export-report-wr-userinfo-font-label'>{'student'}</div>
                                <div className='flex items-start justify-center flex-col pl-[2.471mm] export-report-wr-userinfo-font-value'>
                                    <span>{userInfo.userCode}</span>
                                    <span>{`${userInfo.memberNameKr}(${userInfo.memberNameEn})`}</span>
                                </div>
                            </div>
                            <div className='flex flex-row border-b-[0.242mm] border-b-[#ddd]'>
                                <div className='flex items-center pl-[2.471mm] w-[27.671mm] h-[7.256mm] bg-[#f2f9ff] export-report-wr-userinfo-font-label'>{'book'}</div>
                                <div className='flex items-start justify-center pl-[2.471mm] w-[61.765mm] flex-col export-report-wr-userinfo-font-value'>
                                    <span>{reportSelectBookName}</span>
                                </div>
                                <div className='flex items-center pl-[2.471mm] w-[17.047mm] h-[7.256mm] bg-[#f2f9ff] export-report-wr-userinfo-font-label'>{'unit'}</div>
                                <div className='flex items-start justify-center flex-col pl-[2.471mm] export-report-wr-userinfo-font-value'>
                                    <span>{unitLabel}</span>
                                </div>
                            </div>
                            <div className='flex flex-row border-b-[0.242mm] border-b-[#ddd]'>
                                <div className='flex items-center pl-[2.471mm] w-[27.671mm] h-[7.256mm] bg-[#f2f9ff] export-report-wr-userinfo-font-label'>{'date completed'}</div>
                                <div className='flex items-center justify-start pl-[2.471mm] flex-row export-report-wr-userinfo-font-value gap-[1.235mm]'>
                                    <span>{`1st : ${completeDate1st}`}</span>
                                    <span className='w-[0.247mm] h-[1.935mm] bg-[#aaa]'></span>
                                    <span>{`2nd : ${completeDate2nd}`}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                
                    {/* evaluation graph */}
                    {multi.currentPageNum === 1 && 
                        <div className='flex flex-col w-[200.118mm] h-[49.339mm] gap-[1.209mm] mt-[3.628mm] ml-[4.941mm]'>
                            <div className='flex flex-row justify-center export-report-wr-big-title-font'>Evaluation Graph</div>
                            <div className='flex flex-row justify-center items-center w-[200.118mm] h-[43.534mm] border-[0.24mm] rounded-[4.88mm] bg-[#f9f9f9]'>
                                <PrintReportDoughnutChart />
                                <PrintReportBarChart />
                                
                            </div> 
                        </div>
                    }

                    {/* skill analysis */}
                    {multi.currentPageNum === 1 && 
                        <div className='flex flex-col w-[200.118mm] h-[164.463mm] mt-[3.628mm] ml-[4.941mm]'>
                            <div className='flex flex-row justify-center export-report-wr-big-title-font'>Skill Analysis</div>
                            <div className='grid grid-cols-2 grid-rows-3 justify-center items-center w-[200.118mm] h-[159.867mm]'>
                                {this.skillAnalysisAllComp(skillAnalysis)}
                                
                            </div> 
                        </div>
                    }       

                    {/* overall comment */}
                    {!isMulti && multi.currentPageNum === 1 && 
                        <div className='flex flex-col w-[200.118mm] h-[34.827mm] gap-[1.209mm] mt-[3.628mm] ml-[4.941mm]'>
                            <div className='flex flex-row justify-center export-report-wr-big-title-font'>Overall Comments</div>
                            <div className='flex flex-col justify-start items-start w-[200.118mm] h-[29.023mm] border-[0.24mm] rounded-[4.88mm] px-[3.706mm] py-[3.628mm]'>
                                {currentOverall}
                            </div> 
                        </div>
                    }
                    {/* muiti page */}
                    {isMulti && multi.currentPageNum === 1 && 
                        <div className='flex flex-col w-[200.118mm] h-[26.362mm] gap-[1.209mm] mt-[3.628mm] ml-[4.941mm]'>
                            <div className='flex flex-row justify-center export-report-wr-big-title-font'>Overall Comments</div>
                            <div className='flex flex-col justify-start items-start w-[200.118mm] h-[20.558mm] border-[0.24mm] rounded-[4.88mm] px-[3.706mm] py-[3.628mm]'>
                                {currentOverall}
                            </div> 
                        </div>
                    }
                    {multi.currentPageNum !== 1 &&
                        <div className='flex flex-col w-[200.118mm] h-full max-h-[246.694mm] gap-[1.209mm] mt-[3.628mm] ml-[4.941mm]'>
                            <div className='flex flex-row justify-center export-report-wr-big-title-font'>Overall Comments</div>
                            <div className='flex flex-col justify-start items-start w-[200.118mm] h-fit border-[0.24mm] rounded-[4.88mm] px-[3.706mm] py-[3.628mm]'>
                                {currentOverall}
                            </div> 
                        </div>
                    }
                    {isMulti && 
                        <div className='flex w-full h-[13.302mm] pt-[4.837mm] justify-center export-report-wr-multi-values'>
                            {`- ${multi.currentPageNum} / ${multi.maxPageNum} -`}
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default ReportComponentToPrint;