import React from 'react';
import useLoginStore from "../../../store/useLoginStore";
import useNavStore from "../../../store/useNavStore";
import { useNavigate } from "react-router-dom";
import { navItems } from "../Nav";

const NavAside = () => {
    const {setSelectMenu, selectedMenu, sidebarFlagged, setSidebarFlagged} = useNavStore();
    const { role, setIsOpen, setUserInfo } = useLoginStore();
    // const [menuLocateValue, setMenuLocateValue] = useState("");
    const navigate = useNavigate();
    const handleMenuClick = async (role:TRole, menuTitle: string) => {
        if (selectedMenu === menuTitle) {
            await setSelectMenu(null);
        } else {
            await setSelectMenu(menuTitle,);
            setSidebarFlagged(!sidebarFlagged);
            await goLink(role,menuTitle);
        }
    };

    const goLink = async (role: TRole, link: string) => {
        console.log("link :::", link);
        const rolePath = role==='logout'? '': (role==='admin'? 'admin': (role==='teacher'?'teacher':'student'))
        navigate(`/${rolePath}/${link}`);
    }

    return (
        <aside className={`fixed top-0 left-0 z-40 w-64 h-full pt-[10vh] transition-transform ${!sidebarFlagged ? '-translate-x-full':'translate-x-0'} bg-white border-r border-gray-200  dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    {navItems[role].selectedMenu.map((v, i) => {
                        const key = `navItem-${role}-${i}`
                        return (
                            <li key={key} onClick={()=>handleMenuClick(role, v.path)}>
                                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="flex-1 ml-3 whitespace-nowrap">{v.label}</span>
                                {/* <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> */}
                                </div>
                            </li>
                        )
                    })}
                    {role==='logout' && (
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl" onClick={()=>setIsOpen(true)} >Login</button>
                    )}
                    {role !== 'logout' && (
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl" onClick={()=>setUserInfo("logout")}>Logout</button>
                    )}
                </ul>
            </div>
        </aside>
    )
}

export default NavAside;