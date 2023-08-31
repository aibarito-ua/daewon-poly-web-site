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

    setSelectMenu: (selectdMenuStr: string, selectedMenuTitle: string) => {
        console.log("selectNumber :::", selectdMenuStr)
        console.log("selectedMenuTitle::,",selectedMenuTitle)
        set(()=>({selectedMenu:selectdMenuStr, selectedMenuTitle}))
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
    }
}))

export default useNavStore;