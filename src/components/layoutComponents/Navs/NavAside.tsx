import React from 'react';
import useLoginStore from "../../../store/useLoginStore";
import useNavStore from "../../../store/useNavStore";
import { useNavigate } from "react-router-dom";
import { navItems } from "../Nav";

const NavAside = () => {
    const {setSelectMenu, selectedMenu, sidebarFlagged, setSidebarFlagged, topNavHiddenFlagged} = useNavStore();
    const { companyName, name, role, setIsOpen, setUserInfo } = useLoginStore();
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
        <nav id={'navAside'} className=''>
        <div className={`absolute left-0 top-0 z-50 w-64 h-full max-h-[800px] transition-transform ${
            // !sidebarFlagged ? '-translate-x-full':'translate-x-0'
            ''
            // 'translate-x-0'
        } ${
            topNavHiddenFlagged ? '-translate-x-full hidden': 'translate-x-0'
        } bg-gray-200 border-r border-gray-200`}
        // aria-label="Sidebar"
        >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-200">
                <div className='flex flex-col font-bold text-3xl py-8 px-4'>
                    <p className='flex flex-1'>{'Writing'}</p>
                    <p className='flex flex-1'>{'Hub'}</p>
                </div>
                <ul className="space-y-2 font-medium">
                    {navItems[role].selectedMenu.map((v, i) => {
                        const key = `navItem-${role}-${i}`
                        return (
                            <li key={key} 
                            className='div-to-button-hover-effect'
                            onClick={()=>handleMenuClick(role, v.path)}>
                                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                    img
                                </span>
                                <span className="flex-1 ml-3 whitespace-nowrap">{v.label}</span>
                                </div>
                            </li>
                        )
                    })}
                    {role==='logout' && (
                        <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-xl" onClick={()=>setIsOpen(true)} >Login</button>
                    )}
                    {role !== 'logout' && (
                        <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-xl" onClick={()=>setUserInfo({companyName:'', email: '', class:'',subClass:'', name: '', role: 'logout'})}>Logout</button>
                    )}
                </ul>
            </div>
        </div>
        <div className={`absolute top-0 left-0 z-[49] w-full h-20 pl-64 transition-transform ${
            // !sidebarFlagged ? '-translate-x-full':'translate-x-0'
            topNavHiddenFlagged ? '-translate-x-full hidden': 'translate-x-0'
            // 'translate-x-0'
        } bg-white border-r border-gray-200`}
        // aria-label="Sidebar"
        >
            <div className='flex flex-1 flex-row pl-4'>
                <div className='flex flex-1 content-center items-center'>
                    <div></div>
                </div>
                
                <div className='flex flex-1 flex-row-reverse pr-4'>
                    <div className='flex'>
                        <span className=''>Image</span>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex flex-1 justify-end'>{name}</div>
                        <div className='flex flex-1 justify-end'>class</div>
                        <div className='flex flex-1 justify-end'>Class-what</div>
                    </div>
                </div>
            
            </div>
        </div>

        </nav>
    )
}

export default NavAside;