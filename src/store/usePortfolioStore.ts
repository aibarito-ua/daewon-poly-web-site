import { create } from "zustand";

const usePortfolioStore = create<IUsePortfolioProps>((set,get) => ({
    // portfolio states
    // getter
    // semesters: [],
    // levels: [],
    portfolioSelectFinder: {
        label:'', level:'', semester:0, year:0
    },
    portfolioSelectBoxValue: [],
    selectSemester: '',
    selectLevel: '',
    
    // setter
    // 전체 검색 데이터
    setPortfolioSelectBoxValue: (data) => {
        set(()=>({portfolioSelectBoxValue:data}))
    },
    // select된 데이터
    setPortfolioSelectFinder: (data) => {
        set(()=>({portfolioSelectFinder:data}))
    },
    // setSemesters: (data) => {
    //     set(()=>({semesters: data}))
    // },
    // setLevels: (data) => {
    //     set(()=>({levels:data}))  
    // },
    setSelectSemester: (semesterLabel)=> {
        const dumpPortfolioSelectBoxValue: TReportPageSelectBoxDatas[] = get().portfolioSelectBoxValue;
        
        const data = get().portfolioApiData;
        // default set selected finder 
        let dumySelectedFinder:TDropdownSelectBoxDataTypes = {
            label:'',level:'',semester:0,year:0
        }
        if (dumpPortfolioSelectBoxValue.length > 0) {
            let dumpDisplayPortfolioData:TPortfolioLevel = JSON.parse(JSON.stringify(get().displayPortfolioData));
            dumpDisplayPortfolioData={
                book_name:'',
                level_name:'',
                unit_portfolios:[]
            }
            for (let i = 0; i < dumpPortfolioSelectBoxValue.length; i++) {
                if (dumpPortfolioSelectBoxValue[i].label === semesterLabel) {
                    dumySelectedFinder.year = dumpPortfolioSelectBoxValue[i].year
                    dumySelectedFinder.semester = dumpPortfolioSelectBoxValue[i].semester
                    dumySelectedFinder.label = dumpPortfolioSelectBoxValue[i].label
                    dumySelectedFinder.level = ''
                }
            }
            
            set(()=>({
                selectSemester:semesterLabel,
                selectLevel: '',
                portfolioSelectFinder: dumySelectedFinder,
                displayPortfolioData: dumpDisplayPortfolioData,
            }))
        }
    },
    setSelectLevel: (level) => {
        // let dumpDisplayPortfolioData:TPortfolioLevel = JSON.parse(JSON.stringify(get().displayPortfolioData));
        // for (let i = 0; i < data.periods.length; i++) {
        //     if (data.periods[i].semester === userInfo.semester && data.periods[i].year === userInfo.year) {
        //         const currentPeriod = data.periods[i];
        //         for (let l = 0; l < currentPeriod.levels.length; l++) {
        //             if (currentPeriod.levels[l].level_name === userInfo.courseName) {
        //                 dumpDisplayPortfolioData = currentPeriod.levels[l];
        //                 break;
        //             }
        //         }
        //         break;
        //     }
        // }
        const dumpPortfolioSelectBoxValue: TReportPageSelectBoxDatas[] = get().portfolioSelectBoxValue;
        const semesterLabel = get().selectSemester;
        let currentSelectedFinder = get().portfolioSelectFinder;
        
        const data = get().portfolioApiData;
        if (dumpPortfolioSelectBoxValue.length > 0) {
            let dumpDisplayPortfolioData:TPortfolioLevel = JSON.parse(JSON.stringify(get().displayPortfolioData));
            if (level!== '') {
                for (let i = 0; i < data.periods.length; i++) {
                    if (data.periods[i].semester === currentSelectedFinder.semester && data.periods[i].year === currentSelectedFinder.year) {
                        const currentPeriod = data.periods[i];
                        for (let l = 0; l < currentPeriod.levels.length; l++) {
                            if (currentPeriod.levels[l].level_name === level) {
                                currentSelectedFinder.level = level;
                                dumpDisplayPortfolioData = currentPeriod.levels[l];
                                break;
                            }
                        }
                    }
                }
            } else {
                dumpDisplayPortfolioData={
                    book_name:'',
                    level_name:'',
                    unit_portfolios:[]
                }
            }
            
            set(()=>({
                selectLevel: level,
                portfolioSelectFinder: currentSelectedFinder,
                displayPortfolioData: dumpDisplayPortfolioData,
            }))
        }

    },

    // portfolio modal control
    portfolioModal: {
        open: false,
        isNext: false,
        isPrev: false,
        menuControll: 0,
        selectUnit: 0,
        displayTitle: '',
        isCrown:false,
        contentTitle:[],
        contentBody:[],
        selectPortfolio: {
            completion_date: [],
            contents:[],
            total_score:0,
            unit_index: 0,
            unit_name: '',
        }
    },
    setPortfolioModal: (data) => {

        if (data.open) {
            const unitPortfolios = get().displayPortfolioData;
            
            let nextUnits = false;
            let prevUnits = false;
            for (let i = 0; i < unitPortfolios.unit_portfolios.length; i++) {
                if (unitPortfolios.unit_portfolios[i].unit_index > data.selectUnit) {
                    nextUnits = true;
                } else if (unitPortfolios.unit_portfolios[i].unit_index < data.selectUnit) {
                    prevUnits = true;
                } else {
                    // ===
                    const currentData = unitPortfolios.unit_portfolios[i];
                    data.selectPortfolio = currentData;
                    const title = `Unit ${currentData.unit_index}. ${currentData.unit_name}`;
                    data.displayTitle = title;
                    const avr = (currentData.total_score/60*100) >= 80?true:false;
                    data.isCrown=avr;
                    for (let j = 0; j < currentData.contents.length; j++) {
                        if (currentData.contents[j].name === 'Title') {
                            data.contentTitle = currentData.contents[j].content.split('\n');
                        } else {
                            data.contentBody = currentData.contents[j].content.split('\n');
                        }
                    }

                }
            }
            if (prevUnits) {
                data.isPrev=true;
            } else {
                data.isPrev=false;
            }

            if (nextUnits) {
                data.isNext=true;
            } else {
                data.isNext=false;
            }
        }
        set(()=>({
            portfolioModal: data
        }))
    },
    setPortfolioModalClose: () => {
        const portfolioModal = get().portfolioModal;
        portfolioModal.open = false;
        set(()=>({
            portfolioModal
        }))
    },
    portfolioApiData: {
        periods: []
    },
    displayPortfolioData: {
        level_name: "",
        book_name: "",
        unit_portfolios: []
    },
    setPortfolioApiData: (data, userInfo) => {
        // let dumpSemester:TDropdownSelectBoxDataTypes[] = [];
        // let dumpLevel:TDropdownSelectBoxDataTypes[] = [];
        
        let dumySelectFinderValue: TReportPageSelectBoxDatas[] = [];

        for (let idx = 0; idx < data.periods.length; idx++) {
            const currentPeriod = data.periods[idx];
            const currentYear = currentPeriod.year;
            const currentSemester = currentPeriod.semester === 1? '1st': '2nd';
            const currentSemesterLabel = `${currentYear} - ${currentSemester} Semester`;
            const currentLevels = currentPeriod.levels.map((item)=>{
                return {name:item.level_name}
            })
            let finderValueItem:TReportPageSelectBoxDatas = {
                label: currentSemesterLabel,
                semester: currentPeriod.semester,
                year: currentPeriod.year,
                level: currentLevels
            };
            // resort 0 index to current level
            finderValueItem.level = [
                ...finderValueItem.level.filter(d => d.name === userInfo.courseName),
                ...finderValueItem.level.filter(d => d.name !== userInfo.courseName)
            ];
            dumySelectFinderValue.push(finderValueItem);
        };
        // default set selected finder 
        let dumySelectedFinder:TDropdownSelectBoxDataTypes = {
            label:'',level:'',semester:0,year:0
        }
        for (let dIdx = 0; dIdx < dumySelectFinderValue.length; dIdx++) {
            const currentDumySelectedFinderValue = dumySelectFinderValue[dIdx];
            if (currentDumySelectedFinderValue.year === userInfo.year && currentDumySelectedFinderValue.semester === userInfo.semester) {
                for (let innerIdx = 0; innerIdx < currentDumySelectedFinderValue.level.length; innerIdx++) {
                    const currentInnerData = currentDumySelectedFinderValue.level[innerIdx];
                    if (currentInnerData.name === userInfo.courseName) {
                        dumySelectedFinder.label = currentDumySelectedFinderValue.label;
                        dumySelectedFinder.level = currentInnerData.name;
                        dumySelectedFinder.semester = currentDumySelectedFinderValue.semester;
                        dumySelectedFinder.year = currentDumySelectedFinderValue.year;
                        break;
                    }
                }
                break;
            }
        };

        let dumpDisplayPortfolioData:TPortfolioLevel = JSON.parse(JSON.stringify(get().displayPortfolioData));
        for (let i = 0; i < data.periods.length; i++) {
            if (data.periods[i].semester === userInfo.semester && data.periods[i].year === userInfo.year) {
                const currentPeriod = data.periods[i];
                for (let l = 0; l < currentPeriod.levels.length; l++) {
                    if (currentPeriod.levels[l].level_name === userInfo.courseName) {
                        dumpDisplayPortfolioData = currentPeriod.levels[l];
                        break;
                    }
                }
                break;
            }
        }
        // const checkSemester = dumpSemester.length === 0 ? false:true;

        set(()=>({
            portfolioApiData:data,
            displayPortfolioData: dumpDisplayPortfolioData,
            portfolioSelectBoxValue: dumySelectFinderValue,
            portfolioSelectFinder: dumySelectedFinder,
            selectLevel: dumySelectedFinder.level,
            selectSemester: dumySelectedFinder.label,
        }))
    },
    forceReadOnlyPortfolioSelectBox: [],
    setForceReadOnlyPortfolioSelectBox: (flags) => {
        set(()=>({forceReadOnlyPortfolioSelectBox:flags}))
    },
}))

export default usePortfolioStore;