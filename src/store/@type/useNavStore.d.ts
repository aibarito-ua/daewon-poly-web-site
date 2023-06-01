interface INavItem {
    selectedMenu: TStudentNavItem | string;
    setSelectMenu:any;
    sidebarFlagged: boolean;
    setSidebarFlagged: any;
    topNavHiddenFlagged: boolean;
    setTopNavHiddenFlagged: any;
    subNavTitleString: string;
    setSubNavTitleString: any;
    subRightNavTitleString: string|JSX.Element;
    setSubRightNavTitleString: any;
    selectUnitInfo: TUnitTitleItem;
    setSelectUnitInfo: (unitMainTitle:string, unitSubTitle:string) =>void;
}
type TStudentNavItem = "MyPage" | "EssayWriting" | "Portfolio";
// type TTeacherNavItem = ""
