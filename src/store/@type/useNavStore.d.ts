interface INavItem {
    selectedMenu: TStudentNavItem | string, 
    setSelectMenu:any,
    sidebarFlagged: boolean,
    setSidebarFlagged: any,
    topNavHiddenFlagged: boolean,
    setTopNavHiddenFlagged: any,
    subNavTitleString: string,
    setSubNavTitleString: any,
    subRightNavTitleString: string,
    setSubRightNavTitleString: any,
}
type TStudentNavItem = "MyPage" | "EssayWriting" | "Portfolio";
// type TTeacherNavItem = ""
