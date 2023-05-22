type INavItems = {
    [key in TRole]: {
        selectedMenu: string[]
    };
};
export const navItems:INavItems = {
    admin: {
        selectedMenu: [
            ''
        ]
    },
    logout: {
        selectedMenu: []
    },
    student: {
        selectedMenu: [
            "My Page",
            "Essay Writing",
            "Portfolio",
            "Student Home"
        ]
    },
    teacher: {
        selectedMenu: [
            "menu1",
            "menu2",
            "학습관리",
            "menu3"
        ]
    }
}