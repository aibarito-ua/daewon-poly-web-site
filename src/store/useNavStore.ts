import { create } from 'zustand';

const useNavStore = create<INavItem>((set) => ({
    secondGenerationOpen: false,
    selectedMenu: "",
    selectedMenuTitle: "",
    sidebarFlagged: false,
    topNavHiddenFlagged: false,
    subNavTitleString: "",
    subRightNavTitleString: "",
    // unit info
    selectUnitInfo: {
        main: '',
        sub: ''
    },

    setSelectMenu: (selectdMenuStr: string, selectedMenuTitle?: string) => {
        if (selectedMenuTitle) {
            console.log("selectedMenuTitle::,",selectedMenuTitle)
            set(()=>({selectedMenu:selectdMenuStr, selectedMenuTitle}))
        } else {
            console.log("selectNumber :::", selectdMenuStr)
            set(()=>({selectedMenu:selectdMenuStr}))
        }
    },
    setSidebarFlagged: (sidebarFlagged:boolean) => {
        set(()=>({sidebarFlagged}))
    },
    setTopNavHiddenFlagged: (topNavHiddenFlagged: boolean)=> {
        set(()=>({topNavHiddenFlagged}))
    },
    setSubNavTitleString: (subNavTitleString: string) => {
        set(()=>({subNavTitleString}))
    },
    setSubRightNavTitleString: (subRightNavTitleString: string|JSX.Element)=>{
        set(()=>({subRightNavTitleString}))
    },
    setSelectUnitInfo: (unitMainTitle: string, unitSubTitle: string)=>{
        const unitInfo: TUnitTitleItem = {
            main: unitMainTitle, sub: unitSubTitle
        };
        set(()=>({selectUnitInfo: unitInfo}))
    },

    // unit back event
    goBackFromDraftInUnitPage: null,
    setGoBackFromDraftInUnitPage: (event) => {
        if (event) {
            set(()=>({goBackFromDraftInUnitPage: event}))
        } else {
            set(()=>({goBackFromDraftInUnitPage: null}))
        }
    }
}))

export default useNavStore;