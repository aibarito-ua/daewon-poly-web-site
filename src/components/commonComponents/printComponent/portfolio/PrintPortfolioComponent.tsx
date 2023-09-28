import React from 'react';

interface IPortfolioComponentToPrintProps {
    portfolioModal: TPortfolioModal;
    displayPortfolioData: TPortfolioLevel;
    userInfo: TUserInfoData;
    currentOverall: JSX.Element[];
    multi: {
        maxPageNum: number;
        currentPageNum: number;
    }
    isMulti: boolean;
}

class PortfolioComponentToPrint extends React.PureComponent<IPortfolioComponentToPrintProps> {
    componentDidUpdate(prevProps: Readonly<IPortfolioComponentToPrintProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if (prevProps.portfolioModal.selectUnit !== this.props.portfolioModal.selectUnit) {
            this.forceUpdate();
        }
    }
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

    PortfolioCompletionDate = (portfolioModal:TPortfolioModal) => {
        const formatDate = (inputDate: string, split?:string): string => {
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
        const dates = portfolioModal.selectPortfolio.completion_date;
        let firstDate = '';
        let secondDate = '';
        for (let i = 0; i < dates.length; i++) {
            if (dates[i].draft_index===1) {
                const date = dates[i].date
                firstDate= `1st : ${formatDate(date,'-')}`
            } else if (dates[i].draft_index === 2) {
                const date = dates[i].date
                secondDate= `2nd : ${formatDate(date,'-')}`
            }
        }
        return {firstDate, secondDate}
    }
    setTitleJSX = (data:TUnitPortfolioContent[]) => {
        return data.map((item, itemIdx) => {
            if (item.name === 'Title') {
                const key = item.name+':'+item.order_index+':'+itemIdx+'-portfolio-print';
               return <span key={key} className='export-lm-wh-content-title-value'>{`Title : ${item.content}`}</span>;
            } else return null;
        })
    }

    render() {
        const {
            displayPortfolioData,
            portfolioModal,
            userInfo,
            currentOverall,
            multi, isMulti
        } = this.props;
        
        const dates = this.PortfolioCompletionDate(portfolioModal)
        
        return (
            <div className='print-container'>
                <div className='flex flex-col w-[210mm] h-[297mm] border-[1px] border-black bg-[#fff9f0]'>
                    {/* info row */}
                    <div className='flex flex-row justify-center items-center gap-[5.065mm] w-[185.294mm] h-[36.762mm] bg-white border-[0.24mm] border-[#0fa9cb] mt-[12.093mm] ml-[12.353mm] rounded-[7.3mm]'>
                        {/* icon */}
                        <div className='flex flex-col w-[24.212mm] h-[22.299mm] ml-[4.941mm] gap-[1.693mm]'>
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
                        <div className='flex flex-row w-[150.829mm] h-[24.186mm] border-l-[0.242mm] border-l-[#0fa9cb]'>
                            
                            <div className='flex flex-col pl-[4.818mm] gap-[5.321mm]'>
                                <div className='flex flex-col'>
                                    <div className='flex items-center export-portfolio-wr-userinfo-font-label'>{'level'}</div>
                                    <div className='flex items-start justify-center flex-col export-portfolio-wr-userinfo-font-value'>
                                        <span>{displayPortfolioData.level_name}</span>
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='flex items-center export-portfolio-wr-userinfo-font-label'>{'book'}</div>
                                    <div className='flex items-start justify-center flex-col export-portfolio-wr-userinfo-font-value'>
                                        <span>{displayPortfolioData.book_name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col pl-[6.176mm] gap-[5.321mm]'>
                                <div className='flex flex-col'>
                                    <div className='flex items-center export-portfolio-wr-userinfo-font-label'>{'class'}</div>
                                    <div className='flex items-start justify-center flex-col export-portfolio-wr-userinfo-font-value'>
                                        <span>{userInfo.className}</span>
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='flex items-center export-portfolio-wr-userinfo-font-label'>{'unit'}</div>
                                    <div className='flex items-start justify-center flex-col export-portfolio-wr-userinfo-font-value'>
                                        <span>{portfolioModal.displayTitle}</span>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-1 flex-col pl-[6.176mm] gap-[5.321mm]'>
                                <div className='flex flex-col'>
                                    <div className='flex items-center export-portfolio-wr-userinfo-font-label'>{'student'}</div>
                                    <div className='flex items-center flex-row export-portfolio-wr-userinfo-font-value'>
                                        <span>{userInfo.userCode}</span>
                                        <span>{`${userInfo.memberNameKr}(${userInfo.memberNameEn})`}</span>
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='flex items-center export-portfolio-wr-userinfo-font-label'>{'date completed'}</div>
                                    <div className='flex items-center flex-row export-portfolio-wr-userinfo-font-value'>
                                    <span>{dates.firstDate}</span>
                                    <span className='w-[0.247mm] h-[1.935mm] bg-[#aaa]'></span>
                                    <span>{dates.secondDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                    {/* content */}
                    <div className='flex px-[12.353mm] w-[185.294mm] h-[231.215mm] bg-white mt-[4.837mm] ml-[12.353mm] border-[0.24mm] border-[#0fa9cb] rounded-[7.3mm] relative z-0'>
                        {portfolioModal.isCrown && <div className='absolute right-[40px] bg-portfolio-unit-modal-crown-ic-svg bg-no-repeat w-[60px] h-[50px] ' />}
                        {multi.currentPageNum===1 && portfolioModal.contentTitle.length > 0 &&
                            <div className='absolute top-[14.511mm] -left-[4.941mm] h-[13.060mm] flex items-center px-[4.447mm] rounded-r-[6.530mm] bg-[#0fa9cb] text-white'>
                                {/* <span className='export-lm-wh-content-title-value'></span> */}
                                {this.setTitleJSX(portfolioModal.selectPortfolio.contents)}
                                <div className='export-portfolio-content-title-deco absolute -bottom-[4.7mm] left-0 -z-10'/>
                            </div>
                        }

                        {/* content body */}
                        {multi.currentPageNum===1 && 
                            <div className='mt-[36.279mm] w-[160.588mm] h-[185.262mm]'>{currentOverall}</div>
                        }
                        {multi.currentPageNum!==1 &&
                            <div className='mt-[14.511mm] w-[160.588mm] h-[202.676mm]'>{currentOverall}</div>
                        }

                        {/* page */}
                        {isMulti && 
                            <div className='absolute bottom-0 flex flex-row w-[160.588mm] h-[9.674mm] justify-center'>
                                <div className=' export-lm-wh-draft-info-numbering-div'>
                                    {`- ${multi.currentPageNum} / ${multi.maxPageNum} -`}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default PortfolioComponentToPrint;