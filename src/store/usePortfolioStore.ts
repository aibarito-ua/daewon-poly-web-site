import { create } from "zustand";

const usePortfolioStore = create<IUsePortfolioProps>((set,get) => ({
    // portfolio states
    // getter
    semesters: [],
    levels: [],
    selectSemester: '',
    selectLevel: '',

    // setter
    setSemesters: (data) => {
        set(()=>({semesters: data}))
    },
    setLevels: (data) => {
        set(()=>({levels:data}))  
    },
    setSelectSemester: (semesterLabel)=> {
        const semesters = get().semesters;
        let selectTargetData:TDropdownSelectBoxDataTypes = {
            label:'',level:'',semester:0,year:0
        }
        let dumpDisplayPortfolioData:TPortfolioLevel = JSON.parse(JSON.stringify(get().displayPortfolioData));
        if (semesterLabel==='') {
            dumpDisplayPortfolioData={
                book_name:'',
                level_name:'',
                unit_portfolios:[]
            }
        } else {
            for (let j = 0; j < semesters.length; j++) {
                if (semesters[j].label === semesterLabel) {
                    selectTargetData = semesters[j];
                    const data = get().portfolioApiData;
                    for (let i = 0; i < data.periods.length; i++) {
                        if (data.periods[i].semester === selectTargetData.semester && data.periods[i].year === selectTargetData.year) {
                            const currentPeriod = data.periods[i];
                            for (let l = 0; l < currentPeriod.levels.length; l++) {
                                if (currentPeriod.levels[l].level_name === selectTargetData.level) {
                                    dumpDisplayPortfolioData = currentPeriod.levels[l];
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    
                    break;
                }
            }
        }
        set(()=>({
            selectSemester:semesterLabel,
            displayPortfolioData: dumpDisplayPortfolioData,
        }))
    },
    setSelectLevel: (level) => {
        set(()=>({selectLevel:level}))
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
        let dumpSemester:TDropdownSelectBoxDataTypes[] = [];
        let dumpLevel:TDropdownSelectBoxDataTypes[] = [];
        for (let idx = 0; idx < data.periods.length; idx++) {
            const currentPeriod = data.periods[idx];
            const currentYear = currentPeriod.year;
            const currentSemester = currentPeriod.semester === 1? '1st': '2nd';
            const currentSemeterLabel = `${currentYear} - ${currentSemester} Semeter`;

            for (let lIdx = 0; lIdx < currentPeriod.levels.length; lIdx++) {
                const currentLevel = currentPeriod.levels[lIdx].level_name;
                const currentLevelLabel:TDropdownSelectBoxDataTypes = {
                    label: currentLevel,
                    year: currentYear,
                    semester: currentPeriod.semester,
                    level: currentLevel
                }
                dumpLevel.push(currentLevelLabel);
                const currentPushDataRow:TDropdownSelectBoxDataTypes ={
                    label: currentSemeterLabel,
                    year: currentYear,
                    semester: currentPeriod.semester,
                    level: currentLevel,
                }
                dumpSemester.push(currentPushDataRow)
            }

        }
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

        set(()=>({
            portfolioApiData:data,
            displayPortfolioData: dumpDisplayPortfolioData,
            semesters: dumpSemester,
            levels: dumpLevel,
            selectSemester: dumpSemester[0].label,
        }))
    }
}))

export default usePortfolioStore;