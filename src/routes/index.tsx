import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { EssayWriting } from '../pages/Student/EssayWriting';
import { MyPage } from '../pages/Student/MyPage';
import { Portfolio } from '../pages/Student/Portfolio';
import WebViewWrap from '../pages/WebViewWrap';
import useLoginStore from '../store/useLoginStore';
import PrivateRoute from './PrivateRoute';
import { Admin } from '../pages/Admin';
import { Student } from '../pages/Student/Student';
import { Teacher } from '../pages/Teacher';

export default function Roter() {
    const { role } = useLoginStore();
    return (
        <div className="mx-auto items-center text-center ">
            <Routes>
                {/* No Login Pages */}
                <Route element={<PrivateRoute authenticated={false}/>} >
                    <Route path='/' element={ role === 'logout' ? <Home /> : (
                        role === 'admin' ? <Admin /> : (
                            role === 'teacher' ? <Teacher /> : <Student />
                        )
                    )}></Route>
                    <Route path='/Login' element={<Login />}></Route>
                </Route>
                {/* Admin 전용 페이지 */}
                <Route element={<PrivateRoute authenticated={true} pageAuth='admin' />} >
                    
                </Route>
                {/* Teacher 전용 페이지 */}
                <Route element={<PrivateRoute authenticated={true} pageAuth='teacher' />} >

                </Route>
                {/* 학생 페이지 */}
                <Route element={<PrivateRoute authenticated={true} pageAuth='student' />} >
                    <Route path='/EssayWriting' element={ <EssayWriting />}></Route>
                    <Route path='/MyPage' element={<MyPage />}></Route>
                    <Route path='/Portfolio' element={<Portfolio />}></Route>

                </Route>
                {/* <Route path='' element={ }></Route> */}

                {/* webview 전용 page */}
                <Route path='/webTest' element={<WebViewWrap />}></Route>
            </Routes>
        </div>

    )
}