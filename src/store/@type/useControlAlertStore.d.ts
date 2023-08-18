interface IUseControlAlertStore {
    commonAlertOpenFlag: boolean;
    commonAlertMessage: string[]|JSX.Element[];
    commonAlertControllerFlag : number;
    commonAlertHeadTitle:string;
    commonAlertYesLabel:string;
    commonAlertNoLabel:string;
    commonAlertYesFunctionEvent: Function|null;
    commonAlertCloseEvent:Function|null;
    commonAlertOneButton: boolean;
    commonAlertType: TAlertType;

    setCommonAlertMessage: (messages: string[]) => void;
    setCommonAlertHeadTitle: (title:string) =>void;
    commonAlertOpen: (option?: TCommonAlertOpenOptions ) => void;
    commonAlertClose: () => void;

    // standby screen
    commonStandbyScreen: TCommonStandbyScreen,
    setCommonStandbyScreen: (controlData:TCommonStandbyScreen) => void;

    // unit report modal
    unitReportModalData: TUnitReportModalData,
    unitReportModal: TUnitReportModal,
    setUnitReportModal: (controlData: TUnitReportModal)=>void;

    // unit report score modal data
    unitRubricScoresData : TUnitScoreData,
    setUnitRubricScoresData: (data: TUnitRubricScore[], unit_index:number)=>void;
    
}
type TAlertType = ''|'warning'|'continue';
type TCommonAlertOpenOptions = {
    head?:string,
    yesButtonLabel?:string,
    noButtonLabel?:string,
    messages?:string[]|JSX.Element[],
    yesEvent?:Function,
    closeEvent?:Function,
    useOneButton?:boolean,
    alertType?: TAlertType,
}

// standby screen
type TCommonStandbyScreen = {
    openFlag: boolean
}
// unit report modal
type TUnitReportModal = {
    open: boolean,
    unitTitle: string,
}
type TUnitReportModalData = {
    wordCountSummary: TWordCountSummaryItem,
    correctionSummary: TCorrectionSummaryItem
}
type TWordCountSummaryItem = {
    title: string;
    draft_1st: {
            label: string,
            value: number,
        }[];
    draft_2nd: {
            label: string,
            value: number,
        }[];
}
// normal report correction type
type TCorrectionSummaryItem = {
    title: string;
    correction: {
        reason: 'grammar'|'spelling'|'punctuation',
        list: TCorrectionSentence[]
    }[]
}
type TCorrectionSentence = TCorrectionWord[];
type TCorrectionWord = [number, string];

type TAdminCommentsItem = {

}

// Report data
type TPrintReportDoughnutData ={
    target: string;
    data: {
        name: string;
        value: number;
    }[];
    addWidth: number;
    fitText: number;
}
type TUnitScoreData = {
    averageChartData: {
        dataPayload: TPrintReportDoughnutData
    };
    barChartData: TBarChartsData[];
    unitsData: TUnitRubricScore[];
    hexagonChartData: THexagonDoughnutData[];
    reportByUnit: TReportByUnitInfo;
}
type TReportByUnitInfo = {
    selectUnitInfo: {
        unit_index: number
    }
}
type TRubricScore = {
    name: string,
    score: number
}
type TUnitRubricScore = {
    unit_index: number,
    rubric_scores: TRubricScore[]
}
type TBarChartsData = {
    name: string;
    score: number;
    colors: {
        start: string;
        end: string;
    };
    customY: number;
}
type THexagonDoughnutData = {
    target: string;
    data: {
        name: string;
        value: number;
        selectName: string;
        fillColor: string;
        fillBorderColor: string;
        tooltip: {
            title:string,
            content: string
        }
    }[];
    addWidth: number;
    fitText: number;
    toolLineColor: string;
}