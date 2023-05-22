import { useNavigate } from "react-router-dom";
import useLoginStore from "../../store/useLoginStore";
import Nav from "./Nav";
import { Login } from "../../pages/Login";

export default function Header () {
    const { role, setIsOpen, isOpen, setUserInfo } = useLoginStore();
    const navigate = useNavigate();
    const openModal = () => {
        setIsOpen(true);
    }
    return (
        <header className="py-6 bg-white shadow">
            <div className="container mx-auto px-4">
                <div className='flex flex-row justify-between mr-8'>
                    <h1 className="text-2xl font-bold text-gray-800"
                    >POLY Web Site</h1>
                    {role === "logout" ?
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded '
                            onClick={openModal}
                        >로그인</button>
                        :
                        <button className='rounded-full bg-gray-100 p-2'
                            onClick={
                                async () => {
                                    alert("로그아웃 하시겠습니까?");
                                    await setUserInfo("logout")
                                    navigate('/');
                                }
                            }
                        >로그아웃</button>
                    }
                </div>
                <Nav />
                {isOpen === true &&
                    <Login></Login>
                }
            </div>
        </header>
    )
}