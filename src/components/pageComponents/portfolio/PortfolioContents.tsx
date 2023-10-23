import React from "react";
import usePortfolioStore from "../../../store/usePortfolioStore";
interface IPortfolioContentComponentsProps {

}
export default function PortfolioContents (props: IPortfolioContentComponentsProps) {

    const {} = props;
    const {
        displayPortfolioData,
        portfolioModal, setPortfolioModal,
        selectSemester, selectLevel,
        semesters,
    } = usePortfolioStore();
    const [viewJSX, setViewJSX] = React.useState<JSX.Element[]>([]);
    React.useEffect(()=>{
        console.log('displayPortfolioData ==',displayPortfolioData)
        console.log('semesters all data =',semesters)
        let dumpViewJSX=[]
        for (let i = 0; i < 5; i++) {
            const data = displayRow(i+1);
            dumpViewJSX.push(data);
        }
        setViewJSX(dumpViewJSX)
        
    },[displayPortfolioData])

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    const displayRow = (index:number) => {
        const portfoliosData = displayPortfolioData.unit_portfolios;
        let checkIsOpen = [];
        let unitLabel = '';
        let contentJSX:JSX.Element|null = null;
        for (let i = 0; i < portfoliosData.length; i++) {
            if (portfoliosData[i].unit_index === index) {
                const key = displayPortfolioData.level_name+displayPortfolioData.book_name+i;
                const currentData = portfoliosData[i];
                checkIsOpen.push(currentData.unit_index);
                const completionDate = currentData.completion_date[0].draft_index===2? currentData.completion_date[0].date: currentData.completion_date[1].date;
                const date= formatDate(completionDate);
                unitLabel = `Unit ${currentData.unit_index}.`
                const topicLabel = currentData.unit_name;
                // crown check
                const totalScore = currentData.total_score;
                const avr = totalScore/60 * 100;
                const checkCrown = avr>=80?true:false;

                contentJSX = <div key={key}
                className="w-[300px] h-[206px] bg-no-repeat bg-portfolio-unit-open-bg-svg bg-cover relative select-none hover:cursor-pointer"
                onClick={()=>{
                    let data = portfolioModal;
                    data.open=true;
                    data.selectUnit=currentData.unit_index;
                    data.menuControll=0;
                    setPortfolioModal(data);
                }}
                >
                    <div className="absolute top-[94px] left-[30px] portfolio-contents-date-font">{date}</div>
                    <div className="absolute top-[123px] left-[30px] flex flex-col items-start h-[49px] justify-between">
                        <span className="portfolio-contents-label-font">{unitLabel}</span>
                        <span className="portfolio-contents-label-font">{topicLabel}</span>
                    </div>
                    {checkCrown && <div className="absolute top-0 right-[20px] w-[60px] h-[65px] bg-portfolio-unit-crown-ic-svg bg-cover bg-no-repeat"/>}
                </div>;
                break;
            }
        }
        if (contentJSX!==null) {
            return contentJSX;
        } else {
            return <div className="w-[300px] h-[206px] bg-no-repeat bg-portfolio-unit-lock-bg-svg bg-cover relative flex">
                <div className="absolute top-[123px] left-[120px] portfolio-contents-null-font">
                    {`Unit ${index}`}
                </div>
            </div>
        }
    }
    return <div className={
        window.navigator.userAgent.toLowerCase().indexOf('electron') > -1 
        ? "portfolio-container-wrap-electron"
        : "portfolio-container-wrap"
    }>
        <div className="flex flex-col gap-[15px]">
            <div className="flex flex-row w-full h-fit justify-center items-center gap-[20px]">
                {/* {displayRow(1)}
                {displayRow(2)} */}
                {viewJSX[0]}
                {viewJSX[1]}

            </div>
            <div className="flex flex-row w-full h-fit justify-center items-center gap-[20px]">
            {displayRow(3)}
            {displayRow(4)}
            {displayRow(5)}
            </div>
        </div>
    </div>
}
