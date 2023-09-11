import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import EssayWriting from '../pages/Student/EssayWriting';
import { MyPage } from '../pages/Student/MyPage';
import { Portfolio } from '../pages/Student/Portfolio';
import WebViewWrap from '../pages/WebViewWrap';
import useLoginStore from '../store/useLoginStore';
import PrivateRoute from './PrivateRoute';
import { Admin } from '../pages/Admin';
import { Student } from '../pages/Student/Student';
import { Teacher } from '../pages/Teacher';
import {routeValues} from './routeValues';
import SelectWritingClinic from '../pages/Student/SelectWritingClinic';
import SelectUnit from '../pages/Student/SelectUnit';
import PreviewSparkWriting from '../pages/Student/PreviewSparkWriting';
import Report from '../pages/Student/Report';
import { Nav } from '../components/layoutComponents/Nav';
import NavAside from '../components/layoutComponents/Navs/NavAside';
import CommonAlertModalComponent from '../components/toggleModalComponents/CommonAlertModalComponent';
import StandbyScreen from '../components/commonComponents/standby/StandbyScreen';
import Progress from '../pages/Student/Progress';
import UnitReportModalComponent from '../components/toggleModalComponents/UnitReportModalComponent';
import ReturnFeedbackModalComponent from '../components/toggleModalComponents/ReturnFeedbackModalComponent';

export default function Roter() {
    const { role, isOpen } = useLoginStore();
    const publicRoutes = () => {
        const routeValue = routeValues.publicRoutes;
        // 각 권한별 기본 페이지
        // const mainPage = role === 'logout' ? <Login /> : (
        //     role === 'admin' ? <Admin /> : (
        //         role === 'teacher' ? <Teacher /> : <SelectWritingClinic />
        //     )
        // );
        const mainPage = role === 'logout' ? <Login /> : <SelectWritingClinic />;
        // const mainPage = <Home />
        return (
            <Route element={<PrivateRoute authenticated={false} />}>
                {routeValue.map((publicRoute, publicIndex) => {
                    if (publicRoute.path === '/') {
                        return <Route key={publicIndex} path={publicRoute.path} element={mainPage}/>
                    } else {
                        return <Route key={publicIndex} path={publicRoute.path} element={publicRoute.element}/>
                    }
                })}
            </Route>
        )
    }
    // const privateRoutes = () => {
    //     const routeValue = routeValues.privateRoutes;

    // }
    return (
        <div className='container-wrapper relative'>
            {role!=='logout' && <Nav />}
            {role!=='logout' && <NavAside />}
            <div className="max-display-screen">
                {isOpen && <Login />}
                <Routes>
                    {/* No Login Pages */}
                    {publicRoutes()}
                    {/* Admin 전용 페이지 */}
                    <Route element={<PrivateRoute authenticated={true} pageAuth='admin' />} >
                        
                    </Route>
                    {/* Teacher 전용 페이지 */}
                    <Route element={<PrivateRoute authenticated={true} pageAuth='teacher' />} >

                    </Route>
                    {/* 학생 페이지 */}
                    <Route element={<PrivateRoute authenticated={true} pageAuth='student' />} >
                        <Route path='/student/WritingClinic' element={<SelectWritingClinic />}></Route>
                        <Route path='/student/WritingClinic/SparkWriting/:unit/:draft' element={ <EssayWriting />}></Route>
                        <Route path='/student/WritingClinic/SparkWriting' element={ <SelectUnit />}></Route>
                        <Route path='/student/Progress' element={<Progress />}></Route>
                        <Route path='/student/Report' element={<Report />}></Route>
                        <Route path='/student/MyPortfolio' element={<Portfolio />}></Route>
                        <Route path='/student/WritingClinic/SparkWriting/:unit/:draft/Preview' element={<PreviewSparkWriting />}></Route>

                    </Route>
                    {/* <Route path='' element={ }></Route> */}

                    {/* webview 전용 page */}
                    <Route path='/webTest' element={<WebViewWrap />}></Route>
                </Routes>
                <CommonAlertModalComponent />
                <StandbyScreen />
                <UnitReportModalComponent />
                <ReturnFeedbackModalComponent />
            </div>
          
        </div>

    )
}