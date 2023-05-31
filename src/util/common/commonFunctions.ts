import { NavigateFunction } from "react-router-dom";

export const CommonFunctions={
    goLink: async (linkPath: string, navigate:NavigateFunction, role?: TRole) => {
        if (role!==undefined) {
            const rolePath = role==='logout'? '': (role==='admin'? 'admin': (role==='teacher'?'teacher':'student'))
            navigate(`/${rolePath}/${linkPath}`);
        } else {

        }
    }
}