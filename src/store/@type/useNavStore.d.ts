interface INavItem {
    selectedMenu: TStudentNavItem | string, 
    setSelectMenu:any
}
type TStudentNavItem = "MyPage" | "EssayWriting" | "Portfolio";
// type TTeacherNavItem = ""
