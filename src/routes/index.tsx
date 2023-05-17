import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { EssayWriting } from '../pages/Student/EssayWriting';
import { MyPage } from '../pages/Student/MyPage';
import { Portfolio } from '../pages/Student/Portfolio';

export default function Roter() {

    return (
        <div className="mx-auto items-center text-center ">
            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path='/Login' element={<Login />}></Route>
                {/* 학생 페이지 */}
                <Route path='/EssayWriting' element={<EssayWriting />}></Route>
                <Route path='/MyPage' element={<MyPage />}></Route>
                <Route path='/Portfolio' element={<Portfolio />}></Route>
                {/* <Route path='' element={ }></Route> */}
            </Routes>
        </div>

    )
}