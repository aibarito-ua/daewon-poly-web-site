interface IUsePortfolioProps {
    // in portfolio states
    // getter
    semesters:TDropdownSelectBoxDataTypes[];
    levels:TDropdownSelectBoxDataTypes[];
    selectSemester: string;
    selectLevel: string;
    // setter
    setSemesters: (data:TDropdownSelectBoxDataTypes[])=>void;
    setLevels: (data:TDropdownSelectBoxDataTypes[]) => void;
    setSelectSemester: (data:string) => void;
    setSelectLevel: (data:string) => void;

    // api dates
    portfolioApiData: TPortfolioAPIData;
    setPortfolioApiData: (data:TPortfolioAPIData, userInfo:TUserInfoData) => void;
    displayPortfolioData: TPortfolioLevel;
    
    // modal control
    portfolioModal: TPortfolioModal;
    setPortfolioModal: (data:TPortfolioModal) => void;
    setPortfolioModalClose: () => void;
}
// portfolio modal control
type TPortfolioModal = {
    open:boolean;
    isPrev: boolean;
    isNext: boolean;
    menuControll: number;
    selectUnit: number;
    displayTitle: string;
    isCrown:boolean;
    contentTitle:string[];
    contentBody:string[];
    selectPortfolio: TUnitPortfolio;
}
// api response data
type TPortfolioAPIData = {
    periods: TPortfolioPeriod[]
}
type TPortfolioPeriod = {
    year:number;
    semester: number;
    levels: TPortfolioLevel[]
}
type TPortfolioLevel = {
    level_name:string;
    book_name:string;
    unit_portfolios:TUnitPortfolio[] 
}
type TUnitPortfolio = {
    unit_index:number;
    unit_name: string;
    completion_date: TReportByStudentCompletionDate[];
    contents: TUnitPortfolioContent[];
    total_score: number;
}
type TUnitPortfolioContent = {
    content:string;
    name:string;
    order_index:number;
}
