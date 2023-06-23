import React from 'react';
import useLoginStore from '../store/useLoginStore';

export const Login = () => {
    const { setUserInfo, setIsOpen } = useLoginStore();
    const closeModal = () => { setIsOpen(false); }
    return (
        <>
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-white rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">로그인</h2>
                        {/* <p className="mb-4">모달 내용</p> */}
                        <div>
                            <button onClick={() => {

                                setUserInfo({name: 'Henry', companyName: 'Poly',class: 'TESTCLASS', subClass: 'SUBTEST-CLASS', email: 'TEST@una.co.kr', role: "student"})
                                closeModal()
                            }} className="m-4 p-4 w-1/3 mx-auto bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">student</button>
                            <button onClick={() => {
                                setUserInfo({name: 'teacher', companyName: 'Poly',class: 'TESTCLASS', subClass: 'SUBTEST-CLASS', email: 'TEST@una.co.kr', role: "teacher"})
                                closeModal()
                            }} className="m-4 p-4 w-1/3 mx-auto bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">teacher</button>
                            <button onClick={() => {
                                setUserInfo({name: 'admin', companyName: 'Poly',class: 'TESTCLASS', subClass: 'SUBTEST-CLASS', email: 'TEST@una.co.kr', role: "admin"})
                                closeModal()
                            }} className="m-4 p-4 w-1/3 mx-auto bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">admin</button>
                            {/* <button onClick={() => {
                                setUserInfo("logout")
                                closeModal()
                            }} className="m-4 p-4 w-1/4 mx-auto bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Logout</button> */}
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={closeModal}>
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

