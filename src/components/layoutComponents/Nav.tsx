import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNavStore from '../../store/useNavStore';
import useLoginStore from '../../store/useLoginStore';
import {navItems} from './NavItem'

const Nav = () => {
    const { setSelectMenu, selectedMenu } = useNavStore();
    const { role } = useLoginStore();
    const [menuLocateValue, setMenuLocateValue] = useState("");
    const navigate = useNavigate();

    const handleMenuClick = async (menuTitle: string) => {
        if (selectedMenu === menuTitle) {
            await setSelectMenu(null);
        } else {
            await setSelectMenu(menuTitle);
            await goLink(menuTitle);
        }
    };

    const goLink = async (link: string) => {
        console.log("link :::", link);
        navigate(`/${link}`);

    }
    useEffect(() => {
        // if (role === "student") {
        //     if (selectedMenu === "MyPage") {
        //         setStudentTitle("My Page");
        //     } else if (selectedMenu === "EssayWriting") {
        //         setStudentTitle("Essay Writing");
        //     } else if (selectedMenu === "Portfolio") {
        //         setStudentTitle("Portfolio");
        //     } else {
        //         setStudentTitle("Student Home");
        //     }
        // }
    }, [selectedMenu])
    return (
        <div>
            <div className='bg-gray-100 flex flex-row h-10'>
            <div
                className={`w-1/4 bg-gray font-bold text-center`}
            // onClick={() => setSelectMenu(1)}
            >
                <span className='text-xl'>{menuLocateValue}</span>
            </div>
            {navItems[role].selectedMenu.map((v, i)=>{
                const key = `navItem-${role}-${i}`
                return (
                    <div key={key}
                        className={`w-1/4 bg-gray ${selectedMenu === v ? 'bg-blue-500' : ''}`}
                        onClick={() => handleMenuClick(v)}
                    >
                        <a href="#" className="flex items-center justify-center">{v}</a>
                    </div>
                    )
                })}
            </div>
        </div>

    );
};

export default Nav;