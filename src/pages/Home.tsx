import React from 'react';
import { Login } from './Login';
import useLoginStore from '../store/useLoginStore';
import { Student } from './Student/Student';
import { Teacher } from './Teacher';
import { Admin } from './Admin';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

export const Home = () => {
    const { role, setIsOpen, isOpen, setUserInfo } = useLoginStore();
    const navigate = useNavigate();
    const openModal = () => {
        setIsOpen(true);
    }
    return (
        <>
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
            <div className="bg-gray-200 min-h-screen">
                <main className="container mx-auto px-4 py-8">
                    POLY Main Page
                    {/* 학생 페이지 */}
                    {role === 'student' &&
                        <div>
                            <Student></Student>
                        </div>
                    }
                    {/* 강사 페이지 */}
                    {role === 'teacher' &&
                        <div>
                            <Teacher></Teacher>
                        </div>
                    }
                    {/* 어드민 페이지 */}
                    {role === 'admin' &&
                        <div>
                            <Admin></Admin>
                        </div>
                    }
                </main>
            </div>
            <footer className="py-4 bg-gray-800 text-white text-center">
                <p>&copy; UNITED ASSOCIATES</p>
            </footer>
        </>
    )
}