interface INavItem {
    secondGenerationOpen:boolean;
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
    // navItems: TNavItems;

    setSelectUnitInfo: (unitMainTitle:string, unitSubTitle:string) =>void;

    // unit에서 back버튼 클릭 이벤트
    goBackFromDraftInUnitPage: Function|null;
    setGoBackFromDraftInUnitPage: (event:Function|null) => void;
}
type TStudentNavItem = "MyPage" | "EssayWriting" | "Portfolio";
// type TTeacherNavItem = ""

// nav item types
type TNavItems = {
    [key in TRole]: {
        selectedMenu: TNavItemSelectedMenu[]
    };
}
type TNavItemSelectedMenu = {
    path:string,
    label: string,
    onMenuIcon: JSX.Element,
    offMenuIcon: JSX.Element
}