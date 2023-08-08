import React from 'react';
import useLoginStore from "../../../store/useLoginStore";
import useNavStore from "../../../store/useNavStore";
import { useNavigate } from "react-router-dom";
import { navItems } from "../Nav";
import { commonIconSvgs } from '../../../util/svgs/commonIconsSvg';

const NavAside = () => {
    const {setSelectMenu, selectedMenu, sidebarFlagged, setSidebarFlagged, topNavHiddenFlagged} = useNavStore();
    const { companyName, name, role, setIsOpen, setUserInfo, setLogoutUser } = useLoginStore();
    // const [menuLocateValue, setMenuLocateValue] = useState("");
    const navigate = useNavigate();
    const handleMenuClick = async (role:TRole, menuTitle: string) => {
        if (selectedMenu === menuTitle) {
            // await setSelectMenu(null);
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
        <div className={`absolute left-0 top-0 z-50 w-[190px] h-full max-h-[800px] transition-transform ${
            // !sidebarFlagged ? '-translate-x-full':'translate-x-0'
            ''
            // 'translate-x-0'
        } ${
            topNavHiddenFlagged ? '-translate-x-full hidden': 'translate-x-0'
        }`}
        // aria-label="Sidebar"
        >
            <div className="h-full  pb-4 overflow-y-auto bg-[#3c2481]">
            <div className='mt-[30px] px-3 ml-[36px] w-[118.9px] h-[118.9px] bg-writing-hub-logo bg-no-repeat bg-center' />
                <ul className="px-[9px] mt-[20px] space-y-2 font-medium">
                    {navItems[role].selectedMenu.map((v, i) => {
                        const key = `navItem-${role}-${i}`
                        return (
                            <li key={key} 
                            className={`div-to-button-hover-effect w-[172px] h-[74px] ${
                                selectedMenu===v.path 
                                ? 'border-[3px] border-[#21c39a] rounded-[27px] bg-[#ffffff]' :''
                            }`}
                            onClick={()=>handleMenuClick(role, v.path)}>
                                <div className="flex flex-row items-center p-2 w-full h-full gap-[10px]">
                                <div className='w-[45px] h-[45px]'>
                                {selectedMenu===v.path ? v.onMenuIcon : v.offMenuIcon}
                                </div>
                                <span className={selectedMenu===v.path? 'nav-menu-on':'nav-menu-off'}>{v.label}</span>
                                </div>
                            </li>
                        )
                    })}
                    
                </ul>
                {role !== 'logout' && (
                    // <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-xl" 
                    // onClick={()=>setLogoutUser()}>Logout</button>
                    
                    <commonIconSvgs.ExitButton className='w-[140px] h-[40px] absolute left-[25px] bottom-[30px] hover:cursor-pointer' />
                    
                )}
            </div>
        </div>
        {/* <div className={`absolute top-0 left-0 z-[49] w-full h-20 pl-64 transition-transform ${
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
        </div> */}

        </nav>
    )
}

export default NavAside;