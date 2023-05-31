import { create } from 'zustand';

const useNavStore = create<INavItem>((set) => ({
    selectedMenu: "",
    selectedMenuTitle: "",
    sidebarFlagged: false,
    topNavHiddenFlagged: false,
    subNavTitleString: "",
    subRightNavTitleString: "",
    setSelectMenu: (selectdMenuStr: string, selectedMenuTitle: string) => {
        console.log("selectNumber :::", selectdMenuStr)
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
    setSubRightNavTitleString: (subRightNavTitleString: string)=>{
        set(()=>({subRightNavTitleString}))
    }
}))

export default useNavStore;