import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNavStore from '../store/useNavStore';
import useLoginStore from '../store/useLoginStore';


const Nav = () => {
    const { setSelectMenu, selectedMenu } = useNavStore();
    const { role } = useLoginStore();
    const [studentTitle, setStudentTitle] = useState("");
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
        if (role === "student") {
            if (selectedMenu === "MyPage") {
                setStudentTitle("My Page");
            } else if (selectedMenu === "EssayWriting") {
                setStudentTitle("Essay Writing");
            } else if (selectedMenu === "Portfolio") {
                setStudentTitle("Portfolio");
            } else {
                setStudentTitle("Student Home");
            }
        }
    }, [selectedMenu])
    return (
        <div>
            {role === "student" &&
                <>
                    <div className='bg-gray-100 flex flex-row h-10'>
                        <div
                            className={`w-1/4 bg-gray font-bold text-center`}
                        // onClick={() => setSelectMenu(1)}
                        >
                            <span className='text-xl'>{studentTitle}</span>
                        </div>
                        <div
                            className={`w-1/4 bg-gray ${selectedMenu === "MyPage" ? 'bg-blue-500' : ''}`}
                            onClick={() => handleMenuClick("MyPage")}
                        >
                            <a href="#" className="flex items-center justify-center">My Page</a>
                        </div>
                        <div
                            className={`w-1/4 bg-gray ${selectedMenu === "EssayWriting" ? 'bg-blue-500' : ''}`}
                            onClick={() => handleMenuClick("EssayWriting")}
                        >
                            <a href="#" className="flex items-center justify-center">Essay Writing</a>

                        </div>
                        <div
                            className={`w-1/4 bg-gray ${selectedMenu === "Portfolio" ? 'bg-blue-500' : ''}`}
                            onClick={() => handleMenuClick("Portfolio")}
                        >
                            <a href="#" className="flex items-center justify-center">Portfolio</a>
                        </div>

                    </div>
                </>
            }
            {role === "teacher" &&
                <>
                    <div className="bg-gray-100 flex flex-row h-10">
                        <div
                            className={`w-1/4 bg-gray ${selectedMenu === "메뉴1" ? 'bg-blue-500' : ''}`}
                            onClick={() => setSelectMenu("메뉴1")}
                        >
                            <a href="#" className="flex items-center justify-center">메뉴1</a>
                        </div>
                        <div
                            className={`w-1/4 bg-gray ${selectedMenu === "메뉴2" ? 'bg-blue-500' : ''}`}
                            onClick={() => setSelectMenu("메뉴2")}
                        >
                            <a href="#" className="flex items-center justify-center">메뉴2</a>
                        </div>
                        <div
                            className={`w-1/4 bg-gray ${selectedMenu === "학습관리" ? 'bg-blue-500' : ''}`}
                            onClick={() => setSelectMenu("학습관리")}
                        >
                            <a href="#" className="flex items-center justify-center">학습관리</a>

                        </div>
                        <div
                            className={`w-1/4 bg-gray ${selectedMenu === "메뉴4" ? 'bg-blue-500' : ''}`}
                            onClick={() => setSelectMenu("메뉴4")}
                        >
                            <a href="#" className="flex items-center justify-center">메뉴4</a>
                        </div>

                    </div>
                    {selectedMenu === "학습관리" &&
                        <div className='flex'>학습관리</div>
                    }
                </>
            }
            {role === "admin" &&
                <>
                </>
            }
            {role === "logout" &&
                <>
                </>
            }
        </div>

    );
};

export default Nav;